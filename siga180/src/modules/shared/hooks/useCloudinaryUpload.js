import { useState, useCallback } from 'react';
import cloudinaryService from '../../../services/cloudinary/upload.service';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadMealPhoto = useCallback(async (file, metadata) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await cloudinaryService.uploadMealPhoto(file, metadata);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file, userId) => {
    setUploading(true);
    setError(null);

    try {
      const result = await cloudinaryService.uploadImage(file, {
        folder: `avatars/${userId}`,
        transformation: 'c_fill,w_200,h_200,g_face'
      });

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: result.url })
        .eq('id', userId);

      if (updateError) throw updateError;

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadMealPhoto,
    uploadAvatar,
    uploading,
    progress,
    error
  };
};