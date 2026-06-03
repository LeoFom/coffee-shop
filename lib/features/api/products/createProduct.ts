import {DashboardProductsType, ProductFormValues} from "@/types/products";

export async function createProduct(data: ProductFormValues | DashboardProductsType) {
  return await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}