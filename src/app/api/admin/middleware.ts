import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply middleware to admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin/')) {
    try {
      // For now, we'll allow all requests to admin API routes
      // In production, you would validate the user's JWT token here
      // and check if they have admin role
      
      // You could extract the token from Authorization header
      // const authHeader = request.headers.get('authorization');
      // const token = authHeader?.replace('Bearer ', '');
      
      // For now, just continue
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*',
};