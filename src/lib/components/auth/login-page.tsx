"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordless } from "@/lib/cognito-react";
import { useRouter } from "next/navigation";
export default function LoginPageComponent() {
  const {
    signInStatus,
    requestSignInLink,
    signOut,
    tokensParsed,
    lastError,
    busy,
  } = usePasswordless();

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const isLoading = busy || isChecking;

  const handleRequestLink = async () => {
    console.log('Starting handleRequestLink for email:', username);
    setLocalError(null);
    setIsChecking(true);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setLocalError("Please enter a valid email address");
      setIsChecking(false);
      return;
    }

    try {
      console.log('Checking if user exists in database...');
      // Check if user exists in our database
      const response = await fetch(`/api/users/check?email=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error('Failed to check user existence');
      }
      
      const data = await response.json();
      console.log('User query result:', data);

      if (!data?.exists) {
        console.log('User not found, redirecting to signup');
        // User doesn't exist, redirect to sign-up with email pre-filled
        const signupUrl = new URL('/signup', window.location.origin);
        signupUrl.searchParams.set('email', username);
        router.push(signupUrl.toString());
        return;
      }

      console.log('User found, sending magic link...');
      // User exists, proceed with magic link
      await requestSignInLink({ username, redirectUri: `${window.location.origin}/magic` });
      setLinkSent(true);
      console.log('Magic link sent successfully');
    } catch (err: any) {
      console.error('Login error:', err);
      setLocalError(err?.message || "Failed to send sign-in link");
    } finally {
      setIsChecking(false);
    }
  };

  if (signInStatus === "SIGNED_IN" && tokensParsed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left: Welcome copy */}
        <div className="max-w-xl w-full mb-12 lg:mb-0">
          <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-400">Welcome Back!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You are signed in as <span className="font-medium">{tokensParsed.idToken.email || tokensParsed.idToken.phone_number}</span>.<br />
            Ready to access exclusive projects and resources for consultants.
          </p>
          <Button onClick={signOut}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* Left: Login page copy */}
      <div className="max-w-xl w-full mb-12 lg:mb-0">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-400">Consultant Login</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sign in to access your dashboard, manage projects, and connect with top companies. Enjoy secure, passwordless access with a magic link sent to your email.
        </p>
        <ul className="space-y-4 text-base text-muted-foreground">
          <li>✔️ Passwordless sign-in for security and convenience</li>
          <li>✔️ Access exclusive consulting opportunities</li>
          <li>✔️ Manage your profile and applications</li>
        </ul>
      </div>
      {/* Right: Login form */}
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Passwordless Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {linkSent ? (
              <div className="text-green-700 text-sm">
                A sign-in link has been sent to <span className="font-medium">{username}</span>.<br />
                Please check your email or SMS and follow the link to sign in.
              </div>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleRequestLink} disabled={!username || isLoading} className="w-full">
                  {isLoading ? "Checking..." : "Send Sign-In Link"}
                </Button>
              </>
            )}
            {(localError || lastError) && (
              <div className="text-red-600 text-sm">
                {localError || lastError?.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
