import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Check if auth is enabled
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
  
  if (!authEnabled) {
    return NextResponse.next();
  }

  // For dashboard routes, redirect to login if no token
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};