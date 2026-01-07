"use client";

import { useState, useEffect } from 'react';
import { usePasswordless } from '@/lib/cognito-react';

interface User {
  userId: string;
  email: string;
  role?: string;
  // Add other user properties as needed
}

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { tokens, signingInStatus, signInStatus} = usePasswordless();
  
  const isAuthenticated = (
    signingInStatus === 'SIGNED_IN_WITH_LINK' || 
    signingInStatus === 'SIGNED_IN_WITH_FIDO2' || 
    signingInStatus === 'SIGNED_IN_WITH_PASSWORD' || 
    signingInStatus === 'SIGNED_IN_WITH_OTP'
  ) && !!tokens?.idToken;

  useEffect(() => {

    if (!isAuthenticated && signInStatus !== 'CHECKING') {
      setUser(null);
      setLoading(false);
      return;
    }

    // Extract user info from tokens if available
    if (tokens?.idToken) {
      try {
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
        setUser({
          userId: payload.sub,
          email: payload.email,
          role: payload['custom:role'] || 'user', // Default role
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    }
    
    setLoading(false);
  }, [isAuthenticated, tokens, signingInStatus]);

  const hasRole = (requiredRole: string): boolean => {
    if (!user?.role) return false;
    
    // Simple role checking - you can make this more sophisticated
    const userRole = user.role.toLowerCase();
    const required = requiredRole.toLowerCase();
    
    // Admin has access to everything
    if (userRole === 'admin') return true;
    
    // Exact role match
    if (userRole === required) return true;
    
    // You can add more complex role hierarchy here
    return false;
  };

  return {
    user,
    loading,
    hasRole,
    isAuthenticated,
  };
}