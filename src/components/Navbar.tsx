"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Menu, 
  X, 
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'FEED', href: '/feed' },
    { name: 'REPORT', href: '/report' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
          ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm' 
          : 'py-6 bg-white/10 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/images/logo2.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-black tracking-tighter text-[#1e293b] flex items-center">
              COMPLAINE <span className="text-[#dc2626] ml-1">NEPAL.</span>
            </h1>
          </div>
        </Link>

        {/* Center Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[11px] font-black tracking-[0.1em] transition-colors ${
                pathname === link.href ? 'text-[#1e293b]' : 'text-gray-400 hover:text-[#1e293b]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side Icons/Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Switcher Pill */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 hover:bg-gray-100 transition-all shadow-sm"
          >
            <span className={`text-[10px] font-black ${language === 'en' ? 'text-brand-red' : 'text-gray-400'}`}>EN</span>
            <div className="w-[1px] h-3 bg-gray-200" />
            <span className={`text-[10px] font-black ${language === 'ne' ? 'text-brand-red' : 'text-gray-400'}`}>ने</span>
          </button>

          {/* Search Icon Circle */}
          <button className="w-10 h-10 bg-[#003893] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#003893]/20 hover:scale-105 transition-transform">
            <Search size={18} strokeWidth={2.5} />
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-red transition-all">
                <User size={20} />
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-[#1e293b] text-white px-8 py-3 rounded-full text-[11px] font-black tracking-widest hover:bg-brand-red transition-all shadow-lg active:scale-95"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#1e293b] text-white px-8 py-3 rounded-full text-[11px] font-black tracking-widest hover:bg-brand-red transition-all shadow-lg active:scale-95"
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 active:scale-95 transition-all shadow-sm"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-[88px] left-0 w-full bg-white border-b border-gray-100 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-black tracking-widest text-[#1e293b]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-[1px] w-full bg-gray-50" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest">LANGUAGE</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${language === 'en' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-400'}`}>EN</button>
                    <button onClick={() => setLanguage('ne')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${language === 'ne' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-400'}`}>ने</button>
                  </div>
                </div>

                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-[#1e293b] text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl"
                  >
                    LOGOUT
                  </button>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-[#1e293b] text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-center shadow-xl shadow-brand-red/10"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
