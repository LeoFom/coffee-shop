import 'server-only'
import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { backendConfig } from './runtime-config'
import { parseJsonResult, type FetchResult } from './result'
import { forwardBackendResponse } from './proxy-response'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: object
  headers?: Record<string, string>
}

function unavailable(requestId: string) {
  return Response.json(
    { message: 'Service temporarily unavailable' },
    {
      status: 503,
      headers: { 'cache-control': 'no-store', 'retry-after': '5', 'x-request-id': requestId },
    },
  )
}

export function getBackendUrl() {
  const config = backendConfig(process.env)
  return config.ok ? config.origin : null
}

export async function nodejsFetch(path: string, options: FetchOptions = {}) {
  const requestId = randomUUID()
  const { method = 'GET', body, headers: extra } = options
  const cookieStore = await cookies()
  const cookieHeader = ['accessToken', 'refreshToken', 'userId']
    .map((name) => cookieStore.get(name))
    .filter((cookie) => cookie !== undefined)
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const hasCredential = cookieStore.has('accessToken') || cookieStore.has('refreshToken')
  if (!hasCredential && /^\/(auth\/me|profile|cart|orders)(\/|$)/.test(path)) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401, headers: { 'cache-control': 'no-store', 'x-request-id': requestId } },
    )
  }
  const config = backendConfig(process.env)
  if (!config.ok) return unavailable(requestId)
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\'))
    return Response.json(
      { message: 'Invalid backend path' },
      { status: 400, headers: { 'cache-control': 'no-store', 'x-request-id': requestId } },
    )
  const url = new URL(path, config.origin)
  if (url.origin !== config.origin)
    return Response.json(
      { message: 'Invalid backend path' },
      { status: 400, headers: { 'cache-control': 'no-store', 'x-request-id': requestId } },
    )
  const headers = new Headers({ 'x-request-id': requestId })
  if (cookieHeader) headers.set('cookie', cookieHeader)
  if (body !== undefined) headers.set('content-type', 'application/json')
  if (config.internalKey) headers.set('x-coffeo-api-key', config.internalKey)
  const idempotencyKey = extra?.['idempotency-key'] ?? extra?.['Idempotency-Key']
  if (idempotencyKey && /^[A-Za-z0-9._-]{8,128}$/.test(idempotencyKey))
    headers.set('idempotency-key', idempotencyKey)
  try {
    return await fetch(url, {
      method,
      headers,
      ...(body === undefined || method === 'GET' || method === 'DELETE'
        ? {}
        : { body: JSON.stringify(body) }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(65000),
    })
  } catch {
    return unavailable(requestId)
  }
}

export async function nodejsFetchResult<T>(
  path: string,
  decode: (data: unknown) => T,
  options: FetchOptions = {},
): Promise<FetchResult<T>> {
  return parseJsonResult(await nodejsFetch(path, options), decode)
}

export async function proxyToBackend(path: string, options: FetchOptions = {}) {
  return forwardBackendResponse(await nodejsFetch(path, options))
}
