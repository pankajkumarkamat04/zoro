'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { updateUser } from '@/lib/store/authSlice';
import apiClient from '@/lib/api/axios';
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
  const dispatch = useAppDispatch();
  
  const [gameData, setGameData] = useState<{
    _id: string;
    name: string;
    image: string;
    productId: string;
    publisher: string;
    validationFields: string[];
    regionList?: Array<{
      code: string;
      name: string;
    }>;
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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validatedInfo, setValidatedInfo] = useState<{
    nickname: string;
    server: string;
  } | null>(null);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [selectedPackData, setSelectedPackData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (gameId) {
      fetchDiamondPacks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Initialize formData when gameData is loaded
  useEffect(() => {
    if (gameData && gameData.validationFields) {
      const initialFormData: Record<string, string> = {};
      gameData.validationFields.forEach((field) => {
        initialFormData[field] = '';
      });
      setFormData(initialFormData);
    }
  }, [gameData]);

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

      const response = await apiClient.get('/user/me');
      const data = response.data;
      const balanceCandidate =
        (data && (data.walletBalance ?? data.user?.walletBalance ?? data.data?.walletBalance ?? data.data?.user?.walletBalance));
      if (typeof balanceCandidate === 'number') {
        setWalletBalance(balanceCandidate);
      } else if (typeof balanceCandidate === 'string' && !isNaN(Number(balanceCandidate))) {
        setWalletBalance(Number(balanceCandidate));
      } else {
        setWalletBalance(0);
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
        // toast.error('Authentication token not found');
        return;
      }

      if (!selectedPackData) {
        // toast.error('No pack selected');
        return;
      }

      // Build request body dynamically based on validationFields
      const requestBody: any = {
        diamondPackId: selectedPackData.packId,
        amount: selectedPackData.packAmount,
        quantity: 1,
        redirectUrl: typeof window !== 'undefined' 
          ? `${window.location.origin}/payment-status`
          : 'https://credszone.com/payment-status'
      };

      // Add all validation fields dynamically
      if (gameData && gameData.validationFields) {
        gameData.validationFields.forEach((field) => {
          requestBody[field] = selectedPackData[field];
        });
      }

      const response = await apiClient.post('/order/diamond-pack-upi', requestBody);
      const responseData = response.data;
      
      if (responseData.success && responseData.transaction?.paymentUrl) {
        // toast.success('Payment request created successfully! Redirecting...');
        window.location.href = responseData.transaction.paymentUrl;
      } else {
        // toast.error(responseData.message || 'Failed to create payment request');
      }
    } catch (error: any) {
      console.error('Error processing UPI payment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while processing payment';
      // toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const processWalletPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // toast.error('Authentication token not found');
        return;
      }

      if (!selectedPackData) {
        // toast.error('No pack selected');
        return;
      }

      // Build request body dynamically based on validationFields
      const requestBody: any = {
        diamondPackId: selectedPackData.packId,
        quantity: 1
      };

      // Add all validation fields dynamically
      if (gameData && gameData.validationFields) {
        gameData.validationFields.forEach((field) => {
          requestBody[field] = selectedPackData[field];
        });
      }

      const response = await apiClient.post('/order/diamond-pack', requestBody);
      const responseData = response.data;
      
      if (responseData.success) {
        setShowCheckoutPopup(false);
        
        // Update wallet balance after successful payment
        try {
          const userResponse = await apiClient.get('/user/me');
          const userData = userResponse.data;
          const updatedBalance = userData?.walletBalance ?? userData?.user?.walletBalance ?? userData?.data?.walletBalance;
          if (typeof updatedBalance === 'number') {
            // Update Redux state
            dispatch(updateUser({ walletBalance: updatedBalance }));
            // Update local state
            setWalletBalance(updatedBalance);
          } else if (typeof updatedBalance === 'string' && !isNaN(Number(updatedBalance))) {
            const balanceNum = Number(updatedBalance);
            dispatch(updateUser({ walletBalance: balanceNum }));
            setWalletBalance(balanceNum);
          }
        } catch (error) {
          console.error('Error fetching updated wallet balance:', error);
          // Still proceed with redirect even if balance update fails
        }
        
        // For wallet payments, redirect to order status page using orderId
        const orderId = responseData.orderId || 
                       responseData.order?.orderId ||
                       responseData.data?.orderId ||
                       responseData.order?._id;
        
        if (orderId) {
          // Redirect to order status page
          if (onNavigate) {
            onNavigate('order-status');
          } else {
            router.push(`/order-status?orderId=${encodeURIComponent(orderId)}`);
          }
        } else {
          // Fallback: check for transaction IDs and redirect to payment status
          const transaction = responseData.transaction || responseData.data?.transaction;
          const clientTxnId = transaction?.clientTxnId || transaction?.client_txn_id || transaction?.clientTrxId;
          const txnId = transaction?.txnId || transaction?.txn_id || transaction?.transactionId;
          
          if (clientTxnId || txnId) {
            const params = new URLSearchParams();
            if (clientTxnId) {
              params.append('clientTxnId', clientTxnId);
            }
            if (txnId) {
              params.append('transactionId', txnId);
            }
            
            if (onNavigate) {
              onNavigate('payment-status');
            } else {
              router.push(`/payment-status?${params.toString()}`);
            }
          } else {
            // Final fallback to dashboard
            if (onNavigate) {
              onNavigate('home');
            } else {
              router.push('/dashboard');
            }
          }
        }
      } else {
        // toast.error(responseData.message || 'Failed to process wallet payment');
      }
    } catch (error: any) {
      console.error('Error processing wallet payment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while processing payment';
      // toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const fetchDiamondPacks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/games/${gameId}/diamond-packs`);
      const responseData = response.data;
      
      if (responseData.success) {
        const gameDataValue = responseData.gameData;
        setGameData(gameDataValue);
        setDiamondPacks(responseData.diamondPacks);
        
        // Extract unique categories from diamond packs (excluding "All")
        const categories = Array.from(new Set(responseData.diamondPacks.map((pack: any) => pack.category).filter(Boolean))) as string[];
        setAllCategories(categories);
        
        // Set the first category as default if available and no category is selected
        if (categories.length > 0) {
          setSelectedCategory(prev => prev || categories[0]);
        }
        
        // Get the most used product image for each category
        const images: Record<string, string> = {};
        categories.forEach((category) => {
          // Find all packs in this category
          const categoryPacks = responseData.diamondPacks.filter((pack: any) => pack.category === category);
          if (categoryPacks.length > 0) {
            // Use the first pack's logo/image as the category image
            // You can change this logic to find the "most used" pack if needed
            const firstPack = categoryPacks[0];
            images[category] = firstPack.logo || firstPack.image || gameDataValue?.image || '';
          }
        });
        setCategoryImages(images);
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to format field names to user-friendly labels
  const getFieldLabel = (fieldName: string): string => {
    const labelMap: Record<string, string> = {
      playerId: 'Player ID',
      server: 'Server',
      serverId: 'Server ID',
      uid: 'UID',
      username: 'Username',
      accountId: 'Account ID',
      characterName: 'Character Name',
    };
    
    // If we have a mapping, use it
    if (labelMap[fieldName]) {
      return labelMap[fieldName];
    }
    
    // Otherwise, format the field name (e.g., "playerId" -> "Player ID")
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Helper function to get placeholder text
  const getFieldPlaceholder = (fieldName: string): string => {
    return `Enter your ${getFieldLabel(fieldName)}`;
  };

  const handleValidate = async () => {
    // Dynamic validation - check all required fields
    if (!gameData || !gameData.validationFields) {
      // toast.error('Game data not loaded');
      return;
    }

    for (const field of gameData.validationFields) {
      if (!formData[field] || !formData[field].trim()) {
        // toast.error(`Please enter your ${getFieldLabel(field)}`);
        return;
      }
    }

    setIsValidating(true);

    try {
      // Build request body dynamically based on validationFields
      const requestBody: Record<string, string> = {
        gameId: gameId,
      };
      
      gameData.validationFields.forEach((field) => {
        if (formData[field]) {
          // If this is a server field and regionList is available, ensure we're using the region code
          const isServerField = (field === 'server' || field === 'serverId');
          if (isServerField && gameData.regionList && gameData.regionList.length > 0) {
            // The formData already contains the region code from the dropdown
            // Verify it's a valid region code from the regionList
            const selectedRegion = gameData.regionList.find(region => region.code === formData[field]);
            if (selectedRegion) {
              requestBody[field] = selectedRegion.code;
            } else {
              // If it's not a valid region code, use the value as-is (might be manual input)
              requestBody[field] = formData[field];
            }
          } else {
            requestBody[field] = formData[field];
          }
        }
      });

      const response = await apiClient.post('/games/validate-user', requestBody);
      const responseData = response.data;
        // Check for success using response or valid field
        if (responseData.response || responseData.valid) {
          // Show success message from response
          const successMsg = responseData.msg || responseData.data?.msg || 'User validated successfully!';
          // toast.success(successMsg);
          
          // Set validated info - use top level fields or data fields
          const nickname = responseData.name || responseData.data?.nickname || '';
          const server = responseData.server || responseData.data?.server || '';
          
          setValidatedInfo({
            nickname: nickname,
            server: server
          });
      } else {
        // Show error message
        const errorMsg = responseData.msg || responseData.data?.msg || 'Invalid ID or Server';
        // toast.error(errorMsg);
        setValidatedInfo(null);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.data?.msg || error.message || 'Validation failed. Please try again.';
      // toast.error(errorMsg);
      setValidatedInfo(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Filter diamond packs by selected category
  const filteredDiamondPacks = selectedCategory 
    ? diamondPacks.filter(pack => pack.category === selectedCategory)
    : diamondPacks;

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
      {/* Desktop Container */}
      <div className="w-full">
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
        <div className="px-4 md:px-6 lg:px-8 mb-6">
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

          {/* Input Fields - Dynamic based on validationFields */}
          <div className="space-y-4">
            {gameData.validationFields && gameData.validationFields.map((field, index) => {
              // Check if this is a server field and regionList is available
              const isServerField = (field === 'server' || field === 'serverId');
              const shouldUseDropdown = isServerField && gameData.regionList && gameData.regionList.length > 0;

              return (
                <div key={field}>
                  <label 
                    htmlFor={`topup-${field}`} 
                    className="text-white text-sm mb-2 block"
                  >
                    Enter Your {getFieldLabel(field)}
                  </label>
                  {shouldUseDropdown && gameData.regionList ? (
                    <select
                      name={field}
                      id={`topup-${field}`}
                      value={formData[field] || ''}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 rounded-lg text-black"
                      style={{ backgroundColor: '#D9D9D9' }}
                    >
                      <option value="">Select {getFieldLabel(field)}</option>
                      {gameData.regionList.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      id={`topup-${field}`}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      placeholder={getFieldPlaceholder(field)}
                      className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500"
                      style={{ backgroundColor: '#D9D9D9' }}
                    />
                  )}
                </div>
              );
            })}
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
        <div className="px-4 md:px-6 lg:px-8 mb-6">
        <h2 className="text-white font-bold text-base sm:text-lg mb-4">Select Diamond Pack</h2>

        {/* Category Cards - Square Design - Scrollable */}
        {allCategories.length > 0 && (
          <div className="mb-6 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-3 md:gap-4 pb-2" style={{ minWidth: 'max-content' }}>
              {allCategories.map((category) => {
                const isSelected = selectedCategory === category;
                const categoryImage = categoryImages[category];
                
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 flex flex-col items-center justify-start p-2 flex-shrink-0"
                    style={{
                      width: '110px',
                      minWidth: '110px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgb(127, 140, 170) 0%, rgb(92, 102, 124) 100%)' 
                        : 'linear-gradient(135deg, rgb(35, 36, 38) 0%, rgb(54, 59, 72) 100%)',
                      border: isSelected ? '2px solid rgb(127, 140, 170)' : '2px solid rgb(75, 85, 99)',
                      boxShadow: isSelected ? '0px 4px 8px rgba(127, 140, 170, 0.3)' : '0px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                  {/* Category Image as Element */}
                  {categoryImage ? (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-14 lg:w-12 xl:w-12 mb-0.5 relative flex-shrink-0">
                      <Image
                        src={categoryImage}
                        alt={category}
                        fill
                        className="object-contain"
                        style={{ filter: isSelected ? 'none' : 'grayscale(30%)' }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-14 lg:w-12 xl:w-12 mb-0.5 flex items-center justify-center bg-gray-600 rounded-lg">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4 2 2 0 000-4zM5.5 1a2.5 2.5 0 00-2.5 2.5v.5h5v-.5A2.5 2.5 0 005.5 1zM9 3a2 2 0 100 4 2 2 0 000-4zM10.5 1a2.5 2.5 0 00-2.5 2.5v.5h5v-.5A2.5 2.5 0 0010.5 1zM15 3a2 2 0 100 4 2 2 0 000-4zM16.5 1a2.5 2.5 0 00-2.5 2.5v.5h5v-.5A2.5 2.5 0 0016.5 1zM3 8a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category Name */}
                  <div className="text-center mt-0.5 px-1">
                    <span 
                      className="text-white font-bold text-xs leading-tight break-words"
                      style={{
                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
                        lineHeight: '1.1',
                        fontSize: '10px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {category}
                    </span>
                  </div>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                  )}
                </button>
              );
            })}
            </div>
          </div>
        )}

         {/* Diamond Pack Cards */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
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
                  // toast.error('Please login first to checkout');
                  setTimeout(() => {
                    if (onNavigate) {
                      onNavigate('login');
                    } else {
                      router.push('/login');
                    }
                  }, 1500);
                  return;
                }

                // Validate form data before proceeding - dynamic validation
                if (!gameData || !gameData.validationFields) {
                  // toast.error('Game data not loaded');
                  return;
                }

                for (const field of gameData.validationFields) {
                  if (!formData[field] || !formData[field].trim()) {
                    // toast.error(`Please enter your ${getFieldLabel(field)}`);
                    return;
                  }
                }

                // Store pack details for checkout popup - include all validation fields
                const packDetails: any = {
                  packId: pack._id,
                  gameId: gameId,
                  gameName: gameData?.name,
                  gameImage: gameData?.image,
                  packDescription: pack.description,
                  packAmount: pack.amount,
                  packLogo: pack.logo,
                  packCategory: pack.category,
                };

                // Add all validation fields dynamically
                gameData.validationFields.forEach((field) => {
                  packDetails[field] = formData[field];
                });
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

      {/* Mobile Legend Note - Show only for 2x First recharge bonus and Weekly Pass categories */}
      {gameData && 
       (gameData.name.toLowerCase().includes('mobile legend') || gameData.name.toLowerCase().includes('mobile legends')) &&
       (selectedCategory === '2x First recharge bonus' || selectedCategory === 'Weekly Pass') && (
        <div className="px-4 md:px-6 lg:px-8 mb-6 mt-4">
          {selectedCategory === '2x First recharge bonus' ? (
            <div className="text-gray-300 text-xs space-y-1" style={{ fontFamily: 'Poppins', lineHeight: '1.4' }}>
              <p className="text-white font-semibold text-xs mb-1">2x First Recharge Bonus</p>
              <p className="text-xs">Total Diamonds received for each level:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 text-xs">
                <li>50 Diamond level: 50 base + 50 bonus = <span className="text-green-300">100 total</span></li>
                <li>150 Diamond level: 150 base + 150 bonus = <span className="text-green-300">300 total</span></li>
                <li>250 Diamond level: 250 base + 250 bonus = <span className="text-green-300">500 total</span></li>
                <li>500 Diamond level: 500 base + 500 bonus = <span className="text-green-300">1000 total</span></li>
              </ul>
              <p className="mt-2 text-xs text-gray-400 italic">
                Double Diamonds bonus applies only to your first purchase, regardless of payment channel or platform.
              </p>
            </div>
          ) : selectedCategory === 'Weekly Pass' ? (
            <div className="text-gray-300 text-xs space-y-2" style={{ fontFamily: 'Poppins', lineHeight: '1.4' }}>
              <p className="text-white font-semibold text-xs mb-1">Weekly Pass Notes</p>
              <p className="text-xs"><span className="font-semibold">1.</span> The game account level must reach level 5 in order to purchase the weekly diamond pass.</p>
              <p className="text-xs"><span className="font-semibold">2.</span> A maximum of 10 weekly diamond passes can be purchased within a 70-day period on the third-party platform (the 10-pass count includes passes purchased in-game). Please do not make additional purchases to avoid losses.</p>
              <p className="text-xs"><span className="font-semibold">3.</span> You will receive 80 diamonds on the day of purchase, with the extra 20 diamonds being sent to your Vault, which you need to log in to in order to claim. Additionally, you must log in and access the weekly pass page for 6 consecutive days to claim a total of 120 extra diamonds, with 20 extra diamonds per day. During the 7 days, you will earn a total of 220 diamonds.</p>
            </div>
          ) : null}
        </div>
      )}

        {/* Bottom Spacing for Fixed Navigation */}
        <div className="h-15"></div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>

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
                        // toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${selectedPackData.packAmount} coins for this pack.`);
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
                      // toast.error('Please select a payment method');
                      return;
                    }
                    
                    if (selectedPaymentMethod === 'cred-coins') {
                      if (!selectedPackData) {
                        // toast.error('No pack selected');
                        return;
                      }
                      
                      if (walletBalance < selectedPackData.packAmount) {
                        // toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${selectedPackData.packAmount} coins for this pack.`);
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
