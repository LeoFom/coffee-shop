import {DashboardProductsType as ProductsType} from "@/types/products";
import {DashboardProductsType} from "@/components/dashboard/types/dashboardTypes";

export async function createProduct(data: ProductsType | DashboardProductsType) {
  return await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}