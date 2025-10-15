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
  available: boolean;
  quotation_file: string;
  created_at: string;
}

interface CompetitionFormData {
  name: string;
  image_url: string;
  date: string;
  location: string;
  teams: string;
  available: boolean;
  quotation_file: string;
}

interface CompetitionManagementProps {
  showMessage: (type: string, content: string) => void;
}

const CompetitionManagement = ({ showMessage }: CompetitionManagementProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [competitionForm, setCompetitionForm] = useState<CompetitionFormData>({
    name: '',
    image_url: '',
    date: '',
    location: '',
    teams: '',
    available: true,
    quotation_file: ''
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

  const uploadPdf = async (file: File) => {
    try {
      setUploadingPdf(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `quotations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('file')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('file')
        .getPublicUrl(filePath);

      setUploadingPdf(false);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadingPdf(false);
      showMessage('error', 'خطأ في تحميل ملف PDF');
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showMessage('error', 'يرجى اختيار ملف PDF فقط');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('error', 'يجب أن يكون حجم الملف أقل من 10 ميجابايت');
      return;
    }

    const pdfUrl = await uploadPdf(file);
    if (pdfUrl) {
      setCompetitionForm({ ...competitionForm, quotation_file: pdfUrl });
      showMessage('success', 'تم تحميل ملف طلب عرض الأسعار بنجاح!');
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
        teams: '',
        available: true,
        quotation_file: ''
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
      teams: competition.teams,
      available: competition.available,
      quotation_file: competition.quotation_file
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

  const toggleAvailability = async (competition: Competition) => {
    try {
      const { error } = await supabase
        .from('competitions')
        .update({ available: !competition.available })
        .eq('id', competition.id);
      
      if (error) throw error;
      
      showMessage('success', `تم ${!competition.available ? 'تفعيل' : 'إيقاف'} البطولة بنجاح!`);
      fetchCompetitions();
    } catch (error) {
      console.error('Error updating competition availability:', error);
      showMessage('error', 'خطأ في تحديث حالة البطولة');
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
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">طلب عرض الأسعار (PDF)</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={handlePdfUpload}
                  accept=".pdf"
                  className="hidden"
                  id="quotation-file-upload"
                />
                <label
                  htmlFor="quotation-file-upload"
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer text-center hover:bg-green-200 transition"
                >
                  {uploadingPdf ? 'جاري التحميل...' : 'اختر ملف PDF'}
                </label>
                {competitionForm.quotation_file && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">تم تحميل الملف بنجاح</p>
                    <a 
                      href={competitionForm.quotation_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      عرض الملف
                    </a>
                  </div>
                )}
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

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={competitionForm.available}
                  onChange={(e) => setCompetitionForm({ ...competitionForm, available: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                />
                <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                  البطولة متاحة
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">إلغاء التحديد يعني أن البطولة منتهية</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 md:py-3 rounded-lg transition font-medium"
              disabled={uploading || uploadingPdf}
            >
              {(uploading || uploadingPdf) ? 'جاري المعالجة...' : editingCompetition ? 'تحديث' : 'إضافة البطولة'}
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
                    teams: '',
                    available: true,
                    quotation_file: ''
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitions.map((competition) => (
                  <tr key={competition.id} className={competition.available ? '' : 'bg-gray-50'}>
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
                    <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">
                      <div className="flex flex-col">
                        <span className={competition.available ? '' : 'text-gray-500'}>{competition.name}</span>
                        {competition.quotation_file && (
                          <a 
                            href={competition.quotation_file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 mt-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            عرض الأسعار
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{competition.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">{competition.location}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">{competition.teams}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        competition.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {competition.available ? 'متاحة' : 'منتهية'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditCompetition(competition)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => toggleAvailability(competition)}
                          className={`px-2 py-1 rounded ${
                            competition.available 
                              ? 'text-orange-600 hover:text-orange-900 bg-orange-50' 
                              : 'text-green-600 hover:text-green-900 bg-green-50'
                          }`}
                        >
                          {competition.available ? 'إيقاف' : 'تفعيل'}
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