import { getUser } from '@/lib/auth/getUser'
import { ApiReadError } from '@/lib/nodejs/result'
import { randomUUID } from 'node:crypto'

export async function requireAdminResponse() {
  let user
  try {
    user = await getUser()
  } catch (error) {
    if (!(error instanceof ApiReadError)) throw error
    return Response.json(
      {
        message:
          error.status === 503
            ? 'Service temporarily unavailable'
            : 'Authorization could not be verified',
        error: {
          code: error.code,
          message:
            error.status === 503
              ? 'Service temporarily unavailable'
              : 'Authorization could not be verified',
          fieldErrors: {},
          requestId: error.requestId ?? randomUUID(),
        },
      },
      {
        status: error.status,
        headers: {
          'cache-control': 'no-store',
          ...(error.retryAfter ? { 'retry-after': error.retryAfter } : {}),
        },
      },
    )
  }

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (user.role !== 'Admin') {
    return Response.json({ message: 'Forbidden' }, { status: 403 })
  }

  return null
}
