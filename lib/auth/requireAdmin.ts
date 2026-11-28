import { getUser } from '@/lib/auth/getUser'

export async function requireAdminResponse() {
  const state = await getUser()
  if (state.kind === 'authenticated') {
    return state.user.role === 'Admin'
      ? null
      : Response.json(
          { message: 'Forbidden' },
          { status: 403, headers: { 'cache-control': 'no-store' } },
        )
  }
  if (state.kind === 'needsRefresh')
    return Response.json(
      {
        error: {
          code: 'ACCESS_EXPIRED',
          message: 'Access expired',
          fieldErrors: {},
          requestId: '',
        },
      },
      { status: 401, headers: { 'cache-control': 'no-store' } },
    )
  if (state.kind === 'anonymous')
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401, headers: { 'cache-control': 'no-store' } },
    )
  return Response.json(
    { message: 'Service temporarily unavailable' },
    { status: 503, headers: { 'cache-control': 'no-store', 'retry-after': '5' } },
  )
}
