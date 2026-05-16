// // import { supabaseFetch } from '@/lib/supabase/fetcher';
// import { NextRequest } from 'next/server';
//
// export async function GET(req: NextRequest) {
//   const userId = req.nextUrl.searchParams.get('user_id');
//
//   const data = await supabaseFetch(`profiles?user_id=eq.${userId}`, {
//     cache: 'no-store',
//   });
//
//   return Response.json(data[0]);
// }
//
// export async function PATCH(req: NextRequest) {
//   const { user_id, ...rest } = await req.json();
//
//   const data = await supabaseFetch(`profiles?user_id=eq.${user_id}`, {
//     method: 'PATCH',
//     body: rest,
//     cache: 'no-store',
//   });
//
//   return Response.json(data);
// }