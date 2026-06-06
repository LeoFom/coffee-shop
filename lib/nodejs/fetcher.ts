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

  const res = await fetch(`http://127.0.0.1:3001${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    body: body || undefined,
    cache,
    next,
  });

  return res;
}