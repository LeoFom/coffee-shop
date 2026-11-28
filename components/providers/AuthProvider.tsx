'use client'

import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItems } from '@/lib/features/api/cart/getCartItems'
import { setCartItems } from '@/store/cart/cartSlice'
import { setProducts } from '@/store/products/productSlice'
import type { User } from '@/lib/auth/user'
import { onAuthInvalidated } from '@/lib/auth/fetchWithAuth'

export type { User }

type AuthContextType = { user: User | null; setUser: (user: User | null) => void }
export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const [user, setUserState] = useState<User | null>(initialUser)
  const userId = user?.id ?? null
  const dispatch = useDispatch()
  const identity = useRef<string | null>(initialUser?.id ?? null)
  const setUser = useCallback(
    (next: User | null) => {
      if (identity.current !== (next?.id ?? null)) {
        dispatch(setCartItems([]))
        dispatch(setProducts([]))
        identity.current = next?.id ?? null
      }
      setUserState(next)
    },
    [dispatch],
  )

  useEffect(() => {
    return onAuthInvalidated(() => setUser(null))
  }, [setUser])

  useEffect(() => {
    if (!userId) return
    let active = true
    getCartItems()
      .then((items) => {
        if (active && identity.current === userId) dispatch(setCartItems(items))
      })
      .catch(() => {
        /* Keep current cart on a transient API failure. */
      })
    return () => {
      active = false
    }
  }, [userId, dispatch])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
