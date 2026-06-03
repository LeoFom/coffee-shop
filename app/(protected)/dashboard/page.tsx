import DashboardPage from "@/dashboard/page/DashboardPage";
import {getProducts} from "@/lib/features/api/products/getProducts";

async function Dashboard() {
  const productsData = await getProducts()

  return (
    <DashboardPage
      productsData={productsData}
    />
  );
}

export default Dashboard