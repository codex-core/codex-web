import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  FileText, 
  Download,
  Shield,
  CheckCircle
} from "lucide-react";

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

interface ProfileModalProps {
  profile: UserProfileData;
  isOpen: boolean;
  onClose: () => void;
  onDownloadResume: (applicant: Applicant) => void;
  filteredApplicants: Applicant[];
}

export function ProfileModal({ 
  profile, 
  isOpen,
  onClose, 
  onDownloadResume, 
  filteredApplicants 
}: ProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto lg:min-w-[800px] max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            {profile.isRegisteredUser ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Registered User
              </Badge>
            ) : (
              <Badge variant="secondary">
                External Applicant
              </Badge>
            )}
            {profile.identityVerificationStatus === 'verified' && (
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
                  <p className="text-gray-600">{profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </p>
                </div>
                {profile.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Role:</span>
                  <p className="text-gray-600 capitalize">{profile.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Links */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.linkedinUrl && (
                  <div>
                    <span className="font-medium">LinkedIn:</span>
                    <p className="text-blue-600 hover:underline">
                      <a 
                        href={profile.linkedinUrl} 
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
                {profile.githubUrl && (
                  <div>
                    <span className="font-medium">GitHub:</span>
                    <p className="text-blue-600 hover:underline">
                      <a 
                        href={profile.githubUrl} 
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
                {profile.portfolioUrl && (
                  <div>
                    <span className="font-medium">Portfolio:</span>
                    <p className="text-blue-600 hover:underline">
                      <a 
                        href={profile.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 w-4" />
                        View Portfolio
                      </a>
                    </p>
                  </div>
                )}
                {!profile.linkedinUrl && !profile.githubUrl && !profile.portfolioUrl && (
                  <p className="text-gray-500 italic">No professional links provided</p>
                )}
              </CardContent>
            </Card>

            {/* Experience and Bio */}
            {(profile.bio || profile.experience) && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Professional Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.bio && (
                    <div>
                      <span className="font-medium">Bio:</span>
                      <p className="text-gray-600 mt-1">{profile.bio}</p>
                    </div>
                  )}
                  {profile.experience && (
                    <div>
                      <span className="font-medium">Experience:</span>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">{profile.experience}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumes */}
            {profile.isRegisteredUser && profile.resumes && profile.resumes.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resumes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.resumes.map((resume) => (
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
                            const applicant = filteredApplicants.find(a => a.email === profile.email);
                            if (applicant) {
                              onDownloadResume(applicant);
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
      </DialogContent>
    </Dialog>
  );
}