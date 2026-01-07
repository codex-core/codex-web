"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Users, CheckCircle } from "lucide-react";
import { OverviewTab, JobsTab, ApplicantsTab, ProfileModal } from "@/components/admin/home";

interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalUsers: number;
  recentJobsCount: number;
}

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: 'open' | 'closed' | 'draft' | 'paused';
  createdAt: string;
  applicantCount: number;
  jobType: string;
  description?: string;
  category?: string;
  skills?: string[];
  priority?: string;
  featured?: boolean;
  expiresAt?: string;
}

interface Applicant {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
  appliedAt: string;
  resumeKey?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  phone?: string;
  linkedinUrl?: string;
  coverLetter?: string;
}

interface Resume {
  resumeId: string;
  fileName: string;
  uploadedAt: string;
  s3Key: string;
  isDefault: boolean;
  fileSize?: number;
  fileType?: string;
}

interface UserProfileData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumes?: Resume[];
  identityVerificationStatus?: 'not_started' | 'pending' | 'verified' | 'failed';
  identityVerifiedAt?: string;
  isRegisteredUser?: boolean;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalUsers: 0,
    recentJobsCount: 0
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'jobs' | 'applicants'>('overview');
  const [selectedProfile, setSelectedProfile] = useState<UserProfileData | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchJobs();
    fetchApplicants();
  }, []);

  const fetchStats = async () => {
    try {
      const jobsResponse = await fetch('/api/admin/jobs');
      const jobsData = await jobsResponse.json();
      
      const applicantsResponse = await fetch('/api/admin/applicants');
      const applicantsData = await applicantsResponse.json();
      
      const totalJobs = jobsData.success ? jobsData.jobs.length : 0;
      const activeJobs = jobsData.success ? jobsData.jobs.filter((job: any) => job.status === 'open').length : 0;
      const recentJobs = jobsData.success ? jobsData.jobs.filter((job: any) => {
        const jobDate = new Date(job.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return jobDate > weekAgo;
      }).length : 0;

      const totalApplications = applicantsData.success ? applicantsData.applicants.length : 0;
      const pendingApplications = applicantsData.success ? applicantsData.applicants.filter((app: any) => app.status === 'pending').length : 0;

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        totalUsers: 0,
        recentJobsCount: recentJobs
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/admin/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplicants = async () => {
    try {
      const response = await fetch('/api/admin/applicants');
      if (response.ok) {
        const data = await response.json();
        setApplicants(data.applicants || []);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleExportReport = () => {
    const data = currentView === 'jobs' ? jobs : applicants;
    const headers = currentView === 'jobs' 
      ? ['Title', 'Company', 'Status', 'Applications', 'Created']
      : ['Name', 'Email', 'Position', 'Status', 'Applied Date'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (currentView === 'jobs') {
          const job = item as Job;
          return [
            `"${job.title}"`,
            `"${job.company}"`,
            job.status,
            job.applicantCount || 0,
            new Date(job.createdAt).toLocaleDateString()
          ].join(',');
        } else {
          const applicant = item as Applicant;
          const fullName = `${applicant.firstName} ${applicant.lastName}`;
          return [
            `"${fullName}"`,
            applicant.email,
            `"${applicant.jobTitle}"`,
            applicant.status,
            new Date(applicant.appliedAt).toLocaleDateString()
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentView}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleViewProfile = async (applicant: Applicant) => {
    try {
      const userCheckResponse = await fetch(`/api/users/check?email=${encodeURIComponent(applicant.email)}`);
      
      if (userCheckResponse.ok) {
        const userData = await userCheckResponse.json();
        
        if (userData.exists) {
          const profileResponse = await fetch(`/api/users/${userData.user.userId}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfile = profileData.user;
            
            setSelectedProfile({
              ...userProfile,
              isRegisteredUser: true,
            });
          } else {
            setSelectedProfile({
              userId: applicant.userId,
              email: applicant.email,
              firstName: applicant.firstName,
              lastName: applicant.lastName,
              role: 'applicant',
              phone: applicant.phone,
              location: applicant.location,
              linkedinUrl: applicant.linkedinUrl,
              experience: applicant.experience,
              skills: applicant.skills,
              isRegisteredUser: false,
            });
          }
        } else {
          setSelectedProfile({
            userId: applicant.userId,
            email: applicant.email,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            role: 'applicant',
            phone: applicant.phone,
            location: applicant.location,
            linkedinUrl: applicant.linkedinUrl,
            experience: applicant.experience,
            skills: applicant.skills,
            isRegisteredUser: false,
          });
        }
      } else {
        throw new Error('Failed to check user status');
      }
      
      setShowProfileModal(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSelectedProfile({
        userId: applicant.userId,
        email: applicant.email,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        role: 'applicant',
        phone: applicant.phone,
        location: applicant.location,
        linkedinUrl: applicant.linkedinUrl,
        experience: applicant.experience,
        skills: applicant.skills,
        isRegisteredUser: false,
      });
      setShowProfileModal(true);
    }
  };

  const handleDownloadResume = async (applicant: Applicant) => {
    if (!applicant.resumeKey) {
      alert('No resume available for this applicant');
      return;
    }

    try {
      const userCheckResponse = await fetch(`/api/users/check?email=${encodeURIComponent(applicant.email)}`);
      
      if (userCheckResponse.ok) {
        const userData = await userCheckResponse.json();
        
        if (userData.exists) {
          const profileResponse = await fetch(`/api/users/${userData.user.userId}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfile = profileData.user;
            
            if (userProfile.resumes && userProfile.resumes.length > 0) {
              const defaultResume = userProfile.resumes.find((r: Resume) => r.isDefault) || userProfile.resumes[0];
              
              const downloadResponse = await fetch(`/api/users/${userData.user.userId}/resumes/${defaultResume.resumeId}/download`);
              
              if (!downloadResponse.ok) {
                throw new Error('Failed to get download URL');
              }

              const { downloadUrl } = await downloadResponse.json();
              
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = defaultResume.fileName;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              return;
            }
          }
        }
      }
      
      if (applicant.resumeKey.startsWith('http')) {
        window.open(applicant.resumeKey, '_blank');
      } else {
        alert('Resume not available for download');
      }
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your recruitment platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApplications} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered consultants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentJobsCount}</div>
            <p className="text-xs text-muted-foreground">
              Created this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'overview' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'jobs' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setCurrentView('applicants')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'applicants' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Applicants ({applicants.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {currentView === 'overview' && (
        <OverviewTab
          stats={stats}
          onViewJobs={() => setCurrentView('jobs')}
          onViewApplicants={() => setCurrentView('applicants')}
          onExportReport={handleExportReport}
          onPrintReport={handlePrintReport}
        />
      )}

      {currentView === 'jobs' && (
        <JobsTab
          jobs={jobs}
          onExportReport={handleExportReport}
          onPrintReport={handlePrintReport}
        />
      )}

      {currentView === 'applicants' && (
        <ApplicantsTab
          applicants={applicants}
          onExportReport={handleExportReport}
          onPrintReport={handlePrintReport}
          onViewProfile={handleViewProfile}
          onDownloadResume={handleDownloadResume}
        />
      )}

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onDownloadResume={handleDownloadResume}
          filteredApplicants={applicants}
        />
      )}
    </div>
  );
}