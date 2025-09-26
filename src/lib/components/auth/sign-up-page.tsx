"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordless } from "@/lib/cognito-react";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  
  const [step, setStep] = useState<'signup' | 'confirm' | 'complete'>('signup');
  const [formData, setFormData] = useState({
    email: emailFromUrl || '',
    firstName: '',
    lastName: '',
    confirmationCode: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Update email if URL parameter changes
  useEffect(() => {
    if (emailFromUrl && emailFromUrl !== formData.email) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
    }
  }, [emailFromUrl, formData.email]);

  const { signingInStatus, lastError, stepUpAuthenticationWithSmsOtp, requestSignInLink, signUpUser } = usePasswordless();

  const isLoading = signingInStatus === 'SIGNING_UP' || creatingAccount;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      // Step 1: Create Cognito user
      await signUpUser({
        username: formData.email,
        email: formData.email,
        userAttributes: [
          { name: 'given_name', value: formData.firstName },
          { name: 'family_name', value: formData.lastName },
        ],
      });

      // Step 2: Create user account in DynamoDB via API route
      try {
        setCreatingAccount(true);
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'consultant',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.error || 'Failed to create user account';
          
          if (errorMessage.toLowerCase().includes('already exists') || 
              errorMessage.toLowerCase().includes('duplicate') ||
              errorMessage.toLowerCase().includes('user with that email')) {
            setLocalError('An account with this email already exists. Please try logging in instead.');
            return;
          }
          
          // For other DB errors, continue with magic link
          console.warn('Non-critical database error, continuing with signup:', errorMessage);
        }
      } catch (dbError: any) {
        console.warn('Database user creation failed:', dbError);
        // For other DB errors, continue with magic link
      } finally {
        setCreatingAccount(false);
      }

      // Step 3: Send magic link
      requestSignInLink({
        username: formData.email,
        redirectUri: 'http://localhost:3000/magic'
      });
      
      setStep('complete');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setLocalError(error?.message || 'Sign up failed');
    }
  };


  if (step === 'complete') {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-green-700 text-sm">
            Your account has been created successfully!<br />
            Check your email for a magic link to sign in without a password.
          </div>
        </CardContent>
      </Card>
    );
  }


  // Step: signup
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        {emailFromUrl && (
          <p className="text-sm text-muted-foreground">
            We couldn't find an account with this email. Let's create one for you!
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            disabled={isLoading}
          />
          <Input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={isLoading}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          {(localError || lastError) && (
            <div className="text-red-600 text-sm">
              {localError || lastError?.message}
              {localError?.includes('already exists') && (
                <div className="mt-2">
                  <a 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Go to Login →
                  </a>
                </div>
              )}
            </div>
          )}
        </form>

        {emailFromUrl && !localError?.includes('already exists') && (
          <div className="text-center">
            <a 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Login
            </a>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          After creating your account, you'll receive a magic link to sign in without a password!
        </p>
      </CardContent>
    </Card>
  );
}
