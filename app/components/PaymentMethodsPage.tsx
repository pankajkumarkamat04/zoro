'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

interface PaymentMethodsPageProps {
  onNavigate?: (screen: string) => void;
}

export default function PaymentMethodsPage({ onNavigate }: PaymentMethodsPageProps) {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [packDetails, setPackDetails] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    // Get pack details from localStorage
    const storedPack = localStorage.getItem('selectedPack');
    if (storedPack) {
      setPackDetails(JSON.parse(storedPack));
    }
    
    // Fetch wallet balance
    fetchWalletBalance();
  }, []);
  
  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Let ProtectedRoute handle navigation; just stop loading
        setIsLoading(false);
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
      } else {
        console.error('Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setIsLoading(false);
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

      if (!packDetails) {
        toast.error('No pack selected');
        return;
      }

      // Build request body dynamically - include all validation fields from packDetails
      const requestBody: any = {
        diamondPackId: packDetails.packId,
        amount: packDetails.packAmount,
        quantity: 1,
        redirectUrl: typeof window !== 'undefined' 
          ? `${window.location.origin}/payment-status`
          : 'https://leafstore.in/payment-status'
      };

      // Add all validation fields dynamically (exclude standard pack fields)
      const standardFields = ['packId', 'gameId', 'gameName', 'gameImage', 'packDescription', 'packAmount', 'packLogo', 'packCategory'];
      Object.keys(packDetails).forEach((key) => {
        if (!standardFields.includes(key)) {
          requestBody[key] = packDetails[key];
        }
      });

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
          // Redirect to payment URL
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

      if (!packDetails) {
        toast.error('No pack selected');
        return;
      }

      // Build request body dynamically - include all validation fields from packDetails
      const requestBody: any = {
        diamondPackId: packDetails.packId,
        quantity: 1
      };

      // Add all validation fields dynamically (exclude standard pack fields)
      const standardFields = ['packId', 'gameId', 'gameName', 'gameImage', 'packDescription', 'packAmount', 'packLogo', 'packCategory'];
      Object.keys(packDetails).forEach((key) => {
        if (!standardFields.includes(key)) {
          requestBody[key] = packDetails[key];
        }
      });

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
          // Redirect to dashboard since wallet payment doesn't have transaction IDs
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
  
  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Desktop Container */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section with Logo */}
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>

        {/* Back Button */}
        <div className="px-4 md:px-6 lg:px-8 mb-4">
        <button
          type="button"
          className="flex items-center cursor-pointer"
          style={{
            color: '#7F8CAA',
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
          onClick={() => {
            try {
              router.back();
            } catch (error) {
              // Fallback to dashboard if router.back() fails
              if (onNavigate) {
            onNavigate('home');
          } else {
            router.push('/dashboard');
          }
            }
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          go back
        </button>
      </div>

        {/* Page Title */}
        <div className="px-4 md:px-6 lg:px-8 mb-6">
        <h1 className="text-white font-bold text-xl sm:text-2xl">Payment Methods</h1>
      </div>

        {/* Payment Summary - Order-style box */}
        <div className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)', boxShadow: '0px 4px 4px 0px #00000040' }}>
          <div className="flex">
            <div className="space-y-3" style={{ width: '120px' }}>
              <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Product</div>
              <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>Amount</div>
            </div>
            <div className="w-px bg-white mx-4"></div>
            <div className="flex-1 space-y-3">
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px' }}>
                {packDetails ? `${packDetails.packDescription}` : '—'}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>
                {packDetails ? `₹${packDetails.packAmount}` : isLoading ? 'Loading...' : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Payment Options */}
        <div className="px-4 md:px-6 lg:px-8 mb-8">
        <div className="space-y-4">
          {/* CRED Coins Option - Order-style box */}
          <div
            className={`p-4 rounded-3xl cursor-pointer transition-all ${selectedPaymentMethod === 'cred-coins' ? 'ring-4 ring-white' : ''} ${packDetails && walletBalance < packDetails.packAmount ? 'opacity-60' : ''}`}
            style={{ background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)', boxShadow: '0px 4px 4px 0px #00000040', border: selectedPaymentMethod === 'cred-coins' ? '3px solid white' : 'none' }}
            onClick={() => {
              if (packDetails && walletBalance < packDetails.packAmount) {
                toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${packDetails.packAmount} coins for this pack.`);
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
                  <span className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>{isLoading ? '...' : `${walletBalance} coins`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UPI Option - Order-style box */}
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
        <div className="px-4 md:px-6 lg:px-8 mt-8 sm:mt-10 mb-8 flex justify-center">
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
              // Check if user has enough coins
              if (!packDetails) {
                toast.error('No pack selected');
                return;
              }
              
              if (walletBalance < packDetails.packAmount) {
                toast.error(`Insufficient coins! You have ${walletBalance} coins but need ${packDetails.packAmount} coins for this pack.`);
                return;
              }
              
              // Proceed with Serene Coins payment
              await processWalletPayment();
            } else if (selectedPaymentMethod === 'upi') {
              // Handle UPI payment
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

        {/* Bottom Spacing for Fixed Navigation */}
        <div className="h-15"></div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
}
