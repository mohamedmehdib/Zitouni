'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// Define types for our data
interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  image_url: string;
  height: string;
  potential: string;
  club: string;
  created_at: string;
}

interface PlayerFormData {
  name: string;
  position: string;
  age: string;
  image_url: string;
  height: string;
  potential: string;
  club: string;
}

interface PlayerManagementProps {
  showMessage: (type: string, content: string) => void;
}

const PlayerManagement = ({ showMessage }: PlayerManagementProps) => {
  const [uploading, setUploading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playerForm, setPlayerForm] = useState<PlayerFormData>({
    name: '',
    position: '',
    age: '',
    image_url: '',
    height: '',
    potential: '',
    club: ''
  });

  // Use useCallback to memoize the function and prevent infinite re-renders
  const fetchPlayers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      showMessage('error', 'خطأ في تحميل اللاعبين');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `players/${fileName}`;

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
      setPlayerForm({ ...playerForm, image_url: imageUrl });
      showMessage('success', 'تم تحميل الصورة بنجاح!');
    }
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        const { error } = await supabase
          .from('players')
          .update({ ...playerForm, age: parseInt(playerForm.age) })
          .eq('id', editingPlayer.id);
        
        if (error) throw error;
        
        showMessage('success', 'تم تحديث اللاعب بنجاح!');
      } else {
        const { error } = await supabase
          .from('players')
          .insert([{ ...playerForm, age: parseInt(playerForm.age) }]);
        
        if (error) throw error;
        
        showMessage('success', 'تم إضافة اللاعب بنجاح!');
      }
      
      setPlayerForm({
        name: '',
        position: '',
        age: '',
        image_url: '',
        height: '',
        potential: '',
        club: ''
      });
      setEditingPlayer(null);
      fetchPlayers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving player:', error);
      showMessage('error', 'خطأ في حفظ اللاعب');
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPlayerForm({
      name: player.name,
      position: player.position,
      age: player.age.toString(),
      image_url: player.image_url,
      height: player.height,
      potential: player.potential,
      club: player.club
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا اللاعب؟')) return;
    
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showMessage('success', 'تم حذف اللاعب بنجاح!');
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      showMessage('error', 'خطأ في حذف اللاعب');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">{editingPlayer ? 'تعديل اللاعب' : 'إضافة لاعب جديد'}</h2>
        <form onSubmit={handlePlayerSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم اللاعب</label>
              <input
                type="text"
                value={playerForm.name}
                onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المركز</label>
              <select
                value={playerForm.position}
                onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">اختر المركز</option>
                <option value="حارس مرمى">حارس مرمى</option>
                <option value="مدافع">مدافع</option>
                <option value="وسط">وسط</option>
                <option value="مهاجم">مهاجم</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
              <input
                type="number"
                min="1"
                max="50"
                value={playerForm.age}
                onChange={(e) => setPlayerForm({ ...playerForm, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الطول</label>
              <input
                type="text"
                value={playerForm.height}
                onChange={(e) => setPlayerForm({ ...playerForm, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة اللاعب</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="player-image-upload"
                />
                <label
                  htmlFor="player-image-upload"
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer text-center hover:bg-blue-200 transition"
                >
                  {uploading ? 'جاري التحميل...' : 'اختر صورة'}
                </label>
                {playerForm.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">تم تحميل الصورة بنجاح</p>
                    <div className="mt-1 w-24 h-24 border rounded-lg overflow-hidden relative">
                      <Image
                        src={playerForm.image_url}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الإمكانيات (نجوم)</label>
              <select
                value={playerForm.potential}
                onChange={(e) => setPlayerForm({ ...playerForm, potential: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">اختر التقييم</option>
                <option value="★☆☆☆☆">★☆☆☆☆</option>
                <option value="★★☆☆☆">★★☆☆☆</option>
                <option value="★★★☆☆">★★★☆☆</option>
                <option value="★★★★☆">★★★★☆</option>
                <option value="★★★★★">★★★★★</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النادي</label>
              <input
                type="text"
                value={playerForm.club}
                onChange={(e) => setPlayerForm({ ...playerForm, club: e.target.value })}
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
              {uploading ? 'جاري المعالجة...' : editingPlayer ? 'تحديث' : 'إضافة اللاعب'}
            </button>
            {editingPlayer && (
              <button
                type="button"
                onClick={() => {
                  setEditingPlayer(null);
                  setPlayerForm({
                    name: '',
                    position: '',
                    age: '',
                    image_url: '',
                    height: '',
                    potential: '',
                    club: ''
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-900">قائمة اللاعبين</h2>
        {players.length === 0 ? (
          <p className="text-center text-gray-500 py-4">لم يتم العثور على لاعبين</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">المركز</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">العمر</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">النادي</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={player.image_url}
                          alt={player.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">{player.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">{player.position}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{player.age}</td>
                    <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">{player.club}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditPlayer(player)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
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

export default PlayerManagement;