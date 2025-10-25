'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

interface LeaderboardPlayer {
  _id: string;
  totalPurchaseAmount: number;
  purchaseCount: number;
  name: string;
  email: string;
  avatar?: string | null;
}

interface LeaderboardData {
  currentMonth: {
    month: string;
    leaderboard: LeaderboardPlayer[];
  };
  lastMonth: {
    month: string;
    leaderboard: LeaderboardPlayer[];
  };
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch('https://api.leafstore.in/api/v1/user/leaderboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Get top 3 players from current month leaderboard
  const topThreePlayers = leaderboardData?.currentMonth?.leaderboard?.slice(0, 3) || [];
  
  // Get remaining players (ranks 4-11) from current month leaderboard
  const rankedPlayers = leaderboardData?.currentMonth?.leaderboard?.slice(3, 11) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Page Title */}
      <div className="px-4 mb-6">
        <h1 className="text-white font-bold text-2xl">Leaderboards</h1>
        {leaderboardData?.currentMonth?.month && (
          <p className="text-gray-400 text-sm mt-2">{leaderboardData.currentMonth.month}</p>
        )}
      </div>

      {/* Top 3 Players */}
      <div className="px-4 mb-8">
        <div className="flex justify-center items-end space-x-4">
          {/* Rank #2 */}
          <div className="flex flex-col items-center">
            <div
              className="text-white font-medium mb-2"
              style={{ fontSize: '20px' }}
            >
              #2
            </div>
            <div className="relative mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                style={{
                  border: '4px solid rgb(127, 140, 170)',
                  background: 'rgb(217, 217, 217)'
                }}
              >
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div
                className="text-white mb-2"
                style={{
                  fontSize: '16px',
                  textAlign: 'center'
                }}
              >
                {topThreePlayers[0]?.name || 'Loading...'}
              </div>
              <div
                className="px-3 py-1 rounded-3xl text-white text-sm mb-2 relative z-10"
                style={{
                  backgroundColor: '#232426',
                  marginBottom: '-5px',
                  border: '2px solid #7F8CAA',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                ₹{topThreePlayers[0]?.totalPurchaseAmount?.toLocaleString() || '0'}
              </div>
              <div
                className="mx-auto relative z-0"
                style={{
                  height: '60px',
                  background: 'linear-gradient(180deg, #7F8CAA -6.07%, #232426 100%)',
                  width: '40px',
                  marginTop: '-5px'
                }}
              ></div>
            </div>
          </div>

          {/* Rank #1 */}
          <div className="flex flex-col items-center">
            <div
              className="text-white font-medium mb-2"
              style={{ fontSize: '20px', color: '#7F8CAA' }}
            >
              #1
            </div>
            <div className="relative mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                style={{
                  border: '4px solid rgb(127, 140, 170)',
                  background: 'rgb(217, 217, 217)'
                }}
              >
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div
                className="text-white mb-2"
                style={{
                  fontSize: '16px',
                  textAlign: 'center'
                }}
              >
                {topThreePlayers[1]?.name || 'Loading...'}
              </div>
              <div
                className="px-3 py-1 rounded-3xl text-white text-sm mb-2 relative z-10"
                style={{
                  backgroundColor: '#232426',
                  marginBottom: '-5px',
                  border: '2px solid #7F8CAA',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                ₹{topThreePlayers[1]?.totalPurchaseAmount?.toLocaleString() || '0'}
              </div>
              <div
                className="mx-auto relative z-0"
                style={{
                  height: '80px',
                  background: 'linear-gradient(180deg, #7F8CAA -6.07%, #232426 100%)',
                  width: '40px',
                  marginTop: '-5px'
                }}
              ></div>
            </div>
          </div>

          {/* Rank #3 */}
          <div className="flex flex-col items-center">
            <div
              className="text-white font-medium mb-2"
              style={{ fontSize: '20px' }}
            >
              #3
            </div>
            <div className="relative mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                style={{
                  border: '4px solid rgb(127, 140, 170)',
                  background: 'rgb(217, 217, 217)'
                }}
              >
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div
                className="text-white mb-2"
                style={{
                  fontSize: '16px',
                  textAlign: 'center'
                }}
              >
                {topThreePlayers[2]?.name || 'Loading...'}
              </div>
              <div
                className="px-3 py-1 rounded-3xl text-white text-sm mb-2 relative z-10"
                style={{
                  backgroundColor: '#232426',
                  marginBottom: '-5px',
                  border: '2px solid #7F8CAA',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                ₹{topThreePlayers[2]?.totalPurchaseAmount?.toLocaleString() || '0'}
              </div>
              <div
                className="mx-auto relative z-0"
                style={{
                  height: '40px',
                  background: 'linear-gradient(180deg, #7F8CAA -6.07%, #232426 100%)',
                  width: '40px',
                  marginTop: '-5px'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked List */}
      <div className="px-4 mb-8">
        <div className="space-y-3">
          {rankedPlayers.map((player, index) => (
            <div
              key={player._id}
              className="flex items-center justify-between p-3 rounded-3xl cursor-pointer"
              style={{
                background: '#7F8CAA',
                boxShadow: '0px 4px 4px 0px #00000040'
              }}
              onClick={() => router.push('/profile')}
            >
              <div className="flex items-center">
                <span
                  className="text-white text-sm font-medium mr-2"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}
                >
                  #{index + 4}
                </span>
                <span className="text-white text-sm mr-2">|</span>
                <span
                  className="text-white text-sm"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}
                >
                  {player.name}
                </span>
              </div>
              <div
                className="px-5 py-1 rounded-2xl text-white text-sm"
                style={{
                  backgroundColor: '#232426',
                  border: '1px solid #7F8CAA',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                ₹{player.totalPurchaseAmount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
