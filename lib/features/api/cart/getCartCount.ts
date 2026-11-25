import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import { requireData } from '@/lib/nodejs/result'

export async function getCartCount(): Promise<number> {
  const result = await nodejsFetchResult('/cart', (body) => {
    if (!Array.isArray(body)) throw new Error('Invalid cart response')
    return body as Array<{ quantity?: unknown }>
  })
  return requireData(result).reduce(
    (sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : 0),
    0,
  )
}
