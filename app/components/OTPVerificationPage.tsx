'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FadedCircle from './FadedCircle';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [loginData, setLoginData] = useState<{email: string, isPhoneLogin: boolean} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get login data from localStorage
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      setLoginData(JSON.parse(storedData));
    } else {
      // If no login data, redirect to login page
      router.push('/login');
    }
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleProceed = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }

    if (!loginData) {
      toast.error('Login data not found. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        phone: loginData.email, // Using email field as it contains phone/email
        otp: otpString
      };

      const response = await fetch('https://api.leafstore.in/api/v1/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.requiresRegistration) {
          toast.success('OTP verified. Please complete your registration.');
          // Store phone number for registration page
          localStorage.setItem('userPhone', responseData.phone);
          // Clear login data from localStorage
          localStorage.removeItem('loginData');
          // Navigate to registration page
          setTimeout(() => {
            router.push('/register');
          }, 1500);
        } else {
          // Handle existing user login response
          toast.success(responseData.message || 'OTP verified successfully! Welcome back.');
          
          // Store token in localStorage
          if (responseData.token) {
            localStorage.setItem('authToken', responseData.token);
          }
          
          // Store user data in localStorage
          if (responseData.user) {
            localStorage.setItem('userData', JSON.stringify(responseData.user));
          }
          
          // Store user phone number in localStorage for future use
          localStorage.setItem('userPhone', loginData.email);
          
          // Clear login data from localStorage
          localStorage.removeItem('loginData');
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 relative overflow-hidden" style={{ backgroundColor: 'rgb(35, 36, 38)' }}>
      {/* Logo */}
      <div className="">
        <div className="w-48 h-48 flex items-center justify-center">
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
      <div className="text-center mb-8">
        <h1 className="text-white font-bold mb-4" style={{ fontSize: '40px' }}>
          ENTER OTP
        </h1>
      </div>

      {/* Instructional Text */}
      <div className="text-center mb-8 px-4">
        <p className="text-white mb-2" style={{ fontSize: '20px' }}>
          A one-time password has been sent to your phone number at
        </p>
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgb(127, 140, 170)' }}>
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span style={{ fontSize: '20px', color: 'rgb(127, 140, 170)' }}>{loginData?.email || '8709507961'}</span>
        </div>
      </div>

      {/* OTP Input Fields */}
      <div className="flex gap-1 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="text-center text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-white"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '25px',
              backgroundColor: 'rgb(195, 191, 191)',
              border: 'none',
              opacity: 1
            }}
          />
        ))}
      </div>

      {/* Proceed Button */}
      <div className="mb-8">
        <button 
          onClick={handleProceed}
          disabled={isLoading}
          className="text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            width: '384px',
            height: '60px',
            top: '637px',
            left: '31px',
            backgroundColor: 'rgb(127, 140, 170)', 
            borderRadius: '25px',
            border: '1px solid transparent',
            opacity: 1
          }}
        >
          {isLoading ? 'VERIFYING...' : 'PROCEED'}
        </button>
      </div>

      {/* Resend OTP */}
      <div className="text-center mb-4">
        <button 
          onClick={() => router.push('/login')}
          className="hover:text-white transition-colors"
          style={{ fontSize: '16px', color: 'rgb(127, 140, 170)' }}
        >
          Didn't receive OTP? Resend
        </button>
      </div>

      {/* Alternative Login Option */}
      <div className="text-center mb-8">
        <p className="text-white mb-2" style={{ fontSize: '16px' }}>
          don't have access to your mail?
        </p>
        <button 
          onClick={() => router.push('/login')}
          className="hover:text-white transition-colors"
          style={{ fontSize: '16px', color: 'rgb(127, 140, 170)' }}
        >
          login using phone number
        </button>
      </div>

      {/* Faded Circles */}
      <FadedCircle top="-50px" left="200px" />
      <FadedCircle bottom="-50px" right="200px" />
    </div>
  );
}
