import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Home, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Success() {
  const location = useLocation();
  const { mediaUrl, category } = location.state || {};
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center"
      >
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-red/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="massive-text mb-4" style={{ color: '#DC143C', fontSize: 'clamp(3rem, 10vw, 6rem)' }}>{t('success')}</h1>
          <h2 className="editorial-serif text-4xl text-gray-900">{t('dhanyabaad')}</h2>
        </div>

        <p className="text-gray-500 mb-12 leading-relaxed text-lg max-w-md mx-auto">
          {t('successDesc')}
        </p>

        {mediaUrl && (
          <div className="mb-12 rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 max-w-sm mx-auto bg-gray-50 flex flex-col">
            <div className="w-full h-64 flex items-center justify-center bg-gray-50">
              {(() => {
                const url = typeof mediaUrl === 'string' ? mediaUrl.split(',')[0].trim() : '';
                if (!url) return <div className="text-gray-300 text-[10px] font-black uppercase">No Preview</div>;
                
                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|^.*cloudinary.*\/video\/upload\/.*$/i);
                
                return isVideo ? (
                  <video src={url} className="w-full h-64 object-cover" controls autoPlay muted loop crossOrigin="anonymous" />
                ) : (
                  <img src={url} alt="Submitted evidence" className="w-full h-64 object-cover" crossOrigin="anonymous" />
                );
              })()}
            </div>
            <div className="p-4 bg-white text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-t border-gray-50">
              {t('evidence')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 px-8 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-red transition-all shadow-xl"
          >
            <Home className="w-4 h-4" /> {t('home')}
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'ComplaineNepal Report',
                  text: `I just reported a ${category} issue via ComplaineNepal!`,
                  url: window.location.origin,
                });
              }
            }}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-gray-900 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-brand-red transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" /> {t('share')}
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
            {t('referenceId')}: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
