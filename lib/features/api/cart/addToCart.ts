import {ProductsType} from "@/types/products.types";

export async function addToCart(data: ProductsType) {
  return await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}