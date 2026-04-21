"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Loader2, PlusCircle, TrendingUp, User, Volume2, VolumeX, MessageSquare, Share2, Send, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchComplaints, Complaint, fetchComments, addComment, upvoteComplaint, unvoteComplaint, Comment } from '@/services/complaintService';
import ComplaintCard from '@/components/ComplaintCard';

// 📱 COMPONENT: Mobile Feed Card (with Swiping & Auto-play)
const MobileFeedCard = ({ complaint, isLast, lastRef }: { complaint: Complaint, isLast: boolean, lastRef: any }) => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const mediaUrls = (complaint.mediaUrl || "").split(',').map(u => u.trim()).filter(Boolean);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Upvote State
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    const upvotedIds = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]');
    if (complaint.id && upvotedIds.includes(complaint.id)) {
      setHasUpvoted(true);
    }
  }, [complaint.id]);

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

  const toggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showComments) {
      setShowComments(true);
      setLoadingComments(true);
      try {
        const data = await fetchComments(complaint.id!);
        setComments(data);
      } catch (err) { console.error(err); }
      finally { setLoadingComments(false); }
    } else {
      setShowComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newComment.trim() || !complaint.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const added = await addComment(complaint.id!, newComment);
      setComments(prev => [added, ...prev]);
      setNewComment('');
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint.id) return;
    const upvotedIds = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]');

    try {
      if (hasUpvoted) {
        setHasUpvoted(false);
        const res = await unvoteComplaint(complaint.id!);
        setUpvotes(res.upvotes);
        localStorage.setItem('upvoted_complaints', JSON.stringify(upvotedIds.filter((id: string) => id !== complaint.id)));
      } else {
        setHasUpvoted(true);
        const res = await upvoteComplaint(complaint.id!);
        setUpvotes(res.upvotes);
        localStorage.setItem('upvoted_complaints', JSON.stringify([...upvotedIds, complaint.id]));
      }
    } catch (err) { console.error(err); }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint) return;
    const shareData = {
      title: complaint.title,
      text: `Check out this report on ComplaineNepal: ${complaint.title}`,
      url: `${window.location.origin}/complaint/${complaint.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div 
      ref={isLast ? lastRef : null}
      className="bg-white mb-2 pb-6 shadow-sm last:mb-0"
    >
      {/* Header */}
      <div 
        className="px-6 py-4 flex items-center justify-between transition-all"
      >
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
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
         <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
            {complaint.description}
         </p>
      </div>

      {/* Media Gallery (Swipable) */}
      <div 
        className="relative aspect-square md:aspect-[4/5] bg-black overflow-hidden mx-4 rounded-2xl select-none"
      >
         <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none">
           {mediaUrls.length > 0 ? mediaUrls.map((url, idx) => {
             const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|^.*cloudinary.*\/video\/upload\/.*$/i);
             const finalUrl = url.startsWith('http') ? url : '/images/portrait.png';
             
             return (
               <div key={idx} className="min-w-full h-full snap-center relative">
                  {isVideo ? (
                    <div className="w-full h-full relative group">
                      <video 
                        src={finalUrl} 
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none" 
                        muted 
                        loop 
                        playsInline 
                        crossOrigin="anonymous"
                      />
                      <video 
                        ref={el => { if (el) videoRefs.current.set(url, el); }}
                        src={finalUrl} 
                        className="w-full h-full object-contain relative z-10 pointer-events-none select-none" 
                        muted={isMuted}
                        loop 
                        playsInline 
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                       <img 
                        src={finalUrl} 
                        draggable="false"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                        crossOrigin="anonymous"
                       />
                       <img 
                        src={finalUrl} 
                        alt={`Media ${idx}`}
                        draggable="false"
                        className="w-full h-full object-contain relative z-10 pointer-events-none select-none" 
                        crossOrigin="anonymous"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/portrait.png'; }}
                       />
                    </div>
                  )}
                 {isVideo && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                      className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white z-20 active:scale-90 transition-all font-black text-[8px]"
                    >
                       {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                 )}
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
      <div className="px-6 pt-5 flex items-center justify-between border-t border-gray-50/50 mt-2">
         <div className="flex items-center gap-6">
            <button 
              onClick={handleUpvote}
              className={`flex items-center gap-2 group transition-all ${hasUpvoted ? 'text-brand-red' : 'text-gray-900'}`}
            >
               <TrendingUp size={18} className={`${hasUpvoted ? 'animate-pulse' : 'group-active:scale-125'} transition-transform`} />
               <span className="text-[10px] font-black uppercase tracking-widest">{upvotes}</span>
            </button>
            <button 
              onClick={toggleComments}
              className={`flex items-center gap-2 transition-colors ${showComments ? 'text-brand-red' : 'text-gray-500'}`}
            >
               <MessageSquare size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">{t('remark')}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 active:text-brand-red transition-colors"
            >
               <Share2 size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">{t('share')}</span>
            </button>
         </div>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pb-4 mt-6 border-t border-gray-50 pt-6"
        >
          <form onSubmit={handlePostComment} className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                <User size={14} className="text-brand-red" />
             </div>
             <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('addRemarkPlaceholder')}
                  className="w-full bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand-red focus:bg-white transition-all pr-12"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-red disabled:opacity-30 disabled:grayscale p-1.5"
                >
                   {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
             </div>
          </form>

          <div className="space-y-6">
             {loadingComments ? (
               <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-gray-200" size={20} />
               </div>
             ) : (
               <>
                 {comments.length === 0 ? (
                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center py-4">{t('noRemarks')}</p>
                 ) : (
                   comments.map(c => (
                     <div key={c.id} className="flex gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-black text-gray-300 flex-shrink-0 group-hover:bg-brand-red/5 transition-colors">CP</div>
                        <div className="flex-grow">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-gray-900">{t('citizen')} #{c.id.substring(0, 5)}</span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                           <p className="text-xs text-gray-600 font-medium leading-relaxed">{c.text}</p>
                        </div>
                     </div>
                   ))
                 )}
               </>
             )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const observer = useRef<IntersectionObserver | null>(null);

  const categories = language === 'ne' 
    ? [
        { id: 'All', label: 'सबै' },
        { id: 'garbage', label: 'फोहोर' },
        { id: 'road', label: 'सडक' },
        { id: 'water', label: 'पानी' },
        { id: 'electricity', label: 'बिजुली' }
      ] 
    : [
        { id: 'All', label: 'All' },
        { id: 'garbage', label: 'Garbage' },
        { id: 'road', label: 'Road' },
        { id: 'water', label: 'Water' },
        { id: 'electricity', label: 'Electricity' }
      ];

  const loadData = useCallback(async (currentSkip: number, reset: boolean = false, categoryOverride?: string) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const targetCategory = categoryOverride !== undefined ? categoryOverride : selectedCategory;
      const data = await fetchComplaints(currentSkip, 10, targetCategory);
      
      if (data.length < 10) setHasMore(false);
      else setHasMore(true);

      setComplaints(prev => reset ? data : [...prev, ...data]);
    } catch (error) {
      console.error("Home feed load failed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData(0, true);
  }, [loadData]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSkip(0);
    loadData(0, true, cat);
  };

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
      {/* 📱 MOBILE FEED */}
      <div className="md:hidden w-full pb-24 bg-gray-50/50 pt-2">
        <div className="px-6 mb-8 mt-4">
          <div 
            onClick={() => router.push('/report')}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-50">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="flex-grow bg-gray-50 px-5 py-2.5 rounded-full">
              <span className="text-gray-400 text-sm font-medium">{t('whatsOnYourMind')}</span>
            </div>
            <div className="text-mobile-accent w-10 h-10 flex items-center justify-center">
               <PlusCircle size={24} />
            </div>
          </div>
        </div>

        <div className="px-6 mb-8 overflow-x-auto no-scrollbar flex items-center gap-2">
           {categories.map((cat) => (
             <button 
               key={cat.id} 
               onClick={() => handleCategoryChange(cat.id)}
               className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${cat.id === selectedCategory ? 'bg-mobile-accent text-white border-mobile-accent shadow-lg shadow-mobile-accent/20' : 'bg-white text-gray-400 border-gray-100'}`}
             >
               {cat.label}
             </button>
           ))}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-6 px-6">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">{t('communityFeed')}</h3>
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
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white">
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 select-none">
            <h1 className="text-[25vw] font-black text-[#003893]/5 tracking-tighter uppercase">
              REPORTER
            </h1>
          </div>

          <div className="relative z-20 w-full max-w-5xl flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[60vh] flex items-center justify-center">
              <img 
                src="/images/portrait.png" 
                alt="Representative" 
                className="h-full w-auto object-contain drop-shadow-2xl" 
              />
              
              {/* Centered Button on Hero */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button 
                  onClick={() => router.push('/report')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-red px-12 py-5 rounded-3xl font-black text-xl uppercase tracking-[0.2em] text-white shadow-2xl shadow-brand-red/40 hover:bg-brand-red/90 transition-all"
                >
                  {t('letsReport')}
                </motion.button>
              </div>
            </div>
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
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('bridgingGap')}</p>
            </div>
            <div className="flex gap-12">
              <button onClick={() => router.push('/privacy-policy')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-red transition-all">{t('privacyPolicy')}</button>
              <button onClick={() => router.push('/terms-of-service')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-red transition-all">{t('termsOfService')}</button>
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2026 ComplaineNepal. {t('rightsReserved')}</p>
          </div>
        </footer>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.01)_0%,rgba(255,255,255,0)_100%)] pointer-events-none -z-10"></div>
    </div>
  );
}
