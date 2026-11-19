import { NextRequest } from 'next/server';
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();
  const cityRef = searchParams.get('cityRef');
  const query = searchParams.get('query');

  if (cityRef) {
    params.set('cityRef', cityRef);
  }

  if (query) {
    params.set('query', query);
  }

  return proxyToBackend(`/nova-poshta/warehouses?${params.toString()}`);
}
