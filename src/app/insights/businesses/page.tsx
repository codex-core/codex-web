import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Building2 } from "lucide-react";
import Link from "next/link";
import { getAllBusinessInsights, getBusinessCategories } from "@/lib/insights";

export default function BusinessInsights() {
  const businessInsights = getAllBusinessInsights();
  const businessCategories = getBusinessCategories();
  const featuredPosts = businessInsights.filter(post => post.featured);
  const regularPosts = businessInsights.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/insights" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Insights
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                For{" "}
                <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  Businesses
                </span>
              </h1>
            </div>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Navigate your digital transformation journey with strategic insights on cloud adoption, 
              security best practices, and organizational change management.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {businessCategories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
                Featured for Businesses
              </h2>
              
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-2 bg-card p-8 lg:p-12 mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge>{post.category}</Badge>
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  
                  <h3 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                    {post.title}
                  </h3>
                  
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
                    
                    <Button asChild size="lg">
                      <Link href={`/insights/businesses/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Business Posts */}
      <section className="py-10 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12 text-center">
              All Business Insights
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <Card key={post.id} className="border bg-card transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4">
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                        <Link href={`/insights/businesses/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Let our experts help you navigate your cloud journey with comprehensive solutions 
              tailored to your business needs and industry requirements.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-8">
                <Link href="/insights/consultants">
                  View Consultant Insights
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