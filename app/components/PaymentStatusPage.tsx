'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopSection from './TopSection';
import BottomNavigation from './BottomNavigation';

interface PaymentStatusPageProps {
  onNavigate?: (screen: string) => void;
}

interface TransactionData {
  orderId: string;
  status: string;
  amount: number;
  utr?: string;
  gatewayType: string;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  paymentNote: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ onNavigate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      try {
        const clientTxnId = searchParams.get('client_txn_id');
        const txnId = searchParams.get('txn_id');

        if (!clientTxnId || !txnId) {
          console.error('Missing transaction parameters');
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found');
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.leafstore.in/api/v1/transaction/status?client_txn_id=${clientTxnId}&txn_id=${txnId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (result.success && result.data) {
          setTransactionData(result.data);
          setIsSuccess(result.data.status === 'success');
        } else {
          setIsSuccess(false);
        }
      } catch (error) {
        console.error('Error fetching transaction status:', error);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionStatus();
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
        <TopSection showLogo={true} />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-base sm:text-xl">Loading transaction status...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const isTransactionSuccess = isSuccess && transactionData?.status === 'success';

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Status Section */}
      <div className="flex flex-col items-center py-6">
        {/* Status Icon */}
        <div 
          className="rounded-full flex items-center justify-center mb-4"
          style={{ 
            width: '80px', 
            height: '80px',
            backgroundColor: isTransactionSuccess ? '#20B2AA' : '#DC2626' 
          }}
        >
          {isTransactionSuccess ? (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        {/* Status Text */}
        <h1 className="text-white font-bold mb-2 text-2xl sm:text-3xl text-center">
          {isTransactionSuccess ? (
            <>Order Placed<br />Successfully</>
          ) : (
            <>Failed To Place Order</>
          )}
        </h1>
      </div>

      {/* Transaction Details Card */}
      {transactionData && (
        <div className="px-4 mb-6">
          <div 
            className="p-4 rounded-lg"
            style={{ 
              background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
              boxShadow: '0px 4px 4px 0px #00000040'
            }}
          >
            <div className="flex">
              {/* Left Column - Labels */}
              <div className="space-y-3" style={{ width: '120px' }}>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Order Date</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Order ID</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Product</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Order Details</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Price</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>User ID</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Zone ID</div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>Status</div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-white mx-4"></div>

              {/* Right Column - Values */}
              <div className="flex-1 space-y-3">
                <div className="text-green-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {formatDate(transactionData.createdAt)}
                </div>
                <div className="text-blue-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.orderId}
                </div>
                <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.customerName}
                </div>
                <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.paymentNote || 'N/A'}
                </div>
                <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.amount} INR
                </div>
                <div className="text-blue-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.customerNumber}
                </div>
                <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                  {transactionData.customerEmail}
                </div>
                <div 
                  className={`text-sm font-medium ${isTransactionSuccess ? 'text-green-400' : 'text-red-400'}`}
                  style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}
                >
                  {transactionData.status.charAt(0).toUpperCase() + transactionData.status.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 mb-8">
        <div className="flex gap-4">
          <button 
            className="flex-1 py-3 px-4 rounded-4xl border-2 border-white text-white"
            style={{ fontSize: '16px', backgroundColor: 'transparent' }}
            onClick={() => onNavigate ? onNavigate('topup') : router.push('/topup')}
          >
            Top Up Again
          </button>
          <button 
            className="flex-1 py-3 px-4 rounded-4xl text-white"
            style={{ backgroundColor: 'rgb(75, 85, 99)', fontSize: '16px' }}
            onClick={() => onNavigate ? onNavigate('orders') : router.push('/orders')}
          >
            Order History
          </button>
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-15"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default PaymentStatusPage;

