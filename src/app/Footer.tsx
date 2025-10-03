// components/ArabicFooter.tsx
'use client';

interface ArabicFooterProps {
  onServiceClick: (serviceName: string) => void;
}

const ArabicFooter = ({ onServiceClick }: ArabicFooterProps) => {
  // Function to handle smooth scrolling
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
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
    <footer className="bg-blue-900 text-white pt-12 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-xl font-bold">Zitouni Pro Talent</span>
            </div>
            <p className="text-gray-300 mb-4">
              وكالة كشف المواهب الرائدة في تركيا، نعمل على اكتشاف وتطوير المواهب الكروية الواعدة وربطها بأفضل الأندية والوكلاء حول العالم.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {/* Facebook */}
              <a 
                href="https://facebook.com/zitouniprotalent" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/zitouniprotalent" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              
              {/* TikTok */}
              <a 
                href="https://tiktok.com/@zitouniprotalent" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition"
              >
                <i className="fab fa-tiktok text-xl"></i>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com/@zitouniprotalent" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleSmoothScroll(e, 'home')} 
                  className="text-gray-300 hover:text-white transition block"
                >
                  من نحن
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio" 
                  onClick={(e) => handleSmoothScroll(e, 'portfolio')} 
                  className="text-gray-300 hover:text-white transition block"
                >
                  اللاعبون
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio" 
                  onClick={(e) => handleSmoothScroll(e, 'portfolio')} 
                  className="text-gray-300 hover:text-white transition block"
                >
                  البطولات
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio" 
                  onClick={(e) => handleSmoothScroll(e, 'portfolio')} 
                  className="text-gray-300 hover:text-white transition block"
                >
                  شبكة الوكلاء
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleSmoothScroll(e, 'contact')} 
                  className="text-gray-300 hover:text-white transition block"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">خدماتنا</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onServiceClick('اكتشاف المواهب')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  اكتشاف المواهب
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('إدارة المسيرة الرياضية')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  إدارة المسيرة الرياضية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('التعاقد مع الأندية')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  التعاقد مع الأندية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('تسويق اللاعبين')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  تسويق اللاعبين
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('دورات و بطولات')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  دورات و بطولات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('خدمة إنشاء CV')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  خدمة إنشاء CV
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onServiceClick('الاستشارات الرياضية')}
                  className="text-gray-300 hover:text-white transition text-right w-full hover:underline"
                >
                  الاستشارات الرياضية
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">معلومات الاتصال</h3>
            <div className="space-y-4">
              <div>
                <i className="fas fa-map-marker-alt mt-1 ml-3 text-red-500 w-5 h-5"></i>
                <div>
                  <p className="text-gray-300">immeuble aoun etage 06 app 501 20 mars jawhra sousse . Sousse 4000</p>
                  <p className="text-gray-300">jawahra sousse</p>
                </div>
              </div>
              
              <div>
                <i className="fas fa-phone text-red-500 w-5 h-5"></i>
                <span className="text-gray-300" dir="ltr">+21624262849</span>
              </div>
              
              <div>
                <i className="fas fa-envelope text-red-500 w-5 h-5"></i>
                <span className="text-gray-300">info@zitouniprotalent.com</span>
              </div>

              <div>
                <i className="fas fa-globe text-red-500 w-5 h-5"></i>
                <span className="text-gray-300">www.zitouniprotalent.com</span>
              </div>
              
              <div className="pt-4">
                <a 
                  href="#contact" 
                  onClick={(e) => handleSmoothScroll(e, 'contact')} 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition inline-block"
                >
                  اتصل بنا
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-blue-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold mb-2">اشترك في نشرتنا الإخبارية</h3>
              <p className="text-gray-300">احصل على آخر أخبار المواهب والبطولات</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-blue-800 text-white px-4 py-2 rounded-l-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-r-lg transition">
                <i className="fas fa-paper-plane ml-2"></i>
                اشتراك
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Zitouni Pro Talent . جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition">سياسة الخصوصية</a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition">شروط الخدمة</a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition">سياسة الكوكيز</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArabicFooter;