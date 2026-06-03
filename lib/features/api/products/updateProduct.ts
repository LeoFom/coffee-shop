import {DashboardProductsType} from "@/types/products";

export async function updateProduct(
  id: string,
  data: DashboardProductsType
) {
  return fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}