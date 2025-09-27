import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This is a utility endpoint to create test admin user
    // In production, you would remove this or secure it properly
    
    const testAdminUser = {
      userId: 'admin-test-001',
      email: 'admin@codex.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    };

    return NextResponse.json({
      success: true,
      message: 'Test admin user data',
      user: testAdminUser,
      instructions: [
        '1. This is test data for development purposes',
        '2. To test admin functionality, update your user role in the database to "admin"',
        '3. Then navigate to /dashboard to see the admin view',
        '4. Admin users will see job postings and applicant management'
      ]
    });

  } catch (error) {
    console.error('Error in test setup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to setup test data' 
      },
      { status: 500 }
    );
  }
}