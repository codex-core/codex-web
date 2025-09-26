"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin, Clock, DollarSign, Search, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { getAllJobs, getFeaturedJobs, getJobCategories, getJobTypes } from "@/lib/jobs";
import { EnhancedJobRole } from "@/lib/types/enhanced-job";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import JobApplicationForm from "@/components/JobApplicationForm";

const JOBS_PER_PAGE = 6;

export default function Jobs() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<EnhancedJobRole | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Get enhanced jobs data
  const allJobs = getAllJobs();
  const featuredJobs = getFeaturedJobs();

  // Get unique categories and types
  const categories = getJobCategories();
  const jobTypes = getJobTypes();

  // Filter jobs based on search and filters (combine both job sources)
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
      const matchesType = selectedType === "all" || job.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType, allJobs]);

  // Paginate jobs
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Convert EnhancedJobRole to the format expected by JobApplicationForm
  const convertEnhancedJobToApplicationJob = (enhancedJob: EnhancedJobRole) => ({
    id: enhancedJob.id,
    title: enhancedJob.title,
    company: enhancedJob.company,
    location: enhancedJob.location,
    type: enhancedJob.type,
    description: enhancedJob.description,
    requirements: enhancedJob.requirements || [],
    benefits: enhancedJob.benefits || [],
    salary: enhancedJob.salary,
    experience: enhancedJob.experience,
    skills: enhancedJob.skills,
    posted: enhancedJob.postedDate,
    deadline: enhancedJob.expiresAt,
  });

  // Handle application submission
  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const result = await response.json();
      
      // Success is now handled by the JobApplicationForm component
      // No need to close the form here as the success modal will handle it
      
    } catch (error) {
      console.error('Application submission error:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Reset to first page when filters change
  const handleFilterChange = (type: string, value: string) => {
    setCurrentPage(1);
    if (type === 'category') setSelectedCategory(value);
    if (type === 'type') setSelectedType(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle job action - navigate to detail page for all jobs
  const handleJobAction = (job: EnhancedJobRole) => {
    router.push(`/jobs/${job.slug}`);
  };

  // Handle application form (for cases where we need to show modal)
  const handleShowApplicationForm = (job: EnhancedJobRole) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Consulting{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
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
      {featuredJobs.length > 0 && (
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                  Featured{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Opportunities
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  High-priority roles we're actively recruiting for. Apply now to be first in line.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {featuredJobs.map((job: EnhancedJobRole, index: number) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className="h-full transition-all hover:shadow-lg border-l-4 border-l-blue-600 group cursor-pointer"
                      onClick={() => handleJobAction(job)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{job.category}</Badge>
                          <div className="flex gap-2">
                            <Badge className="bg-blue-600 text-white">Featured</Badge>
                            <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{job.title}</CardTitle>
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
                          <div className="flex gap-2 mt-4">
                            <Button 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobAction(job);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                                setShowApplicationForm(true);
                              }}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Jobs with Pagination */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                All{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Opportunities
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore all available positions and find your perfect match
              </p>
            </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, skills, or categories..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-3 py-1 rounded-md border bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-1 rounded-md border bg-background text-sm"
                >
                  <option value="all">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type} className="capitalize">{type}</option>
                  ))}
                </select>

                {/* Results count */}
                <Badge variant="outline" className="ml-2">
                  {filteredJobs.length} jobs found
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Jobs Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-6">
                {paginatedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className="transition-all hover:shadow-lg group cursor-pointer"
                      onClick={() => handleJobAction(job)}
                    >
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{job.category}</Badge>
                              <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                              {job.priority === 'high' && (
                                <Badge className="bg-red-600 text-white">High Priority</Badge>
                              )}
                              {job.featured && (
                                <Badge className="bg-blue-600 text-white">Featured</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{job.title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                              {job.description}
                            </CardDescription>
                          </div>
                          <div className="hidden lg:flex gap-2">
                            <Button 
                              variant="outline"
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobAction(job);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                                setShowApplicationForm(true);
                              }}
                            >
                              Apply
                            </Button>
                          </div>
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
                        <div className="mt-4 pt-4 border-t lg:hidden">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobAction(job);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                                setShowApplicationForm(true);
                              }}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedType("all");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            {filteredJobs.length > 0 && (
              <div className="text-center mt-6 text-sm text-muted-foreground">
                Showing {((currentPage - 1) * JOBS_PER_PAGE) + 1} to {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Don't See a Perfect{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Match?
              </span>
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
      
      {/* Job Application Form Modal */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          open={showApplicationForm}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}