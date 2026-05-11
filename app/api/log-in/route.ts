import { NextRequest } from 'next/server';
import {nodejsFetch} from "@/lib/nodejs/fetcher";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await nodejsFetch(`/auth/log-in`, {
    method: 'POST',
    body: body,
    cache: 'no-store',
  });

  return Response.json(data);
}