# Jobs API Documentation

## Overview

The Jobs API provides endpoints for managing job postings in the Codex platform. Jobs are stored in DynamoDB and can be queried, created, updated, and deleted through these RESTful endpoints.

## Base URL

```
http://localhost:3000/api/jobs
```

## Endpoints

### GET /api/jobs

Retrieve a list of jobs with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by job status (e.g., "active", "inactive", "draft", "expired")
- `category` (optional): Filter by job category (e.g., "Engineering", "Database")
- `featured` (optional): Filter by featured status ("true" or "false")
- `limit` (optional): Limit the number of results returned

**Example Requests:**
```bash
# Get all jobs
curl http://localhost:3000/api/jobs

# Get active jobs only
curl "http://localhost:3000/api/jobs?status=active"

# Get featured engineering jobs
curl "http://localhost:3000/api/jobs?category=Engineering&featured=true"

# Get first 5 jobs
curl "http://localhost:3000/api/jobs?limit=5"
```

**Response:**
```json
{
  "success": true,
  "jobs": [...],
  "count": 4,
  "filters": {
    "status": "active",
    "category": null,
    "featured": null,
    "limit": null
  }
}
```

### GET /api/jobs/[id]

Retrieve a specific job by its ID.

**Path Parameters:**
- `id`: The unique job identifier

**Example Request:**
```bash
curl http://localhost:3000/api/jobs/senior-fullstack-test-automation
```

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "senior-fullstack-test-automation",
    "title": "Senior Full Stack Engineer - Test Automation",
    "company": "Codex Consulting",
    "category": "Engineering",
    "location": "Reston, VA",
    "type": "contract",
    "status": "active",
    // ... other job fields
  }
}
```

### POST /api/jobs

Create a new job posting. **(Admin only - authentication required)**

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "company": "Codex Consulting",
  "category": "Engineering",
  "location": "Remote",
  "type": "full-time",
  "description": "Join our team...",
  "status": "active",
  "requirements": ["5+ years experience", "React expertise"],
  "skills": ["React", "Node.js", "AWS"],
  "salary": "Competitive",
  "featured": false
}
```

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "engineering-abc123",
    "slug": "senior-software-engineer",
    // ... complete job object
  },
  "message": "Job created successfully"
}
```

### PUT /api/jobs/[id]

Update an existing job. **(Admin only - authentication required)**

**Path Parameters:**
- `id`: The unique job identifier

**Request Body:** (partial updates supported)
```json
{
  "status": "inactive",
  "salary": "$120,000 - $150,000",
  "featured": true
}
```

**Response:**
```json
{
  "success": true,
  "job": {
    // ... updated job object
  },
  "message": "Job updated successfully"
}
```

### DELETE /api/jobs/[id]

Delete a job posting. **(Admin only - authentication required)**

**Path Parameters:**
- `id`: The unique job identifier

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully",
  "deletedJob": {
    "id": "senior-fullstack-test-automation",
    "title": "Senior Full Stack Engineer - Test Automation"
  }
}
```

## Job Object Schema

```typescript
interface Job {
  // Identifiers
  id: string;
  slug: string;
  
  // Basic Info
  title: string;
  company: string;
  category: string;
  location: string;
  type: string; // "contract", "full-time", "part-time", "hybrid"
  
  // Descriptions
  description: string;
  htmlDescription: string;
  
  // Requirements & Skills
  requirements: string[];
  qualifications: string[];
  preferredSkills: string[];
  skills: string[];
  experience: string;
  
  // Job Details
  benefits: string[];
  salary: string;
  priority: string; // "high", "medium", "low"
  featured: boolean;
  status: string; // "active", "inactive", "draft", "expired"
  applicationUrl?: string;
  
  // Timestamps
  postedDate: string; // YYYY-MM-DD
  expiresAt: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  
  // Metadata
  version: number;
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (admin endpoints only)
- `404` - Job not found
- `409` - Conflict (duplicate job ID, version mismatch)
- `500` - Internal Server Error

## Authentication

Admin endpoints (POST, PUT, DELETE) require authentication. Currently, authentication checks are commented out but should be implemented as:

```typescript
// TODO: Implement authentication
const session = await getServerSession(authOptions);
if (!session || session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Database Integration

Jobs are stored in DynamoDB with the following structure:

- **Primary Key**: `PK: JOB#<jobId>`, `SK: META#<jobId>`
- **GSI3 (Status Index)**: `GSI3PK: JOBSTATUS#<status>`, `GSI3SK: CREATED#<createdAt>`

This enables:
- Direct job lookups by ID
- Efficient status-based queries
- Chronological ordering

## Bulk Operations

For bulk job management, use the CLI tool in the `infra` folder:

```bash
cd infra
npm run job-manager sync    # Sync from JSON file
npm run job-manager stats   # Show statistics
npm run job-manager clear   # Clear all jobs
```

## Integration Examples

### React Hook for Fetching Jobs

```typescript
import { useState, useEffect } from 'react';

function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/jobs?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.jobs);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [JSON.stringify(filters)]);

  return { jobs, loading, error };
}

// Usage
const { jobs, loading, error } = useJobs({ status: 'active', featured: 'true' });
```

### Admin Job Creation

```typescript
async function createJob(jobData) {
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Job created:', result.job);
      return result.job;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to create job:', error);
    throw error;
  }
}
```