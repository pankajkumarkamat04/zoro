'use client';

import { useState, useEffect } from 'react';
import DesktopLandingPage from './components/DesktopLandingPage';
import LoginPage from './components/LoginPage';
import PublicRoute from './components/PublicRoute';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = window.navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setIsLoading(false);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login page directly for mobile users
  if (isMobile) {
    return (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    );
  }

  // Show desktop landing page for desktop users
  return <DesktopLandingPage />;
}