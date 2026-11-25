import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import { requireData } from '@/lib/nodejs/result'
import type { User } from '@/lib/auth/user'
import { parseUserRole } from '@/lib/auth/user'

export async function getUser(): Promise<User | null> {
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
  if (!result.ok && result.status === 401) return null
  return requireData(result)
}
