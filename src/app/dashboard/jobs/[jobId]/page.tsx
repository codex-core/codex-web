"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  User,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Shield,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

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

interface Resume {
  resumeId: string;
  fileName: string;
  uploadedAt: string;
  s3Key: string;
  isDefault: boolean;
  fileSize?: number;
  fileType?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Profile modal state
  const [selectedProfile, setSelectedProfile] = useState<UserProfileData | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      fetchJobApplicants();
    }
  }, [jobId]);

  useEffect(() => {
    // Filter applicants based on search and status
    const filtered = applicants.filter(applicant => {
      const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
      const matchesSearch = searchTerm === "" ||
        `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    setFilteredApplicants(filtered);
  }, [applicants, statusFilter, searchTerm]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      } else {
        console.error('Failed to fetch job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const fetchJobApplicants = async () => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/applicants`);
      if (response.ok) {
        const data = await response.json();
        setApplicants(data.applicants || []);
      } else {
        console.error('Failed to fetch job applicants');
      }
    } catch (error) {
      console.error('Error fetching job applicants:', error);
    } finally {
      setLoading(false);
    }
  };

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
      Status: applicant.status,
      'Applied Date': new Date(applicant.appliedAt).toLocaleDateString(),
      Location: applicant.location || 'Not specified',
      Experience: applicant.experience || 'Not specified',
      Skills: applicant.skills?.join(', ') || 'Not specified',
      Phone: applicant.phone || 'Not provided',
      LinkedIn: applicant.linkedinUrl || 'Not provided'
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${job?.title}-applicants-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printContent = `
      <html>
        <head>
          <title>${job?.title} - Applicant Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .job-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
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
          <h1>${job?.title} - Applicant Report</h1>
          <div class="job-info">
            <p><strong>Company:</strong> ${job?.company}</p>
            <p><strong>Location:</strong> ${job?.location}</p>
            <p><strong>Job Type:</strong> ${job?.jobType}</p>
            <p><strong>Status:</strong> ${job?.status}</p>
            <p><strong>Total Applicants:</strong> ${filteredApplicants.length}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Location</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              ${filteredApplicants.map(applicant => `
                <tr>
                  <td>${applicant.firstName} ${applicant.lastName}</td>
                  <td>${applicant.email}</td>
                  <td><span class="status status-${applicant.status}">${applicant.status.toUpperCase()}</span></td>
                  <td>${new Date(applicant.appliedAt).toLocaleDateString()}</td>
                  <td>${applicant.location || 'Not specified'}</td>
                  <td>${applicant.experience || 'Not specified'}</td>
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

  const getStatusStats = () => {
    return {
      pending: filteredApplicants.filter(a => a.status === 'pending').length,
      screening: filteredApplicants.filter(a => a.status === 'screening').length,
      interview: filteredApplicants.filter(a => a.status === 'interview').length,
      offer: filteredApplicants.filter(a => a.status === 'offer').length,
      rejected: filteredApplicants.filter(a => a.status === 'rejected').length,
      hired: filteredApplicants.filter(a => a.status === 'hired').length,
    };
  };

  if (loading || !job) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center gap-4">
          <Link href="/admin">
          <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
          </Button>
        </Link>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
              {getJobStatusBadge(job.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportApplicants}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={printReport}>
            <FileText className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Job Description Card */}
      {job.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            {job.skills && job.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredApplicants.length}</div>
            <p className="text-xs text-gray-600">Total Applicants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusStats.pending}</div>
            <p className="text-xs text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statusStats.screening}</div>
            <p className="text-xs text-gray-600">Screening</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{statusStats.interview}</div>
            <p className="text-xs text-gray-600">Interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusStats.offer}</div>
            <p className="text-xs text-gray-600">Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-700">{statusStats.hired}</div>
            <p className="text-xs text-gray-600">Hired</p>
          </CardContent>
        </Card>
      </div>

      {/* Applicants List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle>Applicants ({filteredApplicants.length})</CardTitle>
          </div>

          {/* Filters */}
          <div className="space-y-3 mt-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Status filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.applicationId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0"
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

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                    <span className="truncate">{applicant.email}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                    </span>
                    {applicant.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {applicant.location}
                      </span>
                    )}
                  </div>

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

                <div className="flex gap-2">
                  {applicant.resumeKey && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadResume(applicant)}
                      title="Download Resume"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(applicant)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}

            {filteredApplicants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applicants found for this job.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal - Same as AdminDashboard */}
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