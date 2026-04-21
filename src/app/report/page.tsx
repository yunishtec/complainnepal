"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Route, Droplets, Zap, Camera, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUpload } from '@/context/UploadContext';

export default function ReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { startUpload } = useUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'garbage',
    location: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('file', file);

    startUpload(data, formData.title);
    router.push('/success');
  };

  const categories = [
    { id: 'garbage', label: 'GARBAGE / WASTE', icon: Trash2 },
    { id: 'road', label: 'ROAD DAMAGE', icon: Route },
    { id: 'water', label: 'WATER SUPPLY', icon: Droplets },
    { id: 'electricity', label: 'ELECTRICITY', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center md:items-start">
        <h1 className="font-display text-[120px] md:text-[180px] leading-[0.8] text-brand-red uppercase tracking-tighter">ALL</h1>
        <h2 className="font-serif italic text-5xl md:text-7xl text-gray-900 mt-2">YOUR report</h2>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <div className="bg-[#FBFCFE] rounded-[48px] p-8 md:p-16 border border-gray-50">
          <form onSubmit={handleSubmit} className="space-y-16">
            
            {/* 01 THE ISSUE */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-black text-xs">01</div>
                <h3 className="font-black uppercase tracking-tight text-gray-900">THE ISSUE</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">ISSUE TITLE</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Large pothole on main road"
                  className="w-full bg-[#F8FAFC] border border-gray-100/50 rounded-2xl py-6 px-8 text-sm font-bold focus:bg-white focus:border-brand-red/30 outline-none transition-all placeholder:text-gray-300"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">CATEGORY</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`flex flex-col items-center justify-center gap-4 py-8 rounded-3xl border transition-all ${
                        formData.category === cat.id 
                          ? 'bg-[#FDF2F4] border-brand-red text-brand-red' 
                          : 'bg-white border-gray-50 text-gray-300 hover:border-gray-200'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl transition-colors ${formData.category === cat.id ? 'bg-white' : 'bg-gray-50'}`}>
                        <cat.icon size={20} strokeWidth={2.5} />
                      </div>
                      <span className="text-[9px] font-black tracking-widest">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 02 DETAILS & LOCATION */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-black text-xs">02</div>
                <h3 className="font-black uppercase tracking-tight text-gray-900">DETAILS & LOCATION</h3>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">LOCATION</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Koteshwor, Kathmandu"
                    className="w-full bg-[#F8FAFC] border border-gray-100/50 rounded-2xl py-6 px-8 text-sm font-bold focus:bg-white focus:border-brand-red/30 outline-none transition-all placeholder:text-gray-300"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">DESCRIPTION</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Provide more details about the issue..."
                    className="w-full bg-[#F8FAFC] border border-gray-100/50 rounded-[32px] py-8 px-10 text-sm font-bold focus:bg-white focus:border-brand-red/30 outline-none transition-all resize-none placeholder:text-gray-300 shadow-inner"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 03 EVIDENCE */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-black text-xs">03</div>
                <h3 className="font-black uppercase tracking-tight text-gray-900">EVIDENCE</h3>
              </div>

              <div className="relative w-48 aspect-square bg-[#F8FAFC] rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group hover:border-brand-red/20">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Camera className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Camera size={24} className="text-gray-300" />
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">0/3</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                type="submit"
                className="bg-brand-red text-white px-16 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:shadow-[0_15px_40px_rgba(220,10,60,0.3)] transition-all transform active:scale-95 shadow-lg shadow-brand-red/20"
              >
                <Send size={18} /> SUBMIT REPORT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
