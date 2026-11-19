import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Cart item ID is required' }, { status: 400 });
  }

  return proxyToBackend(`/cart/${id}`);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  return proxyToBackend(`/cart/${id}`, {
    method: 'PATCH',
    body,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return proxyToBackend(`/cart/${id}`, {
    method: 'DELETE',
  });
}
