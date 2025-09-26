import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

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
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isDefault = formData.get('isDefault') === 'true';
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const s3Key = `resumes/${userId}/${timestamp}-${randomString}.${fileExtension}`;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload directly to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3Client.send(putObjectCommand);

    // Generate resume ID
    const resumeId = `resume_${timestamp}_${randomString}`;

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
    if (isDefault) {
      updatedResumes = existingResumes.map((resume: { isDefault?: boolean }) => ({
        ...resume,
        isDefault: false,
      }));
    }

    // Prepare resume metadata
    const resumeMetadata = {
      resumeId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      s3Key,
      uploadedAt: new Date().toISOString(),
      isDefault,
    };

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
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}