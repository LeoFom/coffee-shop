import DashboardPage from '@/dashboard/page/DashboardPage'
import { getProducts } from '@/lib/features/api/products/getProducts'
import { getOrders } from '@/lib/features/api/orders/getOrders'
import { getCartCount } from '@/lib/features/api/cart/getCartCount'
import { requireData } from '@/lib/nodejs/result'

export default async function AdminProductsPage() {
  const [productsResult, orders, cartItemCount] = await Promise.all([
    getProducts(),
    getOrders(),
    getCartCount(),
  ])
  const productsData = requireData(productsResult)
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <DashboardPage
      productsData={productsData ?? []}
      isAdmin
      initialTab="products"
      orders={orders}
      overview={{
        totalSpent,
        totalOrders: orders.length,
        cartItemCount,
        recentOrders: orders.slice(0, 4),
      }}
    />
  )
}
