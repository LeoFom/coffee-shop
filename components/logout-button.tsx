'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { AuthContext } from '@/components/providers/AuthProvider'
import { invalidateAuthFlight } from '@/lib/auth/fetchWithAuth'

export function LogoutButton() {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const logout = async () => {
    try {
      setErrorMessage(null)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        setErrorMessage('Sign out failed. Please try again.')
        return
      }

      auth?.setUser(null)
      invalidateAuthFlight()
      router.push('/auth/login')
      router.refresh()
    } catch {
      setErrorMessage('Sign out failed. Please try again.')
    }
  }

  return (
    <div>
      <Button onClick={logout}>Logout</Button>
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
