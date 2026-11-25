import { nodejsFetchResult } from '@/lib/nodejs/fetcher'
import { requireData } from '@/lib/nodejs/result'
import type { ProductsType } from '@/types/products.types'

export async function getProductsBySlug(slug: string): Promise<ProductsType | null> {
  const result = await nodejsFetchResult('/products/slug/' + encodeURIComponent(slug), (body) => {
    if (!body || typeof body !== 'object' || !('id' in body) || typeof body.id !== 'string')
      throw new Error('Invalid product response')
    return body as ProductsType
  })
  if (!result.ok && result.status === 404) return null
  return requireData(result)
}
