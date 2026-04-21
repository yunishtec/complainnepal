"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, User, MapPin, Share2, TrendingUp, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchComments, addComment, upvoteComplaint, unvoteComplaint, Complaint, Comment } from '@/services/complaintService';

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { t } = useLanguage();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app we'd fetch the specific complaint
        // For now we fetch all and find the ID
        const res = await fetch(`/api/complaints`);
        const all: Complaint[] = await res.json();
        const found = all.find(c => String(c.id) === id);
        if (found) {
          setComplaint(found);
          const comms = await fetchComments(Number(id));
          setComments(comms);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const added = await addComment(Number(id), newComment);
      setComments(prev => [added, ...prev]);
      setNewComment('');
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-red" size={32} />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="massive-text-card text-gray-900 mb-4">Report Not Found</h1>
        <button onClick={() => router.push('/')} className="text-brand-red font-black uppercase text-[10px] tracking-widest">Back to Archives</button>
      </div>
    );
  }

  const mediaUrls = (complaint.mediaUrl || "").split(',').map(u => u.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-between sticky top-0 bg-white z-50 border-b border-gray-50">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-900 transition-all">
          <ArrowLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest">Report Detail</span>
        <div className="w-6"></div>
      </div>

      <main className="max-w-2xl mx-auto pb-20">
        {/* Media */}
        <div className="aspect-[4/5] bg-black overflow-hidden sm:rounded-b-[40px]">
           {mediaUrls.length > 0 ? (
              <img src={mediaUrls[0]} className="w-full h-full object-cover" alt="Complaint media" />
           ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-800">
                 No Media Found
              </div>
           )}
        </div>

        {/* Content */}
        <div className="px-6 pt-10">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-4 py-1.5 rounded-full">
                 {complaint.category}
              </span>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-auto">Report #{complaint.id}</span>
           </div>
           
           <h1 className="massive-text-card text-gray-900 mb-4 uppercase tracking-tighter leading-none">{complaint.title}</h1>
           
           <div className="flex items-center gap-2 text-gray-400 mb-8">
              <MapPin size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{complaint.location}</span>
           </div>

           <p className="text-sm text-gray-600 font-medium leading-relaxed mb-10">
              {complaint.description}
           </p>

           <div className="h-[1px] bg-gray-50 mb-10 w-full" />

           {/* Comments */}
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Citizen Remarks</h3>
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{comments.length} total</span>
              </div>

              <form onSubmit={handlePostComment} className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-400">
                    <User size={20} />
                 </div>
                 <div className="flex-grow relative">
                    <input 
                       type="text" 
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       placeholder="Add a remark..."
                       className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-brand-red/10 transition-all pr-12"
                    />
                    <button type="submit" disabled={!newComment.trim() || isSubmitting} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-red disabled:opacity-30">
                       <Send size={18} />
                    </button>
                 </div>
              </form>

              <div className="space-y-6">
                 {comments.map(c => (
                    <div key={c.id} className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center text-[10px] font-black">CP</div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black">Citizen #{c.id % 999}</span>
                             <span className="text-[8px] font-bold text-gray-300 uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{c.text}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
