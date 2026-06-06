import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const backendRes = await fetch(`http://127.0.0.1:3001/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    });

    const response = NextResponse.json({ success: true });

    // 3. Вытаскиваем заголовок 'set-cookie' из ответа Fastify
    const setCookieHeader = backendRes.headers.get('set-cookie');

    // 4. Если он есть — пробрасываем его браузеру
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;

  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}