# Job Data Migration Strategy

## Overview

This document outlines the strategy for migrating from static JSON job data to DynamoDB-backed job management while maintaining data consistency and enabling both bulk operations and individual CRUD operations.

## Current State

- Jobs are stored in `src/lib/cms/Enhanced_Jobs.json`
- Frontend components read directly from the JSON file
- No dynamic job management capabilities

## Target State

- Jobs stored in DynamoDB table `codex-platform-{stage}`
- API endpoints for job CRUD operations
- Bulk management capabilities via CLI script
- Frontend components consume jobs via API

## Migration Steps

### Phase 1: Infrastructure Setup ✅

1. **DynamoDB Table Structure**
   - Primary Key: `PK: JOB#<jobId>`, `SK: META#<jobId>`
   - GSI3 for status queries: `GSI3PK: JOBSTATUS#<status>`, `GSI3SK: CREATED#<createdAt>`

2. **Job Data Manager Script** ✅
   - Located in `infra/scripts/job-data-manager.ts`
   - Supports sync, clear, stats, list operations
   - Handles batch operations for efficiency

### Phase 2: Data Population ✅

1. **Initial Sync**
   ```bash
   cd infra
   npm run job-manager sync
   ```

2. **Verify Data**
   ```bash
   npm run job-manager stats
   npm run job-manager list
   ```

### Phase 3: API Development

1. **Create Job API Routes**
   - `GET /api/jobs` - List all jobs (with status filtering)
   - `GET /api/jobs/[id]` - Get single job by ID
   - `POST /api/jobs` - Create new job (admin only)
   - `PUT /api/jobs/[id]` - Update job (admin only)
   - `DELETE /api/jobs/[id]` - Delete job (admin only)

2. **Example API Implementation**
   ```typescript
   // app/api/jobs/route.ts
   import { jobManager } from '@/lib/job-api-integration';
   
   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url);
     const status = searchParams.get('status');
     
     const jobs = status 
       ? await jobManager.getJobsByStatus(status)
       : await jobManager.getAllJobs();
     
     return NextResponse.json({ jobs });
   }
   ```

### Phase 4: Frontend Migration

1. **Update Job Components**
   - Replace JSON file imports with API calls
   - Add loading states and error handling
   - Implement caching strategy (React Query/SWR)

2. **Example Component Update**
   ```typescript
   // Before
   import jobs from '@/lib/cms/Enhanced_Jobs.json';
   
   // After
   const { data: jobs, error, isLoading } = useSWR('/api/jobs', fetcher);
   ```

### Phase 5: Admin Interface Enhancement

1. **Extend Admin Dashboard**
   - Add job creation form
   - Add job editing capabilities
   - Add bulk operations interface

2. **Job Management Features**
   - Status management (active, inactive, draft, expired)
   - Featured job toggle
   - Priority management
   - Expiration date management

## Data Consistency Strategy

### Bulk Operations
- Use the CLI script for initial data loads and bulk updates
- Validate data before bulk operations
- Use transactions for related data updates

### Individual Operations
- Use API routes for single job operations
- Implement optimistic locking with version numbers
- Add audit logging for job changes

### Backup Strategy
- Export jobs to JSON format for backups
- Version control job data changes
- Implement rollback capabilities

## Environment Management

### Development
```bash
STAGE=dev npm run job-manager sync
```

### Production
```bash
STAGE=prod AWS_REGION=us-east-1 npm run job-manager sync --clear
```

## Monitoring and Maintenance

### Regular Tasks
1. **Data Validation**
   ```bash
   npm run job-manager stats
   ```

2. **Expired Job Cleanup**
   - Create scheduled task to update expired jobs
   - Archive old job data

3. **Performance Monitoring**
   - Monitor DynamoDB metrics
   - Optimize GSI usage
   - Track API response times

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**
   - Revert frontend components to use JSON files
   - Disable API routes
   - Continue using static data

2. **Data Recovery**
   - Restore from JSON backups
   - Re-sync data to DynamoDB
   - Validate data integrity

## Success Metrics

- [ ] All jobs successfully migrated to DynamoDB
- [ ] API endpoints responding correctly
- [ ] Frontend components loading data from API
- [ ] Admin interface functional for job management
- [ ] Performance meets or exceeds current static file approach
- [ ] Zero data loss during migration

## Timeline

- **Week 1**: Complete Phase 3 (API Development)
- **Week 2**: Complete Phase 4 (Frontend Migration)
- **Week 3**: Complete Phase 5 (Admin Enhancement)
- **Week 4**: Testing, optimization, and deployment

## Risk Mitigation

1. **Data Loss Prevention**
   - Always backup before bulk operations
   - Use transactions for critical updates
   - Validate data after operations

2. **Performance Issues**
   - Monitor DynamoDB capacity
   - Implement caching strategies
   - Optimize query patterns

3. **Deployment Issues**
   - Blue-green deployment strategy
   - Feature flags for gradual rollout
   - Rollback procedures documented and tested