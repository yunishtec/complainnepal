"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { auth, db } from '@/lib/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure Firestore profile exists even if signed up via Google
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          username: user.displayName || user.email?.split('@')[0],
          isAdmin: false,
          isProfileSetup: false,
          createdAt: new Date().toISOString(),
        });
        router.push('/setup-profile');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mobile-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Complaine<span className="text-brand-red">Nepal</span>
            </h1>
          </Link>
          <h2 className="massive-text-card text-gray-900 mb-2">Access Portal</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Sign in to your archive</p>
        </div>

        {error && (
          <div className="bg-red-50 text-brand-red text-[11px] font-bold p-4 rounded-2xl mb-6 text-center border border-red-100 uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
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
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="bg-white px-4 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <div className="mt-10 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Don't have an account? {' '}
            <Link href="/signup" className="text-gray-900 hover:text-brand-red transition-all border-b-2 border-gray-100 hover:border-brand-red/30 pb-0.5 ml-1">
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
