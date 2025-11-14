'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VideoUploadProps {
  userId: string;
  onUploadComplete: (videoUrl: string, thumbnailUrl: string) => void;
  onError: (error: Error) => void;
}

export default function VideoUpload({ userId, onUploadComplete, onError }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      onError(new Error('Please upload a valid video file (MP4, MOV, or WebM)'));
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      onError(new Error('File size must be less than 100MB'));
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Generate thumbnail URL (you'll need to implement this)
      const thumbnailUrl = publicUrl.replace(`.${fileExt}`, '-thumb.jpg');

      onUploadComplete(publicUrl, thumbnailUrl);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={handleFileSelect}
        className="hidden"
        id="video-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="video-upload"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading... {Math.round(uploadProgress)}%
          </>
        ) : (
          'Upload Video Resume'
        )}
      </label>
    </div>
  );
} 