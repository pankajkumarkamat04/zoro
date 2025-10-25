'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TopSection from './TopSection';
import BottomNavigation from './BottomNavigation';

interface OrderSuccessPageProps {
  onNavigate?: (screen: string) => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onNavigate }) => {
  const router = useRouter();

  const orderDetails = {
    orderDate: "20 June 2025 at 09:39:45",
    orderId: "9284919695620942",
    product: "Mobile Legends",
    orderDetails: "55 Diamonds",
    price: "65 INR",
    userId: "4723503273",
    zoneId: "3369",
    status: "Success"
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Success Section */}
      <div className="flex flex-col items-center py-8">
        {/* Success Icon */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#20B2AA' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Success Text */}
        <h1 
          className="text-white font-bold mb-2" 
          style={{ fontSize: '32px', textAlign: 'center' }}
        >
          Order Placed<br />Successfully
        </h1>
      </div>

      {/* Order Details Card */}
      <div className="mx-4 mb-6">
        <div 
          className="p-4 rounded-lg"
          style={{ 
            background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
            boxShadow: '0px 4px 4px 0px #00000040'
          }}
        >
          <div className="flex">
            {/* Left Column - Labels */}
            <div className="w-1/3 space-y-3">
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
                {orderDetails.orderDate}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.orderId}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.product}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.orderDetails}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.price}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.userId}
              </div>
              <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.zoneId}
              </div>
              <div className="text-green-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {orderDetails.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mb-8">
        <div className="flex gap-4">
          <button 
            className="flex-1 py-3 px-4 rounded-4xl border-2 border-white text-white"
            style={{ fontSize: '16px' }}
            onClick={() => onNavigate ? onNavigate('topup') : router.push('/topup')}
          >
            Top Up Again
          </button>
          <button 
            className="flex-1 py-3 px-4 rounded-4xl text-white"
            style={{ backgroundColor: '#6B7280', fontSize: '16px' }}
            onClick={() => onNavigate ? onNavigate('orders') : router.push('/orders')}
          >
            Order History
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default OrderSuccessPage;
