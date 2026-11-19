import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/nodejs/fetcher';

export async function GET() {
  return proxyToBackend('/orders');
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return proxyToBackend('/orders', {
    method: 'POST',
    body,
  });
}
