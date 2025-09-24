import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Cloud Infrastructure: Trends to Watch in 2024",
    excerpt: "Explore the latest trends shaping cloud infrastructure and how businesses can prepare for the next wave of cloud innovation.",
    category: "Cloud Strategy",
    author: "Sarah Johnson",
    publishDate: "2024-01-15",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Infrastructure as Code: Best Practices for Scalable Cloud Deployments",
    excerpt: "Learn how to implement Infrastructure as Code effectively to automate your cloud deployments and improve consistency.",
    category: "DevOps",
    author: "Michael Chen",
    publishDate: "2024-01-10",
    readTime: "12 min read",
    featured: false
  },
  {
    id: 3,
    title: "Cloud Security Essentials: Protecting Your Digital Assets",
    excerpt: "Comprehensive guide to cloud security best practices, compliance requirements, and risk mitigation strategies.",
    category: "Security",
    author: "Emily Rodriguez",
    publishDate: "2024-01-05",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 4,
    title: "Cost Optimization Strategies for Cloud Infrastructure",
    excerpt: "Practical approaches to reduce cloud costs while maintaining performance and reliability.",
    category: "Cost Management",
    author: "David Thompson",
    publishDate: "2023-12-28",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    title: "Multi-Cloud Strategy: Benefits and Implementation Challenges",
    excerpt: "Understanding when and how to implement a multi-cloud strategy for your organization.",
    category: "Cloud Strategy",
    author: "Lisa Wang",
    publishDate: "2023-12-20",
    readTime: "9 min read",
    featured: false
  },
  {
    id: 6,
    title: "Serverless Computing: When and How to Make the Switch",
    excerpt: "Explore the benefits of serverless architecture and determine if it's right for your applications.",
    category: "Architecture",
    author: "James Miller",
    publishDate: "2023-12-15",
    readTime: "11 min read",
    featured: false
  }
];

const categories = ["All", "Cloud Strategy", "DevOps", "Security", "Cost Management", "Architecture"];

export default function Insights() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Cloud{" "}
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Stay ahead of the curve with our latest insights, best practices, and industry trends 
              in cloud computing and digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            {blogPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="rounded-2xl border bg-card p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge>{post.category}</Badge>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  {post.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <Link href={`/insights/${post.id}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12 text-center">
              Latest Articles
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.filter(post => !post.featured).map((post) => (
                <div key={post.id} className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
                  <div className="mb-4">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/insights/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Subscribe to our newsletter and never miss our latest insights on cloud computing and digital transformation.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/#newsletter">
                  Subscribe to Newsletter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}