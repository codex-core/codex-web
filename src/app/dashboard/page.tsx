"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePasswordless } from "@/lib/cognito-react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Upload,
  AlertCircle
} from "lucide-react";

interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedAt: string;
  resumeKey?: string;
  jobDescription?: string;
  salary?: string;
}

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  location?: string;
  resumes?: Resume[];
}

interface Resume {
  resumeId: string;
  fileName: string;
  uploadedAt: string;
  s3Key: string;
  isDefault: boolean;
}

export default function DashboardPage() {
  const { tokensParsed } = usePasswordless();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const email = tokensParsed?.idToken.email;
        if (!email) {
          setError("No email found in token");
          return;
        }

        // First, get user profile to get userId
        const userResponse = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await userResponse.json();
        if (!userData.exists) {
          setError("User not found in database");
          return;
        }
        console.log('User data fetched:', userData);
        const user = userData.user;

        // Fetch full profile details to get location and resumes
        const profileResponse = await fetch(`/api/users/${user.userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const fullProfile = {
            ...user,
            location: profileData.user.location,
            resumes: profileData.user.resumes || [],
          };
          setUserProfile(fullProfile);
        } else {
          setUserProfile(user);
        }

        // Now fetch applications for this user
        const applicationsResponse = await fetch(`/api/users/${user.userId}/applications`);
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const applicationsData = await applicationsResponse.json();
        const userApplications = applicationsData.applications || [];
        
        setApplications(userApplications);
        
        // Calculate stats from real data
        const stats: DashboardStats = {
          totalApplications: userApplications.length,
          pendingApplications: userApplications.filter((app: Application) => app.status === 'pending').length,
          acceptedApplications: userApplications.filter((app: Application) => app.status === 'accepted').length,
          rejectedApplications: userApplications.filter((app: Application) => app.status === 'rejected').length,
        };
        
        setStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (tokensParsed) {
      fetchDashboardData();
    }
  }, [tokensParsed]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {userProfile?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Your consultant dashboard - we'll notify you when clients need your expertise
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/profile')}>
          <Upload className="w-4 h-4 mr-2" />
          Update Profile
        </Button>
      </div>

      {/* Profile Completion Alerts */}
      {userProfile && (
        <div className="space-y-4">
          {(!userProfile.location || !userProfile.resumes || userProfile.resumes.length === 0) && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mt-1 mb-3">
                      Help us match you with the right clients by completing your consultant profile.
                    </p>
                    <div className="space-y-2 text-sm">
                      {!userProfile.location && (
                        <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                          <span>Add your location so we can match you with nearby or remote clients</span>
                        </div>
                      )}
                      {(!userProfile.resumes || userProfile.resumes.length === 0) && (
                        <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                          <span>Upload your resume so clients can review your experience and skills</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button 
                        size="sm" 
                        onClick={() => router.push('/dashboard/profile')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Matches</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Total client engagements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Ongoing client conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">
              Current client projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalApplications > 0 
                ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Client engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Client Matches</CardTitle>
            {applications.length > 0 && (
              <Button variant="outline" onClick={() => router.push('/dashboard/applications')}>
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No client matches yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your profile and we'll notify you when clients need your expertise
              </p>
              <Button onClick={() => router.push('/dashboard/profile')}>Complete Profile</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.applicationId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(app.status)}
                    <div>
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                      {app.location && (
                        <p className="text-xs text-muted-foreground">{app.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/projects/${app.jobId}`)}
                    >
                      View Project
                    </Button>
                  </div>
                </div>
              ))}
              {applications.length > 5 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/applications')}
                  >
                    View {applications.length - 5} More Matches
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}