'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function ProfileDashboardPage() {
  const router = useRouter();
  
  const [userData, setUserData] = useState({
    fullName: 'Username',
    email: 'user@gmail.com',
    password: '**********'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    // Handle update logic here
    console.log('User data updated:', userData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Go Back Link */}
      <div className="px-4 mb-4">
        <button 
          className="cursor-pointer"
          style={{
            fontSize: '16px',
            color: '#7F8CAA',
            fontWeight: 700
          }}
          onClick={() => router.back()}
        >
          ← go back
        </button>
      </div>

      {/* Welcome Section */}
      <div className="px-4 mb-6">
        <h1 
          className="text-white font-bold text-2xl"
          style={{ fontSize: '24px' }}
        >
          Welcome <span style={{ color: '#7F8CAA' }}>Username</span>
        </h1>
      </div>

      {/* User Profile Card */}
      <div className="px-4 mb-6">
        <div 
          className="p-6 rounded-2xl"
          style={{ 
            background: 'linear-gradient(180deg, #232426 0%, #454B57 100%)',
            boxShadow: '0px 4px 4px 0px #00000040'
          }}
        >
          {/* User Avatar and Info */}
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                style={{ 
                  backgroundColor: '#232426',
                  borderColor: 'white',
                  boxShadow: '0px 2px 7px 0px white'
                }}
              >
                <span 
                  className="text-white font-bold"
                  style={{ fontSize: '20px' }}
                >
                  U
                </span>
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  style={{ backgroundColor: 'white' }}
                ></div>
              </div>
            </div>
            <div>
              <h3 
                className="text-white font-bold"
                style={{ fontSize: '16px' }}
              >
                Username
              </h3>
              <p className="text-gray-400 text-sm">+91 123456789</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Full name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                className="w-full px-2 py-2 rounded-lg text-gray-400"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-2 py-2 rounded-lg text-gray-400"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full px-2 py-2 rounded-lg text-gray-400"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpdate}
              className="text-white font-bold"
              style={{ 
                backgroundColor: '#232426',
                boxShadow: '0px 4px 4px 0px #00000040',
                padding: '10px 30px',
                borderRadius: '20px',
                fontSize: '16px',
                border: '1px solid #7F8CAA'
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Combined Balance and Actions Card */}
      <div className="px-4 mb-8">
        <div 
          className="p-2 rounded-2xl"
          style={{ 
            backgroundColor: 'rgb(54, 59, 72)',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px'
          }}
        >
          {/* Serene Coins Balance Section */}
          <div 
            className="flex items-center justify-between p-4 rounded-2xl mb-6"
            style={{ 
              background: 'linear-gradient(90deg, rgb(38, 39, 42) 0%, rgb(67, 72, 84) 100%)',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
              border: '1px solid white'
            }}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <Image
                  src="/coin.png"
                  alt="Serene Coins"
                  width={48}
                  height={48}
                  className="rounded-full"
                  style={{ color: 'transparent' }}
                />
              </div>
              <div>
                <p className="text-white text-sm">Serene Coins</p>
                <p 
                  className="text-white font-bold"
                  style={{ fontSize: '16px' }}
                >
                  Available Balance
                </p>
              </div>
            </div>
            <div 
              className="px-3 py-1 rounded-lg text-white text-sm"
              style={{ 
                backgroundColor: 'rgb(54, 59, 72)',
                border: '1px solid white',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              1000 coins
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* Orders Button */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push('/orders')}
            >
              <div 
                className="rounded-2xl flex items-center justify-center mb-2"
                style={{ 
                  background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px',
                  width: '100px',
                  height: '100px'
                }}
              >
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  style={{ height: '50px' }}
                >
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div 
                className="rounded-full"
                style={{ 
                  backgroundColor: 'rgb(44, 44, 44)',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 4px',
                  marginTop: '-20px',
                  border: '1px solid white',
                  height: '25px',
                  width: '70px',
                  textAlign: 'center'
                }}
              >
                <span className="text-white text-sm">Orders</span>
              </div>
            </div>

            {/* Cart Button */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push('/topup')}
            >
              <div 
                className="rounded-2xl flex items-center justify-center mb-2"
                style={{ 
                  background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px',
                  width: '100px',
                  height: '100px'
                }}
              >
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  style={{ height: '50px' }}
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </div>
              <div 
                className="rounded-full"
                style={{ 
                  backgroundColor: 'rgb(44, 44, 44)',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 4px',
                  marginTop: '-20px',
                  border: '1px solid white',
                  height: '25px',
                  width: '70px',
                  textAlign: 'center'
                }}
              >
                <span className="text-white text-sm">Cart</span>
              </div>
            </div>

            {/* Queries Button */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push('/contact')}
            >
              <div 
                className="rounded-2xl flex items-center justify-center mb-2"
                style={{ 
                  background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px',
                  width: '100px',
                  height: '100px'
                }}
              >
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  style={{ height: '50px' }}
                >
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div 
                className="rounded-full"
                style={{ 
                  backgroundColor: 'rgb(44, 44, 44)',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 4px',
                  marginTop: '-20px',
                  border: '1px solid white',
                  height: '25px',
                  width: '70px',
                  textAlign: 'center'
                }}
              >
                <span className="text-white text-sm">Queries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-15"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
