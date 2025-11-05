'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle smooth scrolling
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Adjust for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL without refreshing the page
      window.history.pushState(null, '', `/#${targetId}`);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#132E5D]/95 backdrop-blur-sm shadow-lg py-2' : 'bg-[#132E5D] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <div className="relative h-10 w-10 rounded-lg flex items-center justify-center">
                <Image 
                  src={'/zitouni logo.jpg'} 
                  alt='Zitouni Pro Talents Logo'
                  fill 
                  className='rounded-xl object-cover'
                  priority
                />
              </div>
              <span className="ml-2 text-xl font-bold text-white whitespace-nowrap">
                zitouni pro talents
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline space-x-20">
              <a 
                href="#home" 
                onClick={(e) => handleSmoothScroll(e, 'home')} 
                className="text-white hover:bg-[#387F3D] px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                الرئيسية
              </a>
              <a 
                href="#portfolio" 
                onClick={(e) => handleSmoothScroll(e, 'portfolio')} 
                className="text-white hover:bg-[#387F3D] px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                أعمالنا
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleSmoothScroll(e, 'contact')} 
                className="text-white hover:bg-[#387F3D] px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                اتصل بنا
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')} 
              className="px-4 py-2 rounded-md text-sm font-medium transition duration-300 bg-[#387F3D] text-white hover:bg-[#2c6b30]">
              ابدأ الآن
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#387F3D] focus:outline-none transition duration-150"
              aria-expanded="false"
              aria-label="فتح القائمة الرئيسية"
            >
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Matches desktop version */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#132E5D] shadow-lg">
          <a 
            href="#home" 
            onClick={(e) => handleSmoothScroll(e, 'home')} 
            className="text-white hover:bg-[#387F3D] block px-3 py-2 rounded-md text-base font-medium transition duration-150"
          >
            الرئيسية
          </a>
          <a 
            href="#portfolio" 
            onClick={(e) => handleSmoothScroll(e, 'portfolio')} 
            className="text-white hover:bg-[#387F3D] block px-3 py-2 rounded-md text-base font-medium transition duration-150"
          >
            أعمالنا
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleSmoothScroll(e, 'contact')} 
            className="text-white hover:bg-[#387F3D] block px-3 py-2 rounded-md text-base font-medium transition duration-150"
          >
            اتصل بنا
          </a>
          <a
            href="#contact" 
            onClick={(e) => handleSmoothScroll(e, 'contact')} 
            className="w-full mt-4 px-4 py-2 rounded-md text-base font-medium bg-[#387F3D] text-white hover:bg-[#2c6b30] transition duration-150">
            ابدأ الآن
          </a>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
