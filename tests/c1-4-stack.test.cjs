/* eslint-disable @typescript-eslint/no-require-imports -- CI-only integration runner. */
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const jwt = require('../../api/node_modules/jsonwebtoken')

async function main() {
  assert.equal(process.env.NODE_ENV, 'test', 'Only a disposable test database may be used')
  assert.match(process.env.DATABASE_URL ?? '', /@localhost:5432\/coffeo_c14$/)
  const origin = 'http://localhost:3000'
  const email = `c14-${randomUUID()}@example.test`
  const password = 'Synthetic-password-12345'
  const post = (path, cookie = '', body) =>
    fetch(origin + path, {
      method: 'POST',
      headers: { origin, cookie, ...(body ? { 'content-type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      redirect: 'manual',
    })
  const cookies = (response) =>
    Object.fromEntries(
      response.headers
        .getSetCookie()
        .map((value) => value.split(';')[0].split('='))
        .filter(([name]) => name === 'accessToken' || name === 'refreshToken'),
    )
  const header = (values) =>
    Object.entries(values)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ')

  const registered = await post('/api/auth/register', '', { email, password })
  assert.equal(registered.status, 201, await registered.text())
  const login = await post('/api/auth/log-in', '', { email, password })
  assert.equal(login.status, 200, await login.text())
  const session = cookies(login)
  assert.ok(session.accessToken && session.refreshToken)
  const claims = jwt.decode(session.accessToken)
  assert.ok(claims?.sid && claims?.userId)
  const now = Math.floor(Date.now() / 1000)
  const expiredAccess = jwt.sign(
    {
      userId: claims.userId,
      sid: claims.sid,
      email,
      tokenType: 'access',
      iss: 'coffeo-api',
      aud: 'coffeo-access',
      iat: now - 1200,
      exp: now - 600,
    },
    process.env.JWT_ACCESS_SECRET,
    { algorithm: 'HS256', header: { alg: 'HS256', kid: 'v1' } },
  )

  const expired = await fetch(origin + '/dashboard', {
    headers: { cookie: header({ ...session, accessToken: expiredAccess }) },
    redirect: 'manual',
  })
  assert.equal(expired.status, 307)
  assert.equal(expired.headers.get('location'), '/auth/continue?next=%2Fdashboard')

  const refresh = await post('/api/v1/auth/refresh', header(session))
  assert.equal(refresh.status, 200, await refresh.text())
  const current = { ...session, ...cookies(refresh) }
  assert.ok(current.accessToken && current.refreshToken)
  const recovered = await fetch(origin + '/dashboard', {
    headers: { cookie: header(current) },
    redirect: 'manual',
  })
  assert.equal(recovered.status, 200)
  assert.match(await recovered.text(), /Dashboard/)

  const logout = await post('/api/auth/logout', header(current))
  assert.equal(logout.status, 200)
  const revoked = await fetch(origin + '/dashboard', {
    headers: { cookie: header(current) },
    redirect: 'manual',
  })
  assert.equal(revoked.status, 307)
  assert.equal(revoked.headers.get('location'), '/auth/login')
  process.stdout.write('C1.4 API + BFF + PostgreSQL session flow PASS\n')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
