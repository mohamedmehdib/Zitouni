// app/admin/page.tsx
'use client';

import { useState } from 'react';
import PlayerManagement from './PlayerManagement';
import CompetitionManagement from './CompetitionManagement';
import VideoManagement from './VideoManagement';
import AgentManagement from './AgentManagement';
import MessagesManagement from './MessagesManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [message, setMessage] = useState({ type: '', content: '' });

  const showMessage = (type: string, content: string) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">لوحة تحكم المشرف</h1>
        
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