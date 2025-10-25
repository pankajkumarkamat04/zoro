'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { GiShoppingBag } from 'react-icons/gi';
import { MdBarChart } from 'react-icons/md';
import { BsFillSendFill } from 'react-icons/bs';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { logout } from '@/lib/store/authSlice';
import BottomNavigation from './BottomNavigation';
import SideMenu from './SideMenu';

interface DashboardPageProps {
  onNavigate?: (screen: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(!isAuthenticated);
  const [dashboardData, setDashboardData] = useState<{
    walletBalance: number;
    orders: {
      total: number;
      completedCount: number;
      successAmount: number;
    };
    transactions: {
      total: number;
      successfulCount: number;
      successAmount: number;
    };
  } | null>(null);
  const [games, setGames] = useState<Array<{
    _id: string;
    name: string;
    image: string;
    productId: string;
    publisher: string;
    validationFields: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    ogcode?: string;
  }>>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (isAuthenticated && token) {
      fetchDashboardData();
      fetchGames();
    } else if (!isAuthenticated) {
      // If not authenticated, redirect to login
      if (onNavigate) {
        onNavigate('login');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, token]);

  // Update loading state when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      if (!token) {
        if (onNavigate) {
          onNavigate('login');
        } else {
          router.push('/login');
        }
        return;
      }

      const response = await fetch('https://api.leafstore.in/api/v1/user/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setDashboardData(responseData.data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    // Remove setIsLoading(false) from here - loading state is managed by auth state
  };

  const fetchGames = async () => {
    try {
      setGamesLoading(true);
      const response = await fetch('https://api.leafstore.in/api/v1/games/get-all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.games) {
          setGames(responseData.games);
        }
      } else {
        console.error('Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setGamesLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    if (onNavigate) {
      onNavigate('login');
    } else {
      router.push('/login');
    }
  };

  const actionIcons = [
    { icon: '➕', label: 'Add coins' },
    { icon: '🛍️', label: 'Orders' },
    { icon: '📊', label: 'Leaderboard' },
    { icon: '✈️', label: 'Contact US' }
  ];

  // Only show loading screen if user is not authenticated yet
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section & Welcome Section */}
      <div className="px-4 relative">
        {/* Top Color Effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 z-0"
          style={{ 
            background: 'linear-gradient(180deg, rgba(127, 140, 170, 0.3) 0%, transparent 100%)'
          }}
        />
        
         {/* Top Navigation */}
         <div className="flex items-center justify-between mb-6 relative z-10">
           {/* Menu Icon */}
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-6 h-6 flex flex-col justify-center"
           >
             <div className="w-full h-0.5 bg-white mb-1"></div>
             <div className="w-full h-0.5 bg-white mb-1"></div>
             <div className="w-full h-0.5 bg-white"></div>
           </button>

           {/* Logo - Center */}
           <div className="flex items-center justify-center" style={{ marginLeft: '92px' }}>
             <Image
               src="/logo.png"
               alt="Logo"
               width={80}
               height={80}
               className="mx-auto"
               style={{ color: 'transparent' }}
             />
           </div>

          {/* User Profile & Balance */}
          <div className="flex items-center space-x-2">
              <div 
                className="flex items-center rounded-full px-3 py-1 cursor-pointer"
                style={{
                  background: '#232426',
                  fontSize: '14px',
                  border: '1px solid #7F8CAA'
                }}
                onClick={() => onNavigate ? onNavigate('addcoin') : router.push('/addcoin')}
              >
                <Image
                  src="/coin.png"
                  alt="Coin"
                  width={26}
                  height={16}
                  className="mr-1"
                  style={{ color: 'transparent' }}
                />
                <span className="font-bold">{isLoading ? '...' : (dashboardData?.walletBalance || 0)}</span>
                <span className="font-bold ml-1">+</span>
              </div>
            <div 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
              onClick={() => onNavigate ? onNavigate('profile') : router.push('/profile')}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#232426' }}>
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
           </div>
         </div>

        {/* Welcome Content */}
        <div className="relative z-10">
          <h1 className="text-white font-bold" style={{ fontSize: '32px' }}>
            Welcome,
          </h1>
          <h1 className="text-gray-300 font-bold mb-4" style={{ fontSize: '32px' }}>
            {isLoading ? 'Loading...' : (user?.name || 'User')}
          </h1>
          <button className="py-2 px-4 rounded-xl text-white font-bold text-sm mb-4 relative z-10" style={{ backgroundColor: '#7F8CAA' }}>
            JOIN WHATSAPP CHANNEL
          </button>
          
          {/* Character Image */}
          <div className="absolute top-0 opacity-60 z-0" style={{ right: '-200px' }}>
            <Image
              src="/hero.png"
              alt="Character"
              width={500}
              height={400}
              className="object-cover rounded-lg"
              style={{ 
                filter: 'grayscale(100%)',
                color: 'transparent',
                overflow: 'hidden'
              }}
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center mt-8 mb-8 relative z-20">
        <p className="text-white text-sm">your best top-up destination</p>
      </div>

