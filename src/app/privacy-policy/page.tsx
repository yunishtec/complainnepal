"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, ShieldCheck, Globe, Clock } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Legal Document</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Last Updated: April 14, 2026
                </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              Privacy <br /> Policy
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
              Transparent protocols on how we handle, protect, and respect your personal information at ComplaineNepal.
            </p>
          </motion.div>
        </div>

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
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>
              <p className="leading-relaxed text-gray-500 italic border-l-4 border-gray-100 pl-6 py-2">
                We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
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
                02. Definitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {[
                    { title: "Account", desc: "A unique account created for You to access our Service or parts of our Service." },
                    { title: "Company", desc: "Refers to complainnepal, our organization in Nepal." },
                    { title: "Cookies", desc: "Small files placed on Your device containing browsing history and usage details." },
                    { title: "Personal Data", desc: "Any information that relates to an identified or identifiable individual." },
                    { title: "Service", desc: "Refers to the Website accessible from complainnepal.com." },
                    { title: "Device", desc: "Any device that can access the Service such as a computer or mobile phone." }
                ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-brand-red/20 transition-colors group">
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-3 group-hover:text-brand-red transition-colors">{item.title}</h4>
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
                <span className="w-8 h-1 bg-brand-red"></span>
                03. Data Collection
              </h2>
              <div className="space-y-12">
                <div className="flex gap-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Personal Identifiable Information</h3>
                        <ul className="grid grid-cols-2 gap-4 text-gray-500 font-medium">
                            {["Email Address", "First and Last Name", "Phone Number", "Usage Statistics"].map(i => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                                    {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Tracking & Cookies</h3>
                        <p className="text-gray-500 leading-relaxed max-w-2xl mb-6">
                            We use Cookies and similar tracking technologies to track activity and store certain info. This includes beacons, tags, and scripts to analyze our Service.
                        </p>
                        <div className="flex gap-4">
                            <span className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Necessary Cookies</span>
                            <span className="px-5 py-2.5 bg-brand-red text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Functionality Cookies</span>
                        </div>
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
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8 relative z-10">Data Retention</h2>
              <p className="text-gray-400 mb-10 leading-relaxed relative z-10">
                We retain your Personal Data only for as long as necessary. User Accounts are typically retained for the duration of the relationship plus up to 24 months after closure.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-brand-red mb-2">Support Tickets</h5>
                    <p className="text-sm">Retained up to 24 months from closure.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-brand-red mb-2">Usage Logs</h5>
                    <p className="text-sm">Security logs processed for 24 months.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[100px] -z-1"></div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20 space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-red"></span>
                04. Contact Infomation
              </h2>
              <p className="text-gray-500 leading-relaxed">
                If you have any questions about this Privacy Policy, your data rights, or our security protocols, please reach out to our legal department.
              </p>
              <a 
                href="mailto:offgridhqteam@gmail.com"
                className="inline-flex items-center gap-6 px-10 py-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-brand-red transition-all group"
              >
                <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black uppercase text-[10px] text-gray-400 tracking-widest mb-1">Email Support</h4>
                    <p className="text-xl font-black group-hover:text-brand-red transition-colors">offgridhqteam@gmail.com</p>
                </div>
              </a>
            </motion.div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] mt-40">
                End of Privacy Policy for complainnepal
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
