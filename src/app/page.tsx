import React from 'react'
import Navbar from './Navbar'
import HeroSection from './Herosection'
import Mainsection from './Mainsection'
import Footer from './Footer'
import ContactForm from './ContactForm'
export default function page() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mainsection />
      <ContactForm />
      <Footer />
    </div>
  )
}
