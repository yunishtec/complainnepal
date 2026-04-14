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
      <section className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gray-900" />
                {t('guidelines')}
              </h3>
              <ul className="space-y-8">
                {[
                  { title: t('beSpecific'), desc: t('beSpecificDesc') },
                  { title: t('provideEvidence'), desc: t('provideEvidenceDesc') },
                  { title: t('stayUpdated'), desc: t('stayUpdatedDesc') }
                ].map((item, i) => (
                  <li key={i} className="group">
                    <span className="text-[10px] font-bold text-brand-red mb-1 block">0{i+1}</span>
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <ComplaintForm />
          </div>
        </div>
      </section>
    </div>
  );
}
