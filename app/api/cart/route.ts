import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET() {
  return proxyToBackend('/cart');
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return proxyToBackend('/cart', {
    method: 'POST',
    body,
  });
}

