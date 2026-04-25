import { supabaseFetch } from '@/lib/supabase/fetcher';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');

  const data = await supabaseFetch(`cart_items?user_id=eq.${userId}`, {
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await supabaseFetch('cart_items', {
    method: 'POST',
    body,
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...rest } = await req.json();

  const data = await supabaseFetch(`cart_items?id=eq.${id}`, {
    method: 'PATCH',
    body: rest,
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  await supabaseFetch(`cart_items?id=eq.${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  return Response.json({ success: true });
}