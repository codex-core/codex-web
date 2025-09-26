import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Generate a secure API key for your frontend
const API_SECRET = process.env.API_SECRET || 'your-secure-api-secret-key';
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean) as string[];

export interface SecureApiOptions {
  requireAuth?: boolean;
  allowedMethods?: string[];
  requireApiKey?: boolean;
}

export async function secureApiHandler(
  request: NextRequest,
  options: SecureApiOptions = {}
) {
  const {
    requireAuth = false,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'],
    requireApiKey = true,
  } = options;

  // 1. Method validation
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  // 2. Origin validation (CORS protection)
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // For same-origin requests, check referer
  if (referer) {
    const refererUrl = new URL(referer);
    const isAllowedReferer = ALLOWED_ORIGINS.some(allowedOrigin => {
      try {
        const allowedUrl = new URL(allowedOrigin);
        return refererUrl.origin === allowedUrl.origin;
      } catch {
        return false;
      }
    });

    if (!isAllowedReferer) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
  }

  // For CORS requests, check origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      { status: 403 }
    );
  }

  // 3. API Key validation (for extra security)
  if (requireApiKey) {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== API_SECRET) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
  }

  // 4. Rate limiting check (basic implementation)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // 5. Authentication check (if required)
  if (requireAuth) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // Add your auth validation logic here
  }

  return null; // No errors, proceed with the request
}

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

// Helper function to create CORS headers
export function createCorsHeaders(origin?: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Allow-Credentials': 'true',
  };
}