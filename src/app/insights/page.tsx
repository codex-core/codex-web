import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, User, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { getAllInsights, getFeaturedInsights } from "@/lib/insights";

export default function Insights() {
  const featuredInsights = getFeaturedInsights();
  const allInsights = getAllInsights();
  
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
              Discover insights tailored for consultants and businesses navigating the cloud landscape. 
              From building consulting practices to digital transformation strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Audience Categories */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Consultants Card */}
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">For Consultants</CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    Build and grow your consulting practice with industry insights, client management strategies, and business development tips.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium">Featured Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Business Development</Badge>
                      <Badge variant="secondary">Client Relations</Badge>
                      <Badge variant="secondary">Pricing Strategies</Badge>
                    </div>
                  </div>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href="/insights/consultants">
                      Explore Consultant Insights
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Businesses Card */}
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">For Businesses</CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    Navigate digital transformation with strategic insights on cloud adoption, security, and organizational change management.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium">Featured Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Digital Strategy</Badge>
                      <Badge variant="secondary">Cloud Security</Badge>
                      <Badge variant="secondary">Change Management</Badge>
                    </div>
                  </div>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href="/insights/businesses">
                      Explore Business Insights
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12 text-center">
              Featured Insights
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              {featuredInsights.map((post) => (
                <Card key={post.id} className="border bg-card transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge>{post.category}</Badge>
                      <Badge variant="secondary">Featured</Badge>
                      <Badge variant="outline" className="capitalize">
                        {post.audience === 'consultants' ? 'Consultants' : 'Businesses'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={`/insights/${post.audience}/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest from Both Audiences */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12 text-center">
              Latest Insights
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allInsights.filter(post => !post.featured).slice(0, 6).map((post) => (
                <Card key={post.id} className="border bg-card transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      <Badge variant="secondary" className="capitalize">
                        {post.audience === 'consultants' ? 'Consultants' : 'Businesses'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href={`/insights/${post.audience}/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/insights/consultants">
                    View All Consultant Insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/insights/businesses">
                    View All Business Insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
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