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
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      
      if (onProgress) onProgress(50);
      setProgress(50);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result: UploadResult = await response.json();
      
      if (onProgress) onProgress(100);
      setProgress(100);
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
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
