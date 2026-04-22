"use client";
import React from 'react';
import { motion } from 'motion/react';
import { MapPin, MessageSquare, ChevronUp, Image as ImageIcon, Film } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Complaint } from '@/services/complaintService';
import { useLanguage } from '@/context/LanguageContext';

const truncate = (text: string, limit: number) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

interface ComplaintCardProps {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Handle both new array format and legacy string format
  const mediaUrls = Array.isArray(complaint.mediaUrls) ? complaint.mediaUrls : [];
  const firstMedia = mediaUrls[0] || "";
  
  const isCloudinary = firstMedia.includes('cloudinary');
  const isVideo = firstMedia.match(/\.(mp4|webm|ogg|mov)$|^.*cloudinary.*\/video\/upload\/.*$/i);

  // If it's a Cloudinary video, we can request a static image preview of the first frame
  const getPreviewUrl = () => {
    if (isVideo && isCloudinary) {
      return firstMedia.replace('/video/upload/', '/video/upload/c_fill,h_600,w_1000,so_0/').replace(/\.[^/.]+$/, ".jpg");
    }
    return firstMedia;
  };

  const previewUrl = getPreviewUrl();

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = () => {
    if (!isMobile) {
      router.push(`/complaint/${complaint.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { y: -8, transition: { duration: 0.2 } } : {}}
      onClick={handleCardClick}
      className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 transition-all group mb-4 ${
        !isMobile ? 'cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]' : 'cursor-default'
      }`}
    >
      {/* 🎬 Static Preview Section */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {!previewUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <ImageIcon size={32} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('noMediaFound') || 'No Media Found'}</span>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img 
              src={previewUrl} 
              alt={complaint.title} 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              loading="lazy" 
              crossOrigin="anonymous"
              onError={(e) => {
                if (isVideo) (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800';
              }}
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <Film size={20} fill="white" />
                 </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-xl text-gray-900 text-[8px] font-black rounded-full uppercase tracking-widest shadow-lg">
                {t(complaint.category)}
              </span>
            </div>
            {mediaUrls.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">+{mediaUrls.length - 1} {t('units') || 'Units'}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-7">
        <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-brand-red">
              <MapPin size={10} strokeWidth={3} />
              <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[120px]">
                {truncate(complaint.location, 35)}
              </span>
            </div>
           <div className="w-1 h-1 rounded-full bg-gray-200"></div>
           <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">● {complaint.status}</span>
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-3 group-hover:text-brand-red transition-all duration-300">
          {truncate(complaint.title, 40)}
        </h3>
        <p className="text-[13px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-8">
          {complaint.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
           <div className="flex items-center gap-5 text-gray-400">
              <div className="flex items-center gap-1.5 group-hover:text-brand-red transition-colors">
                 <ChevronUp size={18} strokeWidth={3} />
                 <span className="text-sm font-black">{complaint.upvotes}</span>
              </div>
              <div className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                 <MessageSquare size={16} />
                 <span className="text-xs font-black">{complaint.commentCount || 0}</span>
              </div>
           </div>
           <span className="text-[9px] font-black text-gray-200 tracking-[0.2em]">ID.{complaint.id}</span>
        </div>
      </div>
    </motion.div>
  );
}
