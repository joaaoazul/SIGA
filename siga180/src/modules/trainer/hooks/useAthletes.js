import { useState, useCallback } from 'react';
import { useApi, useApiMutation } from '../../shared/hooks/useApi';
import nutritionService from '../../../services/api/nutrition.service';

export const useAthletes = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const { data, loading, error, refetch } = useApi(
    `/trainer/athletes${queryParams ? `?${queryParams}` : ''}`,
    { dependencies: [queryParams] }
  );

  return {
    athletes: data?.athletes || [],
    total: data?.total || 0,
    loading,
    error,
    refetch
  };
};

export const useAthlete = (athleteId) => {
  const { data, loading, error, refetch } = useApi(
    `/trainer/athletes/${athleteId}`,
    { 
      dependencies: [athleteId],
      auto: !!athleteId 
    }
  );

  return {
    athlete: data,
    loading,
    error,
    refetch
  };
};

export const useCreateAthlete = () => {
  return useApiMutation('/trainer/athletes', {
    onSuccess: (data) => {
      console.log('Athlete created:', data);
    }
  });
};

export const useUpdateAthlete = (athleteId) => {
  return useApiMutation(`/trainer/athletes/${athleteId}`, {
    method: 'PUT'
  });
};

export const useDeleteAthlete = () => {
  return useApiMutation((id) => `/trainer/athletes/${id}`, {
    method: 'DELETE'
  });
};