import { NextRequest } from 'next/server';

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try to get token from NextAuth cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  return sessionToken || null;
}