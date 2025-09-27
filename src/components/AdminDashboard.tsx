import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  User,
  Briefcase, 
  FileText, 
  Filter,
  Download,
  Eye,
  ChevronRight,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  X,
  Phone,
  Globe,
  Github,
  Linkedin,
  Mail,
  Shield
} from "lucide-react";

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

interface AdminDashboardProps {
  userProfile: any;
}

export default function AdminDashboard({ userProfile }: AdminDashboardProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'jobs' | 'applicants'>('jobs');
  const [selectedProfile, setSelectedProfile] = useState<UserProfileData | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesJob = selectedJobId === "all" || applicant.jobId === selectedJobId;
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    const matchesRole = roleFilter === "all" || applicant.jobTitle.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesSearch = searchTerm === "" || 
      `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesStatus && matchesRole && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'screening':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'interview':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'offer':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'hired':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getJobStatusBadge = (status: string) => {
    const variant = status === 'open' ? 'default' : 
                   status === 'closed' ? 'destructive' : 
                   status === 'paused' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const exportApplicants = () => {
    const exportData = filteredApplicants.map(applicant => ({
      Name: `${applicant.firstName} ${applicant.lastName}`,
      Email: applicant.email,
      Position: applicant.jobTitle,
      Status: applicant.status,
      'Applied Date': new Date(applicant.appliedAt).toLocaleDateString(),
      Location: applicant.location || 'Not specified',
      Experience: applicant.experience || 'Not specified',
      Skills: applicant.skills?.join(', ') || 'Not specified'
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applicants-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const printApplicants = () => {
    const printContent = `
      <html>
        <head>
          <title>Candidate Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-screening { background-color: #dbeafe; color: #1e40af; }
            .status-interview { background-color: #e9d5ff; color: #7c3aed; }
            .status-offer { background-color: #d1fae5; color: #065f46; }
            .status-rejected { background-color: #fee2e2; color: #991b1b; }
            .status-hired { background-color: #d1fae5; color: #059669; }
          </style>
        </head>
        <body>
          <h1>Candidate Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Candidates: ${filteredApplicants.length}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${filteredApplicants.map(applicant => `
                <tr>
                  <td>${applicant.firstName} ${applicant.lastName}</td>
                  <td>${applicant.email}</td>
                  <td>${applicant.jobTitle}</td>
                  <td><span class="status status-${applicant.status}">${applicant.status.toUpperCase()}</span></td>
                  <td>${new Date(applicant.appliedAt).toLocaleDateString()}</td>
                  <td>${applicant.location || 'Not specified'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleViewProfile = async (applicant: Applicant) => {
    setProfileLoading(true);
    setShowProfileModal(true);
    
    try {
      // First check if the applicant is a registered user in our system
      const userCheckResponse = await fetch(`/api/users/check?email=${encodeURIComponent(applicant.email)}`);
      
      if (userCheckResponse.ok) {
        const userData = await userCheckResponse.json();
        
        if (userData.exists) {
          // User is registered - fetch their full profile
          const profileResponse = await fetch(`/api/users/${userData.user.userId}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfile = profileData.user;
            
            setSelectedProfile({
              ...userProfile,
              isRegisteredUser: true,
            });
          } else {
            // Fallback to application data only
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
          // Not a registered user - use application data only
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
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to application data
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
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDownloadResume = async (applicant: Applicant) => {
    if (!applicant.resumeKey) {
      console.error('No resume available for this applicant');
      return;
    }

    try {
      // Check if user is registered and has uploaded resumes
      const userCheckResponse = await fetch(`/api/users/check?email=${encodeURIComponent(applicant.email)}`);
      
      if (userCheckResponse.ok) {
        const userData = await userCheckResponse.json();
        
        if (userData.exists) {
          // User is registered - fetch their resumes and download the default one
          const profileResponse = await fetch(`/api/users/${userData.user.userId}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfile = profileData.user;
            
            if (userProfile.resumes && userProfile.resumes.length > 0) {
              // Find default resume or use the first one
              const defaultResume = userProfile.resumes.find((r: Resume) => r.isDefault) || userProfile.resumes[0];
              
              // Get presigned URL for download
              const downloadResponse = await fetch(`/api/users/${userData.user.userId}/resumes/${defaultResume.resumeId}/download`);
              
              if (!downloadResponse.ok) {
                throw new Error('Failed to get download URL');
              }

              const { downloadUrl } = await downloadResponse.json();
              
              // Create a temporary link and click it to download
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
      
      // Fallback: If not a registered user or no resumes found, try to use the resumeKey as S3 key
      console.warn('User not registered or no resumes found, falling back to resumeKey');
      // You might want to implement a generic S3 download endpoint here
      // For now, we'll just show an error
      throw new Error('Resume not available for download');
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      // You could add a toast notification here
      alert('Failed to download resume. The applicant may not have uploaded a resume to our system.');
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowProfileModal(open);
    if (!open) {
      setSelectedProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage job postings and applications</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={view === 'jobs' ? 'default' : 'outline'}
            onClick={() => setView('jobs')}
            className="flex-1 sm:flex-none"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Jobs
          </Button>
          <Button
            variant={view === 'applicants' ? 'default' : 'outline'}
            onClick={() => setView('applicants')}
            className="flex-1 sm:flex-none"
          >
            <Users className="w-4 h-4 mr-2" />
            Applicants
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Total Jobs</CardTitle>
            <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {jobs.filter(j => j.status === 'open').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Total Applicants</CardTitle>
            <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{applicants.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {applicants.filter(a => a.status === 'pending').length} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">In Interview</CardTitle>
            <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {applicants.filter(a => a.status === 'interview').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Hired</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {applicants.filter(a => a.status === 'hired').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs View */}
      {view === 'jobs' && (
        <Card>
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="flex flex-col sm:flex-row md:flex-row sm:items-center md:items-center sm:justify-between md:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0 md:space-y-0"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row md:flex-row sm:items-center md:items-center gap-2 sm:gap-3 md:gap-3">
                      <h3 className="font-semibold text-base sm:text-lg md:text-lg">{job.title}</h3>
                      {getJobStatusBadge(job.status)}
                    </div>
                    
                    {/* Mobile: Stack info vertically, Tablet+: Keep horizontal */}
                    <div className="grid grid-cols-1 sm:flex md:flex sm:items-center md:items-center gap-2 sm:gap-4 md:gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span>{job.applicantCount} applicants</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobile: Full width button, Tablet+: Normal button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto md:w-auto"
                      onClick={() => {
                        setSelectedJobId(job.jobId);
                        setView('applicants');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="sm:inline md:inline">View Applicants</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No job postings found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applicants View */}
      {view === 'applicants' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <CardTitle className="text-lg sm:text-xl">Applicants ({filteredApplicants.length})</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportApplicants}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Export CSV</span>
                  <span className="xs:hidden">CSV</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={printApplicants}
                  className="flex-1 sm:flex-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Print Report</span>
                  <span className="xs:hidden">Print</span>
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3 mt-4">
              {/* Search - Full width on mobile */}
              <div className="flex items-center gap-2 w-full">
                <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              {/* Filter dropdowns - Grid layout on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.jobId} value={job.jobId}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.applicationId}
                  className="flex flex-col sm:flex-row md:flex-row sm:items-center md:items-center sm:justify-between md:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0 md:space-y-0"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                      <h3 className="font-semibold text-base">
                        {applicant.firstName} {applicant.lastName}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(applicant.status)}
                        <Badge variant="secondary" className="text-xs">{applicant.status}</Badge>
                      </div>
                    </div>
                    
                    {/* Mobile: Stack info vertically, Tablet+: Keep horizontal */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex md:flex sm:items-center md:items-center gap-1 sm:gap-4 md:gap-4 text-sm text-gray-600">
                      <span className="truncate">{applicant.email}</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{applicant.jobTitle}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                      </span>
                      {applicant.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{applicant.location}</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Skills */}
                    {applicant.skills && applicant.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {applicant.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {applicant.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{applicant.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons - Full width on mobile */}
                  <div className="flex gap-2 w-full sm:w-auto md:w-auto">
                    {applicant.resumeKey && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadResume(applicant)}
                        title="Download Resume"
                        className="flex-1 sm:flex-none md:flex-none"
                      >
                        <Download className="w-4 h-4 sm:mr-0 md:mr-0" />
                        <span className="ml-2 sm:hidden md:hidden">Resume</span>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(applicant)}
                      className="flex-1 sm:flex-none md:flex-none"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="sm:inline md:inline">View Profile</span>
                    </Button>
                  </div>
                </div>
              ))}

              {filteredApplicants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No applicants found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="overflow-y-auto lg:min-w-[800px] max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {profileLoading ? 'Loading Profile...' : `${selectedProfile?.firstName} ${selectedProfile?.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          {profileLoading ? (
            <div className="p-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedProfile ? (
            <div className="space-y-6">
              {/* User Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                {selectedProfile.isRegisteredUser ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Shield className="w-3 h-3 mr-1" />
                    Registered User
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    External Applicant
                  </Badge>
                )}
                {selectedProfile.identityVerificationStatus === 'verified' && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Codex Verified
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-gray-600">{selectedProfile.firstName} {selectedProfile.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedProfile.email}
                      </p>
                    </div>
                    {selectedProfile.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedProfile.phone}
                        </p>
                      </div>
                    )}
                    {selectedProfile.location && (
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedProfile.location}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Role:</span>
                      <p className="text-gray-600 capitalize">{selectedProfile.role}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProfile.linkedinUrl && (
                      <div>
                        <span className="font-medium">LinkedIn:</span>
                        <p className="text-blue-600 hover:underline">
                          <a 
                            href={selectedProfile.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Linkedin className="w-4 h-4" />
                            View LinkedIn Profile
                          </a>
                        </p>
                      </div>
                    )}
                    {selectedProfile.githubUrl && (
                      <div>
                        <span className="font-medium">GitHub:</span>
                        <p className="text-blue-600 hover:underline">
                          <a 
                            href={selectedProfile.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Github className="w-4 h-4" />
                            View GitHub Profile
                          </a>
                        </p>
                      </div>
                    )}
                    {selectedProfile.portfolioUrl && (
                      <div>
                        <span className="font-medium">Portfolio:</span>
                        <p className="text-blue-600 hover:underline">
                          <a 
                            href={selectedProfile.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Globe className="w-4 h-4" />
                            View Portfolio
                          </a>
                        </p>
                      </div>
                    )}
                    {!selectedProfile.linkedinUrl && !selectedProfile.githubUrl && !selectedProfile.portfolioUrl && (
                      <p className="text-gray-500 italic">No professional links provided</p>
                    )}
                  </CardContent>
                </Card>

                {/* Bio and Experience */}
                {(selectedProfile.bio || selectedProfile.experience) && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Professional Background</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProfile.bio && (
                        <div>
                          <span className="font-medium">Bio:</span>
                          <p className="text-gray-600 mt-1">{selectedProfile.bio}</p>
                        </div>
                      )}
                      {selectedProfile.experience && (
                        <div>
                          <span className="font-medium">Experience:</span>
                          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{selectedProfile.experience}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Skills */}
                {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resumes */}
                {selectedProfile.isRegisteredUser && selectedProfile.resumes && selectedProfile.resumes.length > 0 && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Resumes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProfile.resumes.map((resume) => (
                          <div key={resume.resumeId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{resume.fileName}</span>
                                  {resume.isDefault && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                                <span className="text-sm text-gray-600">
                                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Use the existing download logic
                                const applicant = filteredApplicants.find(a => a.email === selectedProfile.email);
                                if (applicant) {
                                  handleDownloadResume(applicant);
                                }
                              }}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Failed to load profile data</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}