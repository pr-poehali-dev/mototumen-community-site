import { useState } from 'react';
import FUNC_URLS from '../../backend/func2url.json';

interface UploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  fileName: string;
  size: number;
}

const compressImage = async (file: File, maxSizeMB = 2): Promise<File> => {
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const maxDimension = 1920;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult | null> => {
    const { folder = 'general', onProgress } = options;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      console.log('[UPLOAD] Starting upload', file.name, file.size);
      let fileToUpload = file;
      
      if (file.type.startsWith('image/')) {
        console.log('[UPLOAD] Compressing image...');
        fileToUpload = await compressImage(file);
        console.log('[UPLOAD] Compressed to', fileToUpload.size);
      }
      
      console.log('[UPLOAD] Reading file as base64...');
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileToUpload);
      });

      const base64 = await base64Promise;
      console.log('[UPLOAD] Base64 ready, length:', base64.length);
      
      if (onProgress) onProgress(50);
      setProgress(50);

      console.log('[UPLOAD] Sending to', FUNC_URLS['upload-media']);
      const response = await fetch(FUNC_URLS['upload-media'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          contentType: file.type,
          folder,
        }),
      });

      console.log('[UPLOAD] Response status:', response.status, response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[UPLOAD] Error response:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const result: UploadResult = await response.json();
      console.log('[UPLOAD] Success!', result);
      
      if (onProgress) onProgress(100);
      setProgress(100);
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[UPLOAD] Failed:', err);
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadFromUrl = async (
    imageUrl: string,
    options: UploadOptions = {}
  ): Promise<UploadResult | null> => {
    const { folder = 'general', onProgress } = options;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const fileName = imageUrl.split('/').pop() || 'image.jpg';
      const file = new File([blob], fileName, { type: blob.type });
      
      return await uploadFile(file, { folder, onProgress });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch image';
      setError(message);
      return null;
    }
  };

  return {
    uploadFile,
    uploadFromUrl,
    uploading,
    progress,
    error,
  };
}