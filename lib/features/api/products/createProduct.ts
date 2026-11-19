import {ProductsType} from "@/types/products.types";

export async function createProduct(data: ProductsType) {
  return await fetch("/api/products", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}