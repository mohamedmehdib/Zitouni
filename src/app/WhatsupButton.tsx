'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to completely avoid hydration issues
const WhatsappButton = dynamic(() => Promise.resolve(() => {
  const handleClick = () => {
    const phoneNumber = "+21624262849";
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-green-600 transition-all duration-300"
      onClick={handleClick}
      title="Contact us on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </div>
  );
}), { ssr: false });

export default WhatsappButton;