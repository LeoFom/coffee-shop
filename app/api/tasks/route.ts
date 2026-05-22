import {nodejsFetch} from "@/lib/nodejs/fetcher";
import {NextRequest} from "next/server";

export async function GET() {
  const data = await nodejsFetch(`/tasks`, {
    method: 'GET',
    cache: 'no-store',
  });

  return Response.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const data = await nodejsFetch(`/tasks`, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  return Response.json(data);
}

