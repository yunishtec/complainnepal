import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Success from './pages/Success';
import Feed from './pages/Feed';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { MapPin } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 group">
              <img 
                src="/images/logo2.png" 
                alt="ComplaineNepal" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-black tracking-tighter uppercase transition-transform group-hover:scale-105">
                <span style={{ color: '#003893' }}>COMPLAINE</span> <span style={{ color: '#DC143C' }}>NEPAL.</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-8 md:gap-12">
              <div className="hidden md:flex items-center gap-10">
                <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all">{t('home')}</Link>
                <Link to="/feed" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all">{t('feed')}</Link>
                <Link to="/report" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all">{t('report')}</Link>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-gray-50 p-1 rounded-full border border-gray-100">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                    language === 'en' 
                      ? 'bg-white text-brand-red shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ne')}
                  className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                    language === 'ne' 
                      ? 'bg-white text-brand-red shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ने
                </button>
              </div>
              
              <Link 
                to="/report"
                className="hidden md:block px-6 py-2.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-red transition-all"
              >
                {t('getStarted')}
              </Link>

              <button className="md:hidden flex flex-col gap-1.5 p-2">
                <div className="w-6 h-[2px] bg-gray-900" />
                <div className="w-6 h-[2px] bg-gray-900" />
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/report" element={<Report />} />
            <Route path="/success" element={<Success />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

