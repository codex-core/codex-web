import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export function getAllBlogPosts(): BlogPostMeta[] {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        title: matterResult.data.title,
        description: matterResult.data.description,
        publishedAt: matterResult.data.publishedAt,
        author: matterResult.data.author,
        category: matterResult.data.category,
        tags: matterResult.data.tags || [],
        featured: matterResult.data.featured || false,
      } as BlogPostMeta;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(matterResult.content);
    
    const contentHtml = processedContent.toString();

    // Combine the data with the slug and contentHtml
    return {
      slug,
      content: contentHtml,
      title: matterResult.data.title,
      description: matterResult.data.description,
      publishedAt: matterResult.data.publishedAt,
      author: matterResult.data.author,
      category: matterResult.data.category,
      tags: matterResult.data.tags || [],
      featured: matterResult.data.featured || false,
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

export function getAllBlogSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export function getFeaturedPosts(): BlogPostMeta[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}