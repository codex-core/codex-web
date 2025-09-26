"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: string[];
  fallbackPath?: string;
  fallbackMessage?: string;
}

export default function RoleGuard({ 
  children, 
  requiredRoles, 
  fallbackPath = '/become-a-host',
  fallbackMessage = 'You need additional permissions to access this area.'
}: RoleGuardProps) {
  const router = useRouter();
  const { user, loading, hasRole, isAuthenticated } = useUserRole();

  const hasRequiredRole = requiredRoles.some(role => hasRole(role));

  useEffect(() => {
    // Don't redirect if still loading authentication or user data
    if (loading) return;

    // If definitely not authenticated (after loading is complete), redirect to login
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // If authenticated but doesn't have required role, redirect to fallback
    if (isAuthenticated && !hasRequiredRole) {
      console.log('User authenticated but lacks required role, redirecting to fallback');
      router.push(fallbackPath);
      return;
    }
  }, [isAuthenticated, hasRequiredRole, loading, router, fallbackPath]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin" />
              Checking permissions...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we verify your access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin" />
              Redirecting to login...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show loading if authenticated but doesn't have required role (redirect will happen)
  if (isAuthenticated && !hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {fallbackMessage}
            </p>
            <p className="text-xs text-muted-foreground">
              Required roles: {requiredRoles.join(', ')}
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={fallbackPath}>Get Access</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
