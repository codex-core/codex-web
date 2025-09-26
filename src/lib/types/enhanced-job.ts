// Enhanced JobRole interface that combines both approaches
export interface EnhancedJobRole {
  id: string;
  slug: string; // URL-friendly version of title
  title: string;
  company: string;
  category: string;
  location: string;
  type: 'contract' | 'full-time' | 'consultant' | 'remote' | 'hybrid';
  
  // Basic description and rich HTML description
  description: string;
  htmlDescription: string; // Rich HTML content from CMS
  
  // Requirements and qualifications
  requirements: string[];
  qualifications: string[];
  preferredSkills: string[];
  
  // Skills and experience
  skills: string[];
  experience: string;
  
  // Job details
  benefits: string[];
  salary?: string;
  priority: 'high' | 'medium' | 'low';
  featured: boolean;
  
  // Dates and metadata
  postedDate: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Application details
  applicationUrl?: string;
  status: 'active' | 'paused' | 'closed';
}

// Utility function to create slug from title
export function createJobSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Utility function to extract skills from HTML description
export function extractSkillsFromDescription(htmlDescription: string): string[] {
  const skillPatterns = [
    /\b(?:Node\.?js|React\.?js|JavaScript|TypeScript|Python|Java|AWS|Azure|Docker|Kubernetes|PostgreSQL|MongoDB|DynamoDB|SQL Server|ASP\.NET|GraphQL|REST API|CI\/CD|Jenkins|Git|Linux|Windows Server|Agile|Scrum|TDD|Microservices|Serverless|Lambda|S3|CloudFormation|CDK|Terraform|DataDog|NewRelic|Selenium|Cucumber|Chef|Puppet|Ansible|Redux|Next\.js|Express|Nest\.js|Spring Boot|Angular|Vue\.js|Svelte|Redis|Elasticsearch|Kafka|RabbitMQ|NGINX|Apache|MySQL|Oracle|NoSQL|GraphQL|REST|SOAP|OAuth|JWT|HTML|CSS|SCSS|Sass|Bootstrap|Tailwind|Material-UI|Figma|Sketch|Jest|Cypress|Playwright|Webpack|Vite|Babel|ESLint|Prettier|Husky|Lint-staged)\b/gi
  ];
  
  const skills = new Set<string>();
  
  skillPatterns.forEach(pattern => {
    const matches = htmlDescription.match(pattern) || [];
    matches.forEach(match => skills.add(match));
  });
  
  return Array.from(skills);
}

// Function to parse HTML description and extract structured data
export function parseJobDescription(htmlDescription: string) {
  // Remove HTML tags for plain text extraction
  const plainText = htmlDescription.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Extract different sections
  const responsibilities = extractSection(htmlDescription, ['responsibilities', 'in this role', 'you will']);
  const qualifications = extractSection(htmlDescription, ['qualifications', 'requirements', 'about you']);
  const preferredSkills = extractSection(htmlDescription, ['preferred', 'nice to have', 'bonus']);
  
  return {
    plainDescription: plainText.slice(0, 300) + '...', // Truncate for summary
    responsibilities,
    qualifications,
    preferredSkills
  };
}

function extractSection(html: string, keywords: string[]): string[] {
  const items: string[] = [];
  
  // Look for lists (ul/ol) that come after headings containing keywords
  const listPattern = /<(?:ul|ol)[^>]*>(.*?)<\/(?:ul|ol)>/gi;
  const itemPattern = /<li[^>]*>.*?<p[^>]*>(.*?)<\/p>.*?<\/li>/gi;
  
  let match;
  while ((match = listPattern.exec(html)) !== null) {
    const listContent = match[1];
    let itemMatch;
    while ((itemMatch = itemPattern.exec(listContent)) !== null) {
      const itemText = itemMatch[1].replace(/<[^>]*>/g, '').trim();
      if (itemText) {
        items.push(itemText);
      }
    }
  }
  
  return items;
}