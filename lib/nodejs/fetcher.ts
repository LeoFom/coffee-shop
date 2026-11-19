import { cookies } from 'next/headers';

export function getBackendUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://127.0.0.1:3001'
  );
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number };
};

export async function nodejsFetch(
  path: string,
  options: FetchOptions = {}
) {
  const { method = 'GET', headers: customHeaders, body, cache = 'no-store', next } = options;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const url = `${getBackendUrl()}${path}`;

  const headers: Record<string, string> = {
    Cookie: cookieHeader,
    ...customHeaders,
  };

  const isGetOrDelete = method === 'GET' || method === 'DELETE';

  if (!isGetOrDelete && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined && !isGetOrDelete
      ? JSON.stringify(body)
      : undefined,
    cache,
    next,
  });

  return res;
}

export async function proxyToBackend(
  path: string,
  options: FetchOptions = {}
) {
  const backendRes = await nodejsFetch(path, options);
  const text = await backendRes.text();
  const headers = new Headers();
  const contentType = backendRes.headers.get('content-type');

  if (contentType) {
    headers.set('content-type', contentType);
  }

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    headers.set('set-cookie', setCookie);
  }

  return new Response(text, {
    status: backendRes.status,
    headers,
  });
}
