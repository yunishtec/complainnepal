"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Filter, 
  ChevronDown, 
  Loader2, 
  Inbox,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchComplaints, Complaint } from '@/services/complaintService';
import ComplaintCard from '@/components/ComplaintCard';

export default function FeedPage() {
  const { t, language } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = language === 'ne' 
    ? [
        { id: 'All', label: 'सबै श्रेणिहरू' },
        { id: 'garbage', label: 'फोहोर / मैला' },
        { id: 'road', label: 'सडक क्षति' },
        { id: 'water', label: 'पानी आपूर्ति' },
        { id: 'electricity', label: 'विद्युत' }
      ] 
    : [
        { id: 'All', label: 'All Categories' },
        { id: 'garbage', label: 'Garbage / Waste' },
        { id: 'road', label: 'Road Damage' },
        { id: 'water', label: 'Water Supply' },
        { id: 'electricity', label: 'Electricity' }
      ];

  const loadData = useCallback(async (currentSkip: number, reset: boolean = false, categoryOverride?: string) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const targetCategory = categoryOverride !== undefined ? categoryOverride : selectedCategory;
      const data = await fetchComplaints(currentSkip, 10, targetCategory);
      
      if (data.length < 10) setHasMore(false);
      else setHasMore(true);

      setComplaints(prev => reset ? data : [...prev, ...data]);
    } catch (err: any) {
      console.error("Feed load failed:", err);
      setError(err.message || "Failed to load feed");
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
    setIsFilterOpen(false);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentCategoryLabel = categories.find(c => c.id === selectedCategory)?.label || 'All Categories';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- Header Section (Matching Screenshot) --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#1e293b] rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-slate-200">
               <LayoutGrid size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] tracking-tighter uppercase mb-1">
                {language === 'ne' ? 'सार्वजनिक फिड' : 'PUBLIC FEED'}
              </h1>
              <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                {language === 'ne' ? 'नेपालभरका नागरिकहरूबाट वास्तविक समयका रिपोर्टहरू।' : 'REAL-TIME REPORTS FROM CITIZENS ACROSS NEPAL.'}
              </p>
            </div>
          </div>

          {/* Custom Category Dropdown Pill */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white border border-gray-100 rounded-full px-8 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all active:scale-95 group"
            >
              <Filter size={18} className="text-brand-red" />
              <span className="text-sm font-bold text-[#1e293b] min-w-[120px] text-left">{currentCategoryLabel}</span>
              <ChevronDown size={18} className={`text-gray-300 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-gray-50 z-[110] p-3 overflow-hidden origin-top-right"
                >
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center px-6 py-3.5 rounded-2xl text-sm font-bold transition-all text-left ${
                          selectedCategory === cat.id 
                            ? 'bg-brand-red/5 text-brand-red' 
                            : 'text-slate-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- Content Area --- */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border border-red-50 shadow-sm">
             <div className="w-20 h-20 bg-red-50 text-brand-red rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Feed</h3>
             <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 px-6">{error}</p>
             <button 
               onClick={() => loadData(0, true)}
               className="bg-[#1e293b] text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-brand-red transition-all"
             >
                RETRY
             </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[4/5] bg-white rounded-[40px] animate-pulse border border-gray-100 p-8 flex flex-col gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-full" />
                 <div className="w-full h-4 bg-gray-50 rounded" />
                 <div className="w-2/3 h-4 bg-gray-50 rounded" />
                 <div className="flex-grow w-full bg-gray-50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
             <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                <Inbox size={48} />
             </div>
             <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-2 uppercase">
               {language === 'ne' ? 'कुनै रिपोर्ट भेटिएन' : 'NO REPORTS FOUND'}
             </h3>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
               {language === 'ne' ? 'यस वर्गमा अहिले कुनै सक्रिय रिपोर्टहरू छैनन्।' : 'NO ACTIVE REPORTS IN THIS CATEGORY AT THE MOMENT.'}
             </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
              {complaints.map((complaint, index) => (
                <div 
                  key={complaint.id} 
                  ref={index === complaints.length - 1 ? lastElementRef : null}
                >
                  <ComplaintCard complaint={complaint} />
                </div>
              ))}
            </div>
            {loadingMore && (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-brand-red" size={40} />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Background radial gradient decoration */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,56,147,0.02)_0%,rgba(255,255,255,0)_100%)] pointer-events-none -z-10"></div>
    </div>
  );
}
