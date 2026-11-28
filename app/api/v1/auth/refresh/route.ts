import { proxyToBackend } from '@/lib/nodejs/fetcher'

export async function POST() {
  return proxyToBackend('/auth/refresh', { method: 'POST' })
}
