'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { checkAuthStart, checkAuthSuccess, checkAuthFailure } from '@/lib/store/authSlice';
import apiClient from '@/lib/api/axios';

interface AuthCheckerProps {
  children: React.ReactNode;
}

export default function AuthChecker({ children }: AuthCheckerProps) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if we have a token in Redux state or localStorage
      const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
      
      // Only check auth if we have a token but haven't verified it yet
      if (authToken && !isAuthenticated) {
        dispatch(checkAuthStart());

        try {
          const response = await apiClient.get('/user/me');
          const userData = response.data;
          dispatch(checkAuthSuccess(userData));
        } catch (error: any) {
          // Token is invalid or expired
          const errorMessage = error.response?.status === 401 
            ? 'Authentication failed. Please login again.'
            : 'Network error. Please check your connection.';
          dispatch(checkAuthFailure(errorMessage));
        }
      }
    };

    checkAuthentication();
  }, [token, isAuthenticated, dispatch]);

  // Show loading spinner while checking authentication
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
  if (authToken && isLoading) {
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
