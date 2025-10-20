'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Define types for our data
interface Video {
  id: string;
  title: string;
  video_id: string;
  created_at: string;
}

interface VideoFormData {
  title: string;
  video_id: string;
}

interface VideoManagementProps {
  showMessage: (type: string, content: string) => void;
}

const VideoManagement = ({ showMessage }: VideoManagementProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoForm, setVideoForm] = useState<VideoFormData>({
    title: '',
    video_id: ''
  });

  // Use useCallback to memoize the function and prevent infinite re-renders
  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      showMessage('error', 'خطأ في تحميل الفيديوهات');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(videoForm)
          .eq('id', editingVideo.id);
        
        if (error) throw error;
        
        showMessage('success', 'تم تحديث الفيديو بنجاح!');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([videoForm]);
        
        if (error) throw error;
        
        showMessage('success', 'تم إضافة الفيديو بنجاح!');
      }
      
      setVideoForm({
        title: '',
        video_id: ''
      });
      setEditingVideo(null);
      fetchVideos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving video:', error);
      showMessage('error', 'خطأ في حفظ الفيديو');
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      video_id: video.video_id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الفيديو؟')) return;
    
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showMessage('success', 'تم حذف الفيديو بنجاح!');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      showMessage('error', 'خطأ في حذف الفيديو');
    }
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">{editingVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</h2>
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الفيديو</label>
              <input
                type="text"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط فيديو YouTube</label>
              <input
                type="text"
                value={videoForm.video_id}
                onChange={(e) => setVideoForm({ ...videoForm, video_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 md:py-3 rounded-lg transition font-medium"
            >
              {editingVideo ? 'تحديث' : 'إضافة الفيديو'}
            </button>
            {editingVideo && (
              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setVideoForm({
                    title: '',
                    video_id: ''
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">قائمة الفيديوهات</h2>
        {videos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">لم يتم العثور على فيديوهات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">{video.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditVideo(video)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
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

export default VideoManagement;