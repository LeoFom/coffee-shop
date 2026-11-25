/* eslint-disable @typescript-eslint/no-require-imports -- Node test loader compiles the shared TypeScript schema. */
const assert = require('node:assert/strict')
const { createHash, randomUUID } = require('node:crypto')
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

const { handleV1 } = require('../lib/contracts/v1/gateway.ts')
const { productResponse, productsResponse, apiError } = require('../lib/contracts/v1/schema.ts')
const productId = randomUUID()
const product = {
  id: productId,
  slug: 'fixture',
  sku: null,
  name: 'Fixture coffee',
  description: null,
  imageUrl: null,
  category: 'Coffee',
  priceMinor: 1234,
  currency: 'USD',
  memberDiscountPercent: '0.00',
  stockQuantity: 1,
  isActive: true,
  coffeeDetails: null,
  createdAt: '2026-11-25T00:00:00.000Z',
  updatedAt: '2026-11-25T00:00:00.000Z',
}

test('v1 generated schema validates fixtures and rejects extra fields', () => {
  assert.equal(productResponse.safeParse({ data: product }).success, true)
  assert.equal(
    productsResponse.safeParse({ data: [product], page: { number: 1, size: 20, total: 1 } })
      .success,
    true,
  )
  assert.equal(
    productResponse.safeParse({ data: { ...product, userId: randomUUID() } }).success,
    false,
  )
  assert.equal(
    productResponse.safeParse({ data: { ...product, priceMinor: 12.34 } }).success,
    false,
  )
  assert.equal(
    apiError.safeParse({
      error: { code: 'X', message: 'x', fieldErrors: {}, requestId: 'request' },
    }).success,
    true,
  )
})

test('v1 BFF accepts only known routes, normalized queries and strict writes', async () => {
  const calls = []
  const backend = async (path, options) => {
    calls.push({ path, options })
    return Response.json({ data: [product], page: { number: 1, size: 20, total: 1 } })
  }
  const get = (path) => new Request(`https://shop.example.test${path}`)
  const catalog = await handleV1(get('/api/v1/products?category=Coffee'), ['products'], backend)
  assert.equal(catalog.status, 200)
  assert.equal(catalog.headers.get('cache-control'), 'no-store')
  assert.match(calls[0].path, /^\/v1\/products\?/)
  assert.equal(
    (await handleV1(get('/api/v1/products?role=Admin'), ['products'], backend)).status,
    400,
  )
  assert.equal(
    (await handleV1(get('/api/v1/products?category=Coffee&category=Coffee'), ['products'], backend))
      .status,
    400,
  )
  assert.equal((await handleV1(get('/api/v1/unknown'), ['unknown'], backend)).status, 404)
  assert.equal(calls.length, 1)
  const patch = (body) =>
    new Request('https://shop.example.test/api/v1/profile/me', {
      method: 'PATCH',
      headers: { origin: 'https://shop.example.test', 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  assert.equal(
    (await handleV1(patch({ phone: null, userId: randomUUID() }), ['profile', 'me'], backend))
      .status,
    400,
  )
  assert.equal(
    (await handleV1(patch({ phone: null }), ['profile', 'me'], backend)).status,
    502,
    'Malformed upstream profile is rejected',
  )
  assert.equal(calls.length, 2)
  assert.equal(calls[1].options.body.phone, null)
  const crossOrigin = new Request('https://shop.example.test/api/v1/profile/me', {
    method: 'PATCH',
    headers: { origin: 'https://evil.example.test', 'content-type': 'application/json' },
    body: '{}',
  })
  assert.equal((await handleV1(crossOrigin, ['profile', 'me'], backend)).status, 403)
})

test('v1 BFF preserves structured API errors and cookie rotation', async () => {
  const request = new Request('https://shop.example.test/api/v1/profile/me')
  const errorBody = {
    error: {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
      fieldErrors: {},
      requestId: 'api-request',
    },
  }
  const backend = async () =>
    Response.json(errorBody, {
      status: 401,
      headers: { 'set-cookie': 'accessToken=new; HttpOnly; Path=/', 'retry-after': '7' },
    })
  const response = await handleV1(request, ['profile', 'me'], backend)
  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), errorBody)
  assert.match(response.headers.get('set-cookie'), /accessToken=new/)
  assert.equal(response.headers.get('retry-after'), '7')
  const unavailable = await handleV1(request, ['profile', 'me'], async () => {
    throw Error('offline')
  })
  assert.equal(unavailable.status, 503)
  assert.equal(apiError.safeParse(await unavailable.json()).success, true)
})

test('v1 source copy matches pinned checksum', () => {
  const lock = JSON.parse(fs.readFileSync('lib/contracts/v1/contract-lock.json', 'utf8'))
  const source = fs.readFileSync('lib/contracts/v1/schema.ts')
  assert.equal(createHash('sha256').update(source).digest('hex'), lock.sourceSha256)
  assert.match(lock.apiCommit, /^[a-f0-9]{40}$/)
})
