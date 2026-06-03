import {ProductCategory, RoastLevel} from "@/lib/data/mockProducts";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  roast?: RoastLevel;
  isMemberDiscount: boolean; // Флаг для скидки по подписке
}

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  roast: string;
  imageUrl: string;
};

export type DashboardProductsType = {
  id: string;
  category?: string;
  currency?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  memberDiscountPercent?: string;
  name?: string;
  price?: string;
  discount?: string;
  roast?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}