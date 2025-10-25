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

const DesktopApp: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <DashboardPage />;
      case 'orders':
        return <OrderHistoryPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfileDashboardPage />;
      default:
        return <DashboardPage />;
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
    <div className="min-h-screen" style={{ backgroundColor: '#232426' }}>
      {/* Desktop App Container */}
      <div className="max-w-md mx-auto min-h-screen relative" style={{ backgroundColor: '#232426' }}>
        {/* Mobile-like Frame */}
        <div className="relative">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="text-white text-xs font-semibold">Topup Mall</div>
            <div className="flex items-center space-x-1">
              <div className="text-white text-xs">100%</div>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-full h-full bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="bg-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#FF6B35' }}>
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-white text-lg font-bold">Topup Mall</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push('/desktop')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main App Content */}
          <div className="relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
            {renderScreen()}
          </div>

          {/* Desktop Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-800 border-t border-gray-700">
            <div className="flex justify-around py-2">
              <button
                onClick={() => setCurrentScreen('home')}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  currentScreen === 'home' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-xs font-medium">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('orders')}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  currentScreen === 'orders' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Orders</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('leaderboard')}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  currentScreen === 'leaderboard' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Leaderboard</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  currentScreen === 'profile' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </div>
          </div>

          {/* Desktop Instructions */}
          <div className="fixed top-4 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-3 max-w-xs">
            <h3 className="text-white text-sm font-semibold mb-2">Desktop App</h3>
            <p className="text-gray-300 text-xs mb-2">
              This is your mobile app optimized for desktop use. Navigate using the bottom menu or click the hamburger menu for more options.
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => router.push('/desktop')}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors"
              >
                Landing Page
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors"
              >
                Full Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopApp;
