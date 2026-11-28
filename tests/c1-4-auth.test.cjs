/* eslint-disable @typescript-eslint/no-require-imports -- Node test loader compiles TypeScript modules. */
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

const { safeReturnTo } = require('../lib/auth/return-to.ts')
const {
  fetchWithAuth,
  invalidateAuthFlight,
  onAuthInvalidated,
} = require('../lib/auth/fetchWithAuth.ts')

test('return path permits only private local destinations', () => {
  for (const path of ['/dashboard', '/dashboard/products', '/orders', '/profile', '/membership'])
    assert.equal(safeReturnTo(path), path)
  for (const path of [
    '//evil.test',
    'https://evil.test',
    '/auth/continue',
    '/dashboard/../auth/login',
    '/dashboard\\evil',
    '/checkout',
  ])
    assert.equal(safeReturnTo(path), '/dashboard')
})

test('expired client requests share one refresh and retry once each', async () => {
  const original = global.fetch
  let refreshes = 0
  let calls = 0
  global.fetch = async (path) => {
    if (path === '/api/v1/auth/refresh') {
      refreshes++
      await new Promise((resolve) => setTimeout(resolve, 15))
      return Response.json({ success: true })
    }
    calls++
    return calls <= 2
      ? Response.json({ error: { code: 'ACCESS_EXPIRED' } }, { status: 401 })
      : Response.json({ ok: true })
  }
  try {
    const [a, b] = await Promise.all([fetchWithAuth('/api/cart'), fetchWithAuth('/api/cart')])
    assert.equal(a.status, 200)
    assert.equal(b.status, 200)
    assert.equal(refreshes, 1)
    assert.equal(calls, 4)
  } finally {
    invalidateAuthFlight()
    global.fetch = original
  }
})

test('503 refresh does not replay a mutation', async () => {
  const original = global.fetch
  let writes = 0
  global.fetch = async (path) => {
    if (path === '/api/v1/auth/refresh') return Response.json({}, { status: 503 })
    writes++
    return Response.json({ error: { code: 'ACCESS_EXPIRED' } }, { status: 401 })
  }
  try {
    const response = await fetchWithAuth('/api/orders', { method: 'POST', body: '{}' })
    assert.equal(response.status, 503)
    assert.equal(writes, 1)
  } finally {
    invalidateAuthFlight()
    global.fetch = original
  }
})

test('ordinary 401 invalidates UI identity without attempting refresh', async () => {
  const original = global.fetch
  let calls = 0
  let invalidations = 0
  const unsubscribe = onAuthInvalidated(() => {
    invalidations++
  })
  global.fetch = async () => {
    calls++
    return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  try {
    assert.equal((await fetchWithAuth('/api/cart')).status, 401)
    assert.equal(calls, 1)
    assert.equal(invalidations, 1)
  } finally {
    unsubscribe()
    invalidateAuthFlight()
    global.fetch = original
  }
})
