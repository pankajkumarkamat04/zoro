'use client';

import { useAppSelector } from '@/lib/hooks/redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthChecker from './AuthChecker';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !token) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, token, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated && !token) {
    return null;
  }

  // If we have a token but haven't verified authentication yet, use AuthChecker
  if (token && !isAuthenticated) {
    return <AuthChecker>{children}</AuthChecker>;
  }

  // Render protected content
  return <>{children}</>;
}
