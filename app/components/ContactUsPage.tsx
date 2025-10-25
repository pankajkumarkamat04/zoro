'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import TopSection from './TopSection';

export default function ContactUsPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    issue: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Your query has been submitted!');
    setFormData({ email: '', phone: '', name: '', issue: '' }); // Clear form
    router.push('/dashboard'); // Navigate back to dashboard after submission
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Top Section with Logo */}
      <div className="relative z-10">
        <TopSection showLogo={true} />
      </div>

      {/* Page Title */}
      <div>
        <h1 
          className="text-white font-bold"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          Contact US
        </h1>
      </div>

      {/* Illustration Section */}
      <div className="px-4 mb-8">
        <div className="flex flex-col items-center">
          {/* Main Illustration */}
          <div className="relative">
            <Image
              src="/support.png"
              alt="Customer Support"
              width={400}
              height={200}
              className="object-contain"
              style={{ 
                color: 'transparent',
                filter: 'grayscale(100%)'
              }}
            />
          </div>

          {/* Sub-heading */}
          <h2 
            className="text-white font-medium mb-8"
            style={{
              fontSize: '20px',
              fontWeight: 700,
              marginTop: '-50px'
            }}
          >
            How can we help you?
          </h2>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="px-4 mb-8">
        <div 
          className="p-3 rounded-2xl"
          style={{ 
            background: 'linear-gradient(90deg, #7F8CAA 0%, #333844 100%)',
            boxShadow: '0px 4px 4px 0px #00000040'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-white text-sm mb-2 block">Enter your email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-2 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="text-white text-sm mb-2 block">Enter your phone number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-2 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
                required
              />
            </div>

            {/* Name Field */}
            <div>
              <label className="text-white text-sm mb-2 block">Enter your name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-2 py-2 rounded-lg text-black placeholder-gray-500"
                style={{ backgroundColor: '#D9D9D9' }}
                required
              />
            </div>

            {/* Issue Field */}
            <div>
              <label className="text-white text-sm mb-2 block">Explain your issue</label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleInputChange}
                placeholder="Explain your issue"
                rows={4}
                className="w-full px-2 py-2 rounded-lg text-black placeholder-gray-500 resize-none"
                style={{ backgroundColor: '#D9D9D9' }}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="text-white font-bold"
                style={{
                  backgroundColor: '#232426',
                  boxShadow: '0px 4px 4px 0px #00000040',
                  padding: '10px 70px',
                  fontSize: '20px',
                  border: '1px solid #7F8CAA',
                  borderRadius: '40px'
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-15"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
