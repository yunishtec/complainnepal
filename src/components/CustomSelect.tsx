"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  isNe?: boolean;
  showBorder?: boolean;
  disabled?: boolean;
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  label,
  className = '', 
  isNe = false, 
  showBorder = true,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {label && <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 transition-all outline-none ${
          showBorder ? (isOpen ? 'border-b-2 border-brand-red' : 'border-b-2 border-gray-100') : 'border-none'
        } ${isNe ? 'font-nepali' : 'font-medium'}`}
      >
        <div className="flex items-center gap-2 text-base">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-300'}>
            {selectedOption ? selectedOption.label : 'Select...'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                    value === option.value ? 'bg-brand-red/5 text-brand-red font-bold' : 'text-gray-700'
                  } ${isNe ? 'font-nepali' : 'font-medium'}`}
                >
                  {option.icon && <span className="text-base">{option.icon}</span>}
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
