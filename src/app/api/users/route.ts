import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, role } = body;
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    const userRecord = {
      PK: `USER#${userId}`,
      SK: 'METADATA',
      Type: 'User',
      UserId: userId,
      Email: email.toLowerCase(),
      FirstName: firstName,
      LastName: lastName,
      Role: role,
      CreatedAt: timestamp,
      Status: 'ACTIVE',
      // GSI1 for email lookup
      GSI1PK: `USER#EMAIL#${email.toLowerCase()}`,
      GSI1SK: userId,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: userRecord,
      ConditionExpression: 'attribute_not_exists(GSI1PK)', // Prevent duplicate emails
    }));

    // Send email notification to the new user via SQS
  const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });
  const EMAIL_QUEUE_URL = process.env.EMAIL_QUEUE_URL;
  try {
  if (EMAIL_QUEUE_URL) {
    const emailMsg = {
      type: 'accountCreated',
      to: userRecord.Email,
      data: {
        firstName: userRecord.FirstName,
        // Add more fields as needed for the template
      }
    };
    await sqs.send(new SendMessageCommand({
      QueueUrl: EMAIL_QUEUE_URL,
      MessageBody: JSON.stringify(emailMsg),
    }));
  }
  } catch (emailErr) {
    console.error('Failed to enqueue email message:', emailErr);
  }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Check if it's a conditional check failed error (duplicate email)
    if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
      return NextResponse.json({ error: 'User with that email already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create user', details: error }, { status: 500 });
  }
}