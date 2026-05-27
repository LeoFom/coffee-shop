import {ProductFormValues} from "@/types/products";

export async function createProduct(data: ProductFormValues) {
  return await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}