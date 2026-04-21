import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Calendar, MapPin, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { NEPAL_LOCATIONS, Province, District } from '../utils/nepalLocations';
import CustomSelect from '../components/CustomSelect';

export default function SetupProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    provinceId: '',
    districtName: '',
    municipalityName: '',
    wardNo: '',
    pollingStation: ''
  });

  // Derived State
  const selectedProvince = NEPAL_LOCATIONS.find(p => p.id.toString() === formData.provinceId);
  const selectedDistrict = selectedProvince?.districts.find(d => d.name === formData.districtName);

  const provinceOptions = NEPAL_LOCATIONS.map(p => ({
    id: p.id.toString(),
    label: `${p.nameNep} (${p.name})`
  }));

  const districtOptions = selectedProvince ? selectedProvince.districts.map(d => ({
    id: d.name,
    label: `${d.nameNep} (${d.name})`
  })) : [];

  const municipalityOptions = selectedDistrict ? selectedDistrict.municipalities.map(m => ({
    id: m.name,
    label: `${m.nameNep} (${m.name})`
  })) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Profile setup complete:', formData);
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#003893]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Complete Profile</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Citizen Identity Registration</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-12 px-12">
            <div className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${step >= 1 ? 'bg-brand-red' : 'bg-gray-100'}`} />
            <div className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${step >= 2 ? 'bg-brand-red' : 'bg-gray-100'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">First Name</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Last Name</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Date of Birth</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-all">
                      <Calendar size={18} />
                    </div>
                    <input 
                      type="date" 
                      required
                      className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all shadow-inner outline-none uppercase"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.firstName || !formData.lastName || !formData.dob}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-red transition-all shadow-xl hover:shadow-brand-red/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  Continue to Location <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Location Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Province */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">State (प्रदेश)</label>
                      {formData.provinceId && <CheckCircle2 size={14} className="text-green-500" />}
                    </div>
                    <CustomSelect 
                      options={[
                        { id: '', label: 'Select State / प्रदेश छान्नुहोस्' },
                        ...provinceOptions
                      ]}
                      value={formData.provinceId}
                      onChange={(val) => setFormData({...formData, provinceId: val, districtName: '', municipalityName: ''})}
                      className="bg-gray-50 rounded-2xl px-4"
                      showBorder={false}
                    />
                  </div>

                  {/* District */}
                  <div className={`space-y-2 transition-opacity ${!formData.provinceId ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">District (जिल्ला)</label>
                      {formData.districtName && <CheckCircle2 size={14} className="text-green-500" />}
                    </div>
                    <div className="relative">
                      <CustomSelect 
                        options={[
                          { id: '', label: 'Select District / जिल्ला छान्नुहोस्' },
                          ...districtOptions
                        ]}
                        value={formData.districtName}
                        onChange={(val) => setFormData({...formData, districtName: val, municipalityName: ''})}
                        className="bg-gray-50 rounded-2xl px-4"
                        showBorder={false}
                      />
                      {!formData.provinceId && (
                        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
                          <Lock size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Municipality */}
                  <div className={`space-y-2 transition-opacity ${!formData.districtName ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Municipality (नगरपालिका)</label>
                      {formData.municipalityName && <CheckCircle2 size={14} className="text-green-500" />}
                    </div>
                    <div className="relative">
                      <CustomSelect 
                        options={[
                          { id: '', label: 'Select Municipality / नगरपालिका छान्नुहोस्' },
                          ...municipalityOptions
                        ]}
                        value={formData.municipalityName}
                        onChange={(val) => setFormData({...formData, municipalityName: val})}
                        className="bg-gray-50 rounded-2xl px-4"
                        showBorder={false}
                      />
                      {!formData.districtName && (
                        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
                          <Lock size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ward No */}
                  <div className={`space-y-2 transition-opacity ${!formData.municipalityName ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ward No. (वडा नं.)</label>
                      {formData.wardNo && <CheckCircle2 size={14} className="text-green-500" />}
                    </div>
                    <div className="relative">
                      <input 
                        type="number"
                        min="1"
                        max="33"
                        disabled={!formData.municipalityName}
                        className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 px-6 text-sm font-medium transition-all shadow-inner outline-none"
                        placeholder="e.g. 1"
                        value={formData.wardNo}
                        onChange={(e) => setFormData({...formData, wardNo: e.target.value})}
                      />
                      {!formData.municipalityName && (
                        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
                          <Lock size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Polling Station */}
                <div className={`space-y-2 transition-opacity ${!formData.wardNo ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between ml-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Polling Station (मतदान केन्द्र)</label>
                    {formData.pollingStation && <CheckCircle2 size={14} className="text-green-500" />}
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      disabled={!formData.wardNo}
                      className="w-full bg-gray-50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl py-4 px-6 text-sm font-medium transition-all shadow-inner outline-none"
                      placeholder="Search or Select Polling Station"
                      value={formData.pollingStation}
                      onChange={(e) => setFormData({...formData, pollingStation: e.target.value})}
                    />
                    {!formData.wardNo && (
                      <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
                        <Lock size={14} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-grow bg-gray-100 text-gray-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !formData.pollingStation}
                    className="flex-[2] bg-brand-red text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 transition-all shadow-xl hover:shadow-brand-red/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                      <>
                        Complete Registration <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>

      <div className="mt-12 text-center opacity-40">
        <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400">Government Certified System &bull; Secured with SHA-256</p>
      </div>
    </div>
  );
}
