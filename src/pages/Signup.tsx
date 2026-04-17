import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Signup
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      if (!signupRes.ok) {
        const data = await signupRes.json();
        throw new Error(data.detail || 'Registration failed');
      }

      // 2. Auto-login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginRes.ok) throw new Error('Registration successful, but login failed');

      const data = await loginRes.json();
      await login(data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#003893]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Complaine<span className="text-brand-red">Nepal</span>
            </h1>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Join Archive</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Become a verified citizen reporter</p>
        </div>

        {error && (
          <div className="bg-red-50 text-brand-red text-[11px] font-bold p-4 rounded-2xl mb-6 text-center border border-red-100 uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Public Username</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                <User size={18} />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none"
                placeholder="citizen_report_01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Create Password</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-red transition-all shadow-xl hover:shadow-brand-red/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Register Now <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Already have an account? {' '}
            <Link to="/login" className="text-gray-900 hover:text-brand-red transition-all border-b-2 border-gray-100 hover:border-brand-red/30 pb-0.5 ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
