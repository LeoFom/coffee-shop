import { NextRequest } from 'next/server';
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET() {
  return proxyToBackend('/profile/me');
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  return proxyToBackend('/profile', {
    method: 'PATCH',
    body,
  });
}
