import { NextRequest } from 'next/server';
import {nodejsFetch} from "@/lib/nodejs/fetcher";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');

  const response = await nodejsFetch('/auth/refresh', {
    method: 'POST',
    headers: {
      Cookie: cookieHeader || '',
    },
    body: JSON.stringify({}),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("[REFRESH TOKEN] error text -> ",errorText)
    return new Response(errorText, { status: response.status });
  }

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
    headers: {
      'set-cookie': response.headers.get('set-cookie') || '',
    },
  });
}