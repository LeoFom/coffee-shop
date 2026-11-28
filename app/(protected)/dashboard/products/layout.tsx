import { requireUser } from '@/lib/auth/requireUser'
import { redirect } from 'next/navigation'

export default async function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/dashboard/products')

  if (user.role !== 'Admin') {
    redirect('/dashboard')
  }

  return children
}
