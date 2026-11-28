let refreshFlight: Promise<Response> | null = null
let refreshController: AbortController | null = null
const invalidationListeners = new Set<() => void>()

export function onAuthInvalidated(listener: () => void) {
  invalidationListeners.add(listener)
  return () => {
    invalidationListeners.delete(listener)
  }
}

function invalidateUser() {
  for (const listener of invalidationListeners) listener()
}

export function invalidateAuthFlight() {
  refreshController?.abort()
  refreshController = null
  refreshFlight = null
}

export function refreshOnce(): Promise<Response> {
  if (!refreshFlight) {
    const controller = new AbortController()
    refreshController = controller
    const flight = fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    })
    const shared = flight.finally(() => {
      if (refreshFlight === shared) refreshFlight = null
      if (refreshController === controller) refreshController = null
    })
    refreshFlight = shared
  }
  return refreshFlight
}

export async function fetchWithAuth(path: string, init: RequestInit = {}): Promise<Response> {
  if (!path.startsWith('/api/') || path.startsWith('//')) throw new Error('Invalid API path')
  const options = { ...init, credentials: 'include' as const }
  const unavailable = () =>
    Response.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
  let response: Response
  try {
    response = await fetch(path, options)
  } catch {
    return unavailable()
  }
  if (response.status !== 401) return response
  let code: unknown
  try {
    code = (await response.clone().json()).error?.code
  } catch {
    invalidateUser()
    return response
  }
  if (code !== 'ACCESS_EXPIRED') {
    invalidateUser()
    return response
  }
  let refreshed: Response
  try {
    refreshed = await refreshOnce()
  } catch {
    return unavailable()
  }
  if (!refreshed.ok) {
    if (refreshed.status === 401) invalidateUser()
    return refreshed.status === 503 ? refreshed : response
  }
  try {
    const retried = await fetch(path, options)
    if (retried.status === 401) invalidateUser()
    return retried
  } catch {
    return unavailable()
  }
}
