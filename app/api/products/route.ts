import {nodejsFetch} from "@/lib/nodejs/fetcher";

export async function GET(){
  const data = await nodejsFetch('/products', {
    method: 'GET'
  })

  return Response.json(data)
}