import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function GET() {
  return proxyToBackend('/auth/me');
}
