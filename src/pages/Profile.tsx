import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Camera, AtSign, Smartphone, 
  MapPin, LogOut, Edit, MessageSquare, 
  User, CheckCircle2, History, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <User size={40} className="text-gray-200" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">{t('yourIdentity') || 'Your Identity'}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 leading-relaxed">
            {t('signInToTrack') || 'Sign in to track your reports and contribute to government accountability.'}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-red transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            {t('login') || 'Log In'} <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 flex items-center justify-between px-6 h-20">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-900 hover:bg-gray-50 rounded-full transition-all active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">{t('myProfile') || 'My Profile'}</h1>
        <button className="text-[11px] font-black uppercase tracking-widest text-[#003893] hover:text-brand-red transition-all">
          {t('edit') || 'Edit'}
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-6 max-w-2xl mx-auto">
        {/* Avatar Section */}
        <div className="flex items-center gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl overflow-hidden uppercase tracking-tighter">
              {user.username.substring(0, 2)}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white shadow-xl rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:text-brand-red transition-all active:scale-90">
              <Camera size={18} />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-3">
              {user.username}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {t('activeCitizen') || 'Active Citizen'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 p-1.5 rounded-2xl flex gap-1 mb-10">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'personal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('personalInfo') || 'Personal Info'}
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'teams' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('history') || 'Report History'}
          </button>
        </div>

        {activeTab === 'personal' ? (
          <div className="space-y-8">
            <InfoItem icon={AtSign} label="Email" value={user.email} />
            <InfoItem icon={Smartphone} label="Phone" value={t('addPhone') || 'Add a phone number'} isPlaceholder />
            <InfoItem icon={MessageSquare} label="Official Handle" value={t('addHandle') || 'Add social handle'} isPlaceholder />
            <InfoItem icon={MapPin} label="Location" value={t('addLocation') || 'Add a location'} isPlaceholder />
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                <History size={24} />
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('noReportsYet') || 'No reports logged yet'}</p>
          </div>
        )}

        {/* Logout Section */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <button 
            onClick={logout}
            className="flex items-center gap-4 text-brand-red hover:brightness-110 transition-all group"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all shadow-sm">
              <LogOut size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{t('logout') || 'Sign Out'}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t('secureLogout') || 'Close current session'}</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, isPlaceholder }: { icon: any, label: string, value: string, isPlaceholder?: boolean }) {
  return (
    <div className="flex items-start gap-6 group cursor-pointer border-b border-gray-50 pb-6 transition-all hover:bg-gray-50/50 rounded-xl px-2 -mx-2">
      <div className="w-12 h-12 shrink-0 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#003893] shadow-sm transition-all group-hover:scale-110">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#003893] mb-1 group-hover:translate-x-1 transition-transform">{label}</p>
        <p className={`text-sm font-medium truncate ${isPlaceholder ? 'text-gray-300 italic' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}
