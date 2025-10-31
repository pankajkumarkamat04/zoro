'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

interface TopUpPageProps {
  onNavigate?: (screen: string) => void;
}

export default function TopUpPage({ onNavigate }: TopUpPageProps = {}) {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;
  
  const [gameData, setGameData] = useState<{
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
  } | null>(null);
  
  const [diamondPacks, setDiamondPacks] = useState<Array<{
    _id: string;
    game: string;
    amount: number;
    commission: number;
    cashback: number;
    logo: string;
    description: string;
    status: string;
    category: string;
  }>>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    playerId: '',
    serverId: ''
  });
  const [validatedInfo, setValidatedInfo] = useState<{
    nickname: string;
    server: string;
  } | null>(null);
  
  useEffect(() => {
    if (gameId) {
      fetchDiamondPacks();
    }
  }, [gameId]);
  
  const fetchDiamondPacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.leafstore.in/api/v1/games/${gameId}/diamond-packs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setGameData(responseData.gameData);
          setDiamondPacks(responseData.diamondPacks);
        }
      } else {
        console.error('Failed to fetch diamond packs');
      }
    } catch (error) {
      console.error('Error fetching diamond packs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValidate = async () => {
    // Validation
    if (!formData.playerId.trim()) {
      toast.error('Please enter your Player ID');
      return;
    }
    if (!formData.serverId.trim()) {
      toast.error('Please enter your Server ID');
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch(`https://api.leafstore.in/api/v1/games/validate-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameId,
          playerId: formData.playerId,
          serverId: formData.serverId
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.response) {
          toast.success('User validated successfully!');
          if (responseData.data) {
            setValidatedInfo({
              nickname: responseData.data.nickname,
              server: responseData.data.server
            });
          }
        } else {
          toast.error(responseData.data?.msg || 'Invalid ID or Server');
          setValidatedInfo(null);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.data?.msg || 'Validation failed. Please try again.');
        setValidatedInfo(null);
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const filterButtons = [
    { name: 'Diamonds', icon: '/daimond.png', active: true },
    { name: 'Weekly Pass', icon: '/daimond.png', active: false },
    { name: 'First Recharge Bonus', icon: '/daimond.png', active: false }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#232426' }}>
        <div className="text-center">
          <p className="text-white text-lg">Game not found</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
                src={gameData.image}
                alt={gameData.name}
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
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg">{gameData.name}</h3>
              <p className="text-gray-300 text-xs sm:text-sm">{gameData.publisher}</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="topup-uid" className="text-white text-sm mb-2 block">Enter Your UID</label>
              <input
                type="text"
                name="playerId"
                id="topup-uid"
                value={formData.playerId}
                onChange={handleInputChange}
                placeholder="Enter your UID"
                className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
            <div>
              <label htmlFor="topup-server" className="text-white text-sm mb-2 block">Enter Your Server ID</label>
              <input
                type="text"
                name="serverId"
                id="topup-server"
                value={formData.serverId}
                onChange={handleInputChange}
                placeholder="Enter your Server ID"
                className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleValidate}
                disabled={isValidating}
                className="py-3 rounded-lg text-white font-bold text-sm flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'rgb(35, 36, 38)',
                  padding: '10px 30px',
                  borderRadius: '20px',
                  border: '1px solid #7F8CAA'
                }}
              >
                {isValidating ? 'VALIDATING...' : 'Validate'}
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {validatedInfo && (
              <div
                className="mt-4 p-4 text-white"
                style={{
                  background: 'linear-gradient(90deg, #363B48 0%, #333844 100%)',
                  borderRadius: '16px',
                  border: '1px solid #7F8CAA'
                }}
              >
                <p className="text-sm"><span className="font-semibold">Name:</span> {validatedInfo.nickname}</p>
                <p className="text-sm"><span className="font-semibold">Server:</span> {validatedInfo.server}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Select Diamond Pack Section */}
      <div className="px-4 mb-6">
        <h2 className="text-white font-bold text-base sm:text-lg mb-4">Select Diamond Pack</h2>

        {/* Filter Buttons */}
        <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto">
          {filterButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="rounded-lg text-xs sm:text-sm font-medium flex items-center text-white whitespace-nowrap shrink-0"
              style={{
                background: 'rgb(35, 36, 38)',
                border: '1px solid rgb(127, 140, 170)',
                padding: '8px 12px',
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
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {diamondPacks.map((pack, index) => (
            <div
              key={pack._id}
              className="cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, rgb(127, 140, 170) 0%, rgb(51, 56, 68) 100%)',
                borderRadius: '22px',
                boxShadow: '0px 4px 4px 0px #00000040'
              }}
              onClick={() => {
                // Validate form data before proceeding
                if (!formData.playerId.trim()) {
                  toast.error('Please enter your Player ID');
                  return;
                }
                
                if (!formData.serverId.trim()) {
                  toast.error('Please enter your Server ID');
                  return;
                }

                // Store pack details for checkout page
                const packDetails = {
                  packId: pack._id,
                  gameId: gameId,
                  gameName: gameData?.name,
                  gameImage: gameData?.image,
                  packDescription: pack.description,
                  packAmount: pack.amount,
                  packLogo: pack.logo,
                  packCategory: pack.category,
                  playerId: formData.playerId,
                  serverId: formData.serverId
                };
                localStorage.setItem('selectedPack', JSON.stringify(packDetails));
                if (onNavigate) {
                  onNavigate('checkout');
                } else {
                  router.push('/checkout');
                }
              }}
            >
              <div className="relative mb-6">
                <Image
                  src={pack.logo}
                  alt={pack.description}
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded-lg"
                  style={{
                    width: '70px',
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
                }}>{pack.description}</h3>
                <p className="text-gray-300" style={{ fontSize: '10px' }}>₹{pack.amount}</p>
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
