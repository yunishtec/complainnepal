import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { fetchRecentComplaints, Complaint } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import { Loader2, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CustomSelect from '../components/CustomSelect';

export default function Feed() {
  const { t, language } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const isNe = language === 'ne';

  const filterOptions = [
    { id: 'all', label: t('allCategories') },
    { id: 'garbage', label: t('garbage') },
    { id: 'road', label: t('road') },
    { id: 'water', label: t('water') },
    { id: 'electricity', label: t('electricity') },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRecentComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Load feed failed:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className={`text-4xl font-black text-gray-900 mb-2 tracking-tight ${isNe ? 'font-nepali' : ''}`}>{t('publicFeed')}</h1>
            <p className={`text-gray-500 ${isNe ? 'font-nepali font-medium' : ''}`}>{t('feedDesc')}</p>
          </motion.div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <CustomSelect
              options={filterOptions}
              value={filter}
              onChange={setFilter}
              isNe={isNe}
              className="min-w-[180px]"
              showBorder={false}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-4" />
            <p className={`text-gray-500 font-medium ${isNe ? 'font-nepali' : ''}`}>{t('loadingReports')}</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className={`text-gray-400 italic ${isNe ? 'font-nepali' : ''}`}>{t('noReports')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
