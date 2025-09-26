import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getJobById } from '@/lib/jobs';

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

    // First, get the user's email from userId
    const userCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'METADATA',
      },
    });

    const userResult = await docClient.send(userCommand);
    if (!userResult.Items || userResult.Items.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userEmail = userResult.Items[0].Email;

    // Query for all applications by this user using GSI2 (applications by email)
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :gsi2pk',
      ExpressionAttributeValues: {
        ':gsi2pk': `APPLICANT#${userEmail}`,
      },
      ScanIndexForward: false, // Get most recent applications first
    });

    const result = await docClient.send(command);
    
    const applications = result.Items?.map(item => {
      // Fetch job details from job data
      const job = getJobById(item.JobId);
      
      return {
        applicationId: item.ApplicationId,
        jobId: item.JobId,
        jobTitle: job?.title || 'Job Title Not Available',
        company: job?.company || 'Company Not Available',
        location: job?.location || 'Location Not Available',
        status: item.Status?.toLowerCase() || 'pending',
        appliedAt: item.AppliedAt || item.CreatedAt,
        resumeKey: item.ResumeUrl,
        jobDescription: job?.description || item.JobDescription,
        salary: job?.salary || item.Salary,
        // Additional fields from the application record
        applicantFirstName: item.ApplicantFirstName,
        applicantLastName: item.ApplicantLastName,
        applicantEmail: item.ApplicantEmail,
        coverLetter: item.CoverLetter,
        // Job details
        jobSlug: job?.slug,
        jobType: job?.type,
      };
    }) || [];

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}