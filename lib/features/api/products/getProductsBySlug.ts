import { nodejsFetch } from '@/lib/nodejs/fetcher';
export async function getProductsBySlug(slug: string) {
  const response = await nodejsFetch('/products/slug/' + encodeURIComponent(slug));
  return response.ok ? response.json() : null;
}
