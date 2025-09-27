import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import enhancedJobsData from '@/lib/cms/Enhanced_Jobs.json';
import { EnhancedJobRole } from '@/lib/types/enhanced-job';

interface Applicant {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
  appliedAt: string;
  resumeKey?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  phone?: string;
  linkedinUrl?: string;
  coverLetter?: string;
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

// Helper function to ensure status is user-friendly
function normalizeStatus(dbStatus: string | undefined): 'pending' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired' {
  if (!dbStatus) return 'pending';
  return dbStatus.toLowerCase() as 'pending' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
}

export async function GET(request: NextRequest) {
  try {
    // Load jobs from Enhanced_Jobs.json to get real job data
    const enhancedJobs = enhancedJobsData as EnhancedJobRole[];
    
    // Query real applications from DynamoDB
    let realApplicants: Applicant[] = [];
    
    try {
      // Scan for all applications - in production, you might want to use pagination
      const scanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'CodexTable',
        FilterExpression: '#type = :type',
        ExpressionAttributeNames: {
          '#type': 'Type'
        },
        ExpressionAttributeValues: {
          ':type': 'Application'
        }
      });

      const result = await docClient.send(scanCommand);
      
      if (result.Items && result.Items.length > 0) {
        // Transform DynamoDB items to admin dashboard format
        realApplicants = result.Items.map(item => {
          // Find the corresponding job title from Enhanced_Jobs.json
          const job = enhancedJobs.find(j => j.id === item.JobId);
          const jobTitle = job ? job.title : 'Unknown Position';
          
          return {
            applicationId: item.ApplicationId,
            jobId: item.JobId,
            jobTitle: jobTitle,
            userId: item.ApplicantEmail, // Using email as userId for now
            firstName: item.ApplicantFirstName,
            lastName: item.ApplicantLastName,
            email: item.ApplicantEmail,
            status: normalizeStatus(item.Status),
            appliedAt: item.AppliedAt || item.CreatedAt,
            resumeKey: item.ResumeUrl ? `resumes/${item.ApplicantEmail}/resume.pdf` : undefined,
            location: item.ApplicantLocation || 'Not specified',
            experience: 'Not specified', // Not currently stored in applications
            skills: [], // Not currently stored in applications
            phone: item.ApplicantPhone,
            linkedinUrl: item.ApplicantLinkedIn,
            coverLetter: item.CoverLetter,
          };
        });
      }
    } catch (dbError) {
      console.error('Error fetching applications from database:', dbError);
      throw new Error('Failed to fetch applications from database');
    }

    return NextResponse.json({
      success: true,
      applicants: realApplicants,
      meta: {
        total: realApplicants.length,
      }
    });

  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch applicants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}