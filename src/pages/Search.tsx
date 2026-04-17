import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowLeft, X, Loader2, LayoutGrid, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';

export default function Search() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [featureResults, setFeatureResults] = useState<any[]>([]);

  const isNe = language === 'ne';

  const features = React.useMemo(() => [
    { title: t('report'), path: '/report', desc: t('reportSearchDesc') },
    { title: t('feed'), path: '/feed', desc: t('feedSearchDesc') },
    { title: t('aboutUs'), path: '/about', desc: t('aboutSearchDesc') },
    { title: t('privacyPolicy'), path: '/privacy-policy', desc: t('privacySearchDesc') },
  ], [t]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setFeatureResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    // Feature search
    const matchedFeatures = features.filter(f => 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFeatureResults(matchedFeatures);

    try {
      const data = await fetchComplaints(0, 20, undefined, searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [features]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col">
      {/* Search Header */}
      <div className="bg-white sticky top-0 z-50 px-6 py-4 md:py-8 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-grow relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors">
              <SearchIcon size={20} />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder') || (isNe ? 'केही खोज्नुहोस्...' : 'Search reports or features...')}
              autoFocus
              className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-12 text-sm font-medium transition-all shadow-inner outline-none"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-12"
              >
                 <div className="flex flex-col items-center justify-center pt-10 pb-0 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                       <SearchIcon size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-2">{t('searchWhatYouNeed') || 'Search What You Need'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px] leading-relaxed">
                      {t('searchDesc') || 'Find reports, community posts, or key application features.'}
                    </p>
                 </div>

                 {/* Recommended Section */}
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-6">{t('recommended') || 'Recommended'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feat) => (
                        <div 
                          key={feat.path}
                          onClick={() => navigate(feat.path)}
                          className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-brand-red group-hover:text-white transition-all">
                               {feat.path === '/report' ? <Filter size={20} /> : <LayoutGrid size={20} />}
                            </div>
                            <div>
                              <h5 className="font-black text-sm uppercase tracking-tight text-gray-900">{feat.title}</h5>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{feat.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse"></div>
                ))}
              </motion.div>
            ) : results.length > 0 || featureResults.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Features Section */}
                {featureResults.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-6">{t('matchingFeatures') || 'Matching Features'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {featureResults.map((feat) => (
                        <div 
                          key={feat.path}
                          onClick={() => navigate(feat.path)}
                          className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-red/20 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-black text-lg uppercase tracking-tight text-gray-900 group-hover:text-brand-red transition-colors">{feat.title}</h5>
                              <p className="text-xs text-gray-400 font-medium">{feat.desc}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-brand-red group-hover:text-white transition-all">
                               <ArrowLeft size={18} className="rotate-180" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complaints Section */}
                {results.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {results.length} {t('reportsFound') || 'Reports Found'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {results.map((complaint) => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[40px] border border-gray-100 flex flex-col items-center"
              >
                 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <X size={32} className="text-red-200" />
                 </div>
                 <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">{t('noResultsFound') || 'No matching reports found'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
