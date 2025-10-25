'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function TopUpPage() {
  const router = useRouter();
  
  const diamondPacks = [
    { diamonds: '100', bonus: '88 + 12(bonus)', price: '$1.99' },
    { diamonds: '200', bonus: '176 + 24(bonus)', price: '$3.99' },
    { diamonds: '500', bonus: '440 + 60(bonus)', price: '$9.99' }
  ];

  const filterButtons = [
    { name: 'Diamonds', icon: '/daimond.png', active: true },
    { name: 'Weekly Pass', icon: '/daimond.png', active: false },
    { name: 'First Recharge Bonus', icon: '/daimond.png', active: false }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Color Effect */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(127, 140, 170, 0.3) 0%, transparent 100%)'
        }}
      />

      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Game Information & Input Card */}
      <div className="px-4 mb-6">
         <div
           className="p-6"
           style={{
             background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
             borderRadius: '22px',
             boxShadow: '0px 4px 4px 0px #00000040'
           }}
         >
          {/* Game Logo and Info */}
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <Image
                src="/game-logo.jpg"
                alt="Mobile Legends"
                width={60}
                height={60}
                className="object-cover rounded-lg"
                style={{
                  width: '60px',
                  height: '60px',
                  border: '1px solid white',
                  borderRadius: '22px',
                  color: 'transparent'
                }}
              />
              <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                NEXT
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Mobile Legends</h3>
              <p className="text-gray-300 text-sm">Moonton</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Enter Your UID</label>
              <input
                type="text"
                placeholder="Enter your UID"
                className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
            <div>
              <label className="text-white text-sm mb-2 block">Enter Your Server ID</label>
              <input
                type="text"
                placeholder="Enter your Server ID"
                className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="py-3 rounded-lg text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: 'rgb(35, 36, 38)',
                  padding: '10px 30px',
                  borderRadius: '20px',
                  border: '1px solid #7F8CAA'
                }}
                onClick={() => router.push('/checkout')}
              >
                Validate
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Select Diamond Pack Section */}
      <div className="px-4 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">Select Diamond Pack</h2>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {filterButtons.map((button, index) => (
            <button
              key={index}
              className="rounded-lg text-sm font-medium flex items-center text-white"
              style={{
                background: 'rgb(35, 36, 38)',
                fontSize: '10px',
                border: '1px solid rgb(127, 140, 170)',
                padding: '8px 16px',
                borderRadius: '25px'
              }}
            >
              <Image
                src={button.icon}
                alt={button.name}
                width={16}
                height={16}
                className="mr-1"
              />
              {button.name}
            </button>
          ))}
        </div>

         {/* Diamond Pack Cards */}
         <div className="grid grid-cols-3 gap-3">
          {diamondPacks.map((pack, index) => (
            <div
              key={index}
              className="cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, rgb(127, 140, 170) 0%, rgb(51, 56, 68) 100%)',
                borderRadius: '22px',
                boxShadow: '0px 4px 4px 0px #00000040'
              }}
              onClick={() => router.push('/checkout')}
            >
              <div className="relative mb-6">
                <Image
                  src="/daimond.png"
                  alt="Diamond Pack"
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded-lg"
                  style={{
                    width: '80px',
                    margin: 'auto',
                    color: 'transparent'
                  }}
                />
              </div>
              <div
                className="text-left py-2 px-3 rounded-lg"
                style={{
                  background: 'linear-gradient(90deg, rgb(54, 59, 72) 0%, rgb(51, 56, 68) 100%)',
                  borderRadius: '22px'
                }}
              >
                <h3 className="text-white mb-1" style={{ 
                  fontFamily: 'Poppins',
                  fontWeight: 800,
                  fontStyle: 'normal',
                  fontSize: '12px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}>{pack.diamonds} Diamonds</h3>
                <p className="text-gray-300" style={{ fontSize: '10px' }}>{pack.bonus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-15"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
