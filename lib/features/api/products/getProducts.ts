import { nodejsFetch } from '@/lib/nodejs/fetcher';
export async function getProducts() {
  const response = await nodejsFetch('/products');
  return response.ok ? response.json() : [];
}
