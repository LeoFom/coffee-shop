import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import { requireData } from '@/lib/nodejs/result'
import type { Profile } from '@/types/profile.types'

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export async function getProfile(): Promise<Profile | null> {
  const result = await nodejsFetchResult('/profile/me', (data) => {
    if (data === null) return null
    if (!data || typeof data !== 'object' || !('userId' in data) || typeof data.userId !== 'string')
      throw new Error('Invalid profile response')
    const profile = data as Record<string, unknown>
    return {
      userId: profile.userId as string,
      firstName: asNullableString(profile.firstName),
      lastName: asNullableString(profile.lastName),
      phone: asNullableString(profile.phone),
      photoUrl: asNullableString(profile.photoUrl),
      createdAt: typeof profile.createdAt === 'string' ? profile.createdAt : '',
      updatedAt: typeof profile.updatedAt === 'string' ? profile.updatedAt : '',
    }
  })
  if (!result.ok && result.status === 404) return null
  return requireData(result)
}
