import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Menu, X, Home as HomeIcon, LayoutGrid, Search, User, Plus, CheckCircle2, Loader2, AlertCircle, LogOut } from 'lucide-react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Report = lazy(() => import('./pages/Report'));
const Success = lazy(() => import('./pages/Success'));
const Feed = lazy(() => import('./pages/Feed'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const About = lazy(() => import('./pages/About'));
const ComplaintDetail = lazy(() => import('./pages/ComplaintDetail'));
const SearchPage = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));

import { useLanguage, LanguageProvider } from './context/LanguageContext';
import { UploadProvider, useUpload } from './context/UploadContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Sleek loading fallback
const PageLoader = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center">
    <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Experience</p>
  </div>
);

function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const items = [
    { icon: HomeIcon, path: '/', label: t('home') },
    { icon: Plus, path: '/report', label: t('report') },
    { icon: Search, path: '/search', label: t('search') || 'Search' },
    { icon: User, path: '/profile', label: t('profile') || 'User' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="bg-mobile-dark/95 backdrop-blur-lg rounded-full py-4 px-8 flex items-center justify-between shadow-2xl border border-white/10">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`transition-all duration-300 ${isActive ? 'scale-110 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeUploads } = useUpload();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('aboutUs'), path: '/about' },
    { name: t('report'), path: '/report' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white md:bg-white sm:bg-mobile-bg">
      {/* Navigation */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
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
              <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all hover:scale-105 active:scale-95">{t('home')}</Link>
              <Link to="/about" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all hover:scale-105 active:scale-95">{t('aboutUs')}</Link>
              <Link to="/feed" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all hover:scale-105 active:scale-95">{t('feed')}</Link>
              <Link to="/report" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-red transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-red hover:after:w-full after:transition-all hover:scale-105 active:scale-95">{t('report')}</Link>
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
            
            <button 
               onClick={() => navigate('/search')}
               className="hidden md:flex items-center justify-center w-10 h-10 bg-[#003893] text-white rounded-full hover:bg-brand-red transition-all hover:scale-110 active:scale-95 shadow-lg shadow-blue-900/10"
            >
               <Search size={18} />
            </button>
            
             <div className="hidden md:flex items-center gap-4">
               {user ? (
                 <>
                   <div className="flex items-center gap-4 mr-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-tight text-gray-900">{user.username}</span>
                        <button onClick={logout} className="text-[8px] font-black uppercase tracking-widest text-brand-red hover:brightness-110 transition-all flex items-center gap-1">
                          {t('logout')} <LogOut size={10} />
                        </button>
                     </div>
                     <Link to="/profile" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-lg overflow-hidden uppercase tracking-tighter hover:scale-110 transition-all">
                       {user.username.substring(0, 2)}
                     </Link>
                   </div>
                   <button 
                    onClick={() => navigate('/report')}
                    className="hidden md:block bg-[#0f172a] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-red transition-all hover:scale-110 hover:shadow-[0_10px_30px_rgba(220,20,60,0.3)] active:scale-95"
                   >
                    {t('report')}
                   </button>
                 </>
               ) : (
                 <button 
                  onClick={() => navigate('/login')}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-red transition-all hover:scale-110 shadow-xl active:scale-95"
                >
                  {t('login')}
                </button>
               )}
             </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-900 z-[60]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 md:hidden bg-white px-6 pt-24"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black uppercase tracking-tighter text-gray-900 border-b border-gray-100 pb-4"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="mt-8 flex items-center gap-4">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('connectWithUs') || 'Connect with us'}</p>
                   <div className="flex-grow h-[1px] bg-gray-100"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pb-24 md:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/report" element={<Report />} />
            <Route path="/complaint/:id" element={<ComplaintDetail />} />
            <Route path="/success" element={<Success />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Suspense>
      </main>

      <MobileBottomNav />

      {/* Global Background Uploads Status */}
      <div className="fixed bottom-24 md:bottom-10 right-6 z-[100] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {activeUploads.map(task => (
            <motion.div
              key={task.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                task.status === 'completed' ? 'bg-green-50 text-green-500' : 
                task.status === 'error' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-brand-red'
              }`}>
                {task.status === 'uploading' && <Loader2 className="w-5 h-5 animate-spin" />}
                {task.status === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                {task.status === 'error' && <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {task.status === 'uploading' ? 'Publishing Report...' : 
                   task.status === 'completed' ? 'Report Live!' : 'Upload Failed'}
                </p>
                <h4 className="text-sm font-bold text-gray-900 truncate">{task.title}</h4>
                {task.error && (
                  <p className="text-[10px] font-black text-red-500 mt-0.5 leading-none uppercase">{task.error}</p>
                )}
                {task.status === 'uploading' && (
                  <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand-red"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 15, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <UploadProvider>
            <AppContent />
          </UploadProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
