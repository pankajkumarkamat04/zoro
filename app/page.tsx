'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from './components/DashboardPage';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = window.navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setIsLoading(false);
      
      // Only redirect to desktop if NOT on mobile
      if (!isMobileDevice) {
        router.push('/desktop');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show dashboard on mobile, redirect happens on desktop
  if (isMobile) {
    return <DashboardPage />;
  }

  // Desktop redirect in progress
  return null;
}