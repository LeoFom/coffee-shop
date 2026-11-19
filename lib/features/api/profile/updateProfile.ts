import type { UpdateProfileInput } from '@/types/profile.types';

export async function updateProfile(data: UpdateProfileInput) {
  return fetch('/api/profile/me', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
