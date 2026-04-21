"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { User, Settings, ArrowLeft, LogOut, ChevronRight, MapPin, Grid, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="massive-text-card text-gray-900 mb-4">Identity Required</h1>
        <button onClick={() => router.push('/login')} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest">Sign In</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-10 rounded-b-[40px] shadow-sm">
        <div className="flex items-center justify-between mb-10">
           <button onClick={() => router.back()} className="text-gray-400"><ArrowLeft size={24} /></button>
           <button className="text-gray-400"><Settings size={20} /></button>
        </div>

        <div className="flex flex-col items-center">
           <div className="w-24 h-24 bg-gray-900 rounded-[32px] flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-blue-900/10">
              {user.username.substring(0, 2).toUpperCase()}
           </div>
           <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-1">{user.username}</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{user.email}</p>
        </div>
      </div>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
         {/* Stats */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
               <Grid size={20} className="text-brand-red mb-3" />
               <span className="text-xl font-black text-gray-900">12</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Reports</span>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
               <MessageSquare size={20} className="text-brand-blue mb-3" />
               <span className="text-xl font-black text-gray-900">48</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Remarks</span>
            </div>
         </div>

         {/* Menu Items */}
         <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all border-b border-gray-50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={18} /></div>
                  <span className="text-sm font-black uppercase tracking-tighter text-gray-900">My Locations</span>
               </div>
               <ChevronRight size={18} className="text-gray-200" />
            </button>
            <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all border-b border-gray-50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><User size={18} /></div>
                  <span className="text-sm font-black uppercase tracking-tighter text-gray-900">Account Details</span>
               </div>
               <ChevronRight size={18} className="text-gray-200" />
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-brand-red"><LogOut size={18} /></div>
                  <span className="text-sm font-black uppercase tracking-tighter text-brand-red group-hover:translate-x-1 transition-all">Logout Portal</span>
               </div>
               <ChevronRight size={18} className="text-brand-red/20" />
            </button>
         </div>
      </main>
    </div>
  );
}
