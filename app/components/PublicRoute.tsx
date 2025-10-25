'use client';

import { useAppSelector } from '@/lib/hooks/redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({ 
  children, 
  redirectTo = '/dashboard' 
}: PublicRouteProps) {
  const { isAuthenticated, isLoading, token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is on desktop and redirect to desktop page
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      
      if (isDesktop) {
        router.push('/desktop');
        return;
      }
    }

    // Only redirect if we're not on OTP verification page and user is authenticated
    if (!isLoading && isAuthenticated && pathname !== '/otp-verification') {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname]);

  // Show loading spinner while checking authentication (but not on OTP page)
  if (isLoading && pathname !== '/otp-verification') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting (but not on OTP page)
  if (isAuthenticated && pathname !== '/otp-verification') {
    return null;
  }

  // Render public content
  return <>{children}</>;
}
