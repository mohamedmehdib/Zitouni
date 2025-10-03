// app/page.tsx
'use client';

import React, { useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './Herosection'
import Mainsection from './Mainsection'
import ContactForm from './ContactForm'
import WhatsupButton from './WhatsupButton'
import ServicePopup from './ServicePopup'
import ArabicFooter from './Footer'

export default function Home() {
  const [showServicePopup, setShowServicePopup] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowServicePopup(true);
  };

  const handleClosePopup = () => {
    setShowServicePopup(false);
    setSelectedService('');
  };

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mainsection />
      <ContactForm />
      <ArabicFooter onServiceClick={handleServiceClick} />
      <WhatsupButton />
      
      <ServicePopup 
        isOpen={showServicePopup}
        onClose={handleClosePopup}
        serviceName={selectedService}
      />
    </div>
  )
}