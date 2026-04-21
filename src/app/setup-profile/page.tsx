"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, MapPin, ArrowRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NEPAL_LOCATIONS } from '@/utils/nepalLocations';
import CustomSelect from '@/components/CustomSelect';

export default function SetupProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    province: '',
    district: '',
    municipality: '',
    wardNo: '',
    pollingStation: ''
  });

  // Location Options
  const provinces = NEPAL_LOCATIONS.map(p => ({ value: p.name, label: `${p.name} (${p.nameNep})` }));
  const [districts, setDistricts] = useState<{value: string, label: string}[]>([]);
  const [municipalities, setMunicipalities] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    if (formData.province) {
      const provinceObj = NEPAL_LOCATIONS.find(p => p.name === formData.province);
      if (provinceObj) {
        setDistricts(provinceObj.districts.map(d => ({ value: d.name, label: `${d.name} (${d.nameNep})` })));
        setFormData(prev => ({ ...prev, district: '', municipality: '' }));
      }
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district && formData.province) {
      const provinceObj = NEPAL_LOCATIONS.find(p => p.name === formData.province);
      const districtObj = provinceObj?.districts.find(d => d.name === formData.district);
      if (districtObj) {
        setMunicipalities(districtObj.municipalities.map(m => ({ value: m.name, label: `${m.name} (${m.nameNep})` })));
        setFormData(prev => ({ ...prev, municipality: '' }));
      }
    }
  }, [formData.district, formData.province]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { db } = await import('@/lib/firebaseConfig');
      const { doc, updateDoc } = await import('firebase/firestore');
      
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        isProfileSetup: true,
        updatedAt: new Date().toISOString()
      });

      router.push('/');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF2F4] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div 
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-12 bg-brand-red' : 'w-6 bg-gray-200'}`}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 shadow-2xl shadow-brand-red/5 border border-brand-red/5"
        >
          <div className="mb-10">
            <h1 className="massive-text-card text-gray-900 mb-2">
              {step === 1 ? 'Personal Bio' : 'Citizen Identity'}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              {step === 1 ? 'Tell us who you are' : 'Confirm your location in Nepal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">First Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-red/20 transition-all outline-none"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Last Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-red/20 transition-all outline-none"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="date" 
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-brand-red/20 transition-all outline-none"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.firstName || !formData.lastName || !formData.dob}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-brand-red transition-all shadow-xl hover:shadow-brand-red/20 disabled:opacity-50"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <CustomSelect 
                    label="State (प्रदेश)" 
                    options={provinces} 
                    value={formData.province} 
                    onChange={(val) => setFormData({...formData, province: val})} 
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <CustomSelect 
                      label="District (जिल्ला)" 
                      options={districts} 
                      value={formData.district} 
                      onChange={(val) => setFormData({...formData, district: val})} 
                      disabled={!formData.province}
                    />
                    <CustomSelect 
                      label="Municipality (नगरपालिका)" 
                      options={municipalities} 
                      value={formData.municipality} 
                      onChange={(val) => setFormData({...formData, municipality: val})} 
                      disabled={!formData.district}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Ward No. (वडा नं.)</label>
                       <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-red/20 transition-all outline-none" 
                        placeholder="e.g. 7"
                        value={formData.wardNo}
                        onChange={(e) => setFormData({...formData, wardNo: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Station (मतदान केन्द्र)</label>
                       <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-red/20 transition-all outline-none" 
                        placeholder="Polling Center"
                        value={formData.pollingStation}
                        onChange={(e) => setFormData({...formData, pollingStation: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={handleBack}
                      className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
                    >
                      <ChevronDown className="rotate-90" size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || !formData.province || !formData.district || !formData.municipality}
                      className="flex-grow bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-brand-red transition-all shadow-xl hover:shadow-brand-red/20 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>Complete Setup <CheckCircle2 size={16} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
          Your identity remains private unless <br/> you choose to share your reports publicly.
        </p>
      </div>
    </div>
  );
}
