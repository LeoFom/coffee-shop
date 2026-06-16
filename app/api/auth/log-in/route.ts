import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001'}/auth/log-in`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  const nextResponse = Response.json(data);

  const setCookie =
    response.headers.get('set-cookie');

  if (setCookie) {
    nextResponse.headers.set(
      'set-cookie',
      setCookie
    );
  }

  return nextResponse;
}