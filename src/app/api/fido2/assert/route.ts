import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fido2BaseUrl = process.env.FIDO2_BASE_URL;
    
    if (!fido2BaseUrl) {
      return NextResponse.json({ error: 'FIDO2 service not configured' }, { status: 500 });
    }

    // Proxy the request to the actual FIDO2 endpoint
    const response = await fetch(`${fido2BaseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('FIDO2 proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}