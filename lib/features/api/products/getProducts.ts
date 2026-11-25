import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import type { ProductsType } from '@/types/products.types'

export async function getProducts() {
  return nodejsFetchResult('/products', (body) => {
    if (!Array.isArray(body)) throw new Error('Invalid catalog response')
    return body as ProductsType[]
  })
}
