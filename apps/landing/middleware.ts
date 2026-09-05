import { NextResponse, type NextRequest } from 'next/server';

/** Set the document language before React hydration, including direct English visits. */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-bubbles-language', (request.nextUrl.pathname === '/en' || request.nextUrl.pathname.startsWith('/en/')) ? 'en' : 'ar');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/', '/ar/:path*', '/en/:path*'] };
