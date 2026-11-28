import DashboardPage from '@/dashboard/page/DashboardPage'
import { getProducts } from '@/lib/features/api/products/getProducts'
import { requireUser } from '@/lib/auth/requireUser'
import { getOrders } from '@/lib/features/api/orders/getOrders'
import { getCartCount } from '@/lib/features/api/cart/getCartCount'
import { requireData } from '@/lib/nodejs/result'

async function Dashboard() {
  const user = await requireUser('/dashboard')
  const isAdmin = user.role === 'Admin'
  const [productsResult, orders, cartItemCount] = await Promise.all([
    isAdmin ? getProducts() : Promise.resolve(null),
    getOrders(),
    getCartCount(),
  ])
  const productsData = productsResult ? requireData(productsResult) : []

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <DashboardPage
      productsData={productsData ?? []}
      isAdmin={isAdmin}
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

export default Dashboard
