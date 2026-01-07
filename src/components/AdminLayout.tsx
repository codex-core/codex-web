"use client";

import { usePasswordless } from "@/lib/cognito-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  User, 
  Settings, 
  LogOut,
  BarChart3,
  Briefcase,
  Plus,
  FileText,
  Users,
  Shield,
  ArrowLeft,
  Home
} from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signInStatus, tokensParsed, signOut, busy } = usePasswordless();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminLayout', busy, signInStatus, tokensParsed);
    if (!busy && signInStatus !== "CHECKING") {
      if (signInStatus !== "SIGNED_IN" || !tokensParsed) {
        router.push("/login");
        return;
      }

      // Fetch user profile to check admin role
      const fetchUserProfile = async () => {
        try {
          const email = tokensParsed.idToken.email;
          if (!email) {
            router.push("/login");
            return;
          }
          
          const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          
          const data = await response.json();
          
          if (!data.exists) {
            // User doesn't exist in our database
            router.push("/signup");
            return;
          }

          const user = data.user;
          
          // Check if user has admin role
          if (user.role !== 'admin') {
            // Redirect non-admins to dashboard
            router.push("/dashboard");
            return;
          }

          setUserProfile(user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.push("/login");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [signInStatus, tokensParsed, busy, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || busy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {userProfile.firstName} {userProfile.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium text-red-600">
                      Administrator
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Admin Navigation */}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Consultant Dashboard
                </Button>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    JOB MANAGEMENT
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/admin/jobs")}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    All Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/admin/jobs/create")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                  </Button>
                </div>

                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    COMING SOON
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Applications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push("/jobs")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Public Site
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open("/jobs", "_blank")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Preview Jobs Page
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}