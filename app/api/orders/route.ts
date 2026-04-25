import { supabaseFetch } from '@/lib/supabase/fetcher';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');

  const data = await supabaseFetch(`orders?user_id=eq.${userId}&select=*`, {
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const { order, items } = await req.json();

  // 1. create order
  const [createdOrder] = await supabaseFetch('orders', {
    method: 'POST',
    body: order,
    cache: 'no-store',
  });

  // 2. create items
  const itemsWithOrderId = items.map((item: any) => ({
    ...item,
    order_id: createdOrder.id,
  }));

  await supabaseFetch('order_items', {
    method: 'POST',
    body: itemsWithOrderId,
    cache: 'no-store',
  });

  return Response.json(createdOrder);
}