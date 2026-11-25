/* eslint-disable @typescript-eslint/no-require-imports -- Node test loader compiles the shared TypeScript modules. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const test = require('node:test')
const ts = require('typescript')

require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText
  module._compile(code, filename)
}

const { backendConfig } = require('../lib/nodejs/runtime-config.ts')
const { parseJsonResult, requireData, ApiReadError } = require('../lib/nodejs/result.ts')
const { forwardBackendResponse } = require('../lib/nodejs/proxy-response.ts')

test('backend configuration validates server URL without exposing the secret', () => {
  const good = backendConfig({
    NODE_ENV: 'production',
    API_URL: 'https://api.example.test/',
    INTERNAL_API_KEY: 'synthetic-server-key',
  })
  assert.equal(good.ok, true)
  assert.equal(good.origin, 'https://api.example.test')
  assert.equal(
    backendConfig({
      NODE_ENV: 'production',
      API_URL: 'http://api.example.test',
      INTERNAL_API_KEY: 'synthetic-server-key',
    }).ok,
    false,
  )
  assert.equal(
    backendConfig({
      NODE_ENV: 'production',
      API_URL: 'https://user:secret@api.example.test',
      INTERNAL_API_KEY: 'synthetic-server-key',
    }).ok,
    false,
  )
  assert.equal(
    backendConfig({ NODE_ENV: 'production', API_URL: 'https://api.example.test' }).ok,
    false,
  )
})

test('typed result keeps empty, missing, unauthorized and unavailable separate', async () => {
  const decodeArray = (value) => {
    if (!Array.isArray(value)) throw new Error('invalid')
    return value
  }
  const empty = await parseJsonResult(Response.json([]), decodeArray)
  assert.equal(empty.ok, true)
  assert.deepEqual(requireData(empty), [])
  const unavailable = await parseJsonResult(
    Response.json(
      { message: 'Service temporarily unavailable' },
      { status: 503, headers: { 'retry-after': '5', 'x-request-id': 'request-123' } },
    ),
    decodeArray,
  )
  assert.equal(unavailable.ok, false)
  assert.equal(unavailable.status, 503)
  assert.equal(unavailable.retryAfter, '5')
  assert.equal(unavailable.error.code, 'SERVICE_UNAVAILABLE')
  assert.throws(
    () => requireData(unavailable),
    (error) => error instanceof ApiReadError && error.status === 503,
  )
  const missing = await parseJsonResult(
    Response.json({ message: 'Not found' }, { status: 404 }),
    decodeArray,
  )
  assert.equal(missing.status, 404)
  assert.equal(missing.error.code, 'NOT_FOUND')
  const unauth = await parseJsonResult(
    Response.json({ message: 'Unauthorized' }, { status: 401 }),
    decodeArray,
  )
  assert.equal(unauth.status, 401)
  const malformed = await parseJsonResult(Response.json({ data: [] }), decodeArray)
  assert.equal(malformed.status, 502)
  assert.equal(malformed.ok, false)
})

test('BFF forwards Retry-After, request ID and every Set-Cookie separately', async () => {
  const headers = new Headers({
    'retry-after': '5',
    'x-request-id': 'request-123',
    'content-type': 'application/json',
  })
  headers.append('set-cookie', 'accessToken=new; HttpOnly; Path=/')
  headers.append('set-cookie', 'refreshToken=new; HttpOnly; Path=/')
  const response = await forwardBackendResponse(
    new Response('{"message":"offline"}', { status: 503, headers }),
  )
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('retry-after'), '5')
  assert.equal(response.headers.get('x-request-id'), 'request-123')
  assert.equal(response.headers.getSetCookie().length, 2)
})
