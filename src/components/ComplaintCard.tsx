import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, Send, X } from 'lucide-react';
import { Complaint, upvoteComplaint, addComment, fetchComments, Comment } from '../services/complaintService';

interface ComplaintCardProps {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleUpvote = async () => {
    try {
      const result = await upvoteComplaint(complaint.id!);
      setUpvotes(result.upvotes);
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const data = await fetchComments(complaint.id!);
        setComments(data);
      } catch (error) {
        console.error("Fetch comments failed:", error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await addComment(complaint.id!, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error("Add comment failed:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: complaint.title,
        text: `Check out this civic issue: ${complaint.title}`,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all mb-6"
    >
      <img src={complaint.mediaUrl} alt={complaint.title} className="w-full h-64 object-cover" />
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-red-50 text-brand-red text-xs font-bold rounded-full uppercase tracking-wider">
            {complaint.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4" /> {complaint.location}
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{complaint.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleUpvote}
              className="flex items-center gap-1.5 text-gray-500 hover:text-brand-red transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <ThumbsUp className={`w-5 h-5 ${upvotes > complaint.upvotes ? 'fill-brand-red text-brand-red' : ''}`} />
              </div>
              <span className="text-sm font-bold">{upvotes}</span>
            </button>
            
            <button 
              onClick={toggleComments}
              className="flex items-center gap-1.5 text-gray-500 hover:text-brand-blue transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">{complaint.commentCount + (comments.length - (loadingComments ? 0 : 0))}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            ID: {complaint.id}
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-gray-100">
                <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-grow px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none text-sm"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-brand-red text-white rounded-xl hover:bg-brand-red/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {loadingComments ? (
                    <div className="text-center py-4 text-gray-400 text-sm italic">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm italic">No comments yet. Be the first!</div>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-sm text-gray-700">{comment.text}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
