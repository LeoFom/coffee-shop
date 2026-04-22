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