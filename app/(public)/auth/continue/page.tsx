import { SessionRecovery } from '@/components/auth/SessionRecovery'
import { safeReturnTo } from '@/lib/auth/return-to'

export default async function ContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return <SessionRecovery next={safeReturnTo(next)} />
}
