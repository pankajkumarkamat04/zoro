'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks/redux';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  orderType: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  manualOrder: boolean;
  paymentMethod: string;
  items: OrderItem[];
  description: string;
  nextStatusCheck: string;
  statusCheckCount: number;
  maxStatusChecks: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderHistoryResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface OrderHistoryPageProps {
  onNavigate?: (screen: string) => void;
}

export default function OrderHistoryPage({ onNavigate }: OrderHistoryPageProps = {}) {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [orderData, setOrderData] = useState<OrderHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (isAuthenticated && token) {
      fetchOrderHistory();
    } else if (!isAuthenticated) {
      if (onNavigate) {
        onNavigate('login');
      } else {
        router.push('/login');
      }
    }
  }, [currentPage, isAuthenticated, token]);

  // Update loading state when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrderHistory = async () => {
    try {
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      // Add optional parameters if they have values
      if (searchDate) {
        queryParams.append('dateFrom', searchDate);
      }
      if (searchOrderId) {
        queryParams.append('orderId', searchOrderId);
      }
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }

      const response = await fetch(`https://api.leafstore.in/api/v1/order/history?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }

      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Failed to load order history');
    }
    // Remove setIsLoading(false) from here - loading state is managed by auth state
  };

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

  const parseDescription = (description: string): { playerId: string; server: string } => {
    try {
      const parsed = JSON.parse(description);
      return {
        playerId: parsed.playerId || 'N/A',
        server: parsed.server || 'N/A'
      };
    } catch {
      return {
        playerId: 'N/A',
        server: 'N/A'
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const handleSearch = () => {
    // Reset to first page when searching
    setCurrentPage(1);
    fetchOrderHistory();
  };

  // Only show loading screen if user is not authenticated yet
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading order history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Page Title */}
      <div className="px-4 mb-6">
        <h1 className="text-white font-bold text-xl sm:text-2xl">Order History</h1>
        {orderData?.pagination && (
          <p className="text-gray-400 text-sm mt-2">
            Showing {orderData?.orders?.length || 0} of {orderData?.pagination?.totalOrders || 0} orders
          </p>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 mb-6">
        <div className="space-y-4" role="search">
          {/* Search by Order ID */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="search by order id"
              aria-label="search by order id"
              className="w-full px-4 py-3 rounded-lg text-black placeholder-gray-500"
              style={{ backgroundColor: '#D9D9D9' }}
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Date Input, Status Filter and Search Button */}
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="date" 
                placeholder="dd-mm-yyyy"
                aria-label="filter by date"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <select 
                className="w-full px-4 py-3 rounded-lg text-black"
                aria-label="filter by status"
                style={{ backgroundColor: '#D9D9D9' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button 
              type="button"
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#363B48' }}
              onClick={handleSearch}
            >
              search
            </button>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="px-4 mb-8">
        <div className="space-y-4">
          {orderData?.orders?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white text-lg">No orders found</div>
              <div className="text-gray-400 text-sm mt-2">You haven't placed any orders yet</div>
            </div>
          ) : (
            orderData?.orders?.map((order) => {
              const descriptionData = parseDescription(order.description);
              const orderItem = order.items[0]; // Get first item for display
              
              return (
                <div 
                  key={order._id}
                  className="p-4 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
                    boxShadow: '0px 4px 4px 0px #00000040'
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Left Column - Labels */}
                    <div className="sm:w-1/3 space-y-3 mb-4 sm:mb-0">
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
                    <div className="hidden sm:block w-px bg-white mx-4"></div>

                    {/* Right Column - Values */}
                    <div className="flex-1 space-y-3">
                      <div className="text-green-400 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {order.orderId}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {orderItem?.itemName || 'N/A'}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {orderItem?.itemName || 'N/A'}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        ₹{order.amount} {order.currency}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {descriptionData.playerId}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                        {descriptionData.server}
                      </div>
                      <div 
                        className={`text-sm font-medium ${getStatusColor(order.status)}`}
                        style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-15"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
