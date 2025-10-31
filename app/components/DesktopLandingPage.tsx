'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks/redux';
import TopSection from './TopSection';
import BottomNavigation from './BottomNavigation';
import DashboardPage from './DashboardPage';
import OrderHistoryPage from './OrderHistoryPage';
import LeaderboardPage from './LeaderboardPage';
import ProfileDashboardPage from './ProfileDashboardPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import TopUpPage from './TopUpPage';
import OTPVerificationPage from './OTPVerificationPage';
import AddCoinPage from './AddCoinPage';
import PaymentMethodsPage from './PaymentMethodsPage';
import ContactUsPage from './ContactUsPage';
import PaymentStatusPage from './PaymentStatusPage';
import NewsPage from './NewsPage';

const DesktopLandingPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileAppScreen, setMobileAppScreen] = useState('login');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Custom navigation function for phone mockup
  const navigateInPhone = (screen: string) => {
    setMobileAppScreen(screen);
  };

  // Mobile App Screen Components - All Pages Available
  const renderMobileAppScreen = () => {
    switch (mobileAppScreen) {
      case 'login':
        return <LoginPage onNavigate={navigateInPhone} />;
      case 'register':
        return <RegisterPage onNavigate={navigateInPhone} />;
      case 'otp-verification':
        return <OTPVerificationPage onNavigate={navigateInPhone} />;
      case 'home':
        return <DashboardPage onNavigate={navigateInPhone} />;
      case 'orders':
        return <OrderHistoryPage onNavigate={navigateInPhone} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={navigateInPhone} />;
      case 'profile':
        return <ProfileDashboardPage onNavigate={navigateInPhone} />;
      case 'topup':
        return <TopUpPage onNavigate={navigateInPhone} />;
      case 'addcoin':
        return <AddCoinPage onNavigate={navigateInPhone} />;
      // case 'checkout':
      //   return <PaymentMethodsPage onNavigate={navigateInPhone} />;
      case 'contact':
        return <ContactUsPage onNavigate={navigateInPhone} />;
      case 'payment-status':
        return <PaymentStatusPage onNavigate={navigateInPhone} />;
      case 'news':
        return <NewsPage onNavigate={navigateInPhone} />;
      default:
        // Default to login if not authenticated, dashboard if authenticated
        return isAuthenticated ? <DashboardPage onNavigate={navigateInPhone} /> : <LoginPage onNavigate={navigateInPhone} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .mobile-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .mobile-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 3px;
        }
        .mobile-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        .mobile-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
      <div className="min-h-screen" style={{ backgroundColor: '#232426' }}>
      {/* Desktop Container */}
      <div className="max-w-7xl mx-auto px-4 h-screen">

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start h-screen">
          {/* Left Side - Marketing Content */}
          <div className="space-y-6 lg:space-y-8 py-8">
             {/* Headline */}
             <div>
               <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                 Secure & affordable Game Top-ups via UPI Payment
               </h2>
               <p className="text-gray-300 text-base md:text-lg mb-4">
                 Your one-stop gateway for gaming greatness. Instant, affordable, and reliable top-ups for your favorite games.
               </p>
               <div className="bg-orange-500 bg-opacity-20 border border-orange-500 rounded-lg p-4">
                 <p className="text-orange-300 text-sm font-semibold">
                   🖥️ Complete Mobile App Available in Browser
                 </p>
               </div>
             </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Mobile Legends</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">PUBG Mobile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Genshin Impact</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Most Affordable</span>
              </div>
            </div>

          </div>

          {/* Right Side - Phone Mockup */}
          <div className="flex justify-center lg:justify-end h-full pt-4">
            <div className="relative h-full">
              {/* Phone Frame */}
              <div 
                className="relative w-80 md:w-96 h-[640px] md:h-[700px] rounded-[3rem] p-2"
                style={{ 
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Phone Screen */}
                <div 
                  className="w-full h-full rounded-[2.5rem] overflow-hidden relative p-2"
                  style={{ backgroundColor: '#232426' }}
                >
                   {/* Mobile App Interface */}
                   <div className="h-full flex flex-col">
                     {/* Dynamic Screen Content */}
                     <div className="flex-1 overflow-y-auto mobile-scrollbar " style={{
                       scrollbarWidth: 'thin',
                       scrollbarColor: '#4B5563 #1F2937'
                     }}>
                       {renderMobileAppScreen()}
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DesktopLandingPage;
