'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    age: '',
    sex: '',
    previousClub: '',
    height: '',
    position: '',
    accommodation: '',
    message: ''
  });

  // Captcha states
  const [captchaImg, setCaptchaImg] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaSolution, setCaptchaSolution] = useState(''); // For fallback
  const [usingFallbackCaptcha, setUsingFallbackCaptcha] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  // Simple fallback captcha generation
  const generateFallbackCaptcha = () => {
    // Generate a simple math captcha as fallback
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const answer = num1 + num2;
    
    return {
      image: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
          <rect width="100%" height="100%" fill="#f8f9fa"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                font-family="Arial" font-size="24" fill="#333">${num1} + ${num2} = ?</text>
        </svg>
      `)}`,
      token: `fallback-${Date.now()}`,
      answer: answer.toString()
    };
  };

  // Load captcha safely
  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://api.opencaptcha.io/captcha', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      
      const data = await res.json();
      
      if (!data.image || !data.token) {
        throw new Error('Incomplete captcha data from API');
      }
      
      setCaptchaImg(data.image);
      setCaptchaToken(data.token);
      setUsingFallbackCaptcha(false);
    } catch (err) {
      console.warn('Using fallback captcha due to API error:', err);
      // Use fallback captcha
      const fallbackCaptcha = generateFallbackCaptcha();
      setCaptchaImg(fallbackCaptcha.image);
      setCaptchaToken(fallbackCaptcha.token);
      setCaptchaSolution(fallbackCaptcha.answer);
      setUsingFallbackCaptcha(true);
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate captcha
    let captchaValid = false;
    
    if (usingFallbackCaptcha) {
      // Validate fallback captcha
      captchaValid = captchaAnswer === captchaSolution;
    } else {
      // Validate with API
      try {
        const res = await fetch('https://api.opencaptcha.io/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: captchaToken,
            answer: captchaAnswer
          })
        });

        const result = await res.json();
        captchaValid = result.success === true;
      } catch (err) {
        console.error('Captcha verification error:', err);
        setError('تعذر التحقق من كابتشا. حاول مرة أخرى.');
        setIsSubmitting(false);
        loadCaptcha();
        return;
      }
    }

    if (!captchaValid) {
      setError('إجابة كابتشا غير صحيحة. حاول مرة أخرى.');
      setIsSubmitting(false);
      loadCaptcha();
      return;
    }

    try {
      // Insert data into Supabase
      const { data, error: supabaseError } = await supabase
        .from('player_registrations')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            nationality: formData.nationality,
            age: parseInt(formData.age),
            sex: formData.sex,
            previous_club: formData.previousClub,
            height: parseInt(formData.height),
            position: formData.position,
            accommodation: formData.accommodation,
            additional_info: formData.message,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Success
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        nationality: '',
        age: '',
        sex: '',
        previousClub: '',
        height: '',
        position: '',
        accommodation: '',
        message: ''
      });
      loadCaptcha();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openContractPdf = () => {
    window.open('/contract.pdf', '_blank');
  };

  if (isSubmitted) {
    return (
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded-lg text-center"
        dir="rtl"
      >
        <div className="text-2xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2">تم إرسال طلبك بنجاح!</h3>
        <p className="mb-4">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          إرسال طلب جديد
        </button>
      </div>
    );
  }

  return (
    <div id="contact" className="bg-white rounded-lg shadow-lg p-6 md:p-8" dir="rtl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        نموذج الاتصال - لاعب كرة القدم
      </h2>

      {/* Contract PDF Button */}
      <div className="mb-6 text-center">
        <button
          onClick={openContractPdf}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center"
        >
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          عرض عقد اللاعبين
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>خطأ: </strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* الاسم الشخصي + اللقب */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              الاسم الشخصي *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسمك الشخصي"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              اللقب *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل لقبك"
            />
          </div>
        </div>

        {/* الجنسية + العمر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nationality"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              الجنسية *
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل جنسيتك"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              العمر *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل عمرك"
            />
          </div>
        </div>

        {/* الجنس + الطول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              الجنس *
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر الجنس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              الطول (سم) *
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل طولك"
            />
          </div>
        </div>

        {/* المركز + الإقامة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              المركز *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل مركزك"
            />
          </div>
          <div>
            <label
              htmlFor="accommodation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              مكان الإقامة *
            </label>
            <input
              type="text"
              id="accommodation"
              name="accommodation"
              value={formData.accommodation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل مكان إقامتك"
            />
          </div>
        </div>

        {/* النادي السابق */}
        <div>
          <label
            htmlFor="previousClub"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            النادي السابق
          </label>
          <input
            type="text"
            id="previousClub"
            name="previousClub"
            value={formData.previousClub}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل ناديك السابق"
          />
        </div>

        {/* الرسالة */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ملاحظات إضافية
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="اكتب ملاحظاتك هنا..."
          />
        </div>

        {/* CAPTCHA Challenge */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="captcha"
              className="block text-sm font-medium text-gray-700"
            >
              تحقق من أنك لست روبوتًا *
            </label>
            <button
              type="button"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 text-sm flex items-center"
            >
              {captchaLoading ? '⏳' : '🔄'} تحديث
            </button>
          </div>
          
          {captchaLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse text-gray-500">جاري تحميل التحقق...</div>
            </div>
          ) : (
            <>
              {captchaImg && (
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <img
                    src={captchaImg}
                    alt="captcha"
                    className="border border-gray-300 rounded-lg bg-white px-2 py-1 h-12"
                  />
                  <input
                    type="text"
                    id="captcha"
                    value={captchaAnswer}
                    onChange={e => setCaptchaAnswer(e.target.value)}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الرموز"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {usingFallbackCaptcha 
                  ? 'حل المسألة الحسابية أعلاه لإثبات أنك لست روبوتًا.'
                  : 'يرجى إدخال الرموز الظاهرة أعلاه لإثبات أنك لست روبوتًا.'}
              </p>
            </>
          )}
        </div>

        {/* زر الإرسال */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري الإرسال...
              </>
            ) : (
              'إرسال الطلب'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;