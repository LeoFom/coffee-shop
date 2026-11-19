import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return Response.json({ error: 'Product slug is required' }, { status: 400 });
  }

  return proxyToBackend(`/products/slug/${slug}`);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  return proxyToBackend(`/products/slug/${slug}`, {
    method: 'PATCH',
    body,
  });
}
