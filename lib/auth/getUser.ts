import { cookies } from "next/headers";

function parseSetCookieToCookieHeader(setCookieHeaders: string[] | string | null): string {
  if (!setCookieHeaders) return "";

  const headersArray = Array.isArray(setCookieHeaders)
    ? setCookieHeaders
    : [setCookieHeaders];

  return headersArray
    .map(header => {
      // Берем только первую часть до точки с запятой (саму куку name=value)
      return header.split(";")[0];
    })
    .join("; ");
}

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Собираем куки, которые есть у браузера на данный момент
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // 1. Пробуем получить профиль
    const res = await fetch(`${baseUrl}/api/profile/me`, {
      method: "GET",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (res.ok) return await res.json();
    if (res.status !== 401) return null;

    // 2. Если 401 — Access Token умер, стучимся в /refresh
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
        "content-type": "application/json"
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!refreshRes.ok) return null;

    // 3. Извлекаем НОВЫЕ куки из ответа Fastify
    // Важно: fetch в Node.js возвращает объединенный set-cookie заголовок или массив
    const setCookieHeader = refreshRes.headers.get("set-cookie");

    if (!setCookieHeader) return null;

    // Очищаем заголовок от "Path=/, HttpOnly", оставляя только "accessToken=ey...; refreshToken=ey..."
    const newCookiesForBuffer = parseSetCookieToCookieHeader(setCookieHeader);

    // 4. Обязательно обновляем куки в самом Next.js (cookieStore),
    // чтобы браузер пользователя получил их в ответе!
    // Для этого парсим строку на отдельные куки и вызываем .set()
    const individualCookies = setCookieHeader.split(/,(?=[^;]*=)/); // разбиваем по запятым, игнорируя внутри свойств

    for (const cookieStr of individualCookies) {
      const [nameValue] = cookieStr.split(";");
      const [name, value] = nameValue.trim().split("=");

      if (name && value) {
        // Извлекаем базовые опции, если они критичны (или хардкодим дефолты для безопасности)
        const isHttpOnly = cookieStr.toLowerCase().includes("httponly");
        const isSecure = cookieStr.toLowerCase().includes("secure");

        cookieStore.set(name, value, {
          path: "/",
          httpOnly: isHttpOnly,
          secure: isSecure,
          sameSite: "strict"
        });
      }
    }

    // 5. Делаем повторный запрос (Retry) уже с чистыми новыми куками
    const retryRes = await fetch(`${baseUrl}/api/profile/me`, {
      method: "GET",
      headers: {
        cookie: newCookiesForBuffer // Передаем строго отформатированную строку
      },
      cache: "no-store",
    });

    return retryRes.ok ? await retryRes.json() : null;
  } catch (e) {
    console.error("Auth error inside Next.js Layout:", e);
    return null;
  }
}