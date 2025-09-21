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
  specialties: string[];
  players_placed: number;
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


  const extractVideoId = (url : string) : string| null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };


  return (
    <div id='portfolio' className="pt-16" dir="rtl">
      {/* Tab Navigation */}
      <div className="sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide py-2">
            {[
              { id: 'players', label: 'اللاعبين المميزين' },
              { id: 'competitions', label: 'البطولات' },
              { id: 'videos', label: 'فيديوهات اللاعبين' },
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
                  <div key={competition.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
                {videos.map((video) => (
                  <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                    <iframe 
      src={`https://www.youtube.com/embed/${extractVideoId(video.video_id)}`}
      title={video.title}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                    </div>
                  </div>
                ))}
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
                {agents.map((agent) => (
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
                        {agent.specialties && agent.specialties.map((specialty: string, i: number) => (
                          <span key={i} className="bg-blue-700 text-xs px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-blue-200 mb-4">{agent.players_placed} لاعب تم توظيفهم</p>
                    
                    <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition w-full mt-auto">
                      الاتصال بالوكيل
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default BodyContentArabic;