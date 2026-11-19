import { nodejsFetch } from '@/lib/nodejs/fetcher';
import type { Profile } from '@/types/profile.types';

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export async function getProfile(): Promise<Profile | null> {
  const response = await nodejsFetch('/profile/me');

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (typeof data?.userId !== 'string') {
    return null;
  }

  return {
    userId: data.userId,
    firstName: asNullableString(data.firstName),
    lastName: asNullableString(data.lastName),
    phone: asNullableString(data.phone),
    photoUrl: asNullableString(data.photoUrl),
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
  };
}
