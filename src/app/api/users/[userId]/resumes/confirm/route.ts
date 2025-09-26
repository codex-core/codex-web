import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    const { resumeMetadata } = body;
    
    if (!resumeMetadata) {
      return NextResponse.json(
        { error: 'Resume metadata is required' },
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

    // Get existing resumes or initialize empty array
    const existingResumes = userResult.Item.resumes || [];

    // If this resume is set as default, unset all other defaults
    let updatedResumes = existingResumes;
    if (resumeMetadata.isDefault) {
      updatedResumes = existingResumes.map((resume: any) => ({
        ...resume,
        isDefault: false,
      }));
    }

    // Add new resume
    updatedResumes.push(resumeMetadata);

    // Update user with new resume
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
      resume: resumeMetadata,
      message: 'Resume uploaded successfully',
    });

  } catch (error) {
    console.error('Error confirming resume upload:', error);
    return NextResponse.json(
      { error: 'Failed to save resume metadata' },
      { status: 500 }
    );
  }
}