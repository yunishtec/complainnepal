import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, Loader2, Trash2, Route, Droplets, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { saveComplaint } from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';
import { useUpload } from '../context/UploadContext';
import { compressVideo } from '../utils/videoCompression';
import CustomSelect from './CustomSelect';

const CATEGORIES = [
  { id: 'garbage', labelKey: 'garbage', icon: Trash2 },
  { id: 'road', labelKey: 'road', icon: Route },
  { id: 'water', labelKey: 'water', icon: Droplets },
  { id: 'electricity', labelKey: 'electricity', icon: Zap },
];

export default function ComplaintForm() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { startUpload } = useUpload();
  const isNe = language === 'ne';

  const categoryOptions = CATEGORIES.map(c => ({
    id: c.id,
    label: t(c.labelKey),
    icon: c.icon
  }));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'garbage',
    location: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const [compressing, setCompressing] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const availableSlots = 5 - files.length;
    
    if (availableSlots <= 0) {
      alert("Maximum 5 files allowed.");
      return;
    }

    const validNewFiles: File[] = [];
    const newPreviews: { url: string; type: string }[] = [];

    // 1. Filter out invalid files first
    const validSelection = selectedFiles.slice(0, availableSlots).filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      const isVideo = file.type.startsWith('video/');
      if (isVideo && sizeMB > 300) {
        alert(`${file.name} exceeds 300MB maximum limit.`);
        return false;
      }
      if (!isVideo && sizeMB > 5) {
        alert(`${file.name} exceeds 5MB photo limit.`);
        return false;
      }
      return true;
    });

    const baseLength = files.length;

    // 2. Process each valid file
    for (const [index, file] of validSelection.entries()) {
      const currentIdx = baseLength + index; // Guaranteed unique for this batch
      
      // Create preview
      const reader = new FileReader();
      const previewData = await new Promise<{url: string; type: string}>((resolve) => {
        reader.onloadend = () => resolve({ url: reader.result as string, type: file.type });
        reader.readAsDataURL(file);
      });

      // Add to states
      setFiles(prev => [...prev, file]);
      setPreviews(prev => [...prev, previewData]);

      // 3. Background Compression
      const isVideo = file.type.startsWith('video/');
      const sizeMB = file.size / (1024 * 1024);
      
      if (isVideo && sizeMB > 50) {
        setCompressing(prev => ({ ...prev, [currentIdx]: 0 }));
        
        try {
          const compressed = await compressVideo(file, (p) => {
            setCompressing(prev => ({ ...prev, [currentIdx]: p }));
          });
          
          setFiles(prev => {
            const next = [...prev];
            next[currentIdx] = compressed;
            return next;
          });
        } catch (err) {
          console.error("Compression failed:", err);
        } finally {
          setCompressing(prev => {
             const newC = {...prev};
             delete newC[currentIdx];
             return newC;
          });
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please add at least one photo or video.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    
    files.forEach(file => {
      data.append('files', file);
    });

    // INSTANT SUBMISSION: Start upload in background and redirect
    startUpload(data, formData.title);
    navigate('/feed');
  };

  return (
    <div className="bg-white px-4 py-10 md:px-6 md:py-14 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-50">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SECTION 1: THE PROBLEM */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">01</span>
            <h3 className="text-xl font-black uppercase tracking-tight">The Issue</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('issueTitle')}</label>
              <input
                required
                type="text"
                placeholder={t('titlePlaceholder')}
                className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all text-xl font-bold placeholder:text-gray-300"
                value={formData.title}
                maxLength={40}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
              <div className="flex justify-end pr-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${formData.title.length >= 35 ? 'text-brand-red' : 'text-gray-300'}`}>
                  {formData.title.length}/40
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('category')}</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group hover:scale-[1.03] active:scale-95 ${
                      formData.category === cat.id 
                        ? 'border-brand-red bg-brand-red/5' 
                        : 'border-gray-50 bg-white hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                       formData.category === cat.id ? 'bg-white shadow-sm' : 'bg-gray-50'
                    }`}>
                      <cat.icon size={24} className={formData.category === cat.id ? 'text-brand-red' : 'text-gray-400'} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      formData.category === cat.id ? 'text-brand-red' : 'text-gray-400'
                    }`}>
                      {t(cat.labelKey)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE DETAILS */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">02</span>
            <h3 className="text-xl font-black uppercase tracking-tight">Details & Location</h3>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('location')}</label>
              <input
                required
                type="text"
                placeholder={t('locationPlaceholder')}
                className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all text-lg font-bold placeholder:text-gray-300"
                value={formData.location}
                maxLength={35}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('description')}</label>
              <textarea
                required
                rows={4}
                placeholder={t('descPlaceholder')}
                className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all text-lg font-bold placeholder:text-gray-300 resize-none"
                value={formData.description}
                maxLength={800}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex justify-end pr-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${formData.description.length >= 750 ? 'text-brand-red' : 'text-gray-300'}`}>
                  {formData.description.length}/800
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EVIDENCE */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">03</span>
            <h3 className="text-xl font-black uppercase tracking-tight">Evidence</h3>
          </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {previews.map((preview, idx) => (
              <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                {compressing[idx] !== undefined ? (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center pointer-events-none">
                    <Loader2 className="w-5 h-5 animate-spin text-white mb-1" />
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">{compressing[idx]}%</span>
                  </div>
                ) : null}
                
                {preview.type.startsWith('video/') ? (
                   <video src={preview.url} className="w-full h-full object-cover" />
                ) : (
                   <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-red opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            {files.length < 5 && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-white hover:border-brand-red transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-[10px] font-black text-gray-400 uppercase">{files.length}/5</span>
              </label>
            )}
          </div>
        </div>
      </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto md:px-20 bg-brand-red text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(220,14,60,0.3)] hover:scale-[1.05] hover:shadow-[0_30px_80px_rgba(220,14,60,0.5)] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('submitReport')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
