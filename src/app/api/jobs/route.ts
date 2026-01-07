import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(client);

interface JobRequest {
  id?: string;
  title: string;
  company: string;
  category: string;
  location: string;
  type: string;
  description: string;
  htmlDescription: string;
  requirements: string[];
  qualifications: string[];
  preferredSkills: string[];
  skills: string[];
  experience: string;
  benefits: string[];
  salary: string;
  priority: string;
  featured: boolean;
  status: string;
  applicationUrl?: string;
  expiresAt?: string;
}

// GET - Retrieve jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const tableName = process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev';

    let jobs = [];

    if (status) {
      // Query jobs by status using GSI3
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :gsi3pk',
        ExpressionAttributeValues: {
          ':gsi3pk': `JOBSTATUS#${status}`
        },
        ScanIndexForward: false, // Most recent first
        Limit: limit ? parseInt(limit) : undefined
      });

      const result = await docClient.send(command);
      jobs = result.Items || [];
    } else {
      // Scan all jobs (for admin or when no filter)
      const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: 'entityType = :entityType',
        ExpressionAttributeValues: {
          ':entityType': 'JOB'
        },
        Limit: limit ? parseInt(limit) : undefined
      });

      const result = await docClient.send(command);
      jobs = result.Items || [];
    }

    // Apply client-side filters for complex queries
    if (category) {
      jobs = jobs.filter(job => job.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      jobs = jobs.filter(job => job.featured === true);
    }

    // Sort by creation date (most recent first)
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
      filters: {
        status,
        category,
        featured,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch jobs',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new job (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin role
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body: JobRequest = await request.json();

    // Validate required fields
    const { title, company, category, location, type, description, status } = body;
    
    if (!title || !company || !category || !location || !type || !description || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate job ID and timestamps
    const jobId = body.id || `${category.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().slice(0, 8)}`;
    const timestamp = new Date().toISOString();
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create job record
    const jobRecord = {
      // Primary Key
      PK: `JOB#${jobId}`,
      SK: `META#${jobId}`,
      
      // GSI3 - Job status queries
      GSI3PK: `JOBSTATUS#${status}`,
      GSI3SK: `CREATED#${timestamp}`,
      
      // Job data
      entityType: 'JOB',
      id: jobId,
      slug,
      title,
      company,
      category,
      location,
      type,
      description,
      htmlDescription: body.htmlDescription || description,
      requirements: body.requirements || [],
      qualifications: body.qualifications || [],
      preferredSkills: body.preferredSkills || [],
      skills: body.skills || [],
      experience: body.experience || '',
      benefits: body.benefits || [],
      salary: body.salary || 'Competitive',
      priority: body.priority || 'medium',
      featured: body.featured || false,
      status,
      applicationUrl: body.applicationUrl || '',
      
      // Timestamps
      postedDate: timestamp.split('T')[0],
      expiresAt: body.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: timestamp,
      updatedAt: timestamp,
      
      // Metadata
      version: 1
    };

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'codex-platform-dev',
      Item: jobRecord,
      // Prevent overwriting existing jobs
      ConditionExpression: 'attribute_not_exists(PK)',
    });

    await docClient.send(command);

    return NextResponse.json({
      success: true,
      job: jobRecord,
      message: 'Job created successfully'
    });

  } catch (error) {
    console.error('Error creating job:', error);

    // Handle specific DynamoDB errors
    if (error instanceof Error) {
      if (error.name === 'ConditionalCheckFailedException') {
        return NextResponse.json(
          { error: 'Job with this ID already exists' },
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
        error: 'Failed to create job',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}