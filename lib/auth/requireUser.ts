import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import { safeReturnTo } from './return-to'

export async function requireUser(returnTo: string) {
  const state = await getUser()
  if (state.kind === 'authenticated') return state.user
  if (state.kind === 'needsRefresh')
    redirect(`/auth/continue?next=${encodeURIComponent(safeReturnTo(returnTo))}`)
  if (state.kind === 'anonymous') redirect('/auth/login')
  throw new Error('AUTH_SERVICE_UNAVAILABLE')
}
