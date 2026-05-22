import { cookies } from "next/headers";

function extractCookies(setCookie: string) {
  return setCookie
    .split(',')
    .map(cookie => cookie.split(';')[0])
    .join('; ');
}


export async function getUser() {
  try {
    const cookieStore = await cookies();

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000";

    const initialCookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // 1. Пробуем получить пользователя
    const res = await fetch(
      `${baseUrl}/api/profile/me`,
      {
        method: "GET",
        headers: {
          cookie: initialCookieHeader,
        },
        cache: "no-store",
      }
    );

    // access token жив
    if (res.ok) {
      return await res.json();
    }

    // access token умер
    if (res.status !== 401) {
      return null;
    }

    // 2. Делаем refresh
    const refreshRes = await fetch(
      `${baseUrl}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          cookie: initialCookieHeader,
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    console.log("!!! refreshRes 3 -> ",refreshRes)


    // refresh умер
    if (!refreshRes.ok) {
      return null;
    }

    // 3. Получаем новые cookies
    const setCookie =
      refreshRes.headers.get("set-cookie");

    console.log("!!! setCookie 3 -> ",setCookie)

    if (!setCookie) {
      return null;
    }

    const cookieHeader = extractCookies(setCookie);
    console.log(cookieHeader)

    // 4. Повторяем запрос уже с новыми cookies
    const retryRes = await fetch(
      `${baseUrl}/api/profile/me`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    console.log("!!! retryRes 4 -> ",retryRes)

    if (!retryRes.ok) {
      return null;
    }

    return await retryRes.json();

  } catch (e) {
    console.log(e);
    return null;
  }
}