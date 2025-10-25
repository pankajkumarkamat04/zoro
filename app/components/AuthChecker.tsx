'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { checkAuthStart, checkAuthSuccess, checkAuthFailure } from '@/lib/store/authSlice';

interface AuthCheckerProps {
  children: React.ReactNode;
}

export default function AuthChecker({ children }: AuthCheckerProps) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Only check auth if we have a token but haven't verified it yet
      if (token && !isAuthenticated) {
        dispatch(checkAuthStart());

        try {
          const response = await fetch('https://api.leafstore.in/api/v1/user/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(checkAuthSuccess(userData));
          } else {
            // Token is invalid or expired
            dispatch(checkAuthFailure('Authentication failed. Please login again.'));
          }
        } catch (error) {
          dispatch(checkAuthFailure('Network error. Please check your connection.'));
        }
      }
    };

    checkAuthentication();
  }, [token, isAuthenticated, dispatch]);

  // Show loading spinner while checking authentication
  if (token && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Render children (the protected content)
  return <>{children}</>;
}
