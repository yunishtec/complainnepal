"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SuccessPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-10"
      >
        <CheckCircle2 size={64} strokeWidth={2.5} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-14"
      >
        <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">{t('success')}</p>
        <h1 className="massive-text-card text-gray-900">{t('dhanyabaad')}</h1>
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
          {t('successDesc')}
          <br/><br/>
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-red">Your report is now live in the community feed.</span>
        </p>
      </motion.div>

      <div className="w-full flex flex-col gap-4 max-w-xs">
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-brand-red transition-all shadow-xl active:scale-[0.98]"
        >
          {t('backToFeed')} <ArrowRight size={18} />
        </button>
        
        <button 
          className="w-full bg-gray-50 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <Share2 size={18} /> {t('share')}
        </button>
      </div>
    </div>
  );
}
