'use client'

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/components/providers/AuthProvider'
import { parseUserRole } from '@/lib/auth/user'
import { invalidateAuthFlight, refreshOnce } from '@/lib/auth/fetchWithAuth'

export function SessionRecovery({ next }: { next: string }) {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const [state, setState] = useState<'working' | 'retry' | 'login'>('working')
  const started = useRef(false)
  const recover = useCallback(async () => {
    try {
      const response = await refreshOnce()
      if (response.status === 503) return setState('retry')
      if (!response.ok) {
        auth?.setUser(null)
        return setState('login')
      }
      const me = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      if (me.status === 503) return setState('retry')
      if (!me.ok) {
        auth?.setUser(null)
        return setState('login')
      }
      const user: unknown = await me.json()
      if (
        !user ||
        typeof user !== 'object' ||
        !('id' in user) ||
        typeof user.id !== 'string' ||
        !('email' in user) ||
        typeof user.email !== 'string'
      )
        return setState('retry')
      invalidateAuthFlight()
      auth?.setUser({
        id: user.id,
        email: user.email,
        role: parseUserRole('role' in user ? user.role : undefined),
      })
      router.replace(next)
      router.refresh()
    } catch {
      setState('retry')
    }
  }, [auth, next, router])

  useEffect(() => {
    if (started.current) return
    started.current = true
    void recover()
  }, [recover])

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center" aria-live="polite">
      <h1 className="text-2xl font-semibold">Restoring your session</h1>
      {state === 'working' && <p className="mt-4">Please wait a moment.</p>}
      {state === 'retry' && (
        <>
          <p className="mt-4">The service is temporarily unavailable. Your information is safe.</p>
          <button
            className="mt-6 rounded bg-brand-brown px-5 py-2 text-white"
            onClick={() => {
              setState('working')
              void recover()
            }}
          >
            Try again
          </button>
        </>
      )}
      {state === 'login' && (
        <>
          <p className="mt-4">Please sign in again.</p>
          <a className="mt-6 inline-block underline" href="/auth/login">
            Sign in
          </a>
        </>
      )}
    </main>
  )
}
