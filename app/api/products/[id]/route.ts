import {nodejsFetch} from "@/lib/nodejs/fetcher";
import {NextRequest} from "next/server";

export async function GET(id: string){
  return await nodejsFetch(`/products/${id}`, {
    method: 'GET'
  })
}

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