import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Сразу определяем типы роутов
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/login');
  const isApiRoute = pathname.startsWith('/api');
  const isPublicPage = pathname === '/';

  // 2. Достаем HttpOnly токен
  const token = request.cookies.get('refreshToken')?.value;

  // КЕЙС 1: Пользователь НЕ авторизован и пытается зайти на защищенную страницу
  if (!token && !isAuthPage && !isApiRoute && !isPublicPage) {
    const url = request.nextUrl.clone();
    // url.pathname = '/auth/login';

    // При редиректе важно передать пустой ответ, но сохранить заголовки
    return NextResponse.redirect(url);
  }

  // КЕЙС 2: Пользователь УЖЕ авторизован, но пытается зайти на логин/регистрацию
  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/protected'; // или /profile
    return NextResponse.redirect(url);
  }

  // КЕЙС 3: Обычный проход (Фронтенд страницы или API запросы)
  // Инициализируем ответ правильно, прокидывая текущий запрос
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ВАЖНО: Синхронизируем куки.
  // Мы гарантируем, что любые куки, которые пришли в запросе (включая HttpOnly),
  // корректно улетят дальше в заголовках ответа.
  request.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}