      {/* Action Icons */}
      <div 
        className="flex justify-center space-x-8 py-6" 
        style={{ 
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#1E1E1E'
        }}
      >
        {/* Add Coins */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onNavigate ? onNavigate('addcoin') : router.push('/addcoin')}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2"
            style={{
              backgroundColor: 'rgb(30, 30, 30)',
              borderColor: 'rgb(35, 36, 38)',
              boxShadow: 'rgb(127, 140, 177) 0px 8px 12px'
            }}
          >
            <FaPlus className="text-2xl" style={{ color: '#7F8CAA' }} />
          </div>
          <span className="text-white text-xs text-center">Add coins</span>
        </div>

        {/* Orders */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onNavigate ? onNavigate('orders') : router.push('/orders')}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2"
            style={{
              backgroundColor: 'rgb(30, 30, 30)',
              borderColor: 'rgb(35, 36, 38)',
              boxShadow: 'rgb(127, 140, 177) 0px 8px 12px'
            }}
          >
            <GiShoppingBag className="text-2xl" style={{ color: '#7F8CAA' }} />
          </div>
          <span className="text-white text-xs text-center">Orders</span>
        </div>

        {/* Leaderboard */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onNavigate ? onNavigate('leaderboard') : router.push('/leaderboard')}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2"
            style={{
              backgroundColor: 'rgb(30, 30, 30)',
              borderColor: 'rgb(35, 36, 38)',
              boxShadow: 'rgb(127, 140, 177) 0px 8px 12px'
            }}
          >
            <MdBarChart className="text-2xl" style={{ color: '#7F8CAA' }} />
          </div>
          <span className="text-white text-xs text-center">Leaderboard</span>
        </div>

        {/* Contact US */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onNavigate ? onNavigate('contact') : router.push('/contact')}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2"
            style={{
              backgroundColor: 'rgb(30, 30, 30)',
              borderColor: 'rgb(35, 36, 38)',
              boxShadow: 'rgb(127, 140, 177) 0px 8px 12px'
            }}
          >
            <BsFillSendFill className="text-2xl" style={{ color: '#7F8CAA' }} />
          </div>
          <span className="text-white text-xs text-center">Contact US</span>
        </div>
      </div>

      {/* Trending Games Section */}
      <div className="px-4 py-2 mb-8 relative">
        {/* Games Grid Color Effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 z-0"
          style={{ 
            background: 'linear-gradient(rgba(127, 140, 170, 0.3) 0%, transparent 100%)'
          }}
        />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h2 className="text-white font-bold text-lg">Trending Games</h2>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-sm">GET MORE</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {gamesLoading ? (
            // Loading skeleton for games
            Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center"
                style={{ height: '170px' }}
              >
                <div 
                  className="pt-10 animate-pulse"
                  style={{ 
                    background: 'linear-gradient(90deg, rgb(127, 140, 170) 0%, rgb(51, 56, 68) 100%)',
                    borderRadius: '22px',
                    height: '130px',
                    width: '130px'
                  }}
                >
                  <div className="relative mb-6">
                    <div 
                      className="w-20 h-20 bg-gray-400 rounded-lg mx-auto"
                      style={{ margin: '-68px auto auto' }}
                    ></div>
                  </div>
                  <div 
                    className="text-left py-2 px-3 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(90deg, rgb(54, 59, 72) 0%, rgb(51, 56, 68) 100%)',
                      borderRadius: '22px'
                    }}
                  >
                    <div className="h-3 bg-gray-400 rounded mb-1"></div>
                    <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            games.slice(0, 6).map((game, index) => (
            <div 
              key={game._id} 
              className="flex items-center justify-center cursor-pointer"
              style={{ 
                height: '170px'
              }}
              onClick={() => onNavigate ? onNavigate(`topup/${game._id}`) : router.push(`/topup/${game._id}`)}
            >
              <div 
                className="pt-10"
                style={{ 
                  background: 'linear-gradient(90deg, rgb(127, 140, 170) 0%, rgb(51, 56, 68) 100%)',
                  borderRadius: '22px',
                  height: '130px',
                  width: '130px'
                }}
              >
                <div className="relative mb-6">
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={80}
                    height={80}
                    className="w-full h-20 object-cover rounded-lg"
                    style={{
                      color: 'transparent',
                      width: '80px',
                      margin: '-68px auto auto',
                      border: '1px solid white',
                      borderRadius: '22px'
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                    NEXT
                  </div>
                </div>
                <div 
                  className="text-left py-2 px-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(90deg, rgb(54, 59, 72) 0%, rgb(51, 56, 68) 100%)',
                    borderRadius: '22px'
                  }}
                >
                  <h3 className="text-white font-medium mb-1" style={{ fontSize: '12px' }}>{game.name}</h3>
                  <p className="text-gray-300" style={{ fontSize: '10px' }}>{game.publisher}</p>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom spacing for navigation */}
      <div className="h-15"></div>

      {/* Side Menu */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>

  );
}
