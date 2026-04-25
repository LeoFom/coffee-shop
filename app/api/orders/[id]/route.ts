import { supabaseFetch } from '@/lib/supabase/fetcher';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const data = await supabaseFetch(
    `orders?id=eq.${params.id}&select=*,order_items(*)`,
    { cache: 'no-store' }
  );

  return Response.json(data[0]);
}