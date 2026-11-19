import { nodejsFetch } from '@/lib/nodejs/fetcher';

export async function getCartCount(): Promise<number> {
  const response = await nodejsFetch('/cart');

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return 0;
  }

  return data.reduce((sum: number, item: { quantity?: unknown }) => {
    const quantity = typeof item?.quantity === 'number' ? item.quantity : 0;
    return sum + quantity;
  }, 0);
}
