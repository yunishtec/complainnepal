import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { fetchRecentComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import { useLanguage } from '../context/LanguageContext';

const PILLS = [
  { label: 'Garbage Collection', key: 'garbagePill' },
  { label: 'Road Repair', key: 'roadPill' },
  { label: 'Water Supply', key: 'waterPill' },
  { label: 'Electricity', key: 'electricityPill' },
  { label: 'Public Safety', key: 'safetyPill' },
  { label: 'Infrastructure', key: 'infraPill' },
  { label: 'Environment', key: 'envPill' },
  { label: 'Civic Rights', key: 'rightsPill' },
  { label: 'Local Governance', key: 'govPill' },
  { label: 'Sanitation', key: 'sanitationPill' }
];

export default function Home() {
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchRecentComplaints().then(setRecentComplaints);
  }, []);

  const isNe = language === 'ne';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center md:text-left relative">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isNe ? 'font-nepali font-bold' : 'editorial-serif'} text-4xl md:text-7xl text-gray-900 mb-4 md:mb-6`}
            >
              {t('heroTitle')}
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`${isNe ? 'massive-text-ne' : 'massive-text'} relative z-20`}
              style={{ color: '#DC143C' }}
            >
              {t('heroSubtitle')}
            </motion.h1>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-12 relative z-30">
              <Link
                to="/report"
                className="px-12 py-5 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-110 transition-all"
                style={{ backgroundColor: '#DC143C', boxShadow: '0 25px 50px -12px rgba(220, 20, 60, 0.4)' }}
              >
                {t('letsReport')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ backgroundColor: '#003893' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="text-white">
            <h2 className={`${isNe ? 'massive-text-ne' : 'massive-text'} text-white mb-4`}>{t('allYour')}</h2>
            <h3 className={`${isNe ? 'font-nepali font-bold' : 'editorial-serif'} text-4xl md:text-7xl text-white`}>{t('civicNeeds')}</h3>
          </div>
          
          <div className="text-right">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 max-w-xs ml-auto">
              {t('allTypesDesc')}
            </p>
            <Link to="/report" className="px-8 py-3 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 transition-all" style={{ color: '#003893' }}>
              {t('fileAReport')}
            </Link>
          </div>
        </div>

        {/* Floating Pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {PILLS.map((pill, i) => (
            <motion.div
              key={pill.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`px-6 py-3 rounded-full border border-white/30 bg-white ${isNe ? 'font-nepali font-bold' : 'font-serif italic'} text-lg shadow-xl transform`}
              style={{ 
                transform: `rotate(${(i % 3 - 1) * 3}deg)`,
                color: '#003893'
              }}
            >
              {t(pill.key)}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-20">
            <div>
              <h2 className="editorial-serif text-5xl text-gray-900 mb-4">{t('recentReports')}</h2>
              <div className="w-24 h-[1px] bg-gray-900" />
            </div>
            <Link to="/feed" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-red transition-colors flex items-center gap-2">
              {t('viewFeed')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {recentComplaints.slice(0, 3).map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
