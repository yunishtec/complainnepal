import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, FileText, Scale, ShieldAlert, Gavel } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      {/* 🏛️ MODERN EDITORIAL HEADER */}
      <section className="relative pt-24 pb-20 px-6 border-b border-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-red mb-12 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return Home
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Legal Agreement</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Last Updated: April 14, 2026
                </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              Terms of <br /> Service
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
                By using ComplaineNepal, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
            </p>
          </motion.div>
        </div>

        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(220,20,60,0.03)_0%,transparent_70%)] pointer-events-none -z-10"></div>
      </section>

      {/* 📜 CONTENT SECTION */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-xl prose-gray max-w-none">
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-20 space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                01. Introduction
              </h2>
              <p className="leading-relaxed text-gray-500">
                Welcome to ComplainNepal. These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and all related services (collectively, the "Service").
              </p>
              <p className="leading-relaxed text-gray-500 italic border-l-4 border-gray-100 pl-6 py-2">
                By accessing, browsing, or using ComplainNepal, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use the Service.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                02. Use License
              </h2>
              <div className="p-10 bg-gray-900 rounded-[3rem] text-white overflow-hidden relative mb-8">
                <h3 className="text-xl font-bold mb-6 relative z-10">Prohibited Activities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 relative z-10">
                    {[
                        "Reproduce or distribute content without permission",
                        "Use the service for fraudulent or harmful purposes",
                        "Attempt to gain unauthorized access to accounts",
                        "Post misleading, false, or defamatory content",
                        "Interfere with platform security/functionality",
                        "Harvest or collect user data without consent"
                    ].map(i => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                            {i}
                        </li>
                    ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-10"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                03. User Content
              </h2>
              <div className="flex gap-8">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-red">
                    <FileText className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Your Responsibility</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        When you submit complaints or comments, you represent that you own the content and that it is not defamatory, harassing, or illegal. You grant us a worldwide license to use and distribute it for Service operation.
                    </p>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-red">
                    <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Content Moderation</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        ComplainNepal reserves the right to review, edit, or remove content deemed inappropriate or harmful, and to suspend or terminate violating accounts.
                    </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-10"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                04. Disclaimers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {[
                    { icon: <Scale className="w-5 h-5"/>, title: "No Legal Advice", desc: "We facilitate complaint lodging only; we do not provide legal representation or guarantees of resolution." },
                    { icon: <ShieldAlert className="w-5 h-5"/>, title: "As-Is Basis", desc: "Service is provided without warranties of any kind regarding accuracy, completeness, or reliability." }
                ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-brand-red/20 transition-colors group">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-red mb-6 transition-transform group-hover:scale-110">
                            {item.icon}
                        </div>
                        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                        <p className="text-sm font-medium leading-relaxed text-gray-500">{item.desc}</p>
                    </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 mb-8">
                <span className="w-8 h-1 bg-brand-red"></span>
                05. Governing Law
              </h2>
              <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 border-dashed flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-white mb-8">
                    <Gavel className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Kathmandu, Nepal</h3>
                <p className="text-gray-500 max-w-md leading-relaxed">
                    These terms are governed by the laws of Nepal. Any disputes will be submitted to binding arbitration in Kathmandu.
                </p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                06. Contact Us
              </h2>
              <p className="text-gray-500 leading-relaxed">
                    For questions or insights regarding these Terms, please reach out directly:
              </p>
              <a 
                href="mailto:support@complainnepal.com"
                className="inline-flex items-center gap-6 px-10 py-6 bg-gray-900 border border-gray-800 rounded-3xl hover:bg-brand-red transition-all group w-full md:w-auto"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h4 className="font-black uppercase text-[10px] text-gray-400 tracking-widest mb-1 group-hover:text-white/60 transition-colors">Legal Support</h4>
                    <p className="text-xl font-black text-white">support@complainnepal.com</p>
                </div>
              </a>
            </motion.div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] mt-40">
                End of Terms of Service for complainnepal
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
