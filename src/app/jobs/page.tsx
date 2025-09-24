import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { jobRoles } from "@/config/jobs";

export default function Jobs() {
  const featuredJobs = jobRoles.filter(job => job.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Career{" "}
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Opportunities
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Join our team of cloud experts and work on transformative projects with industry-leading clients. 
              Discover consulting opportunities that match your skills and career goals.
            </p>

            <div className="mt-10">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/consultants">
                  Join Our Consultant Network
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Featured Opportunities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                High-priority roles we're actively recruiting for. Apply now to be first in line.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="h-full transition-all hover:shadow-lg border-l-4 border-l-foreground">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{job.category}</Badge>
                      <div className="flex gap-2">
                        <Badge className="bg-foreground text-background">Featured</Badge>
                        <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Remote / Hybrid / On-site</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>Competitive project rates</span>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link href="/contact">Apply Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Jobs */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                All Opportunities
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore all available positions and find your perfect match
              </p>
            </div>

            <div className="space-y-6">
              {jobRoles.map((job) => (
                <Card key={job.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{job.category}</Badge>
                          <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                          {job.priority === 'high' && (
                            <Badge className="bg-foreground text-background">High Priority</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          {job.description}
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <Link href="/contact">Apply</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Remote / Hybrid / On-site</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>Competitive rates</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Don't See a Perfect Match?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join our consultant network and we'll notify you when opportunities matching your skills become available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/consultants">
                  Join Consultant Network
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Contact Us
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