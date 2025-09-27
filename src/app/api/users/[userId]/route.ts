import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(client);

// Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_NAME;
    if (!tableName) {
      throw new Error('DYNAMODB_TABLE_NAME environment variable is not set');
    }

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
    });

    const result = await docClient.send(command);
    
    if (!result.Item) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = {
      userId: result.Item.UserId,
      email: result.Item.Email,
      firstName: result.Item.FirstName,
      lastName: result.Item.LastName,
      role: result.Item.Role,
      bio: result.Item.Bio,
      skills: result.Item.Skills,
      experience: result.Item.Experience,
      phone: result.Item.Phone,
      location: result.Item.Location,
      linkedinUrl: result.Item.LinkedinUrl,
      githubUrl: result.Item.GithubUrl,
      portfolioUrl: result.Item.PortfolioUrl,
      resumes: result.Item.resumes || [],
      createdAt: result.Item.CreatedAt,
      status: result.Item.Status,
    };

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update user profile  
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_NAME;
    if (!tableName) {
      throw new Error('DYNAMODB_TABLE_NAME environment variable is not set');
    }

    const {
      firstName,
      lastName,
      bio,
      skills,
      experience,
      phone,
      location,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      status
    } = body;

    // Build update expression
    const updateExpressionParts = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number | boolean | string[]> = {};

    if (firstName !== undefined) {
      updateExpressionParts.push('#firstName = :firstName');
      expressionAttributeNames['#firstName'] = 'FirstName';
      expressionAttributeValues[':firstName'] = firstName;
    }

    if (lastName !== undefined) {
      updateExpressionParts.push('#lastName = :lastName');
      expressionAttributeNames['#lastName'] = 'LastName';
      expressionAttributeValues[':lastName'] = lastName;
    }

    if (bio !== undefined) {
      updateExpressionParts.push('#bio = :bio');
      expressionAttributeNames['#bio'] = 'Bio';
      expressionAttributeValues[':bio'] = bio;
    }

    if (skills !== undefined) {
      updateExpressionParts.push('#skills = :skills');
      expressionAttributeNames['#skills'] = 'Skills';
      expressionAttributeValues[':skills'] = skills;
    }

    if (experience !== undefined) {
      updateExpressionParts.push('#experience = :experience');
      expressionAttributeNames['#experience'] = 'Experience';
      expressionAttributeValues[':experience'] = experience;
    }

    if (phone !== undefined) {
      updateExpressionParts.push('#phone = :phone');
      expressionAttributeNames['#phone'] = 'Phone';
      expressionAttributeValues[':phone'] = phone;
    }

    if (location !== undefined) {
      updateExpressionParts.push('#location = :location');
      expressionAttributeNames['#location'] = 'Location';
      expressionAttributeValues[':location'] = location;
    }

    if (linkedinUrl !== undefined) {
      updateExpressionParts.push('#linkedinUrl = :linkedinUrl');
      expressionAttributeNames['#linkedinUrl'] = 'LinkedinUrl';
      expressionAttributeValues[':linkedinUrl'] = linkedinUrl;
    }

    if (githubUrl !== undefined) {
      updateExpressionParts.push('#githubUrl = :githubUrl');
      expressionAttributeNames['#githubUrl'] = 'GithubUrl';
      expressionAttributeValues[':githubUrl'] = githubUrl;
    }

    if (portfolioUrl !== undefined) {
      updateExpressionParts.push('#portfolioUrl = :portfolioUrl');
      expressionAttributeNames['#portfolioUrl'] = 'PortfolioUrl';
      expressionAttributeValues[':portfolioUrl'] = portfolioUrl;
    }

    if (status !== undefined) {
      updateExpressionParts.push('#status = :status');
      expressionAttributeNames['#status'] = 'Status';
      expressionAttributeValues[':status'] = status;
    }

    if (updateExpressionParts.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add updatedAt timestamp
    updateExpressionParts.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'UpdatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: 'METADATA',
      },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: result.Attributes 
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}