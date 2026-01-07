import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { middleware } from "../../middleware";

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

    // Get job details from DynamoDB
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || "CodexTable",
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      },
    });

    const result = await docClient.send(getCommand);

    if (!result.Item) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Transform job data for frontend
    const job = {
      jobId: result.Item.id || jobId,
      title: result.Item.title,
      company: result.Item.company,
      location: result.Item.location,
      salary: result.Item.salary,
      status: result.Item.status || 'open',
      createdAt: result.Item.createdAt,
      applicantCount: result.Item.applicantCount || 0,
      jobType: result.Item.type || 'Full-time',
      description: result.Item.description,
      category: result.Item.category,
      skills: result.Item.skills || [],
      priority: result.Item.priority,
      featured: result.Item.featured || false,
      expiresAt: result.Item.expiresAt,
      requirements: result.Item.requirements,
      benefits: result.Item.benefits,
      experience: result.Item.experience,
    };

    return NextResponse.json({
      success: true,
      job: job,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // First, check if the job exists
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || "CodexTable",
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      },
    });

    const existingJob = await docClient.send(getCommand);

    if (!existingJob.Item) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if there are any applications for this job
    const queryCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || "CodexTable",
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :jobPK",
      ExpressionAttributeValues: {
        ":jobPK": `JOB#${jobId}`,
      },
      Select: "COUNT"
    });

    const applicationsResult = await docClient.send(queryCommand);
    const applicationCount = applicationsResult.Count || 0;

    // Note: In a production system, you might want to:
    // 1. Soft delete the job instead of hard delete
    // 2. Handle applications differently (maybe archive them)
    // 3. Add more validation or business logic

    // Delete the job
    const deleteCommand = new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || "CodexTable",
      Key: {
        PK: `JOB#${jobId}`,
        SK: `META#${jobId}`
      },
    });

    await docClient.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
      applicationsAffected: applicationCount,
    });

  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job" },
      { status: 500 }
    );
  }
}