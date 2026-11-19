import { NextRequest } from 'next/server';
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function POST(req: NextRequest) {
  const body = await req.json();

  return proxyToBackend('/profile', {
    method: 'POST',
    body,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  return proxyToBackend('/profile', {
    method: 'PATCH',
    body,
  });
}

export async function DELETE() {
  return proxyToBackend('/profile', {
    method: 'DELETE',
  });
}
