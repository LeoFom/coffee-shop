import 'server-only';
import { cookies } from 'next/headers';
export function getBackendUrl() {
  const value = process.env.API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3001');
  if (!value) return null;
  const url = new URL(value);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('API_URL must use HTTPS');
  return url.origin;
}
type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number };
};
export async function nodejsFetch(path: string, options: FetchOptions = {}) {
  const { method = 'GET', headers: extra, body } = options;
  const cookieStore = await cookies();
  const cookieHeader = ['accessToken', 'refreshToken', 'userId'].map(name => cookieStore.get(name)).filter(Boolean).map(cookie => cookie!.name + '=' + cookie!.value).join('; ');
  if (!cookieHeader && /^\/(auth\/me|profile|cart|orders)(\/|$)/.test(path)) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const base = getBackendUrl();
    if (!base || (process.env.NODE_ENV === 'production' && !process.env.INTERNAL_API_KEY)) return Response.json({ message: 'API is not configured' }, { status: 503 });
    return await fetch(new URL(path, base), {
      method,
      headers: { Cookie: cookieHeader, ...extra,
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(process.env.INTERNAL_API_KEY ? { 'x-coffeo-api-key': process.env.INTERNAL_API_KEY } : {}),
      },
      ...(body === undefined || method === 'GET' || method === 'DELETE' ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(65000),
    });
  } catch { return Response.json({ message: 'API is starting or temporarily unavailable. Please try again.' }, { status: 503 }); }
}
export async function proxyToBackend(path: string, options: FetchOptions = {}) {
  const response = await nodejsFetch(path, options);
  const headers = new Headers({ 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  const type = response.headers.get('content-type');
  if (type) headers.set('content-type', type);
  for (const cookie of response.headers.getSetCookie()) headers.append('set-cookie', cookie);
  return new Response(response.status === 204 ? null : await response.text(), { status: response.status, headers });
}
