// components/BodyContentArabic.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Define types for our data
interface Player {
  id: string;
  name: string;
  club: string;
  position: string;
  age: number;
  potential: number;
  image_url: string;
  created_at: string;
}

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  teams: string;
  image_url: string;
  available: boolean;
  quotation_file: string;
}

interface Video {
  id: string;
  title: string;
  video_id: string;
  player_name: string;
  position: string;
  age: number;
  club: string;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  company: string;
  location: string;
  specialties: string[] | string;
  players_placed?: string; // Changed to string for WhatsApp number
  image_url: string;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BodyContentArabic = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [players, setPlayers] = useState<Player[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState({
    players: true,
    competitions: true,
    videos: true,
    agents: true
  });
  const [error, setError] = useState({
    players: false,
    competitions: false,
    videos: false,
    agents: false
  });
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Function to handle WhatsApp redirection
  const handleWhatsAppRedirect = (phoneNumber: string) => {
    // Ensure the phone number has the correct format
    let formattedNumber = phoneNumber.trim();
    
    // Remove any existing + sign
    if (formattedNumber.startsWith('+')) {
      formattedNumber = formattedNumber.substring(1);
    }
    
    // Add the + sign for WhatsApp
    const whatsappNumber = `+${formattedNumber}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Fetch players data
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPlayers(data || []);
        setError(prev => ({ ...prev, players: false }));
      } catch (error) {
        console.error('Error fetching players:', error);
        setError(prev => ({ ...prev, players: true }));
        setPlayers([]);
      } finally {
        setLoading(prev => ({ ...prev, players: false }));
      }
    };

    if (activeTab === 'players') {
      fetchPlayers();
    }
  }, [activeTab]);

  // Fetch competitions data
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const { data, error } = await supabase
          .from('competitions')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        setCompetitions(data || []);
        setError(prev => ({ ...prev, competitions: false }));
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setError(prev => ({ ...prev, competitions: true }));
        setCompetitions([]);
      } finally {
        setLoading(prev => ({ ...prev, competitions: false }));
      }
    };

    if (activeTab === 'competitions') {
      fetchCompetitions();
    }
  }, [activeTab]);

  // Fetch videos data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setVideos(data || []);
        setError(prev => ({ ...prev, videos: false }));
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(prev => ({ ...prev, videos: true }));
        setVideos([]);
      } finally {
        setLoading(prev => ({ ...prev, videos: false }));
      }
    };

    if (activeTab === 'videos') {
      fetchVideos();
    }
  }, [activeTab]);

  // Fetch agents data
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAgents(data || []);
        setError(prev => ({ ...prev, agents: false }));
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError(prev => ({ ...prev, agents: true }));
        setAgents([]);
      } finally {
        setLoading(prev => ({ ...prev, agents: false }));
      }
    };

    if (activeTab === 'agents') {
      fetchAgents();
    }
  }, [activeTab]);

  const extractVideoId = (url: string): string | null => {
    // Handle YouTube Shorts URLs
    if (url.includes('youtube.com/shorts/')) {
      const match = url.match(/youtube\.com\/shorts\/([^?#&]+)/);
      return match ? match[1] : null;
    }
    
    // Handle regular YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      const match = url.match(/youtube\.com\/watch\?v=([^&#]+)/);
      return match ? match[1] : null;
    }
    
    // Handle youtu.be URLs (both regular and shorts)
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?#&]+)/);
      return match ? match[1] : null;
    }
    
    // Handle YouTube embed URLs
    if (url.includes('youtube.com/embed/')) {
      const match = url.match(/youtube\.com\/embed\/([^?#&]+)/);
      return match ? match[1] : null;
    }
    
    // If it's already just an ID (11 characters typical for YouTube)
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
      return url;
    }
    
    return null;
  };

  const getEmbedUrl = (videoId: string | null): string => {
    if (!videoId) return '';
    
    // For YouTube Shorts, use the regular embed URL - they work the same way
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const isYouTubeShort = (url: string): boolean => {
    return url.includes('youtube.com/shorts/') || 
           (url.includes('youtu.be/') && url.length < 50); // Shorts often have shorter URLs
  };

  // Helper function to safely handle specialties (array or string)
  const getSpecialtiesArray = (specialties: string[] | string): string[] => {
    if (Array.isArray(specialties)) {
      return specialties;
    }
    
    if (typeof specialties === 'string') {
      // Try to parse as JSON array first
      try {
        const parsed = JSON.parse(specialties);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // If not JSON, split by comma or other delimiters
        console.log(e)
        if (specialties.includes(',')) {
          return specialties.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else if (specialties.includes(';')) {
          return specialties.split(';').map(s => s.trim()).filter(s => s.length > 0);
        } else if (specialties.trim().length > 0) {
          return [specialties.trim()];
        }
      }
    }
    
    return [];
  };

  // Handle competition click
  const handleCompetitionClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    
    if (competition.available) {
      setShowMessageModal(true);
    }
    // If not available, do nothing or show a different message
  };

  // Handle PDF view
  const handleViewDevis = () => {
    if (selectedCompetition?.quotation_file) {
      window.open(selectedCompetition.quotation_file, '_blank', 'noopener,noreferrer');
    }
    setShowMessageModal(false);
  };

  return (
    <div id='portfolio' className="pt-16" dir="rtl">
      {/* Tab Navigation */}
      <div className="sticky top-16 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide pt-2">
            {[
              { id: 'players', label: 'اللاعبين المميزين' },
              { id: 'competitions', label: 'البطولات' },
              { id: 'videos', label: 'فيديوهات عامة' },
              { id: 'agents', label: 'شبكة الوكلاء' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-600 hover:text-blue-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Players Section */}
      {activeTab === 'players' && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-900">المواهب المميزة</h2>
            
            {loading.players ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : error.players ? (
              <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">خطأ في الاتصال! </strong>
                  <span className="block sm:inline">تعذر تحميل بيانات اللاعبين. يرجى المحاولة مرة أخرى لاحقًا.</span>
                </div>
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">لا توجد بيانات! </strong>
                  <span className="block sm:inline">لا يوجد أي لاعبين في قاعدة البيانات حالياً.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {players.map((player) => (
                  <div key={player.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 sm:h-52 md:h-60">
                      <Image
                        src={player.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'}
                        alt={player.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {player.position}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-lg text-blue-900 mb-1">{player.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{player.club}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">العمر: {player.age}</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">الإمكانيات: {player.potential}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Competitions Section */}
      {activeTab === 'competitions' && (
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-900">البطولات والمسابقات</h2>
            
            {loading.competitions ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : error.competitions ? (
              <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">خطأ في الاتصال! </strong>
                  <span className="block sm:inline">تعذر تحميل بيانات البطولات. يرجى المحاولة مرة أخرى لاحقًا.</span>
                </div>
              </div>
            ) : competitions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">لا توجد بيانات! </strong>
                  <span className="block sm:inline">لا توجد أي بطولات في قاعدة البيانات حالياً.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {competitions.map((competition) => (
                  <div 
                    key={competition.id} 
                    className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:scale-105 ${
                      competition.available 
                        ? 'bg-white border-2 border-transparent hover:border-blue-500' 
                        : 'bg-gray-100 border-2 border-gray-300 opacity-75'
                    }`}
                    onClick={() => handleCompetitionClick(competition)}
                  >
                    <div className="relative h-40 sm:h-48">
                      <Image
                        src={competition.image_url || 'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'}
                        alt={competition.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <h3 className="text-white text-lg md:text-xl font-bold">{competition.name}</h3>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          competition.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {competition.available ? 'متاحة' : 'منتهية'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="truncate">{competition.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{competition.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="truncate">{competition.teams}</span>
                      </div>
                      {competition.available && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            انقر لعرض التفاصيل
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {activeTab === 'videos' && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-900">أبرز اللاعبين</h2>
            
            {loading.videos ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : error.videos ? (
              <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">خطأ في الاتصال! </strong>
                  <span className="block sm:inline">تعذر تحميل مقاطع الفيديو. يرجى المحاولة مرة أخرى لاحقًا.</span>
                </div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">لا توجد بيانات! </strong>
                  <span className="block sm:inline">لا توجد أي مقاطع فيديو في قاعدة البيانات حالياً.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                {videos.map((video) => {
                  const videoId = extractVideoId(video.video_id);
                  const isShort = isYouTubeShort(video.video_id);
                  
                  return (
                    <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div 
                        className={`video-container ${isShort ? 'short-video' : ''}`} 
                        style={{ 
                          position: 'relative', 
                          paddingBottom: '56.25%',
                          height: 0, 
                          overflow: 'hidden' 
                        }}
                      >
                        <iframe 
                          src={getEmbedUrl(videoId)}
                          title={video.title}
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            border: 0 
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-blue-900 mb-1">{video.player_name}</h3>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{video.position}</span>
                          <span>العمر: {video.age}</span>
                        </div>
                        <p className="text-gray-700 text-sm mt-2">{video.club}</p>
                        {isShort && (
                          <div className="mt-2">
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                              YouTube Short
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Agents Section */}
      {activeTab === 'agents' && (
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-900">شبكة الوكلاء</h2>
            
            {loading.agents ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : error.agents ? (
              <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">خطأ في الاتصال! </strong>
                  <span className="block sm:inline">تعذر تحميل بيانات الوكلاء. يرجى المحاولة مرة أخرى لاحقًا.</span>
                </div>
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
                  <strong className="font-bold">لا توجد بيانات! </strong>
                  <span className="block sm:inline">لا يوجد أي وكلاء في قاعدة البيانات حالياً.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
                {agents.map((agent) => {
                  // Safely get specialties array
                  const specialtiesArray = getSpecialtiesArray(agent.specialties);
                  
                  return (
                    <div key={agent.id} className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-5 md:p-6 text-white text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white relative">
                        <Image
                          src={agent.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'}
                          alt={agent.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-1">{agent.name}</h3>
                      <p className="text-blue-200 text-sm mb-3">{agent.company}</p>
                      <p className="text-sm mb-4">{agent.location}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">التخصصات</h4>
                        <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                          {specialtiesArray.length > 0 ? (
                            specialtiesArray.map((specialty: string, i: number) => (
                              <span key={i} className="bg-blue-700 text-xs px-2 py-1 rounded">
                                {specialty}
                              </span>
                            ))
                          ) : (
                            <span className="text-blue-200 text-xs">لا توجد تخصصات</span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedCompetition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                {selectedCompetition.name}
              </h3>
              
              <p className="text-gray-600 mb-2">
                هذه البطولة متاحة حالياً للمشاركة
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>التاريخ:</strong> {selectedCompetition.date}<br/>
                  <strong>المكان:</strong> {selectedCompetition.location}<br/>
                  <strong>عدد الفرق:</strong> {selectedCompetition.teams}
                </p>
              </div>

              {selectedCompetition.quotation_file ? (
                <div className="space-y-3">
                  <button
                    onClick={handleViewDevis}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    عرض عرض الأسعار (PDF)
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    سيتم فتح ملف PDF في نافذة جديدة
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    لا يتوفر عرض أسعار لهذه البطولة حالياً. يرجى التواصل معنا للمزيد من المعلومات.
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowMessageModal(false)}
                className="w-full mt-4 bg-gray-500 hover:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyContentArabic;