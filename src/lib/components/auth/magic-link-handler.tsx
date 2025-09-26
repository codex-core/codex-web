"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderIcon, CheckCircle, XCircle } from "lucide-react";
import { usePasswordless } from "@/lib/cognito-react";

export default function MagicLinkHandler() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signInStatus, tokensParsed, signingInStatus } = usePasswordless();

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        // The passwordless library automatically handles magic links in the URL
        // We just need to wait for the authentication to complete
        console.log('Magic link handler initializing...');
        console.log('Current sign in status:', signInStatus);
        console.log('Tokens parsed:', tokensParsed);

        // Check if we're already signed in
        if (signInStatus === 'SIGNED_IN' && tokensParsed) {
          console.log('Already signed in, redirecting to dashboard');
          setStatus('success');
          setTimeout(() => {
            router.push('/');
          }, 1500);
          return;
        }

        // If there's a fragment in the URL, the passwordless library should handle it automatically
        const fragment = window.location.hash.substring(1);
        if (fragment) {
          console.log('Magic link fragment detected:', fragment);
          // The passwordless library will process this automatically
          // We just need to wait for the authentication state to change
        } else {
          setError('No authentication token found in URL');
          setStatus('error');
        }

      } catch (err: any) {
        console.error('Magic link authentication error:', err);
        setError(err?.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleMagicLink();
  }, [router, signInStatus, tokensParsed, signingInStatus]);

  // Monitor sign-in status changes
  useEffect(() => {
    console.log('Sign-in status changed:', signInStatus);
    console.log('Signing-in status changed:', signingInStatus);
    
    if (signInStatus === 'SIGNED_IN' && tokensParsed && status === 'processing') {
      console.log('Authentication successful!');
      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else if (signingInStatus === 'INVALID_SIGNIN_LINK') {
      setError('The sign-in link is invalid or has expired');
      setStatus('error');
    } else if (signingInStatus === 'SIGNIN_LINK_EXPIRED') {
      setError('The sign-in link has expired');
      setStatus('error');
    }
  }, [signInStatus, signingInStatus, tokensParsed, router, status]);

  // If already signed in, redirect immediately
  useEffect(() => {
    if (signInStatus === 'SIGNED_IN' && tokensParsed) {
      router.push('/');
    }
  }, [signInStatus, tokensParsed, router]);

  const handleRetrySignIn = () => {
    router.push('/login');
  };

  const handleGoToDashboard = () => {
    router.push('/host/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'processing' && (
              <>
                <LoaderIcon className="h-5 w-5 animate-spin" />
                Signing you in...
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Welcome back!
              </>
            )}
            {status === 'error' && (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                Sign in failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'processing' && (
            <div className="text-center text-muted-foreground">
              Please wait while we authenticate your magic link...
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-center text-green-700">
                You've been successfully signed in! Redirecting to your dashboard...
              </div>
              {tokensParsed && (
                <div className="text-center text-sm text-muted-foreground">
                  Signed in as {tokensParsed.idToken.email || tokensParsed.idToken.phone_number}
                </div>
              )}
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-center text-red-600 text-sm">
                {error}
              </div>
              <div className="space-y-2">
                <Button onClick={handleRetrySignIn} className="w-full" variant="outline">
                  Try signing in again
                </Button>
                <Button onClick={() => router.push('/')} className="w-full" variant="ghost">
                  Return to home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
