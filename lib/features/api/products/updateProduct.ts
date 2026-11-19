import {ProductsType} from "@/types/products.types";

export async function updateProduct(
  id: string,
  data: ProductsType,
) {
  return fetch(`/api/products/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}