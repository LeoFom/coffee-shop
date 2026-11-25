import type { Order } from '@/types/orders.types'
import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import { requireData } from '@/lib/nodejs/result'

export async function getOrders(): Promise<Order[]> {
  const result = await nodejsFetchResult('/orders', (body) => {
    if (!Array.isArray(body)) throw new Error('Invalid orders response')
    return body as Order[]
  })
  return requireData(result)
}
