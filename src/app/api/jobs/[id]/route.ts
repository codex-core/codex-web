import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(client);

interface JobUpdateRequest {
  title?: string;
  company?: string;
  category?: string;
  location?: string;
  type?: string;
  description?: string;
  htmlDescription?: string;
  requirements?: string[];
  qualifications?: string[];
  preferredSkills?: string[];
  skills?: string[];
  experience?: string;
  benefits?: string[];
  salary?: string;
  priority?: string;
  featured?: boolean;
  status?: string;
  applicationUrl?: string;
  expiresAt?: string;
}

// GET - Retrieve single job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = (await params);

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const command = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: result.Item
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch job',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing job (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check for admin role
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id: jobId } = await params;
    const updates: JobUpdateRequest = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // First, get the existing job
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      }
    });

    const existingJob = await docClient.send(getCommand);

    if (!existingJob.Item) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Merge updates with existing job data
    const timestamp = new Date().toISOString();
    const updatedJob: any = {
      ...existingJob.Item,
      ...updates,
      updatedAt: timestamp,
      version: (existingJob.Item.version || 1) + 1
    };

    // Update slug if title changed
    if (updates.title && updates.title !== existingJob.Item.title) {
      updatedJob.slug = updates.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Update GSI3 keys if status changed
    if (updates.status && updates.status !== existingJob.Item.status) {
      updatedJob.GSI3PK = `JOBSTATUS#${updates.status}`;
    }

    // Save updated job
    const putCommand = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Item: updatedJob,
      // Optimistic locking - ensure version hasn't changed
      ConditionExpression: 'version = :expectedVersion',
      ExpressionAttributeValues: {
        ':expectedVersion': existingJob.Item.version || 1
      }
    });

    await docClient.send(putCommand);

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Error updating job:', error);

    // Handle specific DynamoDB errors
    if (error instanceof Error) {
      if (error.name === 'ConditionalCheckFailedException') {
        return NextResponse.json(
          { error: 'Job was modified by another process. Please refresh and try again.' },
          { status: 409 }
        );
      }
      
      if (error.name === 'ValidationException') {
        return NextResponse.json(
          { error: 'Invalid job data format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update job',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete job (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check for admin role
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // First, check if job exists
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      }
    });

    const existingJob = await docClient.send(getCommand);

    if (!existingJob.Item) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Delete the job
    const deleteCommand = new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      }
    });

    await docClient.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
      deletedJob: {
        id: jobId,
        title: existingJob.Item.title
      }
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete job',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}