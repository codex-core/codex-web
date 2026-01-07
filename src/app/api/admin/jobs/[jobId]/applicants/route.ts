import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { middleware } from "../../../middleware";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Check admin authorization
    const authResult = await middleware(request);
    if (authResult && authResult.status !== 200) {
      return authResult;
    }

    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Query applications for this specific job using GSI1
    const queryCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || "CodexTable",
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": `JOB#${jobId}`,
      },
    });

    const result = await docClient.send(queryCommand);

    // Transform application data for frontend
    const applicants = (result.Items || []).map((item) => ({
      applicationId: item.ApplicationId,
      jobId: item.JobId,
      jobTitle: item.JobTitle || `Job ${item.JobId}`, // Default if not present
      userId: item.ApplicantEmail, // Using email as userId since that's what we have
      firstName: item.ApplicantFirstName,
      lastName: item.ApplicantLastName,
      email: item.ApplicantEmail,
      status: item.Status?.toLowerCase() || 'pending',
      appliedAt: item.AppliedAt,
      resumeKey: item.ResumeUrl,
      location: item.ApplicantLocation,
      experience: item.ApplicantExperience,
      skills: item.ApplicantSkills || [],
      phone: item.ApplicantPhone,
      linkedinUrl: item.ApplicantLinkedIn,
      coverLetter: item.CoverLetter,
      // Additional fields that might be useful
      salary: item.ExpectedSalary,
      availability: item.Availability,
      workAuthorization: item.WorkAuthorization,
      preferredStartDate: item.PreferredStartDate,
    }));

    // Sort by application date (most recent first)
    applicants.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    return NextResponse.json({
      success: true,
      applicants: applicants,
      total: applicants.length,
    });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job applicants" },
      { status: 500 }
    );
  }
}