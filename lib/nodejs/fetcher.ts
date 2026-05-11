type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  cache?: RequestCache;
  next?: { revalidate?: number };
};

export async function nodejsFetch(
  path: string,
  options: FetchOptions = {}
) {
  const { method = 'GET', body, cache = 'force-cache', next } = options;

  const res = await fetch(`http://127.0.0.1:3001${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });


  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res
}