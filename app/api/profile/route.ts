import { NextRequest } from 'next/server';
import {nodejsFetch} from "@/lib/nodejs/fetcher";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await nodejsFetch(`/profile`, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  return Response.json(data);
}