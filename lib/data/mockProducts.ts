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
  { id: '7', slug: 'brazil-santos', name: 'Brazil Santos', price: 17, category: 'Beans', roast: 'Medium', isMemberDiscount: true },
  { id: '8', slug: 'guatemala-antigua', name: 'Guatemala Antigua', price: 21, category: 'Beans', roast: 'Medium', isMemberDiscount: false },
  { id: '9', slug: 'kenya-aa-plus', name: 'Kenya AA Plus', price: 26, category: 'Beans', roast: 'Light', isMemberDiscount: true },
  { id: '10', slug: 'sumatra-mandheling', name: 'Sumatra Mandheling', price: 20, category: 'Beans', roast: 'Dark', isMemberDiscount: false },
  { id: '11', slug: 'aeropress-go', name: 'AeroPress Go Travel', price: 45, category: 'Equipment', isMemberDiscount: false },
  { id: '12', slug: 'ceramic-mug-white', name: 'Minimalist Ceramic Mug', price: 18, category: 'Merch', isMemberDiscount: true },
  { id: '13', slug: 'espresso-house-blend', name: 'Espresso House Blend', price: 16, category: 'Beans', roast: 'Dark', isMemberDiscount: true },
  { id: '14', slug: 'hand-grinder-pro', name: 'Manual Burr Grinder', price: 55, category: 'Equipment', isMemberDiscount: false },
  { id: '15', slug: 'decaf-peru', name: 'Decaf Peru Cajamarca', price: 23, category: 'Beans', roast: 'Medium', isMemberDiscount: false },
  { id: '16', slug: 'paper-filters-v60', name: 'V60 Paper Filters (100pcs)', price: 9, category: 'Equipment', isMemberDiscount: false },
  { id: '17', slug: 'costa-rica-tarrazu', name: 'Costa Rica Tarrazu', price: 24, category: 'Beans', roast: 'Light', isMemberDiscount: true },
  { id: '18', slug: 'enamel-camping-mug', name: 'Adventure Enamel Mug', price: 14, category: 'Merch', isMemberDiscount: false },
  { id: '19', slug: 'instant-dark-roast', name: 'Dark Roast Instant', price: 10, category: 'Instant', isMemberDiscount: true },
  { id: '20', slug: 'gooseneck-kettle', name: 'Electric Gooseneck Kettle', price: 89, category: 'Equipment', isMemberDiscount: false },
  { id: '21', slug: 'vietnam-robusta', name: 'Vietnam High Altitude', price: 15, category: 'Beans', roast: 'Dark', isMemberDiscount: true },
  { id: '22', slug: 'coffeo-t-shirt', name: 'Classic Logo T-Shirt', price: 28, category: 'Merch', isMemberDiscount: true },
  { id: '23', slug: 'chemex-6-cup', name: 'Chemex Classic 6-Cup', price: 48, category: 'Equipment', isMemberDiscount: false },
  { id: '24', slug: 'honduras-organic', name: 'Honduras Organic', price: 22, category: 'Beans', roast: 'Medium', isMemberDiscount: false },
  { id: '25', slug: 'milk-frother', name: 'Handheld Milk Frother', price: 12, category: 'Equipment', isMemberDiscount: true },
  { id: '26', slug: 'instant-vanilla-latte', name: 'Instant Vanilla Latte', price: 14, category: 'Instant', isMemberDiscount: false },
  { id: '27', slug: 'rwanda-single-origin', name: 'Rwanda Single Origin', price: 25, category: 'Beans', roast: 'Light', isMemberDiscount: true },
  { id: '28', slug: 'coffee-scales', name: 'Digital Coffee Scales', price: 35, category: 'Equipment', isMemberDiscount: false },
  { id: '29', slug: 'barista-apron', name: 'Denim Barista Apron', price: 40, category: 'Merch', isMemberDiscount: true },
  { id: '30', slug: 'cold-brew-pack', name: 'Cold Brew Filter Packs', price: 18, category: 'Beans', roast: 'Medium', isMemberDiscount: false },
];