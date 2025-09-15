import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export const useImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
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
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addImages = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImages: UploadedImage[] = fileArray.map(file => ({
      id: Math.random().toString(36).substring(2),
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const uploadPromises = images.map(img => uploadImage(img.file));
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter(url => url !== null) as string[];
  };

  return {
    images,
    uploading,
    addImages,
    removeImage,
    clearImages,
    uploadAllImages
  };
};