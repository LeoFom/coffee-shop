import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = await cookies();

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/profile/me`,
      {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    // access token умер
    if (res.status === 401) {

      const refreshRes = await fetch(
        `${baseUrl}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      );

      // refresh тоже умер
      if (!refreshRes.ok) {
        return null;
      }

      // после refresh пробуем снова
      const retryRes = await fetch(
        `${baseUrl}/api/profile/me`,
        {
          method: "GET",
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      );

      if (!retryRes.ok) {
        return null;
      }

      return await retryRes.json();
    }

    if (!res.ok) {
      return null;
    }

    return await res.json();

  } catch (e) {
    console.log(e);
    return null;
  }
}