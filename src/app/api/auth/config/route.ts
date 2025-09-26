import { NextRequest, NextResponse } from 'next/server';
import { secureApiHandler, createCorsHeaders } from '@/lib/api-security';

export async function GET(request: NextRequest) {
  // Apply security middleware
  const securityError = await secureApiHandler(request, {
    allowedMethods: ['GET'],
    requireApiKey: true,
    requireAuth: false, // This endpoint doesn't require user auth
  });

  if (securityError) {
    return securityError;
  }

  // Only expose what's needed, keep sensitive endpoints server-side
  const response = NextResponse.json({
    cognitoIdpEndpoint: process.env.COGNITO_IDP_ENDPOINT ?? 'us-east-1',
    clientId: process.env.CLIENT_ID, // Remove NEXT_PUBLIC_ prefix
    fido2: {
      baseUrl: process.env.FIDO2_BASE_URL, // Remove NEXT_PUBLIC_ prefix
    }
  });

  // Add CORS headers
  const corsHeaders = createCorsHeaders(request.headers.get('origin'));
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;

}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request.headers.get('origin'));
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}