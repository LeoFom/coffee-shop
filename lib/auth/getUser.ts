import { cache } from 'react'
import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import type { User } from '@/lib/auth/user'
import { parseUserRole } from '@/lib/auth/user'

export type AuthState =
  | { kind: 'authenticated'; user: User }
  | { kind: 'needsRefresh' }
  | { kind: 'anonymous' }
  | { kind: 'unavailable' }

export const getUser = cache(async (): Promise<AuthState> => {
  const result = await nodejsFetchResult('/auth/me', (data) => {
    if (
      !data ||
      typeof data !== 'object' ||
      !('id' in data) ||
      typeof data.id !== 'string' ||
      !('email' in data) ||
      typeof data.email !== 'string'
    )
      throw new Error('Invalid user response')
    return {
      id: data.id,
      email: data.email,
      role: parseUserRole('role' in data ? data.role : undefined),
    }
  })
  if (result.ok) return { kind: 'authenticated', user: result.data }
  if (result.error.code === 'ACCESS_EXPIRED') return { kind: 'needsRefresh' }
  if (result.status === 401) return { kind: 'anonymous' }
  return { kind: 'unavailable' }
})
