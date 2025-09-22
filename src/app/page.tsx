import React from 'react'
import Navbar from './Navbar'
import HeroSection from './Herosection'
import Mainsection from './Mainsection'
import Footer from './Footer'
import ContactForm from './ContactForm'
import WhatsupButton from './WhatsupButton'
export default function page() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mainsection />
      <ContactForm />
      <Footer />
      <WhatsupButton />
    </div>
  )
}
