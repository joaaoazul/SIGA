import { useState, useCallback } from 'react';
import { useApiMutation } from '../../shared/hooks/useApi';
import uploadService from '../../../services/upload/UploadService';

export const useLogMeal = () => {
  const [uploading, setUploading] = useState(false);
  const mutation = useApiMutation('/athlete/meals', {
    method: 'POST'
  });

  const logMeal = useCallback(async (mealData, photo = null) => {
    let photoUrl = null;

    if (photo) {
      setUploading(true);
      try {
        const uploadResult = await uploadService.uploadMealPhoto(photo, {
          mealType: mealData.type
        });
        photoUrl = uploadResult.url;
      } catch (error) {
        console.error('Photo upload failed:', error);
      } finally {
        setUploading(false);
      }
    }

    return mutation.mutate({
      ...mealData,
      photoUrl
    });
  }, [mutation]);

  return {
    logMeal,
    logging: mutation.loading || uploading,
    error: mutation.error
  };
};

export const useUpdateMealLog = (mealId) => {
  return useApiMutation(`/athlete/meals/${mealId}`, {
    method: 'PUT'
  });
};