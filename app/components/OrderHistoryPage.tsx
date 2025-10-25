'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function OrderHistoryPage() {
  const router = useRouter();
  
  const orders = [
    {
      orderDate: "20 June 2025 at 09:39:45",
      orderId: "9284919695620942",
      product: "Mobile Legends",
      orderDetails: "55 Diamonds",
      price: "65 INR",
      userId: "4723503273",
      zoneId: "3369",
      status: "Success"
    },
    {
      orderDate: "19 June 2025 at 14:22:18",
      orderId: "9284919695620943",
      product: "Mobile Legends",
      orderDetails: "100 Diamonds",
      price: "120 INR",
      userId: "4723503274",
      zoneId: "3370",
      status: "Failed"
    },
    {
      orderDate: "18 June 2025 at 11:15:30",
      orderId: "9284919695620944",
      product: "Mobile Legends",
      orderDetails: "200 Diamonds",
      price: "240 INR",
      userId: "4723503275",
      zoneId: "3371",
      status: "Success"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Page Title */}
      <div className="px-4 mb-6">
        <h1 className="text-white font-bold text-2xl">Order History</h1>
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 mb-6">
        <div className="space-y-4">
          {/* Search by Order ID */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="search by order id"
              className="w-full px-4 py-3 rounded-lg text-black placeholder-gray-500"
              style={{ backgroundColor: '#D9D9D9' }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Date Input and Search Button */}
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="date" 
                placeholder="dd-mm-yyyy"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
              />
            </div>
            <button 
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#363B48' }}
            >
              search
            </button>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="px-4 mb-8">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg cursor-pointer"
              style={{ 
                background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
                boxShadow: '0px 4px 4px 0px #00000040'
              }}
              onClick={() => router.push('/topup')}
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
                  <div className="text-green-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.orderDate}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.orderId}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.product}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.orderDetails}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.price}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.userId}</div>
                  <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>{order.zoneId}</div>
                  <div 
                    className={`text-sm font-medium ${
                      order.status === 'Success' ? 'text-green-400' : 'text-red-400'
                    }`}
                    style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}
                  >
                    {order.status}
                  </div>
                </div>
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
