import DashboardPage from "@/dashboard/page/DashboardPage";
import { getProducts } from "@/lib/features/api/products/getProducts";
import { getUser } from "@/lib/auth/getUser";
import { getOrders } from "@/lib/features/api/orders/getOrders";
import { getCartCount } from "@/lib/features/api/cart/getCartCount";

async function Dashboard() {
  const user = await getUser();
  const isAdmin = user?.role === "Admin";
  const [productsData, orders, cartItemCount] = await Promise.all([
    isAdmin ? getProducts() : Promise.resolve([]),
    getOrders(),
    getCartCount(),
  ]);

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

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
  );
}

export default Dashboard;
