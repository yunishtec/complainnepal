import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Calendar, ChevronUp, ChevronDown,
  Share2, Loader2, ChevronLeft, ChevronRight,
  Play, Pause, Volume2, VolumeX, Maximize
} from 'lucide-react';
import { 
  Complaint, fetchComments, addComment, Comment, 
  upvoteComplaint, unvoteComplaint 
} from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';

// --- Helper for Truncation ---
const truncate = (text: string, limit: number) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// --- Custom Video Player Component ---
const CustomVideo = ({ src, isActive }: { src: string, isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => { setIsPlaying(true); }).catch(error => { console.error(error); setIsPlaying(false); });
      }
    }
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div className="relative w-full h-full group bg-black flex items-center justify-center overflow-hidden" onMouseMove={handleMouseMove} onClick={() => togglePlay()}>
      <video key={src} ref={videoRef} src={src} preload="auto" crossOrigin="anonymous" onTimeUpdate={onTimeUpdate}
        onWaiting={() => setIsBuffering(true)} onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
        onCanPlay={() => setIsBuffering(false)} onEnded={() => setIsPlaying(false)} onError={() => setIsBuffering(false)}
        playsInline className="w-full h-full object-contain" />
      {isBuffering && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Loader2 className="w-10 h-10 text-brand-red animate-spin" /></div>}
      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6">
            <div className="flex-grow flex items-center justify-center pointer-events-none">
               <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl">
                  {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
               </motion.div>
            </div>
            <div className="flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
               <div className="group/progress relative w-full h-1 bg-white/20 rounded-full cursor-pointer">
                  <div className="h-full bg-brand-red relative transition-all" style={{ width: `${progress}%` }}>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-red rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-white/80">
                     <button onClick={togglePlay} className="hover:text-brand-red transition-all scale-110 active:scale-95">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
                     <button onClick={toggleMute} className="hover:text-brand-red transition-all scale-110 active:scale-95">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                  </div>
                  <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white/80 hover:text-brand-red transition-all scale-110 active:scale-95"><Maximize size={20} /></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [everOverflowed, setEverOverflowed] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const response = await fetch(`/api/complaints/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setComplaint(data);
        const commentData = await fetchComments(Number(id));
        setComments(commentData);
        const upvotedIds = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]').map(Number);
        if (upvotedIds.includes(Number(id))) setHasUpvoted(true);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    loadDetail();
  }, [id]);


  useEffect(() => {
    const checkOverflow = () => {
      if (descRef.current) {
        const isCurrentlyOverflowing = descRef.current.scrollHeight > descRef.current.clientHeight + 1;
        
        if (!isExpanded) {
          if (isCurrentlyOverflowing) setEverOverflowed(true);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    const timer = setTimeout(checkOverflow, 100);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timer);
    };
  }, [complaint, isExpanded]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth <= 0) return;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== currentMediaIdx) setCurrentMediaIdx(index);
  };

  const scrollToMedia = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  const handleUpvote = async () => {
    if (!complaint || !id) return;
    const complaintId = Number(id);
    const upvotedIds = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]').map(Number);
    try {
      if (hasUpvoted) {
        setHasUpvoted(false);
        const res = await unvoteComplaint(complaintId);
        setComplaint({ ...complaint, upvotes: res.upvotes });
        localStorage.setItem('upvoted_complaints', JSON.stringify(upvotedIds.filter(i => i !== complaintId)));
      } else {
        setHasUpvoted(true);
        const res = await upvoteComplaint(complaintId);
        setComplaint({ ...complaint, upvotes: res.upvotes });
        localStorage.setItem('upvoted_complaints', JSON.stringify([...upvotedIds, complaintId]));
      }
    } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    if (!complaint) return;
    const shareData = {
      title: complaint.title,
      text: `Check out this report on ComplaineNepal: ${complaint.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('linkCopied') || "Link copied to clipboard!");
      }
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    setSubmittingComment(true);
    try {
      const comment = await addComment(Number(id), newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) { console.error(err); } finally { setSubmittingComment(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{t('retrievingRecord')}</span>
    </div>
  );

  if (!complaint) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900 p-6 text-center">
      <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-brand-red">{t('caseNotAccessible')}</h2>
      <button onClick={() => navigate('/feed')} className="border border-gray-100 text-gray-900 px-5 py-2 rounded-full font-black uppercase text-[10px] hover:bg-gray-900 hover:text-white transition-all">{t('backToFeed')}</button>
    </div>
  );

  const mediaUrls = (complaint.mediaUrl || "").split(',').map(u => u.trim()).filter(Boolean);
  const displayTitle = truncate(complaint.title, 40);
  const displayLocation = truncate(complaint.location, 35);
  const rawDescription = complaint.description || "";
  const displayDescription = rawDescription.length > 800 ? rawDescription.substring(0, 800) + "..." : rawDescription;

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center border-b border-gray-50">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-brand-red transition-all text-[10px] font-black uppercase tracking-widest text-gray-400"><ArrowLeft size={16} />{t('backToArchives')}</button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-20">
        <section className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 group border border-gray-100">
           <div ref={scrollRef} onScroll={handleScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing" style={{ WebkitOverflowScrolling: 'touch' }}>
             {mediaUrls.map((url, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center bg-black">
                   {url.match(/\.(mp4|webm|ogg|mov)$|^.*cloudinary.*\/video\/upload\/.*$/i) ? ( <CustomVideo src={url} isActive={idx === currentMediaIdx} /> ) : ( <img src={url} alt={complaint.title} className="w-full h-full object-contain" crossOrigin="anonymous" /> )}
                </div>
             ))}
           </div>
           {mediaUrls.length > 1 && (
             <>
               <button onClick={() => scrollToMedia(currentMediaIdx - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronLeft size={20} /></button>
               <button onClick={() => scrollToMedia(currentMediaIdx + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronRight size={20} /></button>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/40 backdrop-blur-md rounded-full z-10">
                  {mediaUrls.map((_, i) => <button key={i} onClick={() => scrollToMedia(i)} className={`h-1 rounded-full transition-all ${i === currentMediaIdx ? 'w-6 bg-white' : 'w-1 bg-white/40'}`} />)}
               </div>
             </>
           )}
        </section>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div className="flex-grow">
               <div className="flex items-center gap-3 mb-4 text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-brand-red">{t('reportIdLabel')}{complaint.id}</span>
                  <span className="text-gray-200">/</span><span className="text-gray-400 font-bold">{t(complaint.category)}</span>
                  <span className="text-gray-200">/</span><span className="text-gray-400 font-bold">{complaint.status}</span>
               </div>
               <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-gray-900 mb-6 uppercase">{displayTitle}</h1>
              <div className="flex items-center gap-6 text-gray-400 text-[11px] font-bold">
                 <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                 <span className="flex items-center gap-2 text-brand-red truncate max-w-[200px]"><MapPin size={16} strokeWidth={3} /> {displayLocation}</span>
              </div>
           </div>
           <div className="flex items-center gap-2 flex-shrink-0 pt-2">
               <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                  <button onClick={handleUpvote} className={`flex items-center gap-3 px-5 py-2.5 hover:bg-gray-100 transition-all border-r border-gray-100 ${hasUpvoted ? 'text-brand-red' : ''}`}><ChevronUp size={22} strokeWidth={3} /><span className="text-sm font-black">{complaint.upvotes}</span></button>
                  <button className="px-5 py-2.5 hover:bg-gray-100 transition-all text-gray-200"><ChevronDown size={22} strokeWidth={3} /></button>
               </div>
               <button onClick={handleShare} className="flex items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all border border-gray-100 text-gray-600 active:scale-95"><Share2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('share')}</span></button>
            </div>
        </div>

        <div className="max-w-4xl">
            <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-50 mb-16 shadow-sm">
               <div 
                  ref={descRef} 
                  onClick={() => everOverflowed && setIsExpanded(!isExpanded)}
                  className={`text-base text-gray-600 font-medium leading-[1.8] whitespace-pre-wrap transition-all duration-500 overflow-hidden ${!isExpanded ? 'line-clamp-2' : ''} ${everOverflowed && !isExpanded ? 'cursor-pointer hover:text-gray-900' : ''}`}
               >
                  {displayDescription}
               </div>
               {everOverflowed && (
                  <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4 flex items-center gap-2 text-brand-red text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                    {isExpanded ? <>{t('showLess')} <ChevronUp size={14} /></> : <>{t('showMore')} <ChevronDown size={14} /></>}
                  </button>
               )}
            </div>

            <section className="pt-12 border-t border-gray-100">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-10 flex items-center gap-4">{comments.length} {t('discussionRecords')} <div className="h-0.5 w-8 bg-brand-red rounded-full" /></h3>
               <form onSubmit={handleAddComment} className="mb-16 max-w-2xl">
                  <div className="bg-white rounded-2xl px-6 py-4 border border-gray-100 focus-within:border-brand-red transition-all shadow-sm">
                     <textarea 
                        placeholder={t('verificationRemark')} 
                        className="w-full bg-transparent outline-none text-sm font-medium min-h-[60px] text-gray-900 placeholder:text-gray-200 resize-none" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                     />
                     <div className="flex justify-end mt-4">
                        <button type="submit" disabled={!newComment.trim() || submittingComment} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-red transition-all disabled:opacity-20 shadow-lg active:scale-95">{t('verifyPost')}</button>
                     </div>
                  </div>
               </form>
              <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 pb-6 border-b border-gray-50 last:border-0 group">
                       <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[9px] flex-shrink-0 text-gray-300 group-hover:bg-brand-red group-hover:text-white transition-all shadow-sm">CP</div>
                       <div>
                          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold"><span className="text-gray-900">{t('citizen')}_{comment.id}</span><span className="text-gray-200">·</span><span className="text-gray-400 uppercase tracking-tighter">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed">{comment.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
