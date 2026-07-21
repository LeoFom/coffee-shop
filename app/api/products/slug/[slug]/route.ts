import {nodejsFetch} from "@/lib/nodejs/fetcher";
import {NextRequest, NextResponse} from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
){
  try {
    const { slug } = await params;

    // 1. Базовая валидация
    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // 2. Выполнение запроса
    const response = await nodejsFetch(`/products/slug/${slug}`, {
      method: 'GET',
    });

    // 3. Обработка неуспешных статусов от внешнего API (если nodejsFetch возвращает Response)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Product not found or upstream error' },
        { status: response.status }
      );
    }

    // 4. Парсинг и возврат успешного результата
    const data = await response.json(); // Предполагаем, что API возвращает JSON
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    // 5. Логирование и безопасный ответ при критической ошибке
    // console.error(`[GET /products/${id}] Error fetching product:`, error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


// {
//   const { id } = await params;
//
//   return await nodejsFetch(`/products/${id}`, {
//     method: 'GET'
//   })
// }

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();

  const response = await nodejsFetch(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  return Response.json(await response.json());
}