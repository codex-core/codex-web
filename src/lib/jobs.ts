import { EnhancedJobRole } from '@/lib/types/enhanced-job';
import enhancedJobsData from '@/lib/cms/Enhanced_Jobs.json';

// Load enhanced jobs data
export const enhancedJobs: EnhancedJobRole[] = enhancedJobsData as EnhancedJobRole[];

// Get all jobs
export function getAllJobs(): EnhancedJobRole[] {
  return enhancedJobs.filter(job => job.status === 'active');
}

// Get job by slug
export function getJobBySlug(slug: string): EnhancedJobRole | null {
  const job = enhancedJobs.find(job => job.slug === slug && job.status === 'active');
  return job || null;
}

// Get job by ID
export function getJobById(id: string): EnhancedJobRole | null {
  const job = enhancedJobs.find(job => job.id === id && job.status === 'active');
  return job || null;
}

// Get featured jobs
export function getFeaturedJobs(): EnhancedJobRole[] {
  return enhancedJobs.filter(job => job.featured && job.status === 'active');
}

// Get jobs by category
export function getJobsByCategory(category: string): EnhancedJobRole[] {
  return enhancedJobs.filter(job => 
    job.category.toLowerCase() === category.toLowerCase() && 
    job.status === 'active'
  );
}

// Get jobs by type
export function getJobsByType(type: string): EnhancedJobRole[] {
  return enhancedJobs.filter(job => 
    job.type.toLowerCase() === type.toLowerCase() && 
    job.status === 'active'
  );
}

// Search jobs
export function searchJobs(query: string): EnhancedJobRole[] {
  const searchTerm = query.toLowerCase();
  
  return enhancedJobs.filter(job => {
    if (job.status !== 'active') return false;
    
    return (
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm))
    );
  });
}

// Get unique categories
export function getJobCategories(): string[] {
  const categories = new Set(enhancedJobs.map(job => job.category));
  return Array.from(categories).sort();
}

// Get unique job types
export function getJobTypes(): string[] {
  const types = new Set(enhancedJobs.map(job => job.type));
  return Array.from(types).sort();
}

// Get unique locations
export function getJobLocations(): string[] {
  const locations = new Set(enhancedJobs.map(job => job.location));
  return Array.from(locations).sort();
}

// Get all job slugs (useful for static generation)
export function getAllJobSlugs(): string[] {
  return enhancedJobs
    .filter(job => job.status === 'active')
    .map(job => job.slug);
}

// Filter jobs with multiple parameters
export interface JobFilters {
  category?: string;
  type?: string;
  location?: string;
  skills?: string[];
  featured?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export function filterJobs(filters: JobFilters): EnhancedJobRole[] {
  return enhancedJobs.filter(job => {
    if (job.status !== 'active') return false;
    
    // Category filter
    if (filters.category && job.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    
    // Type filter
    if (filters.type && job.type.toLowerCase() !== filters.type.toLowerCase()) {
      return false;
    }
    
    // Location filter
    if (filters.location && job.location.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }
    
    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const hasMatchingSkill = filters.skills.some(filterSkill =>
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) return false;
    }
    
    // Featured filter
    if (filters.featured !== undefined && job.featured !== filters.featured) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && job.priority !== filters.priority) {
      return false;
    }
    
    return true;
  });
}

// Sort jobs
export type JobSortBy = 'newest' | 'oldest' | 'title' | 'company' | 'priority';

export function sortJobs(jobs: EnhancedJobRole[], sortBy: JobSortBy): EnhancedJobRole[] {
  const sorted = [...jobs];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'company':
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    default:
      return sorted;
  }
}