// components/MessagesManagement.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

interface PlayerRegistration {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  age: number;
  sex: string;
  phone: string;
  previous_club: string | null;
  height: number;
  position: string;
  accommodation: string | null;
  additional_info: string | null;
  created_at: string;
  is_active: boolean; // New field to track if message is active
  responded_at: string | null; // New field to track response time
}

interface MessagesManagementProps {
  showMessage: (type: string, content: string) => void;
}

const MessagesManagement = ({ showMessage }: MessagesManagementProps) => {
  const [messages, setMessages] = useState<PlayerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<PlayerRegistration | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Use useCallback to memoize the function and prevent infinite re-renders
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('player_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setMessages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات';
      setError(errorMessage);
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleMessageStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const respondedAt = newStatus ? null : new Date().toISOString();

      const { error: supabaseError } = await supabase
        .from('player_registrations')
        .update({ 
          is_active: newStatus,
          responded_at: respondedAt
        })
        .eq('id', id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === id 
          ? { ...msg, is_active: newStatus, responded_at: respondedAt }
          : msg
      ));

      // Update selected message if it's the one being toggled
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => 
          prev ? { ...prev, is_active: newStatus, responded_at: respondedAt } : null
        );
      }

      const statusText = newStatus ? 'نشط' : 'غير نشط';
      showMessage('success', `تم ${newStatus ? 'تفعيل' : 'تعطيل'} الرسالة بنجاح`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تغيير حالة الرسالة';
      setError(errorMessage);
      showMessage('error', errorMessage);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
      const { error: supabaseError } = await supabase
        .from('player_registrations')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Remove from local state
      setMessages(prev => prev.filter(msg => msg.id !== id));
      setSelectedMessage(null);
      showMessage('success', 'تم حذف الرسالة بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في الحذف';
      setError(errorMessage);
      showMessage('error', errorMessage);
    }
  };

  // تنسيق التاريخ والوقت الميلادي
  const formatGregorianDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('fr', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter messages based on status
  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    if (filter === 'active') return message.is_active;
    if (filter === 'inactive') return !message.is_active;
    return true;
  });

  // Count messages by status
  const activeCount = messages.filter(msg => msg.is_active).length;
  const inactiveCount = messages.filter(msg => !msg.is_active).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <strong>خطأ: </strong> {error}
        <button 
          onClick={fetchMessages}
          className="mr-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الرسائل المستلمة</h2>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button 
            onClick={fetchMessages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            تحديث
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            الكل ({messages.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'active'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            النشطة ({activeCount})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'inactive'
                ? 'border-b-2 border-gray-500 text-gray-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            المستجيَب عليها ({inactiveCount})
          </button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filter === 'all' 
            ? 'لا توجد رسائل لعرضها'
            : filter === 'active'
            ? 'لا توجد رسائل نشطة'
            : 'لا توجد رسائل مستجيَب عليها'
          }
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : message.is_active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="font-semibold text-gray-800">
                      {message.first_name} {message.last_name}
                    </h3>
                    {!message.is_active && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                        ✓ مستجيَب
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {message.sex}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.is_active ? 'نشط' : 'مستجيَب'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>العمر: {message.age} سنة</p>
                  <p>الطول: {message.height} سم</p>
                  <p>المركز: {message.position}</p>
                  <p>الهاتف: <span dir='ltr'>+{message.phone}</span></p>
                  <p>الإقامة: {message.accommodation || 'غير محدد'}</p>
                  {!message.is_active && message.responded_at && (
                    <p className="text-xs text-gray-400">
                      تم الرد: {formatGregorianDateTime(message.responded_at)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400" dir='ltr'>
                    {formatGregorianDateTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Details */}
          <div className="lg:border-r lg:pr-6 lg:border-gray-200">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedMessage.first_name} {selectedMessage.last_name}
                    </h3>
                    {!selectedMessage.is_active && (
                      <span className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                        ✓ مستجيَب عليها
                      </span>
                    )}
                  </div>
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {selectedMessage.sex}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">الجنسية:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.nationality}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">العمر:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.age} سنة</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">الطول:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.height} سم</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">رقم الهاتف:</label>
                    <p className="text-gray-800 mt-1"><span dir='ltr'>+{selectedMessage.phone}</span></p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">النادي السابق:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.previous_club || 'غير محدد'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">المركز:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.position}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">الإقامة:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.accommodation || 'غير محدد'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">الحالة:</label>
                    <p className={`mt-1 ${
                      selectedMessage.is_active 
                        ? 'text-green-600 font-semibold' 
                        : 'text-gray-600'
                    }`}>
                      {selectedMessage.is_active ? 'نشط' : 'مستجيَب عليها'}
                    </p>
                  </div>
                </div>

                {selectedMessage.additional_info && (
                  <div>
                    <label className="font-medium text-gray-600">معلومات إضافية:</label>
                    <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedMessage.additional_info}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">تاريخ الإرسال:</label>
                    <p className="text-gray-800 mt-1 text-right" dir='ltr'>
                      {formatGregorianDateTime(selectedMessage.created_at)}
                    </p>
                  </div>
                  {!selectedMessage.is_active && selectedMessage.responded_at && (
                    <div>
                      <label className="font-medium text-gray-600">تاريخ الرد:</label>
                      <p className="text-gray-800 mt-1 text-right" dir='ltr'>
                        {formatGregorianDateTime(selectedMessage.responded_at)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 space-x-reverse justify-end pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => toggleMessageStatus(selectedMessage.id, selectedMessage.is_active)}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      selectedMessage.is_active
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {selectedMessage.is_active ? 'تم الرد ✓' : 'إعادة التفعيل'}
                  </button>
                  <button 
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                اختر رسالة لعرض التفاصيل
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;