'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DesktopRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is on desktop
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    
    if (isDesktop) {
      // Redirect desktop users to desktop page with mobile app
      router.push('/desktop');
    } else {
      // Mobile users go to mobile dashboard
      router.push('/mobile-dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  );
};

export default DesktopRedirect;
