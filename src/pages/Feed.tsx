import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { fetchComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import { Loader2, Filter, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CustomSelect from '../components/CustomSelect';

export default function Feed() {
  const { t, language } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const isNe = language === 'ne';

  const filterOptions = [
    { id: 'all', label: t('allCategories') },
    { id: 'garbage', label: t('garbage') },
    { id: 'road', label: t('road') },
    { id: 'water', label: t('water') },
    { id: 'electricity', label: t('electricity') },
  ];

  const loadComplaints = useCallback(async (currentSkip: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const data = await fetchComplaints(currentSkip, 10);
      
      if (data.length < 10) setHasMore(false);
      else setHasMore(true);

      setComplaints(prev => reset ? data : [...prev, ...data]);
    } catch (error) {
      console.error("Load feed failed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    setSkip(0);
    loadComplaints(0, true);
  }, [loadComplaints]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextSkip = skip + 10;
        setSkip(nextSkip);
        loadComplaints(nextSkip);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, skip, loadComplaints]);

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-gray-900 rounded-[24px] flex items-center justify-center text-white shadow-2xl">
              <LayoutGrid size={32} />
            </div>
            <div>
              <h1 className={`text-5xl font-black text-gray-900 mb-1 tracking-tighter uppercase ${isNe ? 'font-nepali' : ''}`}>{t('publicFeed')}</h1>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ${isNe ? 'font-nepali font-medium' : ''}`}>{t('feedDesc')}</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <Filter className="w-4 h-4 text-brand-red ml-2" />
            <CustomSelect
              options={filterOptions}
              value={filter}
              onChange={(val) => {
                setFilter(val);
                setSkip(0);
                loadComplaints(0, true);
              }}
              isNe={isNe}
              className="min-w-[220px]"
              showBorder={false}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[40px] animate-pulse"></div>
             ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[60px] border-4 border-dashed border-gray-50 flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid size={40} className="text-gray-200" />
             </div>
             <p className={`text-gray-300 font-bold uppercase tracking-widest text-xs ${isNe ? 'font-nepali' : ''}`}>{t('noReports')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
              {filteredComplaints.map((complaint, index) => (
                <div key={complaint.id} ref={index === filteredComplaints.length - 1 ? lastElementRef : null}>
                   <ComplaintCard complaint={complaint} />
                </div>
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
              </div>
            )}
            
            {!hasMore && filteredComplaints.length > 0 && (
              <div className="text-center py-20 border-t border-gray-100 mt-20">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">End of public record</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
