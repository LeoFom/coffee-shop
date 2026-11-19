import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export default async function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return children;
}
