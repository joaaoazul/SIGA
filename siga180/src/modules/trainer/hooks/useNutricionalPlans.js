import { useApi, useApiMutation } from '../../shared/hooks/useApi';

export const useTrainerNutritionPlans = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const { data, loading, error, refetch } = useApi(
    `/trainer/nutrition-plans${queryParams ? `?${queryParams}` : ''}`,
    { dependencies: [queryParams] }
  );

  return {
    plans: data?.plans || [],
    total: data?.total || 0,
    loading,
    error,
    refetch
  };
};

export const useCreateNutritionPlan = () => {
  return useApiMutation('/trainer/nutrition-plans', {
    method: 'POST',
    onSuccess: (data) => {
      console.log('Plan created:', data);
    }
  });
};

export const useUpdateNutritionPlan = (planId) => {
  return useApiMutation(`/trainer/nutrition-plans/${planId}`, {
    method: 'PUT'
  });
};

export const useDuplicatePlan = () => {
  return useApiMutation((planId) => `/trainer/nutrition-plans/${planId}/duplicate`, {
    method: 'POST'
  });
};
