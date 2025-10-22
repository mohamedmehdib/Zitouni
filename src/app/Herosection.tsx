// components/ArabicHeroSection.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const ArabicHeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const rotationAngle = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    
    // Animation fluide et continue de la pièce
    const animateCoin = () => {
      if (coinRef.current) {
        rotationAngle.current += 0.5; // Vitesse de rotation réduite pour plus de fluidité
        if (rotationAngle.current >= 360) {
          rotationAngle.current = 0;
        }
        
        coinRef.current.style.transform = `rotateY(${rotationAngle.current}deg)`;
      }
      animationRef.current = requestAnimationFrame(animateCoin);
    };

    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(animateCoin);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-4 bg-[#132E5D]" dir="rtl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-right">
            <div className="h-12 bg-gray-700 rounded mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded mb-8 max-w-lg mx-auto md:mx-0"></div>
          </div>
          <div className="relative">
            <div className="w-full h-64 bg-gray-700 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id='home' className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-[#132E5D] overflow-hidden" dir="rtl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-[#387F3D] opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto z-10 w-full">
          {/* Main content grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16 px-4 md:px-8 lg:px-16 xl:px-32" dir='ltr'>
            {/* 3D Coin Animation - Now on left side */}
            <div className="order-1 flex justify-center md:justify-start">
              <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 perspective-1000">
                <div 
                  ref={coinRef}
                  className="relative w-full h-full preserve-3d transition-transform duration-100 ease-linear"
                  style={{ transformStyle: 'preserve-3d' }}
                  onMouseEnter={() => {
                    if (coinRef.current) {
                      coinRef.current.style.transition = 'transform 0.5s ease';
                      coinRef.current.style.transform = 'rotateY(0deg)';
                    }
                  }}
                  onMouseLeave={() => {
                    if (coinRef.current) {
                      coinRef.current.style.transition = 'transform 0.5s ease';
                    }
                  }}
                >
                  {/* Face avant (Photo 1) */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-100 to-gray-300 rounded-full overflow-hidden shadow-xl border-6 md:border-8 border-gray-200 coin-reflection coin-highlight"
                      style={{ backfaceVisibility: 'hidden' }}>
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                      <Image fill
                        src="/534146492_122134550528860794_7379940811194517947_n.jpg" 
                        alt="FINALIST SPORTS" 
                        className="w-full h-full object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                    </div>
                  </div>
                  
                  {/* Face arrière (Photo 2) */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-100 to-gray-300 rounded-full overflow-hidden shadow-xl border-6 md:border-8 border-gray-200 coin-reflection coin-highlight"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                      <Image fill
                        src="/486791548_1214433217353110_3670197155805224633_n.jpg" 
                        alt="Finalist Sports" 
                        className="w-full h-full object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                    </div>
                  </div>
                </div>
                
                {/* Ombre dynamique */}
                <div className="absolute -bottom-3 md:-bottom-4 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-3 md:h-4 bg-black rounded-full opacity-30 blur-md"></div>
              </div>
            </div>
            
            {/* Text content - Now on right side */}
            <div className="order-2 text-center md:text-right mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight" dir='rtl'>
                في <span className="text-[#387F3D]">Zitouni Pro Talent </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mb-6 md:mb-8 max-w-lg mx-auto md:mr-0">
              
              نكتشف ونطوّر المواهب الكروية عبر برامج تدريبية ومعسكرات احترافية عالية المستوى.
              نوفّر للاعبين مباريات تجريبية، اختبارات أداء، ومتابعة فردية لمسارهم الرياضي.
              بشراكتنا مع Finalist التركية، نفتح أبواب الاحتراف في السوقين التركي والأوروبي.
              معنا، تتحول الموهبة إلى مشروع احترافي حقيقي.
              </p>
            </div>
          </div>

          {/* Bottom section with image and stats */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-8 border-t border-white/20 pt-8 md:pt-12">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-700">
              <div className={`absolute inset-0 bg-gray-800 rounded-2xl transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#387F3D] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              
              <Image
                src="/haitham.jpg"
                alt="صورة توضيحية للتحول الرقمي"
                width={10000}
                height={10000}
                className={`rounded-2xl w-full h-auto transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
              <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-1 sm:mb-2">+100</div>
                <div className="text-gray-400 text-sm sm:text-lg">تربص ناجح</div>
              </div>
              <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-1 sm:mb-2">70%</div>
                <div className="text-gray-400 text-sm sm:text-lg">رضا العملاء</div>
              </div>
              <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-1 sm:mb-2">+10</div>
                <div className="text-gray-400 text-sm sm:text-lg">سنة خبرة</div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-[#387F3D] rounded-full opacity-20 animate-pulse"></div>
          <div className="hidden md:block absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full opacity-10 animate-pulse"></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 md:h-3 bg-white rounded-full mt-1 md:mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .coin-reflection::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 15%;
          width: 30%;
          height: 30%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 70%);
          border-radius: 50%;
          z-index: 2;
        }
        .coin-highlight::after {
          content: '';
          position: absolute;
          top: 20%;
          right: 20%;
          width: 15%;
          height: 15%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 100%);
          border-radius: 50%;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .coin-reflection::before {
            top: 12%;
            left: 12%;
            width: 25%;
            height: 25%;
          }
          .coin-highlight::after {
            top: 18%;
            right: 18%;
            width: 12%;
            height: 12%;
          }
        }
      `}</style>
    </>
  );
};

export default ArabicHeroSection;