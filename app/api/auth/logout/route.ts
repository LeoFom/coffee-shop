import { proxyToBackend } from "@/lib/nodejs/fetcher";

export async function POST() {
  return proxyToBackend('/auth/logout', {
    method: 'POST',
  });
}
