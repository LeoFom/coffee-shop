import {nodejsFetch} from "@/lib/nodejs/fetcher";
import {NextRequest, NextResponse} from "next/server";

export async function GET() {
  try {
    const response = await nodejsFetch('/cart', {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cart from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in cart route:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const newBody= body ? JSON.stringify(body) : JSON.stringify({})

  const response = await nodejsFetch('/cart', {
    method: "POST",
    body: newBody,
    cache: 'no-store',
  })

  if(!response.ok) {
    const errorText = await response.text();
    return new Response(errorText, { status: response.status });
  }

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
    headers: {
      'set-cookie': response.headers.get('set-cookie') || '',
    }
  })
}