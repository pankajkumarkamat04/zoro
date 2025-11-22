'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';
import { useAppSelector } from '@/lib/hooks/redux';

interface AddCoinPageProps {
  onNavigate?: (screen: string) => void;
}

export default function AddCoinPage({ onNavigate }: AddCoinPageProps) {
  const router = useRouter();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  // Fetch wallet balance for display
  useState(() => {
    const fetchBalance = async () => {
      try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) return;
        const response = await fetch('https://api.leafstore.in/api/v1/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.walletBalance === 'number') {
            setWalletBalance(data.walletBalance);
          }
        }
      } catch {
        // ignore balance fetch errors
      }
    };
    fetchBalance();
  });
  
  const coinPacks = [
    { amount: '250' },
    { amount: '500' },
    { amount: '1000' },
    { amount: '1500' },
    { amount: '2000' },
    { amount: '2500' }
  ];

  const handleCoinPackSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount(amount); // Auto-fill the input with the selected amount
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(''); // Clear selected pack when entering custom amount
  };

  const handlePayment = async () => {
    const amount = selectedAmount || customAmount;
    
    // Validation
    if (!amount.trim()) {
      toast.error('Please select an amount or enter a custom amount');
      return;
    }

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber < 1) {
      toast.error('Minimum amount should be 1');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token || !isAuthenticated) {
        toast.error('Please login first to add coins');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('login');
          } else {
            router.push('/login');
          }
        }, 1500);
        return;
      }

      const response = await fetch('https://api.leafstore.in/api/v1/wallet/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountNumber,
          redirectUrl: "https://leafstore.in"
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.transaction?.paymentUrl) {
          toast.success('Redirecting to payment...');
          // Redirect to payment URL
          window.location.href = responseData.transaction.paymentUrl;
        } else {
          toast.error('Failed to create payment request');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Payment request failed');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
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

        {/* Balance Card */}
        <div className="px-4 md:px-6 lg:px-8 mb-6">
        <div 
          className="flex items-center justify-between p-4 rounded-2xl"
          style={{ 
            background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
            boxShadow: '0px 4px 4px 0px #00000040'
          }}
        >
          <div className="flex items-center">
            <div className="mr-4">
              <Image
                src="/coin.png"
                alt="Coins"
                width={48}
                height={48}
                className="rounded-full"
                style={{ color: 'transparent' }}
              />
            </div>
            <div>
              <p className="text-white text-sm">Creds</p>
              <p className="text-white font-bold text-lg">Available Balance</p>
            </div>
          </div>
          <div 
            className="px-3 py-1 rounded-lg text-white text-sm"
            style={{ 
              backgroundColor: '#363B48',
              border: '1px solid white',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            {walletBalance} coins
          </div>
        </div>
      </div>

        {/* Coin Packs Section */}
        <div className="px-4 md:px-6 lg:px-8 mb-6">
              <h2 className="text-white font-bold mb-4 text-xl sm:text-2xl">
                Coin Packs
              </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {coinPacks.map((pack, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center rounded-3xl cursor-pointer transition-all ${
                pack.amount === '1000' ? 'p-2' : 'p-4'
              } ${selectedAmount === pack.amount ? 'ring-2 ring-blue-500' : ''}`}
              style={{ 
                background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
                border: '3px solid white'
              }}
              onClick={() => handleCoinPackSelect(pack.amount)}
            >
              <div className="mb-3">
                <Image
                  src="/coin.png"
                  alt="Coin Pack"
                  width={pack.amount === '1000' ? 70 : 40}
                  height={pack.amount === '1000' ? 70 : 40}
                  className="rounded-full"
                  style={{ color: 'transparent' }}
                />
              </div>
              <div 
                className="px-5 py-1 rounded-2xl text-white font-medium"
                style={{ 
                  backgroundColor: '#363B48',
                  border: '1px solid white',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                {pack.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Custom Amount Section */}
        <div className="px-4 md:px-6 lg:px-8 mb-8">
        <div className="space-y-3">
          <input 
            type="number" 
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="enter amount"
            className="w-full px-4 py-3 rounded-lg text-black placeholder-gray-500"
            style={{ backgroundColor: '#D9D9D9' }}
          />
                  <p style={{ fontSize: '15px', color: 'white' }}>
                    minimum amount should be 1
                  </p>
          
          <div className="flex justify-center">
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full max-w-sm rounded-3xl text-white font-bold text-base sm:text-lg py-3 sm:py-4 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: '#7F8CAA',
                boxShadow: '0px 4px 4px 0px #00000040',
                border: '2px solid white'
              }}
            >
              {isProcessing ? 'PROCESSING...' : 'PAY ONLINE'}
            </button>
          </div>
        </div>
      </div>

        {/* Bottom Spacing for Fixed Navigation */}
        <div className="h-15"></div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
}
