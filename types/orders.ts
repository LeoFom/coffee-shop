import { Product } from '@/types/products';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Orders {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}