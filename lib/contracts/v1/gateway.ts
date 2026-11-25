import { randomUUID } from 'node:crypto'
import { ZodError } from 'zod'
import {
  apiError,
  productIdParam,
  productQuery,
  productResponse,
  productsResponse,
  productSlugParam,
  profilePatch,
  profileResponse,
  reservedCartWrite,
  reservedCheckoutWrite,
} from './schema'

type Method = 'GET' | 'POST' | 'PATCH'
type Backend = (path: string, options: { method: Method; body?: object }) => Promise<Response>

function error(
  status: number,
  code: string,
  message: string,
  fieldErrors: Record<string, string[]> = {},
  upstreamHeaders?: Headers,
) {
  const headers = new Headers({ 'cache-control': 'no-store' })
  if (upstreamHeaders) {
    for (const name of ['retry-after', 'x-request-id']) {
      const value = upstreamHeaders.get(name)
      if (value) headers.set(name, value)
    }
    for (const cookie of upstreamHeaders.getSetCookie()) headers.append('set-cookie', cookie)
  }
  return Response.json(
    {
      error: { code, message, fieldErrors, requestId: headers.get('x-request-id') ?? randomUUID() },
    },
    { status, headers },
  )
}

export async function handleV1(
  request: Request,
  segments: string[],
  backend: Backend,
): Promise<Response> {
  const url = new URL(request.url)
  if (request.method !== 'GET' && request.headers.get('origin') !== url.origin)
    return error(403, 'FORBIDDEN', 'Invalid request origin')
  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\'),
    )
  )
    return error(404, 'NOT_FOUND', 'Route not found')

  let path: string
  let body: object | undefined
  let responseSchema:
    typeof productsResponse | typeof productResponse | typeof profileResponse | undefined
  try {
    const method = request.method as Method
    if (!['GET', 'POST', 'PATCH'].includes(method))
      return error(405, 'METHOD_NOT_ALLOWED', 'Method not allowed')
    if (method === 'GET' && segments.length === 1 && segments[0] === 'products') {
      const params = Object.fromEntries(url.searchParams)
      if ([...url.searchParams.keys()].length !== Object.keys(params).length)
        return error(400, 'VALIDATION_FAILED', 'Duplicate query field')
      const query = productQuery.parse(params)
      path = `/v1/products?${new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)]))}`
      responseSchema = productsResponse
    } else if (method === 'GET' && segments.length === 2 && segments[0] === 'products') {
      const { id } = productIdParam.parse({ id: segments[1] })
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = `/v1/products/${id}`
      responseSchema = productResponse
    } else if (
      method === 'GET' &&
      segments.length === 3 &&
      segments[0] === 'products' &&
      segments[1] === 'slug'
    ) {
      const { slug } = productSlugParam.parse({ slug: segments[2] })
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = `/v1/products/slug/${encodeURIComponent(slug)}`
      responseSchema = productResponse
    } else if (
      segments.length === 2 &&
      segments[0] === 'profile' &&
      segments[1] === 'me' &&
      (method === 'GET' || method === 'PATCH')
    ) {
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = '/v1/profile/me'
      responseSchema = profileResponse
      if (method === 'PATCH') body = profilePatch.parse(await request.json())
    } else if (
      method === 'POST' &&
      segments.length === 2 &&
      segments[0] === 'cart' &&
      segments[1] === 'items'
    ) {
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = '/v1/cart/items'
      body = reservedCartWrite.parse(await request.json())
    } else if (method === 'POST' && segments.length === 1 && segments[0] === 'orders') {
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = '/v1/orders'
      body = reservedCheckoutWrite.parse(await request.json())
    } else if (
      method === 'POST' &&
      segments.length === 2 &&
      segments[0] === 'admin' &&
      segments[1] === 'products'
    ) {
      if (url.search) return error(400, 'VALIDATION_FAILED', 'Unknown query field')
      path = '/v1/admin/products'
      const raw: unknown = await request.json()
      if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
        return error(400, 'VALIDATION_FAILED', 'Object body required')
      body = raw
    } else return error(404, 'NOT_FOUND', 'Route not found')
  } catch (cause) {
    if (cause instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of cause.issues) {
        const key = issue.path.map(String).join('.') || '_root'
        ;(fieldErrors[key] ??= []).push(issue.message)
      }
      return error(400, 'VALIDATION_FAILED', 'Validation failed', fieldErrors)
    }
    return error(400, 'VALIDATION_FAILED', 'Invalid JSON body')
  }

  let upstream: Response
  try {
    upstream = await backend(path, {
      method: request.method as Method,
      ...(body === undefined ? {} : { body }),
    })
  } catch {
    return error(503, 'API_UNAVAILABLE', 'API is temporarily unavailable')
  }

  const headers = new Headers({
    'cache-control': 'no-store',
    'content-type': 'application/json',
    'x-content-type-options': 'nosniff',
  })
  for (const cookie of upstream.headers.getSetCookie()) headers.append('set-cookie', cookie)
  const requestId = upstream.headers.get('x-request-id')
  if (requestId) headers.set('x-request-id', requestId)
  for (const name of ['retry-after', 'idempotency-replayed']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  let payload: unknown
  try {
    payload = await upstream.json()
  } catch {
    return upstream.status === 503
      ? error(503, 'API_UNAVAILABLE', 'API is temporarily unavailable', {}, headers)
      : error(502, 'BAD_GATEWAY', 'Invalid API response', {}, headers)
  }
  if (upstream.ok && responseSchema) {
    const parsed = responseSchema.safeParse(payload)
    if (!parsed.success) return error(502, 'BAD_GATEWAY', 'Invalid API response', {}, headers)
    return Response.json(parsed.data, { status: upstream.status, headers })
  }
  if (!upstream.ok) {
    const parsed = apiError.safeParse(payload)
    if (!parsed.success)
      return error(
        upstream.status === 503 ? 503 : 502,
        upstream.status === 503 ? 'API_UNAVAILABLE' : 'BAD_GATEWAY',
        upstream.status === 503 ? 'API is temporarily unavailable' : 'Invalid API error',
        {},
        headers,
      )
    return Response.json(parsed.data, { status: upstream.status, headers })
  }
  return error(502, 'BAD_GATEWAY', 'Unexpected API response')
}
