'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// Define types for our data
interface Competition {
  id: string;
  name: string;
  image_url: string;
  date: string;
  location: string;
  teams: string;
  created_at: string;
}

interface CompetitionFormData {
  name: string;
  image_url: string;
  date: string;
  location: string;
  teams: string;
}

interface CompetitionManagementProps {
  showMessage: (type: string, content: string) => void;
}

const CompetitionManagement = ({ showMessage }: CompetitionManagementProps) => {
  const [uploading, setUploading] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [competitionForm, setCompetitionForm] = useState<CompetitionFormData>({
    name: '',
    image_url: '',
    date: '',
    location: '',
    teams: ''
  });

  // Use useCallback to memoize the function and prevent infinite re-renders
  const fetchCompetitions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCompetitions(data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      showMessage('error', 'خطأ في تحميل البطولات');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `competitions/${fileName}`;

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
      setCompetitionForm({ ...competitionForm, image_url: imageUrl });
      showMessage('success', 'تم تحميل الصورة بنجاح!');
    }
  };

  const handleCompetitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompetition) {
        const { error } = await supabase
          .from('competitions')
          .update(competitionForm)
          .eq('id', editingCompetition.id);
        
        if (error) throw error;
        
        showMessage('success', 'تم تحديث البطولة بنجاح!');
      } else {
        const { error } = await supabase
          .from('competitions')
          .insert([competitionForm]);
        
        if (error) throw error;
        
        showMessage('success', 'تم إضافة البطولة بنجاح!');
      }
      
      setCompetitionForm({
        name: '',
        image_url: '',
        date: '',
        location: '',
        teams: ''
      });
      setEditingCompetition(null);
      fetchCompetitions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving competition:', error);
      showMessage('error', 'خطأ في حفظ البطولة');
    }
  };

  const handleEditCompetition = (competition: Competition) => {
    setEditingCompetition(competition);
    setCompetitionForm({
      name: competition.name,
      image_url: competition.image_url,
      date: competition.date,
      location: competition.location,
      teams: competition.teams
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذه البطولة؟')) return;
    
    try {
      const { error } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showMessage('success', 'تم حذف البطولة بنجاح!');
      fetchCompetitions();
    } catch (error) {
      console.error('Error deleting competition:', error);
      showMessage('error', 'خطأ في حذف البطولة');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">{editingCompetition ? 'تعديل البطولة' : 'إضافة بطولة جديدة'}</h2>
        <form onSubmit={handleCompetitionSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم البطولة</label>
              <input
                type="text"
                value={competitionForm.name}
                onChange={(e) => setCompetitionForm({ ...competitionForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة البطولة</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="competition-image-upload"
                />
                <label
                  htmlFor="competition-image-upload"
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer text-center hover:bg-blue-200 transition"
                >
                  {uploading ? 'جاري التحميل...' : 'اختر صورة'}
                </label>
                {competitionForm.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">تم تحميل الصورة بنجاح</p>
                    <div className="mt-1 w-24 h-24 border rounded-lg overflow-hidden relative">
                      <Image
                        src={competitionForm.image_url}
                        alt="معاينة"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                )}
                <input
                  type="url"
                  value={competitionForm.image_url}
                  onChange={(e) => setCompetitionForm({ ...competitionForm, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أو أدخل رابط الصورة مباشرة"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
              <input
                type="text"
                value={competitionForm.date}
                onChange={(e) => setCompetitionForm({ ...competitionForm, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: 15-20 أبريل 2023"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد الفرق</label>
              <input
                type="text"
                value={competitionForm.teams}
                onChange={(e) => setCompetitionForm({ ...competitionForm, teams: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: 32 فريق"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">المكان</label>
              <input
                type="text"
                value={competitionForm.location}
                onChange={(e) => setCompetitionForm({ ...competitionForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
              {uploading ? 'جاري المعالجة...' : editingCompetition ? 'تحديث' : 'إضافة البطولة'}
            </button>
            {editingCompetition && (
              <button
                type="button"
                onClick={() => {
                  setEditingCompetition(null);
                  setCompetitionForm({
                    name: '',
                    image_url: '',
                    date: '',
                    location: '',
                    teams: ''
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">قائمة البطولات</h2>
        {competitions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">لم يتم العثور على بطولات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">المكان</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">الفرق</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitions.map((competition) => (
                  <tr key={competition.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={competition.image_url}
                          alt={competition.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">{competition.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{competition.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">{competition.location}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">{competition.teams}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditCompetition(competition)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteCompetition(competition.id)}
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

export default CompetitionManagement;