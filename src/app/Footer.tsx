// components/ArabicFooter.tsx
const ArabicFooter = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-red-600 text-white font-bold text-xl py-2 px-3 rounded-md ml-3">ك ش</div>
              <span className="text-xl font-bold">كشاف تركيا</span>
            </div>
            <p className="text-gray-300 mb-4">
              وكالة كشف المواهب الرائدة في تركيا، نعمل على اكتشاف وتطوير المواهب الكروية الواعدة وربطها بأفضل الأندية والوكلاء حول العالم.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm3.7 14.077c-1.75.362-5.453.362-7.203 0-1.896-.391-2.117-1.538-2.246-2.077-.02-.086-.029-.176-.029-.265v-2.97c0-.182.108-.35.27-.431l2.5-1.423c.094-.055.204-.055.298 0l2.5 1.423c.161.08.27.25.27.43v2.97c0 .089-.01.179-.03.265-.056.242-.17.642-1.017.898.26.432.908 1.01 1.746 1.45 1.28.663 2.954.785 3.787.58.387-.095.64-.352.64-.66 0-.224-.106-.42-.274-.54-.344-.24-.83-.427-1.4-.567z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">الرئيسية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">من نحن</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">اللاعبون</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">البطولات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">شبكة الوكلاء</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">اتصل بنا</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">خدماتنا</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-white transition">اكتشاف المواهب</li>
              <li className="text-gray-300 hover:text-white transition">إدارة المسيرة الرياضية</li>
              <li className="text-gray-300 hover:text-white transition">التعاقد مع الأندية</li>
              <li className="text-gray-300 hover:text-white transition">تسويق اللاعبين</li>
              <li className="text-gray-300 hover:text-white transition">دورات و بطولات</li>
              <li className="text-gray-300 hover:text-white transition">خدمة إنشاء CV</li>
              <li className="text-gray-300 hover:text-white transition">الاستشارات الرياضية</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">معلومات الاتصال</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-1 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                  <p className="text-gray-300">immeuble aoun etage 06 app 501 20 mars jawhra sousse . Sousse 4000</p>
                  <p className="text-gray-300">jawahra sousse</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-gray-300" dir="ltr">+21624262849</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-300">info@turkishscout.com</span>
              </div>
              
              <div className="pt-4">
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition">
                  اتصل بنا
                </button>
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
                اشتراك
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 zitouni pro talent . جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">سياسة الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">شروط الخدمة</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">سياسة الكوكيز</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArabicFooter;