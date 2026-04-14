import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchRecentComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';

export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRecentComplaints();
        setRecentComplaints(data.slice(0, 3));
      } catch (error) {
        console.error("Home feed load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 🚀 PERFECTLY SYMMETRICAL HERO SECTION */}
      <section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-10">
        
        {/* Background Accent Text (Optional/Subtle) */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none opacity-[0.02]">
          <h1 className="text-[30vw] font-black text-gray-900 leading-none">NEPAL</h1>
        </div>

        {/* Massive Red Subtitle - Anchored below the focal point */}
        <div className="absolute top-[55%] md:top-[60%] left-0 w-full transform -translate-y-1/2 z-10 pointer-events-none overflow-hidden">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`${language === 'ne' ? 'text-[22vw] font-nepali' : 'text-[18vw] font-black'} text-[#003893] uppercase leading-none text-center whitespace-nowrap tracking-tighter`}
            >
              {t('heroSubtitle')}
            </motion.h1>
        </div>

        {/* THE FOCAL POINT: Portrait centered */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-20 w-full max-w-4xl flex justify-center mt-[-6vh]"
        >
          <img 
            src="/images/portrait.png" 
            alt={t('heroSubtitle')} 
            className="w-full h-auto max-h-[85vh] object-contain opacity-95 transition-all duration-700"
          />
        </motion.div>

        {/* SYMMETRICAL TYPOGRAPHY & DECORATIONS */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          
          {/* Main Title Row */}
          <div className={`w-full max-w-[98%] flex items-center justify-center ${language === 'ne' ? 'gap-12 md:gap-[15vw]' : 'gap-28 md:gap-[28vw]'} mt-[-10vh] md:mt-[-25vh]`}>
             
             {/* LEFT SIDE: Symmetrical text */}
             <motion.div
               initial={{ opacity: 0, x: -60 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.3 }}
             >
               <h2 className={`${language === 'ne' ? 'text-8xl md:text-[14rem] font-nepali font-black' : 'text-7xl md:text-8xl lg:text-[10rem] font-serif italic'} text-[#111827] leading-none drop-shadow-sm`}>
                 {language === 'ne' ? 'म' : "I'm"}
               </h2>
             </motion.div>

             {/* RIGHT SIDE: Symmetrical text with matching style */}
             <motion.div
               initial={{ opacity: 0, x: 60 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.3 }}
             >
               <h2 className={`${language === 'ne' ? 'text-8xl md:text-[14rem] font-nepali font-black italic' : 'text-7xl md:text-8xl lg:text-[10rem] font-serif italic'} text-[#DC143C] leading-none drop-shadow-sm`}>
                 {language === 'ne' ? 'नागरिक' : 'Civic'}
               </h2>
             </motion.div>
          </div>

          {/* Center Bottom: Balanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-40 md:mt-64"
          >
            <button
              onClick={() => navigate('/report')}
              className="group pointer-events-auto bg-[#DC143C] px-20 py-6 rounded-full font-black text-xl uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 shadow-[0_20px_60px_rgba(220,20,60,0.4)] hover:shadow-[0_30px_80px_rgba(220,20,60,0.6)]"
            >
              {t('letsReport')}
            </button>
          </motion.div>

        </div>
      </section>

      {/* 📋 ACTIVITY FEED */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20 text-center">
            <div className="w-12 h-1 bg-brand-red mb-6"></div>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-4">{t('recentReports')}</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{t('allTypesDesc')}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1,2,3].map(i => (
              <div key={i} className="h-96 bg-gray-50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 italic font-medium">
             Be the first to share your story.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {recentComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
        
        <div className="mt-20 flex justify-center">
           <button 
             onClick={() => navigate('/feed')}
             className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 hover:text-brand-red border-b-2 border-transparent hover:border-brand-red pb-2 transition-all"
           >
             Open Comprehensive Feed
           </button>
        </div>
      </section>

      {/* 📁 FOOTER */}
      <footer className="py-20 border-t border-gray-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter">ComplaineNepal</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Bridging the gap between citizens & accountability</p>
          </div>
          <div className="flex gap-12">
            <button 
              onClick={() => navigate('/privacy-policy')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-red transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => navigate('/terms-of-service')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-red transition-colors"
            >
              Terms of Service
            </button>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 ComplaineNepal. All rights reserved.</p>
        </div>
      </footer>

      {/* Background Finish */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.01)_0%,rgba(255,255,255,0)_100%)] pointer-events-none -z-10"></div>
    </div>
  );
}
