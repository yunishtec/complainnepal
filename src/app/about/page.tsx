"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Target, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* 🏛️ EDITORIAL HERO SECTION */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none opacity-[0.03]">
          <h1 className="text-[25vw] font-black text-gray-900 leading-none uppercase">STORY</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10"
        >
          <h2 className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-6">{t('aboutUs')}</h2>
          <h1 className={`${language === 'ne' ? 'text-7xl md:text-9xl font-nepali' : 'text-6xl md:text-8xl lg:text-9xl font-serif italic'} text-gray-900 leading-tight mb-8`}>
            {language === 'ne' ? 'हाम्रो' : 'The'} <span className="text-brand-red">{language === 'ne' ? 'कथा' : 'Mission'}</span>
          </h1>
          <div className="w-24 h-1 bg-brand-blue mx-auto"></div>
        </motion.div>
      </section>

      {/* 📖 CONTENT SECTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-red mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-red"></span>
              {t('theStory')}
            </h3>
            <p className={`${language === 'ne' ? 'text-2xl font-nepali leading-relaxed' : 'text-3xl font-serif leading-snug'} text-gray-800`}>
              {t('storyDesc')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-gray-50 rounded-3xl overflow-hidden relative group"
          >
             <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-transparent transition-all duration-500"></div>
             <img 
               src="/images/allnepali.png" 
               alt="Nepal Community" 
               className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
             />
             <div className="absolute inset-x-8 bottom-8">
               <div className="p-6 bg-white/90 backdrop-blur shadow-xl rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{t('builtForNepal')}</p>
               </div>
             </div>
          </motion.div>
        </div>

        {/* MISSION & VISION BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-brand-red transition-all duration-500 cursor-default"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all">
                <Target className="w-8 h-8 text-brand-red group-hover:text-white" />
             </div>
             <h4 className="text-2xl font-black uppercase tracking-tight mb-6 group-hover:text-white">{t('mission')}</h4>
             <p className={`${language === 'ne' ? 'text-lg font-nepali' : 'text-lg font-serif'} text-gray-500 leading-relaxed group-hover:text-white/80`}>
                {t('missionDesc')}
             </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-brand-blue transition-all duration-500 cursor-default"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 transition-all">
                <Eye className="w-8 h-8 text-brand-blue group-hover:text-white" />
             </div>
             <h4 className="text-2xl font-black uppercase tracking-tight mb-6 group-hover:text-white">{t('vision')}</h4>
             <p className={`${language === 'ne' ? 'text-lg font-nepali' : 'text-lg font-serif'} text-gray-500 leading-relaxed group-hover:text-white/80`}>
                {t('visionDesc')}
             </p>
          </motion.div>
        </div>
      </section>

      {/* 👥 THE TEAM SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-50">
        <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-6">{t('whoWeAre')}</h2>
            <p className={`${language === 'ne' ? 'text-2xl font-nepali' : 'text-3xl font-serif italic'} max-w-3xl text-gray-800 leading-relaxed`}>
              {t('teamDesc')}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center group">
             <div className="w-64 h-80 rounded-[2rem] overflow-hidden mb-8 border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-110 grayscale hover:grayscale-0">
                <img src="/images/yunish.png" alt="Yunish" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">{t('yunishBhatta')}</h3>
             <p className="text-xs font-bold uppercase tracking-widest text-brand-red">{t('coFounder')}</p>
          </div>

          <div className="flex flex-col items-center group">
             <div className="w-64 h-80 rounded-[2rem] overflow-hidden mb-8 border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-110 grayscale hover:grayscale-0">
                <img src="/images/aasis.png" alt="Aasis" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">{t('aasisBagale')}</h3>
             <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">{t('coFounder')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
