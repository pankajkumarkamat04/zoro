'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/lib/hooks/redux';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

interface TopUpPageProps {
  onNavigate?: (screen: string) => void;
}

export default function TopUpPage({ onNavigate }: TopUpPageProps = {}) {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
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
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [selectedPackData, setSelectedPackData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (gameId) {
      fetchDiamondPacks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  useEffect(() => {
    if (showCheckoutPopup) {
      document.body.style.overflow = 'hidden';
      fetchWalletBalance();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCheckoutPopup]);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      const response = await fetch('https://api.leafstore.in/api/v1/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const balanceCandidate =
          (data && (data.walletBalance ?? data.user?.walletBalance ?? data.data?.walletBalance ?? data.data?.user?.walletBalance));
        if (typeof balanceCandidate === 'number') {
          setWalletBalance(balanceCandidate);
        } else if (typeof balanceCandidate === 'string' && !isNaN(Number(balanceCandidate))) {
          setWalletBalance(Number(balanceCandidate));
        } else {
          setWalletBalance(0);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const processUPIPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      if (!selectedPackData) {
        toast.error('No pack selected');
        return;
      }

      const requestBody = {
        diamondPackId: selectedPackData.packId,
        playerId: selectedPackData.playerId,
        server: selectedPackData.serverId,
        amount: selectedPackData.packAmount,
        quantity: 1,
        redirectUrl: typeof window !== 'undefined' 
          ? `${window.location.origin}/payment-status`
          : 'https://leafstore.in/payment-status'
      };

      const response = await fetch('https://api.leafstore.in/api/v1/order/diamond-pack-upi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.transaction?.paymentUrl) {
          toast.success('Payment request created successfully! Redirecting...');
          window.location.href = responseData.transaction.paymentUrl;
        } else {
          toast.error(responseData.message || 'Failed to create payment request');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing UPI payment:', error);
      toast.error('An error occurred while processing payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const processWalletPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      if (!selectedPackData) {
        toast.error('No pack selected');
        return;
      }

      const requestBody = {
        diamondPackId: selectedPackData.packId,
        playerId: selectedPackData.playerId,
        server: selectedPackData.serverId,
        quantity: 1
      };

      const response = await fetch('https://api.leafstore.in/api/v1/order/diamond-pack', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          toast.success('Payment completed successfully with CRED Coins!');
          setShowCheckoutPopup(false);
          if (onNavigate) {
            onNavigate('home');
          } else {
            router.push('/dashboard');
          }
        } else {
          toast.error(responseData.message || 'Failed to process wallet payment');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      toast.error('An error occurred while processing payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
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
          
          // Extract unique categories from diamond packs
          const categories = ['All', ...Array.from(new Set(responseData.diamondPacks.map((pack: any) => pack.category).filter(Boolean))) as string[]];
          setAllCategories(categories);
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

  // Filter diamond packs by selected category
  const filteredDiamondPacks = selectedCategory === 'All' 
    ? diamondPacks 
    : diamondPacks.filter(pack => pack.category === selectedCategory);

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
        {allCategories.length > 0 && (
          <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="rounded-lg text-xs sm:text-sm font-medium flex items-center text-white whitespace-nowrap shrink-0"
                style={{
                  background: selectedCategory === category ? 'rgb(75, 85, 99)' : 'rgb(35, 36, 38)',
                  border: '1px solid rgb(127, 140, 170)',
                  padding: '8px 12px',
                  borderRadius: '25px'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

         {/* Diamond Pack Cards */}
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredDiamondPacks.map((pack, index) => (
            <div
              key={pack._id}
              className="cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, rgb(127, 140, 170) 0%, rgb(51, 56, 68) 100%)',
                borderRadius: '22px',
                boxShadow: '0px 4px 4px 0px #00000040'
              }}
              onClick={() => {
                // Check if user is logged in before proceeding
                const token = localStorage.getItem('authToken');
                if (!token || !isAuthenticated) {
                  toast.error('Please login first to checkout');
                  setTimeout(() => {
                    if (onNavigate) {
                      onNavigate('login');
                    } else {
                      router.push('/login');
                    }
                  }, 1500);
                  return;
                }

                // Validate form data before proceeding
                if (!formData.playerId.trim()) {
                  toast.error('Please enter your Player ID');
                  return;
                }
                
                if (!formData.serverId.trim()) {
                  toast.error('Please enter your Server ID');
                  return;
                }

                // Store pack details for checkout popup
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
                setSelectedPackData(packDetails);
                setShowCheckoutPopup(true);
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

      {/* Checkout Popup */}
      {showCheckoutPopup && selectedPackData && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50" style={{ background: '#000000cc' }} />
          <div className="fixed bottom-0 left-0 right-0 rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto" style={{ animation: 'slideUp 0.3s ease-out', backgroundColor: 'rgb(35, 36, 38)' }}>
            {/* Top Color Effect */}
            <div 
              className="sticky top-0 left-0 right-0 h-10 pointer-events-none z-10"
              style={{ 
                background: 'linear-gradient(180deg, rgba(127, 140, 170, 0.3) 0%, transparent 100%)'
              }}
            />
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center mb-6">
                <h2 className="flex-1 text-center font-bold text-xl text-white">Checkout</h2>
                <button
                  onClick={() => setShowCheckoutPopup(false)}
                  className="p-2 rounded-full"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Payment Summary */}
              <div className="mb-6">
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)', boxShadow: '0px 4px 4px 0px #00000040' }}>
                  <div className="flex">
                    <div className="space-y-3" style={{ width: '120px' }}>
                      <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Product</div>
                      <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Amount</div>
                    </div>
                    <div className="w-px bg-white mx-4"></div>
                    <div className="flex-1 space-y-3">
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>
                        {selectedPackData ? `${selectedPackData.packDescription}` : '—'}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>
                        {selectedPackData ? `₹${selectedPackData.packAmount}` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-8">
                <div className="space-y-4">
                  {/* CRED Coins Option */}
                  <div
                    className={`p-4 rounded-3xl cursor-pointer transition-all ${selectedPaymentMethod === 'cred-coins' ? 'ring-4 ring-white' : ''} ${selectedPackData && walletBalance < selectedPackData.packAmount ? 'opacity-60' : ''}`}
                    style={{ background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)', boxShadow: '0px 4px 4px 0px #00000040', border: selectedPaymentMethod === 'cred-coins' ? '3px solid white' : 'none' }}
                    onClick={() => {
                      if (selectedPackData && walletBalance < selectedPackData.packAmount) {
                        toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${selectedPackData.packAmount} coins for this pack.`);
                        return;
                      }
                      setSelectedPaymentMethod('cred-coins');
                    }}
                  >
                    <div className="flex">
                      <div className="space-y-3" style={{ width: '120px' }}>
                        <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Method</div>
                        <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Available</div>
                      </div>
                      <div className="w-px bg-white mx-4"></div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <Image src="/coin.png" alt="Coin" width={32} height={32} className="rounded-full" style={{ color: 'transparent' }} />
                          </div>
                          <span className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>CRED Coins</span>
                        </div>
                        <div>
                          <span className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>{walletBalance} coins</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPI Option */}
                  <div
                    className={`p-4 rounded-3xl cursor-pointer transition-all ${selectedPaymentMethod === 'upi' ? 'ring-4 ring-white' : ''}`}
                    style={{ background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)', boxShadow: '0px 4px 4px 0px #00000040', border: selectedPaymentMethod === 'upi' ? '3px solid white' : 'none' }}
                    onClick={() => setSelectedPaymentMethod('upi')}
                  >
                    <div className="flex">
                      <div className="space-y-3" style={{ width: '120px' }}>
                        <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Method</div>
                      </div>
                      <div className="w-px bg-white mx-4"></div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <Image src="/UPI_logo.svg.png" alt="UPI Logo" width={40} height={40} className="rounded-lg" />
                          </div>
                          <span className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>UPI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Securely Button */}
              <div className="mt-8 sm:mt-10 mb-8 flex justify-center">
                <button
                  type="button"
                  className="w-full max-w-sm py-3 sm:py-4 rounded-4xl text-white font-bold text-base sm:text-lg flex items-center justify-center cursor-pointer"
                  style={{ 
                    backgroundColor: 'rgb(127, 140, 170)',
                    border: '1px solid',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '100%',
                    padding: '17px 100px 17px 100px',
                    boxShadow: '0px 4px 4px 0px #00000040',
                    opacity: isProcessingPayment ? 0.7 : 1
                  }}
                  aria-busy={isProcessingPayment}
                  disabled={isProcessingPayment}
                  onClick={async () => {
                    if (!selectedPaymentMethod) {
                      toast.error('Please select a payment method');
                      return;
                    }
                    
                    if (selectedPaymentMethod === 'cred-coins') {
                      if (!selectedPackData) {
                        toast.error('No pack selected');
                        return;
                      }
                      
                      if (walletBalance < selectedPackData.packAmount) {
                        toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${selectedPackData.packAmount} coins for this pack.`);
                        return;
                      }
                      
                      await processWalletPayment();
                    } else if (selectedPaymentMethod === 'upi') {
                      await processUPIPayment();
                    }
                  }}
                >
                  {isProcessingPayment ? 'PROCESSING...' : 'PAY SECURELY'}
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
