import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Apply security headers to all API routes
  console.log('Middleware triggered for:', request.nextUrl.pathname);
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('checking api route for:', request.nextUrl.pathname);
    // Check for API key on protected routes
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.API_SECRET;

    // List of public API routes that don't require API key
    const publicRoutes = [
      '/api/health', // Add any public routes here
    ];

    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );

    if (!isPublicRoute && (!apiKey || apiKey !== expectedApiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add security headers
    const response = NextResponse.next();
    
    // Prevent API routes from being embedded in iframes
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};