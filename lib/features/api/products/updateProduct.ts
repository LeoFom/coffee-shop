import {ProductsType} from "@/types/products.types";

export async function updateProduct(
  id: string,
  data: ProductsType,
) {
  return fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}