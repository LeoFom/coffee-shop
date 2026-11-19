import { proxyToBackend } from '@/lib/nodejs/fetcher';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Order ID is required' }, { status: 400 });
  }

  return proxyToBackend(`/orders/${id}`);
}
