'use client';

import { useRouter } from 'next/navigation';
import { IoMdHome } from 'react-icons/io';
import { LuGrid2X2 } from 'react-icons/lu';
import { GiShoppingBag } from 'react-icons/gi';
import { RiQuestionLine } from 'react-icons/ri';

interface BottomNavigationProps {
  onNavigate?: (screen: string) => void;
}

export default function BottomNavigation({ onNavigate }: BottomNavigationProps = {}) {
  const router = useRouter();
  
  return (
    <div 
      className="fixed p-4 z-40"
      style={{
        backgroundColor: 'rgb(30, 30, 30)',
        bottom: '10px',
        borderRadius: '50px',
        left: '30px',
        right: '30px',
        boxShadow: 'rgb(127, 140, 178) 0px 5px 6px'
      }}
    >
      <div className="flex justify-around">
        {/* Home */}
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => onNavigate ? onNavigate('home') : router.push('/dashboard')}
        >
          <IoMdHome className="w-6 h-6 text-white" />
        </div>
        
        {/* Profile */}
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/profile')}
        >
          <LuGrid2X2 className="w-6 h-6 text-white" />
        </div>
        
        {/* Orders */}
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/orders')}
        >
          <GiShoppingBag className="w-6 h-6 text-white" />
        </div>
        
        {/* Help/Support */}
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/contact')}
        >
          <RiQuestionLine className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
