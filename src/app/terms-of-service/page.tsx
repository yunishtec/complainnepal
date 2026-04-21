"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ChevronLeft, FileText, Scale, ExternalLink, Clock } from 'lucide-react';

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      {/* 🏛️ MODERN EDITORIAL HEADER */}
      <section className="relative pt-24 pb-20 px-6 border-b border-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/')}
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
                <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">User Agreement</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Effective Date: April 14, 2026
                </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              Terms Of <br /> Service
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
              The ethical and legal framework governing the use of ComplaineNepal to ensure a constructive civic environment.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(0,56,147,0.03)_0%,transparent_70%)] pointer-events-none -z-10"></div>
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
                <span className="w-8 h-1 bg-brand-blue"></span>
                01. Acceptance
              </h2>
              <p className="leading-relaxed text-gray-500">
                By accessing or using ComplaineNepal, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-blue"></span>
                02. User Conduct
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {[
                    { title: "Veracity", desc: "Users must provide truthful and accurate reports about public issues." },
                    { title: "Civility", desc: "Abusive language or harassment in remarks is strictly prohibited." },
                    { title: "Evidence", desc: "Do not upload manipulated or misleading media to the platform." },
                    { title: "Privacy", desc: "Respect the privacy of individuals when capturing photos/videos in public." }
                ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-brand-blue/20 transition-colors group">
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-3 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                        <p className="text-sm font-medium leading-relaxed text-gray-600">{item.desc}</p>
                    </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-10"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-blue"></span>
                03. Usage License
              </h2>
              <div className="space-y-12">
                <div className="flex gap-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Content Ownership</h3>
                        <p className="text-gray-500 leading-relaxed max-w-2xl">
                          You retain ownership of the content you submit. However, by posting, you grant ComplaineNepal a worldwide, non-exclusive license to use, display, and distribute such content.
                        </p>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                        <ExternalLink className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Account Responsibilities</h3>
                        <p className="text-gray-500 leading-relaxed max-w-2xl mb-6">
                            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                        </p>
                    </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 p-12 bg-gray-900 rounded-[3rem] text-white overflow-hidden relative"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8 relative z-10">Termination</h2>
              <p className="text-gray-400 mb-10 leading-relaxed relative z-10">
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[100px] -z-1"></div>
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
