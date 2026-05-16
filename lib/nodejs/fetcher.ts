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
  // 1. По умолчанию для API ставим 'no-store', чтобы всегда получать свежие данные.
  // Если где-то реально нужен кэш (например, список статичных категорий), передашь 'force-cache' вручную.
  const { method = 'GET', headers: customHeaders, body, cache = 'no-store', next } = options;

  const res = await fetch(`http://127.0.0.1:3001${path}`, {
    method,
    headers: {
      // 2. Базовые дефолтные заголовки
      'Content-Type': 'application/json',
      // 3. Безопасно подмешиваем кастомные заголовки (куки, авторизацию), не ломая дефолтные
      ...customHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  // if (!res.ok) {
  //   let errorMessage = `API Error [${res.status}]`;
  //
  //   try {
  //     // Пытаемся прочитать текст ошибки от Fastify
  //     const errorText = await res.text();
  //     errorMessage += `: ${errorText}`;
  //   } catch {
  //     errorMessage += ': Failed to parse error response';
  //   }
  //
  //   // В продакшене senior-ы логируют такие ошибки в Sentry/Winston, а не просто кидают throw
  //   console.error(`[nodejsFetch Failed]: ${method} ${path}`, errorMessage);
  //   throw new Error(errorMessage);
  // }

  return res;
}