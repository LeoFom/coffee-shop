import { getUser } from '@/lib/auth/getUser';

export async function requireAdminResponse() {
  const user = await getUser();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'Admin') {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }

  return null;
}
