import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onUpload, isLoading = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      // Dummy logic: simulate upload delay
      setTimeout(() => {
        onUpload(file);
        setFile(null);
      }, 1000);
      // In a real app, upload to Supabase storage here
      // const { data, error } = await supabase.storage.from('resumes').upload(file.name, file);
      // if (error) throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-lg shadow-soft p-6"
    >
      <h3 className="text-xl font-semibold text-black mb-4">Upload Video Resume</h3>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
      />
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="mt-2"
          >
            Upload
          </Button>
        </div>
      )}
    </motion.div>
  );
} 