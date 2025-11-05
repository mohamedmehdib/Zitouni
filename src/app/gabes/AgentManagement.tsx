'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// Define types for our data
interface Agent {
  id: string;
  name: string;
  company: string;
  location: string;
  image_url: string;
  specialties: string[];
  players_placed: number;
  created_at: string;
}

interface AgentFormData {
  name: string;
  company: string;
  location: string;
  image_url: string;
  specialties: string;
}

interface AgentManagementProps {
  showMessage: (type: string, content: string) => void;
}

const AgentManagement = ({ showMessage }: AgentManagementProps) => {
  const [uploading, setUploading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [agentForm, setAgentForm] = useState<AgentFormData>({
    name: '',
    company: '',
    location: '',
    image_url: '',
    specialties: ''
  });

  // Use useCallback to memoize the function and prevent infinite re-renders
  const fetchAgents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      showMessage('error', 'خطأ في تحميل الوكلاء');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `agents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setUploading(false);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      showMessage('error', 'خطأ في تحميل الصورة');
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      showMessage('error', 'يرجى اختيار ملف صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت');
      return;
    }

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setAgentForm({ ...agentForm, image_url: imageUrl });
      showMessage('success', 'تم تحميل الصورة بنجاح!');
    }
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specialtiesArray = agentForm.specialties.split(',').map(s => s.trim());
      
      if (editingAgent) {
        const { error } = await supabase
          .from('agents')
          .update({ 
            name: agentForm.name,
            company: agentForm.company,
            location: agentForm.location,
            image_url: agentForm.image_url,
            specialties: specialtiesArray
          })
          .eq('id', editingAgent.id);
        
        if (error) throw error;
        
        showMessage('success', 'تم تحديث الوكيل بنجاح!');
      } else {
        const { error } = await supabase
          .from('agents')
          .insert([{ 
            name: agentForm.name,
            company: agentForm.company,
            location: agentForm.location,
            image_url: agentForm.image_url,
            specialties: specialtiesArray,
            players_placed: 0 // Default value
          }]);
        
        if (error) throw error;
        
        showMessage('success', 'تم إضافة الوكيل بنجاح!');
      }
      
      setAgentForm({
        name: '',
        company: '',
        location: '',
        image_url: '',
        specialties: ''
      });
      setEditingAgent(null);
      fetchAgents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving agent:', error);
      showMessage('error', 'خطأ في حفظ الوكيل');
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setAgentForm({
      name: agent.name,
      company: agent.company,
      location: agent.location,
      image_url: agent.image_url,
      specialties: Array.isArray(agent.specialties) ? agent.specialties.join(', ') : agent.specialties || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الوكيل؟')) return;
    
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showMessage('success', 'تم حذف الوكيل بنجاح!');
      fetchAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      showMessage('error', 'خطأ في حذف الوكيل');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">{editingAgent ? 'تعديل الوكيل' : 'إضافة وكيل جديد'}</h2>
        <form onSubmit={handleAgentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوكيل</label>
              <input
                type="text"
                value={agentForm.name}
                onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الشركة</label>
              <input
                type="text"
                value={agentForm.company}
                onChange={(e) => setAgentForm({ ...agentForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البلد</label>
              <input
                type="text"
                value={agentForm.location}
                onChange={(e) => setAgentForm({ ...agentForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة الوكيل</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="agent-image-upload"
                />
                <label
                  htmlFor="agent-image-upload"
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer text-center hover:bg-blue-200 transition"
                >
                  {uploading ? 'جاري التحميل...' : 'اختر صورة'}
                </label>
                {agentForm.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">تم تحميل الصورة بنجاح</p>
                    <div className="mt-1 w-24 h-24 border rounded-lg overflow-hidden relative">
                      <Image
                        src={agentForm.image_url}
                        alt="معاينة"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">التخصصات (مفصولة بفواصل)</label>
              <input
                type="text"
                value={agentForm.specialties}
                onChange={(e) => setAgentForm({ ...agentForm, specialties: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: الدوري الإنجليزي، الدوري التركي، الليغا"
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 md:py-3 rounded-lg transition font-medium"
              disabled={uploading}
            >
              {uploading ? 'جاري المعالجة...' : editingAgent ? 'تحديث' : 'إضافة الوكيل'}
            </button>
            {editingAgent && (
              <button
                type="button"
                onClick={() => {
                  setEditingAgent(null);
                  setAgentForm({
                    name: '',
                    company: '',
                    location: '',
                    image_url: '',
                    specialties: ''
                  });
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-400 text-white py-2 md:py-3 rounded-lg transition font-medium"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">قائمة الوكلاء</h2>
        {agents.length === 0 ? (
          <p className="text-center text-gray-500 py-4">لم يتم العثور على وكلاء</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">الشركة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">الموقع</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={agent.image_url}
                          alt={agent.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">{agent.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">{agent.company}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{agent.location}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;