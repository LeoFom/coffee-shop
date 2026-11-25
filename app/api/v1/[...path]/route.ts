import { handleV1 } from '@/lib/contracts/v1/gateway'
import { nodejsFetch } from '@/lib/nodejs/fetcher'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ path: string[] }> }
async function handle(request: Request, context: Context) {
  const { path } = await context.params
  return handleV1(request, path, nodejsFetch)
}

export const GET = handle
export const POST = handle
export const PATCH = handle
