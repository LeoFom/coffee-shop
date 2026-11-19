import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/nodejs/fetcher";
import { requireAdminResponse } from "@/lib/auth/requireAdmin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Product ID is required' }, { status: 400 });
  }

  return proxyToBackend(`/products/${id}`);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminResponse();
  if (denied) {
    return denied;
  }

  const { id } = await params;
  const body = await req.json();

  return proxyToBackend(`/products/${id}`, {
    method: 'PATCH',
    body,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminResponse();
  if (denied) {
    return denied;
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Product ID is required' }, { status: 400 });
  }

  return proxyToBackend(`/products/${id}`, {
    method: 'DELETE',
  });
}
