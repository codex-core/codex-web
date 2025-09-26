import { NextResponse } from 'next/server';

export async function GET() {
  // Only expose what's needed, keep sensitive endpoints server-side
  return NextResponse.json({
    cognitoIdpEndpoint: process.env.COGNITO_IDP_ENDPOINT ?? 'us-east-1',
    clientId: process.env.CLIENT_ID, // Remove NEXT_PUBLIC_ prefix
    fido2: {
      baseUrl: process.env.FIDO2_BASE_URL, // Remove NEXT_PUBLIC_ prefix
    }
  });
}