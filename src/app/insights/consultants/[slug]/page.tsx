import { notFound } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";
import { generateStaticParamsForConsultants, getInsightPost, getRelatedInsights } from "@/lib/insights";
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return generateStaticParamsForConsultants();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightPost('consultants', slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${post.title} | Codex Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
    },
  };
}

export default async function ConsultantArticle({ params }: PageProps) {
  const { slug } = await params;
  const post = await getInsightPost('consultants', slug);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = getRelatedInsights(post, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Article Header */}
      <section className="pt-20 pb-8 lg:pt-32 lg:pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/insights/consultants" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Consultant Insights
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2 mb-6">
              <Badge>{post.category}</Badge>
              {post.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b">
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
              
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share Article
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              {/* This would be where you'd render the full article content */}
              {/* For now, we'll show a placeholder */}
              <div 
                className="prose prose-lg prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12 text-center">
                Related Articles
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
                    <div className="mb-4">
                      <Badge variant="outline">{relatedPost.category}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{relatedPost.author}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href={`/insights/consultants/${relatedPost.slug}`}>
                        Read Article
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Take Action?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Apply these insights to your consulting practice or get personalized guidance from our experts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Get Expert Guidance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-8">
                <Link href="/insights/consultants">
                  More Consultant Insights
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