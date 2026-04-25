import { supabaseFetch } from '@/lib/supabase/fetcher';
import { NextRequest } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const data = await supabaseFetch(`products?id=eq.${params.id}`, {
    next: { revalidate: 60 },
  });

  return Response.json(data[0]);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const data = await supabaseFetch(`products?id=eq.${params.id}`, {
    method: 'PATCH',
    body,
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await supabaseFetch(`products?id=eq.${params.id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  return Response.json({ success: true });
}