import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/nodejs/fetcher";
import { requireAdminResponse } from "@/lib/auth/requireAdmin";

export async function GET() {
  return proxyToBackend('/products');
}

export async function POST(req: NextRequest) {
  const denied = await requireAdminResponse();
  if (denied) {
    return denied;
  }

  const body = await req.json();

  return proxyToBackend('/products', {
    method: 'POST',
    body,
  });
}
