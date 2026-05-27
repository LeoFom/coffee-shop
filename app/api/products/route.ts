import {nodejsFetch} from "@/lib/nodejs/fetcher";
import {NextRequest} from "next/server";

export async function GET(){
  const data = await nodejsFetch('/products', {
    method: 'GET'
  })

  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newBody= body ? JSON.stringify(body) : JSON.stringify({})

  const response = await nodejsFetch('/products', {
    method: 'POST',
    body: newBody,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(errorText, { status: response.status });
  }

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
    headers: {
      'set-cookie': response.headers.get('set-cookie') || '',
    },
  });
}