export interface DashboardTab {
  id: string;
  label: string;
}

export type DashboardProductsType = {
  id: string;

  name: string;
  slug: string;
  description: string;
  imageUrl: string;

  category: string;
  brandId?: string;

  price: number;
  discount: number;

  roast?: string;

  coffeeType?: string;

  originCountry?: string;
  region?: string;

  farm?: string;
  processingStation?: string;

  altitudeMin?: number;
  altitudeMax?: number;

  variety?: string;

  processingMethod?: string;

  scaScore?: number;

  arabicaPercent?: number;
  robustaPercent?: number;

  acidity?: number;
  sweetness?: number;
  bitterness?: number;
  body?: number;

  caffeineLevel?: number;

  weightGrams?: number;

  flavorNotes?: string[];
  brewingMethods?: string[];
}