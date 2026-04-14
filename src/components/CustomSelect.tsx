import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  id: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isNe?: boolean;
  showBorder?: boolean;
}

export default function CustomSelect({ options, value, onChange, className = '', isNe = false, showBorder = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === value) || options[0];

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
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-4 transition-all outline-none ${
          showBorder ? (isOpen ? 'border-b-2 border-brand-red' : 'border-b-2 border-gray-100') : 'border-none'
        } ${isNe ? 'font-nepali' : 'font-medium'}`}
      >
        <div className="flex items-center gap-2 text-lg">
          {selectedOption.icon && <span>{selectedOption.icon}</span>}
          <span className="text-gray-900">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
                    value === option.id ? 'bg-brand-red/5 text-brand-red font-bold' : 'text-gray-700'
                  } ${isNe ? 'font-nepali' : 'font-medium'}`}
                >
                  {option.icon && <span className="text-xl">{option.icon}</span>}
                  <span className="text-lg">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
