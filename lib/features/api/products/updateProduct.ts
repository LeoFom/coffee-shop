import {DashboardProductsType as ProductsType} from "@/types/products";
import {DashboardProductsType} from "@/components/dashboard/types/dashboardTypes";

export async function updateProduct(
  id: string,
  data: ProductsType | DashboardProductsType
) {
  return fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}