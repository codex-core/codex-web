"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePasswordless } from "@/lib/cognito-react";
import { 
  User,
  Upload,
  FileText,
  Plus,
  X,
  Save,
  Edit,
  Download
} from "lucide-react";

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
  resumes?: Resume[];
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

export default function ProfilePage() {
  const { tokensParsed } = usePasswordless();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = tokensParsed?.idToken.email;
        if (!email) return;

        // First, get user profile by email to get userId
        const userCheckResponse = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
        if (!userCheckResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await userCheckResponse.json();
        if (!userData.exists) {
          console.error("User not found in database");
          return;
        }

        const user = userData.user;

        // Now fetch full profile details
        const profileResponse = await fetch(`/api/users/${user.userId}`);
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile details');
        }

        const profileData = await profileResponse.json();
        const userProfile = profileData.user;

        const fullProfile: UserProfile = {
          userId: userProfile.userId,
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          bio: userProfile.bio,
          skills: userProfile.skills || [],
          experience: userProfile.experience,
          phone: userProfile.phone,
          location: userProfile.location,
          linkedinUrl: userProfile.linkedinUrl,
          githubUrl: userProfile.githubUrl,
          portfolioUrl: userProfile.portfolioUrl,
          resumes: userProfile.resumes || [],
        };

        setProfile(fullProfile);

        // Fetch resumes - they're included in the profile response now
        setResumes(fullProfile.resumes || []);

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tokensParsed) {
      fetchProfile();
    }
  }, [tokensParsed]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/users/${profile.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
          skills: profile.skills,
          experience: profile.experience,
          phone: profile.phone,
          location: profile.location,
          linkedinUrl: profile.linkedinUrl,
          githubUrl: profile.githubUrl,
          portfolioUrl: profile.portfolioUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const result = await response.json();
      console.log('Profile saved successfully:', result);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // You could add a toast notification here
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    
    const updatedSkills = profile.skills?.filter(skill => skill !== skillToRemove) || [];
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Client-side validation (server will also validate)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadingResume(true);
    setUploadError('');

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isDefault', (resumes.length === 0).toString()); // Set as default if it's the first resume

      // Upload directly to the API
      const uploadResponse = await fetch(`/api/users/${profile.userId}/resumes/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload resume');
      }

      const { resume } = await uploadResponse.json();

      // Update local state
      setResumes(prev => [...prev, resume]);
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!profile) return;

    try {
      const response = await fetch(`/api/users/${profile.userId}/resumes?resumeId=${resumeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      // Update local state
      setResumes(prev => prev.filter(resume => resume.resumeId !== resumeId));
      
    } catch (error) {
      console.error('Error deleting resume:', error);
      // You could add a toast notification here
    }
  };

  const handleSetDefaultResume = async (resumeId: string) => {
    if (!profile) return;

    try {
      const response = await fetch(`/api/users/${profile.userId}/resumes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          isDefault: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default resume');
      }

      // Update local state
      setResumes(prev => prev.map(resume => ({
        ...resume,
        isDefault: resume.resumeId === resumeId,
      })));
      
    } catch (error) {
      console.error('Error setting default resume:', error);
      // You could add a toast notification here
    }
  };

  const handleDownloadResume = async (resumeId: string, fileName: string) => {
    if (!profile) return;

    try {
      const response = await fetch(`/api/users/${profile.userId}/resumes/${resumeId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const { downloadUrl } = await response.json();
      
      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile Management</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location || ""}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="City, State"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ""}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={profile.experience || ""}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your work experience..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills and Links */}
        <div className="space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={profile.githubUrl || ""}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                <Input
                  id="portfolioUrl"
                  value={profile.portfolioUrl || ""}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resume Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={uploadingResume}
              />
              <Button
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={uploadingResume}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
              </Button>
              
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
            </div>
            
            <div className="space-y-3">
              {resumes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No resumes uploaded yet</p>
                  <p className="text-sm">Upload your first resume to get started</p>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.resumeId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{resume.fileName}</span>
                          {resume.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadResume(resume.resumeId, resume.fileName)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {!resume.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefaultResume(resume.resumeId)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteResume(resume.resumeId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}