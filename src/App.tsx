import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Success from './pages/Success';
import Feed from './pages/Feed';
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
            <Link to="/" className="flex items-center gap-1 group">
              <span className="text-xl font-black tracking-tighter text-gray-900 uppercase transition-transform group-hover:scale-105">
                Complaine<span style={{ color: '#DC143C' }}>Nepal.</span>
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
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white py-12 px-6 border-t border-gray-100">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <MapPin className="text-red-600 w-5 h-5" />
              <span className="font-bold text-gray-900">ComplaineNepal</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 ComplaineNepal. {t('builtForNepal')}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-red-600">{t('privacy')}</a>
              <a href="#" className="hover:text-red-600 text-sm text-gray-400 transition-colors">{t('terms')}</a>
              <a href="#" className="text-sm text-gray-400 hover:text-red-600">{t('contact')}</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

