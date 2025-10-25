'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function PaymentMethodsPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Back Button */}
      <div className="px-4 mb-4">
        <button
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
          onClick={() => router.back()}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          go back
        </button>
      </div>

      {/* Page Title */}
      <div className="px-4 mb-6">
        <h1 className="text-white font-bold text-2xl">Payment Methods</h1>
      </div>

      {/* Payment Summary */}
      <div className="px-4 mb-6">
        <div
          className="flex items-center justify-between "
        >
           <div 
             className="flex items-center py-2 px-4 rounded-3xl" 
             style={{ 
               background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
               boxShadow: '0px 4px 4px 0px #00000040',
               fontFamily: 'Poppins',
               fontWeight: 600,
               fontStyle: 'normal',
               fontSize: '16px',
               lineHeight: '100%',
               letterSpacing: '0%'
             }}
           >
             <span 
               className="text-white" 
               style={{
                 fontFamily: 'Poppins',
                 fontWeight: 600,
                 fontStyle: 'normal',
                 fontSize: '16px',
                 lineHeight: '100%',
                 letterSpacing: '0%'
               }}
             >
               Amount
             </span>
             <div className="w-px h-6 bg-gray-400 mx-4"></div>
             <span 
               className="text-white font-bold" 
               style={{
                 fontFamily: 'Poppins',
                 fontWeight: 600,
                 fontStyle: 'normal',
                 fontSize: '16px',
                 lineHeight: '100%',
                 letterSpacing: '0%'
               }}
             >
               800 INR
             </span>
           </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="px-4 mb-8">
        <div className="space-y-4">
          {/* Serene Coins Option */}
          <div
            className="flex items-center justify-between p-4 rounded-3xl cursor-pointer"
            style={{ 
              background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
              boxShadow: '0px 4px 4px 0px #00000040'
            }}
            onClick={() => router.push('/addcoin')}
          >
             <div className="flex items-center">
               <div className="mr-4">
                 <Image
                   src="/coin.png"
                   alt="Coin"
                   width={48}
                   height={48}
                   className="rounded-full"
                   style={{ color: 'transparent' }}
                 />
               </div>
              <div>
                <p className="text-white text-sm" style={{ fontSize: '16px', fontWeight: 600 }}>Serene Coins</p>
                <p className="text-white font-bold text-sm" style={{ fontSize: '20px', fontWeight: 700 }}>Available Balance</p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-lg"
              style={{ 
                backgroundColor: '#232426',
                border: '1px solid',
                borderRadius: '20px'
              }}
            >
              <span className="text-white text-sm">1000 coins</span>
            </div>
          </div>

          {/* UPI Option */}
          <div
            className="flex items-center justify-between p-4 rounded-3xl cursor-pointer"
            style={{ 
              background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
              boxShadow: '0px 4px 4px 0px #00000040'
            }}
            onClick={() => router.push('/checkout')}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <Image
                  src="/UPI_logo.svg.png"
                  alt="UPI Logo"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <div className="w-px h-8 bg-gray-400 mx-4"></div>
              <span className="text-white text-sm">UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Securely Button */}
      <div className="px-4 mt-10 mb-8 flex justify-center">
        <button
          className="py-4 rounded-4xl text-white font-bold text-lg flex items-center justify-center cursor-pointer"
          style={{ 
            backgroundColor: 'rgb(127, 140, 170)',
            border: '1px solid',
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            padding: '17px 100px 17px 100px',
            boxShadow: '0px 4px 4px 0px #00000040'
          }}
          onClick={() => router.push('/orders')}
        >
          PAY SECURELY
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
  );
}
