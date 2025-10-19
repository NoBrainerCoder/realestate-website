import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedMedia {
  id: string;
  url: string;
  file: File;
  type: 'image' | 'video';
}

export const useMediaUpload = () => {
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadMedia = async (file: File, type: 'image' | 'video'): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || `Failed to upload ${type}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addMedia = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newMedia: UploadedMedia[] = fileArray.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        id: Math.random().toString(36).substring(2),
        url: URL.createObjectURL(file),
        file,
        type: isVideo ? 'video' : 'image'
      };
    });
    
    setMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (id: string) => {
    setMedia(prev => {
      const mediaToRemove = prev.find(m => m.id === id);
      if (mediaToRemove) {
        URL.revokeObjectURL(mediaToRemove.url);
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const clearMedia = () => {
    media.forEach(m => URL.revokeObjectURL(m.url));
    setMedia([]);
  };

  const uploadAllMedia = async (): Promise<Array<{ url: string; type: 'image' | 'video' }>> => {
    const uploadPromises = media.map(async (m) => {
      const url = await uploadMedia(m.file, m.type);
      return url ? { url, type: m.type } : null;
    });
    const uploadedMedia = await Promise.all(uploadPromises);
    return uploadedMedia.filter(m => m !== null) as Array<{ url: string; type: 'image' | 'video' }>;
  };

  return {
    media,
    uploading,
    addMedia,
    removeMedia,
    clearMedia,
    uploadAllMedia
  };
};