import React from 'react';
import ComplaintForm from '../components/ComplaintForm';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Report() {
  const { t, language } = useLanguage();
  const isNe = language === 'ne';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="pt-20 pb-12 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className={`${isNe ? 'massive-text-ne' : 'massive-text'} mb-4 whitespace-nowrap`} style={{ color: '#DC143C' }}>{t('reportTitle1')}</h1>
              <h2 className={`${isNe ? 'font-nepali font-bold' : 'editorial-serif'} text-5xl md:text-8xl text-gray-900`}>{t('reportTitle2')}</h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 md:px-0 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <ComplaintForm />
        </div>
      </section>
    </div>
  );
}
