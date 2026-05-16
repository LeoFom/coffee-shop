// import { supabaseFetch } from '@/lib/supabase/fetcher';
// import { NextRequest } from 'next/server';
//
// export async function GET() {
//   const data = await supabaseFetch('products?is_active=eq.true', {
//     next: { revalidate: 60 }, // кеш 60с
//   });
//
//   return Response.json(data);
// }
//
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//
//   const data = await supabaseFetch('products', {
//     method: 'POST',
//     body,
//     cache: 'no-store',
//   });
//
//   return Response.json(data);
// }