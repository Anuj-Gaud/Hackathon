import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../lib/supabase';

interface VideoUploadProps {
  userId: string;
  onUploadComplete: (videoUrl: string, thumbnailUrl: string) => void;
  onError: (error: Error) => void;
}

export default function VideoUpload({ userId, onUploadComplete, onError }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/quicktime', 'video/webm'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      
      // Validate file size (max 100MB)
      if (file.size && file.size > 100 * 1024 * 1024) {
        onError(new Error('Video file size must be less than 100MB'));
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Create a FormData object for the file
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      } as any);

      // Upload video to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, formData);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Generate thumbnail URL (this would typically be handled by a serverless function)
      const thumbnailUrl = publicUrl.replace(`.${fileExt}`, '_thumb.jpg');

      onUploadComplete(publicUrl, thumbnailUrl);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isUploading && styles.buttonDisabled]}
        onPress={handleFileSelect}
        disabled={isUploading}
      >
        {isUploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.uploadingText}>
              Uploading... {Math.round(uploadProgress)}%
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Upload Video Resume</Text>
        )}
      </TouchableOpacity>
      {isUploading && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 8,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
}); 