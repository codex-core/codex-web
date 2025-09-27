import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, role } = await request.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: email, firstName, lastName, role' 
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['consultant', 'admin', 'staffer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid role. Must be one of: consultant, admin, staffer' 
        },
        { status: 400 }
      );
    }

    const userId = uuidv4();
    const now = new Date().toISOString();

    // Create user record
    const userRecord = {
      PK: `USER#${userId}`,
      SK: `PROFILE#${userId}`,
      entityType: 'USER',
      userId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role,
      active: true,
      createdAt: now,
      updatedAt: now,
      // Add GSI fields for querying
      GSI1PK: `USER#${role.toUpperCase()}`,
      GSI1SK: `PROFILE#${userId}`,
      GSI2PK: `EMAIL#${email.toLowerCase()}`,
      GSI2SK: `USER#${userId}`,
    };

    const putCommand = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-users-dev',
      Item: userRecord,
      ConditionExpression: 'attribute_not_exists(PK)', // Prevent duplicate userId
    });

    await docClient.send(putCommand);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
        active: true,
        createdAt: now,
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle specific DynamoDB errors
    if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this ID already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, return a simple response
    // In production, you would implement user listing with pagination
    return NextResponse.json({
      success: true,
      message: 'User management endpoint',
      endpoints: {
        'POST /api/admin/users': 'Create a new user',
        'GET /api/admin/users': 'List users (not implemented)',
      }
    });

  } catch (error) {
    console.error('Error in admin users endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}