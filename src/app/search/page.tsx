"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, Loader2, ArrowRight, User, TrendingUp, History, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchComplaints, Complaint } from '@/services/complaintService';

export default function SearchPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (val: string) => {
    if (!val.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchComplaints(0, 5, 'All', val);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const recommendedItems = [
    { title: t('report'), desc: t('reportSearchDesc'), path: '/report', icon: Sparkles, color: 'text-brand-red bg-brand-red/5' },
    { title: t('communityFeed'), desc: t('feedSearchDesc'), path: '/', icon: TrendingUp, color: 'text-brand-blue bg-brand-blue/5' },
    { title: t('aboutUs'), desc: t('aboutSearchDesc'), path: '/about', icon: User, color: 'text-gray-900 bg-gray-50' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sleek Search Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50">
        <div className="max-w-2xl mx-auto px-6 h-20 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              autoFocus
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-12 text-sm font-bold focus:ring-2 focus:ring-brand-red/10 transition-all outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-brand-red" size={18} />
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div 
              key="defaultview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Feature Shortcuts */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 ml-2">{t('recommended')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {recommendedItems.map((item, idx) => (
                    <Link 
                      key={idx}
                      href={item.path}
                      className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] hover:border-brand-red/20 transition-all hover:shadow-xl hover:shadow-brand-red/5"
                    >
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                            <item.icon size={22} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">{item.title}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                         </div>
                      </div>
                      <ArrowRight size={18} className="text-gray-200 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="resultsview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
                    {results.length} {t('resultsFound')}
                  </h3>
               </div>

               {results.length > 0 ? (
                 <div className="space-y-4">
                   {results.map((res) => (
                     <Link 
                        key={res.id} 
                        href={`/complaint/${res.id}`}
                        className="block p-6 bg-white border border-gray-50 rounded-[32px] hover:border-gray-100 transition-all active:scale-[0.98]"
                     >
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-[8px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-3 py-1 rounded-full">
                              {res.category}
                           </span>
                           <span className="text-[10px] font-bold text-gray-300">#{res.id}</span>
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tighter">{res.title}</h4>
                        <div className="flex items-center gap-2 text-gray-400">
                           <MapPin size={12} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">{res.location}</span>
                        </div>
                     </Link>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 text-center space-y-4">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{t('noResultsFound')}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Try different keywords or browse the feed</p>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
