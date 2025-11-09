
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PlayerManagement from './PlayerManagement';
import CompetitionManagement from './CompetitionManagement';
import VideoManagement from './VideoManagement';
import AgentManagement from './AgentManagement';
import MessagesManagement from './MessagesManagement';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('players');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLoginForm = () => {
    const errors = {
      email: '',
      password: '',
      general: ''
    };

    if (!loginForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!loginForm.password) {
      errors.password = 'كلمة المرور مطلوبة';
    }

    setLoginErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({ email: '', password: '', general: '' });

    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        setLoginErrors(prev => ({
          ...prev,
          general: 'بيانات الدخول غير صحيحة'
        }));
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
        showMessage('success', 'تم تسجيل الدخول بنجاح!');
        setLoginForm({ email: '', password: '' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginErrors(prev => ({
        ...prev,
        general: 'بيانات الدخول غير صحيحة'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      showMessage('success', 'تم تسجيل الخروج بنجاح!');
    } catch (error) {
      console.error('Logout error:', error);
      showMessage('error', 'حدث خطأ أثناء تسجيل الخروج.');
    }
  };

  const showMessage = (type: string, content: string) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول إلى لوحة التحكم
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            للمشرفين فقط
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {message.content && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.content}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              {loginErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {loginErrors.general}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">إجراءات أمنية</span>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-700 text-center">
                  هذه الصفحة مخصصة للمشرفين فقط. يرجى التأكد من أنك مخول للوصول إلى هذه اللوحة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin dashboard if logged in
  return (
    <div className="min-h-screen bg-gray-100 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">لوحة تحكم المشرف</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
          >
            تسجيل الخروج
          </button>
        </div>
        
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.content}
          </div>
        )}
        
        {/* التنقل بين التبويبات */}
        <div className="bg-white shadow-md rounded-lg mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'players', label: 'إدارة اللاعبين' },
              { id: 'competitions', label: 'إدارة البطولات' },
              { id: 'videos', label: 'إدارة الفيديوهات' },
              { id: 'agents', label: 'إدارة الوكلاء' },
              { id: 'messages', label: 'الرسائل المستلمة' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${activeTab === tab.id ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-600 hover:text-blue-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* عرض التبويب النشط */}
        {activeTab === 'players' && <PlayerManagement showMessage={showMessage} />}
        {activeTab === 'competitions' && <CompetitionManagement showMessage={showMessage} />}
        {activeTab === 'videos' && <VideoManagement showMessage={showMessage} />}
        {activeTab === 'agents' && <AgentManagement showMessage={showMessage} />}
        {activeTab === 'messages' && <MessagesManagement showMessage={showMessage} />}
      </div>
    </div>
  );
};


export default AdminDashboard;
