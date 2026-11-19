import { Order } from '@/types/orders.types';
import { nodejsFetch } from '@/lib/nodejs/fetcher';

export async function getOrders(): Promise<Order[]> {
  const response = await nodejsFetch('/orders');

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
