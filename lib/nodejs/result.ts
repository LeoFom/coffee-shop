import { apiError } from '../contracts/v1/schema'

type Failure = {
  ok: false
  status: number
  error: {
    code: string
    message: string
    requestId: string | null
    fieldErrors: Record<string, string[]>
  }
  retryAfter: string | null
}
type Success<T> = { ok: true; status: number; data: T; requestId: string | null }
export type FetchResult<T> = Failure | Success<T>

const statusCodes: Record<number, [string, string]> = {
  400: ['VALIDATION_FAILED', 'Validation failed'],
  401: ['UNAUTHORIZED', 'Unauthorized'],
  403: ['FORBIDDEN', 'Forbidden'],
  404: ['NOT_FOUND', 'Resource not found'],
  409: ['CONFLICT', 'Request conflicts with current state'],
  429: ['RATE_LIMITED', 'Too many requests'],
  503: ['SERVICE_UNAVAILABLE', 'Service temporarily unavailable'],
}

function failure(
  status: number,
  requestId: string | null,
  retryAfter: string | null,
  body?: unknown,
): Failure {
  const candidate =
    body && typeof body === 'object' && 'error' in body ? { error: body.error } : body
  const structured = apiError.safeParse(candidate)
  const [code, message] = statusCodes[status] ?? ['REQUEST_FAILED', 'Request failed']
  return {
    ok: false,
    status,
    error: structured.success
      ? { ...structured.data.error, requestId: structured.data.error.requestId || requestId }
      : { code, message, requestId, fieldErrors: {} },
    retryAfter,
  }
}

export async function parseJsonResult<T>(
  response: Response,
  decode: (data: unknown) => T,
): Promise<FetchResult<T>> {
  const requestId = response.headers.get('x-request-id')
  const retryAfter = response.headers.get('retry-after')
  let body: unknown
  try {
    body = await response.json()
  } catch {
    return failure(response.ok ? 502 : response.status, requestId, retryAfter)
  }
  if (!response.ok) return failure(response.status, requestId, retryAfter, body)
  try {
    return { ok: true, status: response.status, data: decode(body), requestId }
  } catch {
    return failure(502, requestId, null)
  }
}

export class ApiReadError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly retryAfter: string | null,
    readonly requestId: string | null,
  ) {
    super(code)
  }
}

export function requireData<T>(result: FetchResult<T>): T {
  if (result.ok) return result.data
  throw new ApiReadError(
    result.status,
    result.error.code,
    result.retryAfter,
    result.error.requestId,
  )
}
