export interface JobRole {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  experience: string;
  type: 'contract' | 'full-time' | 'consultant';
  priority: 'high' | 'medium' | 'low';
  featured: boolean;
}

export const jobRoles: JobRole[] = [
  {
    id: 'fullstack-react',
    title: 'Full Stack Engineer (React Focus)',
    category: 'Engineering',
    description: 'We are seeking experienced full stack engineers with strong React expertise to work on cutting-edge cloud applications. You will be responsible for building scalable web applications from front-end to back-end.',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
    experience: '3+ years of full stack development experience',
    type: 'consultant',
    priority: 'high',
    featured: true
  },
  {
    id: 'fullstack-angular',
    title: 'Full Stack Engineer (Angular Focus)',
    category: 'Engineering',
    description: 'Looking for skilled full stack developers with Angular expertise to build enterprise-level applications. Experience with cloud infrastructure and modern development practices is essential.',
    skills: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Azure', 'Kubernetes', 'REST APIs'],
    experience: '3+ years of full stack development experience',
    type: 'consultant',
    priority: 'high',
    featured: true
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'AI/ML',
    description: 'Join our AI team to develop and deploy machine learning models in cloud environments. You will work on innovative projects involving natural language processing, computer vision, and predictive analytics.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS SageMaker', 'Docker', 'MLOps', 'Jupyter'],
    experience: '2+ years of ML engineering experience',
    type: 'consultant',
    priority: 'high',
    featured: true
  },
  {
    id: 'prompt-engineer',
    title: 'Prompt Engineer',
    category: 'AI/ML',
    description: 'We are looking for creative prompt engineers to optimize AI model interactions and develop sophisticated prompt strategies for various business applications.',
    skills: ['LLM Optimization', 'Prompt Design', 'Python', 'OpenAI API', 'Anthropic Claude', 'Chain-of-Thought', 'RAG', 'LangChain'],
    experience: '1+ years of prompt engineering or AI experience',
    type: 'consultant',
    priority: 'high',
    featured: true
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    category: 'Engineering',
    description: 'Seeking backend engineers to design and implement robust, scalable server-side applications and APIs. Experience with cloud infrastructure and microservices architecture preferred.',
    skills: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'Redis', 'AWS/Azure', 'Microservices', 'API Design'],
    experience: '2+ years of backend development experience',
    type: 'consultant',
    priority: 'medium',
    featured: false
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Infrastructure',
    description: 'Looking for DevOps engineers to manage and optimize our cloud infrastructure, implement CI/CD pipelines, and ensure reliable deployment processes.',
    skills: ['AWS/Azure', 'Terraform', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'Monitoring', 'Linux'],
    experience: '2+ years of DevOps experience',
    type: 'consultant',
    priority: 'medium',
    featured: false
  }
];

export const consultantProcess = {
  steps: [
    {
      id: 1,
      title: 'Application',
      description: 'Submit your application with your resume and portfolio',
      duration: '5 minutes'
    },
    {
      id: 2,
      title: 'Initial Screening',
      description: 'Brief screening process to verify experience and skills',
      duration: '24-48 hours'
    },
    {
      id: 3,
      title: 'Talent Pool',
      description: 'Join our vetted consultant network and wait for matching opportunities',
      duration: 'Ongoing'
    },
    {
      id: 4,
      title: 'Project Match',
      description: 'Get contacted when a role matches your experience and availability',
      duration: 'As opportunities arise'
    },
    {
      id: 5,
      title: 'Client Interview',
      description: 'Interview with the client for specific project requirements',
      duration: '1-2 weeks'
    },
    {
      id: 6,
      title: 'Project Start',
      description: 'Begin work on the matched project with full support from Codex',
      duration: 'Project duration'
    }
  ],
  benefits: [
    'Competitive project rates',
    'Flexible remote work options',
    'Professional development opportunities',
    'Access to cutting-edge projects',
    'Dedicated project support',
    'Networking opportunities',
    'Long-term partnership potential',
    'Skills development programs'
  ]
};

export const featuredRoles = jobRoles.filter(role => role.featured);
export const highPriorityRoles = jobRoles.filter(role => role.priority === 'high');

export const jobCategories = Array.from(new Set(jobRoles.map(role => role.category)));