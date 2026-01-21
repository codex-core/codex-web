'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobApplicationForm from '@/components/JobApplicationForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Building, 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EnhancedJobRole } from '@/lib/types/enhanced-job';

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [job, setJob] = useState<EnhancedJobRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJobBySlug = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // Try to get job by ID first (if slug matches ID format)
        let response = await fetch(`/api/jobs/${slug}`);
        let data = await response.json();
        
        if (data.success) {
          setJob(data.job);
        } else {
          // If direct lookup fails, get all jobs and find by slug
          response = await fetch('/api/jobs?status=active');
          data = await response.json();
          
          if (data.success) {
            const foundJob = data.jobs.find((job: EnhancedJobRole) => job.slug === slug);
            if (foundJob) {
              setJob(foundJob);
            } else {
              setError('Job not found');
            }
          } else {
            setError(data.error || 'Failed to fetch job');
          }
        }
      } catch (err) {
        setError('Failed to fetch job');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobBySlug();
  }, [slug]);

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

      await response.json();
      
      // Success is now handled by the JobApplicationForm component
      
    } catch (error) {
      console.error('Application submission error:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job opportunity: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Job link copied to clipboard!');
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {error ? 'Error Loading Job' : 'Job Not Found'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || "The job you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/jobs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Jobs
                </Link>
              </Button>
              {error && (
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isExpired = Boolean(job.expiresAt && new Date(job.expiresAt) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Job Header */}
      <section className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/jobs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="outline">{job.category}</Badge>
                        <Badge 
                          variant="secondary" 
                          className={job.type === 'remote' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {job.type}
                        </Badge>
                        {job.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                        {job.priority === 'high' && (
                          <Badge variant="destructive">High Priority</Badge>
                        )}
                        {isExpired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-3xl lg:text-4xl font-bold mb-3">
                        {job.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                      
                      <CardDescription className="text-lg leading-relaxed">
                        {job.description}
                      </CardDescription>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={() => {
                          if(job.applicationUrl){
                            window.open(job.applicationUrl, '_blank');
                            return;
                          }
                          setShowApplicationForm(true)}}
                        disabled={isExpired}
                      >
                        {isExpired ? 'Application Closed' : 'Apply Now'}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setBookmarked(!bookmarked)}
                        >
                          <Bookmark className={`w-4 h-4 mr-1 ${bookmarked ? 'fill-current' : ''}`} />
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Job Description */}
                {job.htmlDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>About This Role</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: job.htmlDescription }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Preferred Skills */}
                {job.preferredSkills && job.preferredSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferred Qualifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {job.preferredSkills.map((skill, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>What We Offer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Key Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Job Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Experience Level</div>
                          <div className="text-sm text-muted-foreground">{job.experience}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Employment Type</div>
                          <div className="text-sm text-muted-foreground capitalize">{job.type}</div>
                        </div>
                      </div>
                      
                      {job.expiresAt && (
                        <>
                          <Separator />
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Application Deadline</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(job.expiresAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Apply Now Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h3 className="font-semibold text-blue-900">Ready to Apply?</h3>
                        <p className="text-sm text-blue-700">
                          Join our team and work on exciting projects with industry-leading clients.
                        </p>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            if(job.applicationUrl){
                              window.open(job.applicationUrl, '_blank');
                              return;
                            }
                            setShowApplicationForm(true);
                          }}
                          disabled={isExpired}
                        >
                          {isExpired ? 'Application Closed' : 'Apply Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Job Application Form Modal */}
      {job && (
        <JobApplicationForm
          job={job}
          open={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}