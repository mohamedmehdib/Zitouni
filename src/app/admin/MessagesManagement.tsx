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
  previous_club: string | null;
  height: number;
  position: string;
  accommodation: string | null;
  additional_info: string | null;
  created_at: string;
}

interface MessagesManagementProps {
  showMessage: (type: string, content: string) => void;
}

const MessagesManagement = ({ showMessage }: MessagesManagementProps) => {
  const [messages, setMessages] = useState<PlayerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<PlayerRegistration | null>(null);

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

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا توجد رسائل لعرضها
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {message.first_name} {message.last_name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {(message.sex)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>العمر: {message.age} سنة</p>
                  <p>الطول: {message.height} سم</p>
                  <p>المركز: {message.position}</p>
                  <p>الإقامة: {(message.accommodation)}</p>
                  <p className="text-xs text-gray-400">
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
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </h3>
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {(selectedMessage.sex)}
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
                    <label className="font-medium text-gray-600">النادي السابق:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.previous_club || 'غير محدد'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">المركز:</label>
                    <p className="text-gray-800 mt-1">{selectedMessage.position}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">الإقامة:</label>
                    <p className="text-gray-800 mt-1">{(selectedMessage.accommodation)}</p>
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

                <div>
                  <label className="font-medium text-gray-600">تاريخ الإرسال:</label>
                  <p className="text-gray-800 mt-1">
                    {formatGregorianDateTime(selectedMessage.created_at)}
                  </p>
                </div>

                <div className="flex space-x-2 space-x-reverse justify-end pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
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