import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, PlusCircle, List, ArrowUpRight, TrendingUp, LayoutGrid, User, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';

// 📱 COMPONENT: Mobile Feed Card (with Swiping & Auto-play)
const MobileFeedCard = ({ complaint, isLast, lastRef }: { complaint: Complaint, isLast: boolean, lastRef: any }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const mediaUrls = (complaint.mediaUrl || "").split(',').map(u => u.trim()).filter(Boolean);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    const options = { threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
            video.play().catch(() => {}); // Play if visible
        } else {
            video.pause(); // Pause if out of view
        }
      });
    }, options);

    videoRefs.current.forEach(v => observer.observe(v));
    return () => observer.disconnect();
  }, [complaint.mediaUrl]);

  return (
    <div 
      ref={isLast ? lastRef : null}
      className="bg-white border-b border-gray-100 pb-8 last:border-0"
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-50 overflow-hidden">
             <User size={20} className="text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{complaint.title}</h4>
            <div className="flex items-center gap-2">
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{complaint.location}</p>
               <span className="text-gray-200">·</span>
               <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">{complaint.category}</span>
            </div>
          </div>
        </div>
        <div className="text-gray-300">
           <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
         <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
            {complaint.description}
         </p>
      </div>

      {/* Media Gallery (Swipable) */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
         <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
           {mediaUrls.length > 0 ? mediaUrls.map((url, idx) => {
             const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|^.*cloudinary.*\/video\/upload\/.*$/i);
             const finalUrl = url.startsWith('http') ? url : '/images/portrait.png';
             
             return (
               <div key={idx} className="min-w-full h-full snap-center relative">
                 {isVideo ? (
                   <video 
                     ref={el => el && videoRefs.current.set(url, el)}
                     src={finalUrl} 
                     className="w-full h-full object-cover" 
                     muted 
                     loop 
                     playsInline 
                     crossOrigin="anonymous"
                   />
                 ) : (
                   <img 
                     src={finalUrl} 
                     alt={`Media ${idx}`}
                     className="w-full h-full object-cover" 
                     crossOrigin="anonymous"
                     onError={(e) => { (e.target as HTMLImageElement).src = '/images/portrait.png'; }}
                   />
                 )}
                 
                 {/* Unit counter if multiple */}
                 {mediaUrls.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">{idx + 1} / {mediaUrls.length}</span>
                    </div>
                 )}
               </div>
             )
           }) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <img src="/images/portrait.png" className="w-full h-full object-cover opacity-20 grayscale" alt="Placeholder" />
             </div>
           )}
         </div>
      </div>

      {/* Interaction Bar */}
      <div className="px-6 pt-5 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 group text-gray-900">
               <TrendingUp size={18} className="text-brand-red group-active:scale-125 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-widest">{complaint.upvotes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400">
               <List size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ne' ? 'समर्थन' : 'Report detail'}</span>
            </button>
         </div>
         <button 
           onClick={() => navigate(`/complaint/${complaint.id}`)}
           className="px-6 py-2 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.15em] active:scale-95 transition-all"
         >
           View Post
         </button>
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadData = useCallback(async (currentSkip: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const data = await fetchComplaints(currentSkip, 10);
      
      if (data.length < 10) setHasMore(false);
      else setHasMore(true);

      setComplaints(prev => reset ? data : [...prev, ...data]);
    } catch (error) {
      console.error("Home feed load failed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadData(0, true);
  }, [loadData]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextSkip = skip + 10;
        setSkip(nextSkip);
        loadData(nextSkip);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, skip, loadData]);

  return (
    <div className="min-h-screen bg-mobile-bg md:bg-white overflow-x-hidden">
      {/* 📱 MOBILE DASHBOARD / FEED */}
      <div className="md:hidden w-full pt-12 pb-24 bg-white">
        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-6 pt-4">
          <Link to="/" className="flex items-center gap-1.5 group">
            <img 
              src="/images/logo2.png" 
              alt="ComplaineNepal" 
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">
              Complaine<span className="text-brand-red">Nepal</span>
            </h1>
          </Link>
          <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 gap-1">
            <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-400'}`}>EN</button>
            <button onClick={() => setLanguage('ne')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${language === 'ne' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-400'}`}>ने</button>
          </div>
        </div>

        {/* Facebook Style Post Creator Bar */}
        <div className="px-6 mb-8">
          <div 
            onClick={() => navigate('/report')}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-50">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="flex-grow bg-gray-50 px-5 py-2.5 rounded-full">
              <span className="text-gray-400 text-sm font-medium">What's on your mind?</span>
            </div>
            <div className="text-mobile-accent w-10 h-10 flex items-center justify-center">
               <PlusCircle size={24} />
            </div>
          </div>
        </div>

        {/* Categories / Filter Bar (Optional but nice) */}
        <div className="px-6 mb-8 overflow-x-auto no-scrollbar flex items-center gap-2">
           {['All', 'Garbage', 'Road', 'Water', 'Electricity'].map((cat) => (
             <button key={cat} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${cat === 'All' ? 'bg-mobile-accent text-white border-mobile-accent shadow-lg shadow-mobile-accent/20' : 'bg-white text-gray-400 border-gray-100'}`}>
               {cat}
             </button>
           ))}
        </div>

        {/* Feed Section */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Community Feed</h3>
          </div>

          <div className="space-y-0">
             {loading ? [1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[32px] animate-pulse border border-gray-50 mb-6"></div>) 
                      : complaints.map((complaint, index) => (
               <MobileFeedCard 
                 key={complaint.id} 
                 complaint={complaint} 
                 isLast={index === complaints.length - 1}
                 lastRef={lastElementRef}
               />
             ))}
             {loadingMore && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-red" size={24} /></div>}
          </div>
        </div>
      </div>

      {/* 🚀 DESKTOP HERO */}
      <div className="hidden md:block">
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.02]"><h1 className="text-[30vw] font-black text-gray-900">NEPAL</h1></div>
          <div className="absolute top-[60%] left-0 w-full transform -translate-y-1/2 z-10 pointer-events-none overflow-hidden text-center">
              <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 1.5 }} className={`${language === 'ne' ? 'text-[22vw] font-nepali-display' : 'text-[18vw]'} text-[#003893] font-black uppercase tracking-tighter whitespace-nowrap`}>
                {t('heroSubtitle')}
              </motion.h1>
          </div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-20 w-full max-w-4xl flex justify-center"><img src="/images/portrait.png" alt="Hero" className="w-full h-auto max-h-[85vh] object-contain opacity-95" /></motion.div>
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <div className={`w-full max-w-[98%] flex items-center justify-center ${language === 'ne' ? 'gap-[15vw]' : 'gap-[28vw]'} mt-[-25vh]`}>
               <motion.h2 initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} className={`${language === 'ne' ? 'font-nepali-display text-[14rem]' : 'text-[10rem] font-serif italic'} text-[#111827]`}>{language === 'ne' ? 'म' : "I'm"}</motion.h2>
               <motion.h2 initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} className={`${language === 'ne' ? 'font-nepali-display text-[14rem]' : 'text-[10rem] font-serif italic'} text-[#DC143C]`}>{language === 'ne' ? 'नागरिक' : 'Civic'}</motion.h2>
            </div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-32 translate-y-[100px]">
              <motion.button onClick={() => navigate('/report')} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="pointer-events-auto bg-brand-red px-20 py-6 rounded-full font-black text-xl uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_rgba(220,20,60,0.4)]">{t('letsReport')}</motion.button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
              <div className="w-12 h-1 bg-brand-red mb-8"></div>
              <h3 className="text-6xl font-black text-gray-900 tracking-tighter uppercase mb-4">{t('recentReports')}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">{t('allTypesDesc')}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">{[1,2,3].map(i => <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[40px] animate-pulse"></div>)}</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-12 items-start">
                {complaints.map((complaint, index) => (
                  <div key={complaint.id} ref={index === complaints.length - 1 ? lastElementRef : null}><ComplaintCard complaint={complaint} /></div>
                ))}
              </div>
              {loadingMore && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-red" size={40} /></div>}
            </>
          )}
        </section>

        <footer className="py-24 border-t border-gray-100 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-start gap-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Complaine<span className="text-brand-red">Nepal</span></h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Bridging the gap between citizens & accountability</p>
            </div>
            <div className="flex gap-12">
              <button onClick={() => navigate('/privacy-policy')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-red transition-all">Privacy Policy</button>
              <button onClick={() => navigate('/terms-of-service')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-red transition-all">Terms of Service</button>
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2026 ComplaineNepal. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.01)_0%,rgba(255,255,255,0)_100%)] pointer-events-none -z-10"></div>
    </div>
  );
}
