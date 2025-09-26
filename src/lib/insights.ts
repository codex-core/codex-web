import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export interface InsightPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  featured: boolean;
  audience: 'consultants' | 'businesses';
  slug: string;
  tags: string[];
  content?: string;
}

const insightsDirectory = path.join(process.cwd(), 'content/insights');
const consultantsDirectory = path.join(insightsDirectory, 'consultants');
const businessesDirectory = path.join(insightsDirectory, 'businesses');

// Get all consultant insights
export function getAllConsultantInsights(): InsightPost[] {
  if (!fs.existsSync(consultantsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(consultantsDirectory);
  const allInsights = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(consultantsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: `consultant-${slug}`,
        slug,
        audience: 'consultants' as const,
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || 'General',
        author: data.author || 'Anonymous',
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 min read',
        featured: data.featured || false,
        tags: data.tags || [],
      };
    });

  return allInsights.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Get all business insights
export function getAllBusinessInsights(): InsightPost[] {
  if (!fs.existsSync(businessesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(businessesDirectory);
  const allInsights = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(businessesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: `business-${slug}`,
        slug,
        audience: 'businesses' as const,
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || 'General',
        author: data.author || 'Anonymous',
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 min read',
        featured: data.featured || false,
        tags: data.tags || [],
      };
    });

  return allInsights.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Get all insights combined
export function getAllInsights(): InsightPost[] {
  const consultantInsights = getAllConsultantInsights();
  const businessInsights = getAllBusinessInsights();
  
  return [...consultantInsights, ...businessInsights].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Get insights by audience
export function getInsightsByAudience(audience: 'consultants' | 'businesses' | 'all'): InsightPost[] {
  if (audience === 'consultants') {
    return getAllConsultantInsights();
  }
  if (audience === 'businesses') {
    return getAllBusinessInsights();
  }
  return getAllInsights();
}

// Get featured insights
export function getFeaturedInsights(): InsightPost[] {
  return getAllInsights().filter(insight => insight.featured);
}

// Get specific insight by audience and slug
export async function getInsightPost(audience: 'consultants' | 'businesses', slug: string): Promise<InsightPost | null> {
  try {
    const directory = audience === 'consultants' ? consultantsDirectory : businessesDirectory;
    const fullPath = path.join(directory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown content
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content);
    
    const contentHtml = processedContent.toString();

    return {
      id: `${audience}-${slug}`,
      slug,
      audience,
      title: data.title || '',
      excerpt: data.excerpt || '',
      category: data.category || 'General',
      author: data.author || 'Anonymous',
      publishDate: data.publishDate || new Date().toISOString().split('T')[0],
      readTime: data.readTime || '5 min read',
      featured: data.featured || false,
      tags: data.tags || [],
      content: contentHtml,
    };
  } catch (error) {
    console.error('Error loading insight post:', error);
    return null;
  }
}

// Generate static params for Next.js
export function generateStaticParamsForConsultants() {
  const insights = getAllConsultantInsights();
  return insights.map((insight) => ({
    slug: insight.slug,
  }));
}

export function generateStaticParamsForBusinesses() {
  const insights = getAllBusinessInsights();
  return insights.map((insight) => ({
    slug: insight.slug,
  }));
}

// Get insight by slug (for backward compatibility)
export function getInsightBySlug(slug: string): InsightPost | undefined {
  const allInsights = getAllInsights();
  return allInsights.find(insight => insight.slug === slug);
}

// Get categories for each audience
export function getConsultantCategories(): string[] {
  const insights = getAllConsultantInsights();
  const categories = Array.from(new Set(insights.map(insight => insight.category)));
  return ['All', ...categories.sort()];
}

export function getBusinessCategories(): string[] {
  const insights = getAllBusinessInsights();
  const categories = Array.from(new Set(insights.map(insight => insight.category)));
  return ['All', ...categories.sort()];
}

// Get related insights
export function getRelatedInsights(currentInsight: InsightPost, limit: number = 3): InsightPost[] {
  const sameAudienceInsights = getInsightsByAudience(currentInsight.audience);
  
  // Filter out current insight and find related ones
  const relatedInsights = sameAudienceInsights
    .filter(insight => insight.id !== currentInsight.id)
    .filter(insight => 
      insight.category === currentInsight.category || 
      insight.featured ||
      insight.tags.some(tag => currentInsight.tags.includes(tag))
    )
    .slice(0, limit);

  // If we don't have enough related insights, fill with other insights from same audience
  if (relatedInsights.length < limit) {
    const additionalInsights = sameAudienceInsights
      .filter(insight => 
        insight.id !== currentInsight.id && 
        !relatedInsights.find(related => related.id === insight.id)
      )
      .slice(0, limit - relatedInsights.length);
    
    relatedInsights.push(...additionalInsights);
  }

  return relatedInsights;
}