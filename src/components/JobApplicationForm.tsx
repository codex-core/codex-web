'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePasswordless } from '@/lib/cognito-react';
import { Upload, FileText, CheckCircle, AlertCircle, MapPin, Clock, DollarSign, Mail, Calendar, Zap } from 'lucide-react';
import { EnhancedJobRole } from '@/lib/types/enhanced-job';

interface JobApplicationFormProps {
  job: EnhancedJobRole;
  open: boolean;
  onClose: () => void;
  onSubmit: (applicationData: any) => Promise<void>;
}

interface UserProfile {
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

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  linkedinProfile?: string;
  resumeFile: File | null;
  resumeUrl?: string;
}

export default function JobApplicationForm({ job, open, onClose, onSubmit }: JobApplicationFormProps) {
  const { signInStatus, tokensParsed } = usePasswordless();
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    linkedinProfile: '',
    resumeFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [isQuickApply, setIsQuickApply] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Check if user is signed in and load their profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (signInStatus === 'SIGNED_IN' && tokensParsed?.idToken?.email && open) {
        setIsLoadingProfile(true);
        try {
          const email = tokensParsed.idToken.email;
          
          // Fetch user profile
          const profileResponse = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.exists && profileData.user.role === 'consultant') {
              setUserProfile(profileData.user);
              
              // Fetch user resumes using userId from profile data
              if (profileData.user.userId) {
                const resumesResponse = await fetch(`/api/users/${profileData.user.userId}/resumes`);
                if (resumesResponse.ok) {
                  const resumesData = await resumesResponse.json();
                  setUserResumes(resumesData.resumes || []);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadUserProfile();
  }, [signInStatus, tokensParsed, open]);

  // Pre-fill form data when user profile loads
  useEffect(() => {
    if (userProfile && isQuickApply) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        linkedinProfile: userProfile.linkedinUrl || '',
        coverLetter: prev.coverLetter || `Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position at ${job.company}. ${userProfile.bio ? `\n\n${userProfile.bio}` : ''}\n\nI look forward to discussing how my experience can contribute to your team.\n\nBest regards,\n${userProfile.firstName} ${userProfile.lastName}`,
      }));

      // If user has a default resume, use it
      const defaultResume = userResumes.find(resume => resume.isDefault);
      if (defaultResume) {
        // Create a virtual file object for display purposes
        const virtualFile = new File([''], defaultResume.fileName, { type: 'application/pdf' });
        setFormData(prev => ({ 
          ...prev, 
          resumeFile: virtualFile,
          resumeUrl: defaultResume.s3Key 
        }));
        setUploadStatus('success');
      }
    }
  }, [userProfile, userResumes, isQuickApply, job.title, job.company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, resumeFile: file }));
    setUploadError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    try {
      setUploadStatus('uploading');

      // Get presigned URL from our API
      const response = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          applicantEmail: formData.email,
          jobId: job.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { presignedUrl, s3Key } = await response.json();

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unknown error');
        console.error('S3 Upload Error:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorText
        });
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      setUploadStatus('success');
      return s3Key;
    } catch (error) {
      setUploadStatus('error');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resumeFile && !formData.resumeUrl) {
      setUploadError('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let resumeUrl = formData.resumeUrl; // Use existing resume URL if available
      
      // Only upload if we have a new file and no existing URL
      if (formData.resumeFile && !formData.resumeUrl) {
        resumeUrl = await uploadResume(formData.resumeFile);
      }

      // Prepare application data
      const applicationData = {
        jobId: job.id,
        applicantInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          linkedinProfile: formData.linkedinProfile,
        },
        coverLetter: formData.coverLetter,
        resumeUrl,
        appliedAt: new Date().toISOString(),
      };

      // Submit application
      await onSubmit(applicationData);
      
      // Generate a mock application ID for display (in real app, this would come from the API)
      setApplicationId(`APP-${Date.now()}`);
      
      // Show success content
      setIsSubmissionComplete(true);
      
    } catch (error) {
      console.error('Application submission error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApply = () => {
    setIsQuickApply(true);
  };

  const handleManualApply = () => {
    setIsQuickApply(false);
    // Reset form data to empty
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      coverLetter: '',
      linkedinProfile: '',
      resumeFile: null,
    });
    setUploadStatus('idle');
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      coverLetter: '',
      linkedinProfile: '',
      resumeFile: null,
    });
    setIsSubmitting(false);
    setUploadStatus('idle');
    setUploadError('');
    setIsSubmissionComplete(false);
    setApplicationId('');
    setIsQuickApply(false);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const getUploadStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isSubmissionComplete ? 'Application Submitted Successfully! 🎉' : 'Apply for Position'}
          </DialogTitle>
          <DialogDescription asChild>
            {!isSubmissionComplete ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-semibold text-foreground text-lg">{job.title}</div>
                  <div className="text-sm text-muted-foreground">{job.company} • {job.location}</div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                  <Badge variant="outline">{job.experience}</Badge>
                  {job.priority === 'high' && (
                    <Badge className="bg-red-600 text-white">High Priority</Badge>
                  )}
                  {job.featured && (
                    <Badge className="bg-blue-600 text-white">Featured</Badge>
                  )}
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Remote / Hybrid / On-site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary || 'Competitive rates'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Skills Required</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 8).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                
                <p className="text-gray-600">
                  Thank you for your interest in the <strong>{job.title}</strong> position at {job.company}. 
                  We've received your application and will review it shortly.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {!isSubmissionComplete ? (
            <>
              {/* Quick Apply vs Manual Apply Selection */}
              {signInStatus === 'SIGNED_IN' && userProfile && !isQuickApply && !isLoadingProfile && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Quick Apply Available</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          We found your profile information. You can apply instantly with your saved details
                          {userResumes.find(r => r.isDefault) && ' and your default resume'}.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleQuickApply}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Quick Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Profile */}
              {isLoadingProfile && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading your profile...</p>
                </div>
              )}

              {/* Quick Apply Summary */}
              {isQuickApply && userProfile && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">Quick Apply Mode</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Applying as {userProfile.firstName} {userProfile.lastName} ({userProfile.email})
                          {userResumes.find(r => r.isDefault) && (
                            <span> with your default resume: {userResumes.find(r => r.isDefault)?.fileName}</span>
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleManualApply}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Personal Information
                {isQuickApply && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Pre-filled
                  </Badge>
                )}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={isQuickApply ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={isQuickApply ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={isQuickApply ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={isQuickApply ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedinProfile"
                  name="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  className={isQuickApply && formData.linkedinProfile ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Resume *
                {isQuickApply && formData.resumeUrl && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Using Default
                  </Badge>
                )}
              </h3>

              {/* Quick Apply Resume Display */}
              {isQuickApply && formData.resumeUrl && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Using Your Default Resume
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {formData.resumeFile?.name || 'Default Resume'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, resumeFile: null, resumeUrl: undefined }));
                        setUploadStatus('idle');
                      }}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Change Resume
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Label htmlFor="resume" className="text-sm font-medium">Upload Resume (PDF or Word, max 5MB)</Label>
                
                {!formData.resumeFile ? (
                  <div 
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                        : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full transition-all duration-200 ${
                          isDragOver ? 'bg-blue-200 scale-110' : 'bg-blue-100'
                        }`}>
                          <Upload className={`w-8 h-8 transition-all duration-200 ${
                            isDragOver ? 'text-blue-700' : 'text-blue-600'
                          }`} />
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className={`text-lg font-medium transition-colors duration-200 ${
                          isDragOver ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {isDragOver ? 'Drop your resume here!' : (
                            <>
                              Drop your resume here, or{' '}
                              <span className="text-blue-600 hover:text-blue-700 font-semibold">browse</span>
                            </>
                          )}
                        </p>
                      </div>
                      <p className={`text-sm mb-4 transition-colors duration-200 ${
                        isDragOver ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        Supports PDF, DOC, DOCX up to 5MB
                      </p>
                      {!isDragOver && (
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>PDF</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>DOC</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>DOCX</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`border rounded-lg p-4 transition-all duration-200 ${
                    uploadStatus === 'uploading' 
                      ? 'border-blue-200 bg-blue-50' 
                      : uploadStatus === 'success'
                      ? 'border-green-200 bg-green-50'
                      : uploadStatus === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full transition-all duration-200 ${
                          uploadStatus === 'uploading' 
                            ? 'bg-blue-100' 
                            : uploadStatus === 'success'
                            ? 'bg-green-100'
                            : uploadStatus === 'error'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <FileText className={`w-5 h-5 transition-all duration-200 ${
                            uploadStatus === 'uploading' 
                              ? 'text-blue-600' 
                              : uploadStatus === 'success'
                              ? 'text-green-600'
                              : uploadStatus === 'error'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-medium transition-colors duration-200 ${
                            uploadStatus === 'uploading' 
                              ? 'text-blue-900' 
                              : uploadStatus === 'success'
                              ? 'text-green-900'
                              : uploadStatus === 'error'
                              ? 'text-red-900'
                              : 'text-gray-900'
                          }`}>
                            {formData.resumeFile.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm transition-colors duration-200 ${
                              uploadStatus === 'uploading' 
                                ? 'text-blue-700' 
                                : uploadStatus === 'success'
                                ? 'text-green-700'
                                : uploadStatus === 'error'
                                ? 'text-red-700'
                                : 'text-gray-700'
                            }`}>
                              {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {uploadStatus === 'uploading' && (
                              <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                            )}
                            {uploadStatus === 'success' && (
                              <span className="text-xs text-green-600 font-medium">Ready</span>
                            )}
                            {uploadStatus === 'error' && (
                              <span className="text-xs text-red-600 font-medium">Upload failed</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getUploadStatusIcon()}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, resumeFile: null }));
                            setUploadStatus('idle');
                            setUploadError('');
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={uploadStatus === 'uploading'}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {uploadError && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Cover Letter *
                {isQuickApply && formData.coverLetter && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Pre-filled
                  </Badge>
                )}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="coverLetter">
                  Tell us why you're interested in this position and why you'd be a great fit
                </Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the [Job Title] position..."
                  rows={6}
                  required
                  className={isQuickApply && formData.coverLetter ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.coverLetter.length} characters
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || uploadStatus === 'uploading'}
                className={`min-w-[120px] ${isQuickApply ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    {isQuickApply ? 'Quick Applying...' : 'Submitting...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isQuickApply && <Zap className="w-4 h-4" />}
                    {isQuickApply ? 'Quick Apply' : 'Submit Application'}
                  </div>
                )}
              </Button>
            </div>
              </form>
            </>
          ) : (
            /* Success Content */
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Application Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Application Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>Application ID: <span className="font-mono text-gray-900">{applicationId}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Resume: {formData.resumeFile?.name}</span>
                  </div>
                </div>
              </div>
              
              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• Our hiring team will review your application</li>
                  <li>• We'll contact you within 3-5 business days</li>
                  <li>• Keep an eye on your email for updates</li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    onClose();
                    // Reset form
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      coverLetter: '',
                      linkedinProfile: '',
                      resumeFile: null,
                    });
                    setUploadStatus('idle');
                    setUploadError('');
                    setIsSubmissionComplete(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset to form view for another application
                    setIsSubmissionComplete(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      coverLetter: '',
                      linkedinProfile: '',
                      resumeFile: null,
                    });
                    setUploadStatus('idle');
                    setUploadError('');
                  }}
                  className="flex-1"
                >
                  Apply to Another Job
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}