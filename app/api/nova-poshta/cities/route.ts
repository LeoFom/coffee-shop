import { NextRequest } from 'next/server';
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') ?? '';

  return proxyToBackend(
    `/nova-poshta/cities?query=${encodeURIComponent(query)}`,
  );
}
