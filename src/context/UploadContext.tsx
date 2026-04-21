"use client";
import React, { createContext, useContext, useState } from 'react';
import { saveComplaint } from '../services/complaintService';

interface UploadTask {
  id: string;
  title: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadContextType {
  activeUploads: UploadTask[];
  startUpload: (formData: FormData, title: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [activeUploads, setActiveUploads] = useState<UploadTask[]>([]);

  const startUpload = async (formData: FormData, title: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Add to active uploads
    setActiveUploads(prev => [...prev, { id, title, progress: 0, status: 'uploading' }]);

    try {
      // Execute the upload in background
      await saveComplaint(formData);
      
      // Update status to completed
      setActiveUploads(prev => prev.map(task => 
        task.id === id ? { ...task, status: 'completed', progress: 100 } : task
      ));

    } catch (error: any) {
      console.error("Background upload failed:", error);
      setActiveUploads(prev => prev.map(task => 
        task.id === id ? { ...task, status: 'error', error: error.message || 'Server error' } : task
      ));
    } finally {
      // Remove notification after 5 seconds regardless of success or error
      setTimeout(() => {
        setActiveUploads(prev => prev.filter(task => task.id !== id));
      }, 5000);
    }
  };

  return (
    <UploadContext.Provider value={{ activeUploads, startUpload }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) throw new Error('useUpload must be used within UploadProvider');
  return context;
}
