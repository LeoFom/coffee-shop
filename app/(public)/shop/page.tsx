import ShopPage from '@/shop/page'
import { getProducts } from '@/lib/features/api/products/getProducts'
import { CatalogUnavailable } from '@/components/shop/CatalogUnavailable'

export default async function Shop() {
  const productsData = await getProducts()
  if (!productsData.ok) return <CatalogUnavailable status={productsData.status} />
  return <ShopPage productsData={productsData.data} />
}
