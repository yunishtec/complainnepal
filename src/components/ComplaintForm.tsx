import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { saveComplaint } from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';
import CustomSelect from './CustomSelect';

const CATEGORIES = [
  { id: 'garbage', labelKey: 'garbage', icon: '🗑️' },
  { id: 'road', labelKey: 'road', icon: '🛣️' },
  { id: 'water', labelKey: 'water', icon: '💧' },
  { id: 'electricity', labelKey: 'electricity', icon: '⚡' },
];

export default function ComplaintForm() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('file', file);

      const result = await saveComplaint(data);

      navigate('/success', { state: { mediaUrl: result.mediaUrl, category: formData.category } });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('issueTitle')}</label>
          <input
            required
            type="text"
            placeholder={t('titlePlaceholder')}
            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-brand-red outline-none transition-all text-xl font-medium placeholder:text-gray-200"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('category')}</label>
            <CustomSelect
              options={categoryOptions}
              value={formData.category}
              onChange={val => setFormData(prev => ({ ...prev, category: val }))}
              isNe={isNe}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('location')}</label>
            <input
              required
              type="text"
              placeholder={t('locationPlaceholder')}
              className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-brand-red outline-none transition-all text-lg font-medium placeholder:text-gray-200"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('description')}</label>
          <textarea
            required
            rows={4}
            placeholder={t('descPlaceholder')}
            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-brand-red outline-none transition-all text-lg font-medium placeholder:text-gray-200 resize-none"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('evidence')}</label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              required
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-brand-red transition-all overflow-hidden"
            >
              {preview ? (
                <div className="relative w-full h-full group">
                  <img src={preview} alt="Preview" className="w-full h-[300px] object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">{t('changeFile')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{t('uploadMedia')}</p>
                  <p className="text-xs text-gray-400">{t('dragDrop')}</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
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
      </form>
    </div>
  );
}
