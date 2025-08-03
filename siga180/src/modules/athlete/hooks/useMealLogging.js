// src/modules/athlete/hooks/useMealLogging.js
import { useState } from 'react';
import { UploadService } from '../../../services/upload/UploadService'; // Correção aqui
import { useApiMutation } from '../../shared/hooks/useApi';

export const useMealLogging = () => {
  const [currentMeal, setCurrentMeal] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock API calls for now
  const logMealMutation = useApiMutation(async (mealData) => {
    console.log('Logging meal:', mealData);
    // TODO: Implement with Supabase
    return { id: Date.now(), ...mealData };
  });

  const uploadPhotoMutation = useApiMutation(async ({ file, mealId }) => {
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await UploadService.uploadMealPhoto(file, mealId);
      setUploadProgress(100);
      return result;
    } finally {
      clearInterval(interval);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  });

  const updateMealMutation = useApiMutation(async ({ mealId, updates }) => {
    console.log('Updating meal:', mealId, updates);
    // TODO: Implement with Supabase
    return { id: mealId, ...updates };
  });

  const deleteMealMutation = useApiMutation(async (mealId) => {
    console.log('Deleting meal:', mealId);
    // TODO: Implement with Supabase
    return { success: true };
  });

  const logMeal = async (mealData) => {
    try {
      const meal = await logMealMutation.mutate(mealData);
      setCurrentMeal(meal);
      return meal;
    } catch (error) {
      console.error('Error logging meal:', error);
      throw error;
    }
  };

  const uploadMealPhoto = async (file, mealId) => {
    return uploadPhotoMutation.mutate({ file, mealId });
  };

  const updateMeal = async (mealId, updates) => {
    return updateMealMutation.mutate({ mealId, updates });
  };

  const deleteMeal = async (mealId) => {
    return deleteMealMutation.mutate(mealId);
  };

  return {
    currentMeal,
    uploadProgress,
    logMeal,
    uploadMealPhoto,
    updateMeal,
    deleteMeal,
    loading: logMealMutation.loading || uploadPhotoMutation.loading,
    error: logMealMutation.error || uploadPhotoMutation.error
  };
};