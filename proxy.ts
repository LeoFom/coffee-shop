import { NextRequest, NextResponse } from 'next/server';
export function proxy(request: NextRequest) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ message: 'Invalid request origin' }, { status: 403, headers: { 'cache-control': 'no-store' } });
  return NextResponse.next();
}
export const config = { matcher: ['/api/:path*'] };
