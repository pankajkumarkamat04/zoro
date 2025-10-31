'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/lib/hooks/redux';
import { loginStart } from '@/lib/store/authSlice';
import FadedCircle from './FadedCircle';

interface LoginPageProps {
  onNavigate?: (screen: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email or phone number');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const requestBody = isPhoneLogin
        ? { phone: email }
        : { email: email };

      const response = await fetch('https://api.leafstore.in/api/v1/user/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success('OTP sent successfully! Please check your phone/email.');
        // Store the email/phone for OTP verification page
        localStorage.setItem('loginData', JSON.stringify({
          email: email,
          isPhoneLogin: isPhoneLogin
        }));
        // Navigate after a short delay to show the success toast
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('otp-verification');
          } else {
            router.push('/otp-verification');
          }
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 sm:pt-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#232426' }}>
      {/* Logo */}
      <div className="">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Creds Zone Logo"
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          <span className="text-white">Creds</span>
          <span className="ml-2" style={{ color: '#7F8CAA' }}>Zone</span>
        </h1>
        <p className="text-white text-xs sm:text-sm">your best top-up destination</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm relative">
        {/* Form Container */}
        <div className="rounded-2xl p-6 pt-12 shadow-lg relative border-2 border-white" style={{ backgroundColor: '#7F8CAA' }}>
          {/* User Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Email Input */}
          <div className="mt-8">
            <div className="flex items-center mb-3">
              {isPhoneLogin ? (
                <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
              <span className="text-white font-medium">{isPhoneLogin ? 'Phone' : 'Email'}</span>
            </div>
            <label htmlFor="login-field" className="sr-only">{isPhoneLogin ? 'Phone number' : 'Email address'}</label>
            <input
              type={isPhoneLogin ? "tel" : "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isPhoneLogin ? "enter your phone number" : "enter your email"}
              id="login-field"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              style={{ backgroundColor: '#C3BFBF' }}
            />
          </div>
        </div>

        {/* Alternative Login Option */}
        <div className="mt-4 ml-2">
          <button
            type="button"
            className="text-sm sm:text-base hover:opacity-80 transition-colors"
            style={{ color: '#7F8CAA', fontSize: '20px' }}
            onClick={() => setIsPhoneLogin(!isPhoneLogin)}
          >
            {isPhoneLogin ? 'login with email' : 'login with phone number'}
          </button>
        </div>

      </div>

      {/* Login Button */}
      <div className="mt-10 sm:mt-12 w-full max-w-sm px-6 sm:px-8">
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full border-2 border-white py-3 sm:py-4 text-white font-bold text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#7F8CAA', borderRadius: '25px' }}
        >
          {isLoading ? 'SENDING OTP...' : 'LOGIN NOW'}
        </button>
      </div>

      {/* Faded Circle */}
      <FadedCircle top="1000px" />
    </div>
  );
}