import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest } from './lib/auth';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = getTokenFromRequest(request);
    
    // If no NextAuth session token found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};