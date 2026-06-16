import { cookies } from 'next/headers';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: any;
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

  // const cleanCookieHeader = cookieStore.getAll()
  //   .map(cookie => `${cookie.name}=${cookie.value}`)
  //   .join('; ');
  //
  // console.log("--- NODEJS FETCH SENDS CLEAN COOKIE ---");
  // console.log(cleanCookieHeader);
  // console.log("---------------------------------------");

  const isGetOrDelete = method === 'GET' || method === 'DELETE';

  const res = await fetch(`http://127.0.0.1:3001${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
      'Cookie': cookieHeader,
    },
    body: !isGetOrDelete && body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  return res;
}