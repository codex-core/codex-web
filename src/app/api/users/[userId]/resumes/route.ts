import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get user data which contains resumes array
    const getUserCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
    });

    const result = await docClient.send(getUserCommand);
    
    if (!result.Item) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const resumes = result.Item.resumes || [];

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// Delete a resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // Get current user data
    const getUserCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
    });

    const userResult = await docClient.send(getUserCommand);
    if (!userResult.Item) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingResumes = userResult.Item.resumes || [];
    const updatedResumes = existingResumes.filter((resume: any) => resume.resumeId !== resumeId);

    // Update user with remaining resumes
    const updateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
      UpdateExpression: 'SET resumes = :resumes, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':resumes': updatedResumes,
        ':updatedAt': new Date().toISOString(),
      },
    });

    await docClient.send(updateCommand);

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

// Update resume settings (e.g., set as default)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { resumeId, isDefault } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // Get current user data
    const getUserCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
    });

    const userResult = await docClient.send(getUserCommand);
    if (!userResult.Item) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingResumes = userResult.Item.resumes || [];
    
    // Update resumes array
    const updatedResumes = existingResumes.map((resume: any) => {
      if (resume.resumeId === resumeId) {
        return { ...resume, isDefault };
      } else if (isDefault) {
        // If setting this resume as default, unset others
        return { ...resume, isDefault: false };
      }
      return resume;
    });

    // Update user with modified resumes
    const updateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
      UpdateExpression: 'SET resumes = :resumes, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':resumes': updatedResumes,
        ':updatedAt': new Date().toISOString(),
      },
    });

    await docClient.send(updateCommand);

    return NextResponse.json({
      success: true,
      message: 'Resume updated successfully',
    });

  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}