'use client';

import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function LeaderboardPage() {
  const router = useRouter();
  
  const topThreePlayers = [
    { rank: 2, name: "Name", score: "1000" },
    { rank: 1, name: "Name", score: "1000" },
    { rank: 3, name: "Name", score: "1000" }
  ];

  const rankedPlayers = [
    { rank: 4, name: "Name", score: "1000" },
    { rank: 5, name: "Name", score: "1000" },
    { rank: 6, name: "Name", score: "1000" },
    { rank: 7, name: "Name", score: "1000" },
    { rank: 8, name: "Name", score: "1000" },
    { rank: 9, name: "Name", score: "1000" },
    { rank: 10, name: "Name", score: "1000" },
    { rank: 11, name: "Name", score: "1000" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Page Title */}
      <div className="px-4 mb-6">
        <h1 className="text-white font-bold text-2xl">Leaderboards</h1>
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
                {topThreePlayers[0].name}
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
                {topThreePlayers[0].score}
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
                {topThreePlayers[1].name}
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
                {topThreePlayers[1].score}
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
                {topThreePlayers[2].name}
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
                {topThreePlayers[2].score}
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
              key={index}
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
                  #{player.rank}
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
                {player.score}
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
