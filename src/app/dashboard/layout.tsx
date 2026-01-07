"use client";

import { usePasswordless } from "@/lib/cognito-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { 
  User, 
  FileText, 
  Settings, 
  LogOut,
  Home,
  Building2,
  Shield,
  Users,
  BarChart3
} from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signInStatus, tokensParsed, signOut, busy } = usePasswordless();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('DashboardLayout', busy, signInStatus, tokensParsed);
    if (!busy && signInStatus !== "CHECKING") {
      // timeout for 3 seconds before continuing

      if (signInStatus !== "SIGNED_IN" || !tokensParsed) {
        router.push("/login");
        return;
      }

      // Fetch user profile to check role
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
          
          // Check if user has consultant or admin role
          if (user.role !== 'consultant' && user.role !== 'admin') {
            // Redirect non-consultants/admins
            router.push("/");
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
          <p className="text-muted-foreground">Loading dashboard...</p>
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {userProfile.firstName} {userProfile.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {userProfile.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {userProfile.role === 'admin' && (
                  // Admin Navigation
                  <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/admin")}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                )}
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard/applications")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      My Applications
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/jobs")}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </>
                
                <div className="pt-4 border-t">
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}