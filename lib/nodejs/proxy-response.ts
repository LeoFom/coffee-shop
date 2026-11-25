export async function forwardBackendResponse(response: Response): Promise<Response> {
  const headers = new Headers({ 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  for (const name of ['content-type', 'retry-after', 'x-request-id', 'idempotency-replayed']) {
    const value = response.headers.get(name)
    if (value) headers.set(name, value)
  }
  for (const cookie of response.headers.getSetCookie()) headers.append('set-cookie', cookie)
  return new Response(response.status === 204 ? null : await response.text(), {
    status: response.status,
    headers,
  })
}
