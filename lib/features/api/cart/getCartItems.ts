import { fetchWithAuth } from '@/lib/auth/fetchWithAuth'
import type { CartItem } from '@/types/checkout.types'
import { mapCartItem } from '@/utils/addProductToCart'

export async function getCartItems(): Promise<CartItem[]> {
  const response = await fetchWithAuth('/api/cart')
  if (!response.ok) throw new Error(`Cart unavailable: ${response.status}`)
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new Error('Invalid cart response')
  return data.map(mapCartItem).filter((item): item is CartItem => item !== null)
}
