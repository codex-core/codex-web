import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(client);

interface ApplicationRequest {
  jobId: string;
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedinProfile?: string;
  };
  coverLetter: string;
  resumeUrl: string;
  appliedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplicationRequest = await request.json();

    // Validate required fields
    const { jobId, applicantInfo, coverLetter, resumeUrl, appliedAt } = body;
    
    if (!jobId || !applicantInfo || !coverLetter || !resumeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone } = applicantInfo;
    
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required applicant information' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate unique application ID
    const applicationId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create application record
    const applicationRecord = {
      // Primary Key
      PK: `APPLICATION#${applicationId}`,
      SK: `METADATA`,
      
      // GSI1 - Job applications by job
      GSI1PK: `JOB#${jobId}`,
      GSI1SK: `APPLICATION#${timestamp}`,
      
      // GSI2 - Applications by applicant email
      GSI2PK: `APPLICANT#${email.toLowerCase()}`,
      GSI2SK: `APPLICATION#${timestamp}`,
      
      // GSI3 - Applications by status and date
      GSI3PK: 'APPLICATION',
      GSI3SK: `PENDING#${timestamp}`,
      
      // Application data
      Type: 'Application',
      ApplicationId: applicationId,
      JobId: jobId,
      Status: 'PENDING',
      
      // Applicant information
      ApplicantFirstName: firstName,
      ApplicantLastName: lastName,
      ApplicantEmail: email.toLowerCase(),
      ApplicantPhone: phone,
      ApplicantLinkedIn: applicantInfo.linkedinProfile || null,
      
      // Application details
      CoverLetter: coverLetter,
      ResumeUrl: resumeUrl,
      
      // Timestamps
      AppliedAt: appliedAt,
      CreatedAt: timestamp,
      UpdatedAt: timestamp,
      
      // Additional metadata
      ApplicationSource: 'WEB',
      Version: 1,
    };

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'CodexTable',
      Item: applicationRecord,
      // Prevent overwriting existing applications
      ConditionExpression: 'attribute_not_exists(PK)',
    });

    await docClient.send(command);

    // Return success response
    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
      data: {
        applicationId,
        jobId,
        applicantEmail: email.toLowerCase(),
        status: 'PENDING',
        appliedAt: appliedAt,
      },
    });

  } catch (error) {
    console.error('Application submission error:', error);

    // Handle specific DynamoDB errors
    if (error instanceof Error) {
      if (error.name === 'ConditionalCheckFailedException') {
        return NextResponse.json(
          { error: 'Application already exists' },
          { status: 409 }
        );
      }
      
      if (error.name === 'ValidationException') {
        return NextResponse.json(
          { error: 'Invalid data format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to submit application',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve application status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const email = searchParams.get('email');

    if (!applicationId && !email) {
      return NextResponse.json(
        { error: 'Application ID or email is required' },
        { status: 400 }
      );
    }

    // TODO: Implement application retrieval logic
    // This would use Query operations on the appropriate GSIs
    
    return NextResponse.json({
      message: 'Application retrieval not implemented yet',
      applicationId,
      email,
    });

  } catch (error) {
    console.error('Application retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve application' },
      { status: 500 }
    );
  }
}