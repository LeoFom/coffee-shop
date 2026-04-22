export type ProductCategory = 'Beans' | 'Merch' | 'Equipment' | 'Instant';
export type RoastLevel = 'Light' | 'Medium' | 'Dark';

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  roast?: RoastLevel;
  isMemberDiscount: boolean; // Флаг для скидки по подписке
}

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', slug: 'ethiopia-yirgacheffe', name: 'Ethiopia Yirgacheffe', price: 22, category: 'Beans', roast: 'Light', isMemberDiscount: true },
  { id: '2', slug: 'colombia-supremo', name: 'Colombia Supremo', price: 19, category: 'Beans', roast: 'Medium', isMemberDiscount: false },
  { id: '3', slug: 'french-roast-blend', name: 'French Roast Blend', price: 18, category: 'Beans', roast: 'Dark', isMemberDiscount: true },
  { id: '4', slug: 'coffeo-tote-bag', name: 'Coffeo Canvas Tote', price: 15, category: 'Merch', isMemberDiscount: false },
  { id: '5', slug: 'v60-dripper', name: 'Hario V60 Dripper', price: 25, category: 'Equipment', isMemberDiscount: true },
  { id: '6', slug: 'instant-specialty', name: 'Specialty Instant Coffee', price: 12, category: 'Instant', isMemberDiscount: false },
];