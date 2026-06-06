import {ProductsType} from "@/types/products.types";

export async function createProduct(data: ProductsType) {
  return await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}