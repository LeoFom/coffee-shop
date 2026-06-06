import {ProductCategory, RoastLevel} from "@/lib/data/mockProducts";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  roast?: RoastLevel;
  isMemberDiscount: boolean;
}


export type CategoryType =  'Coffee' | 'Equipment' | 'Merchandise';
export type RoastType = "Light" | "Medium" | "Dark";
export type CoffeeType = 'Beans' | 'Ground' | 'Drip' | 'Capsules';
export type ProcessingMethod = 'Washed' | 'Natural' | 'Honey' | 'Anaerobic' | 'SemiWashed';

export type ProductsType = {
  id: string;

  name: string;
  slug: string;

  description: string;
  imageUrl: string;

  category: CategoryType;

  price: number;
  discount: number;

  brandId?: string;

  coffeeDetails?: {
    coffeeType?: CoffeeType;

    roast?: RoastType;

    originCountry?: string;
    region?: string;

    farm?: string;
    processingStation?: string;

    variety?: string;

    processingMethod?: ProcessingMethod;

    altitudeMin?: number;
    altitudeMax?: number;

    scaScore?: number;

    arabicaPercent?: number;
    robustaPercent?: number;

    acidity?: number;
    sweetness?: number;
    bitterness?: number;
    body?: number;

    caffeineLevel?: number;

    weightGrams?: number;
  };
};