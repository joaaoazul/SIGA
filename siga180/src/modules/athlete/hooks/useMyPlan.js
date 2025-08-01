import { useApi } from '../../shared/hooks/useApi';

export const useMyNutritionPlan = () => {
  const { data, loading, error, refetch } = useApi('/athlete/my-plan');

  return {
    plan: data?.plan,
    expires: data?.expires,
    daysRemaining: data?.daysRemaining,
    loading,
    error,
    refetch
  };
};

export const useMyMealsToday = () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, loading, error, refetch } = useApi(
    `/athlete/my-meals?date=${today}`
  );

  return {
    meals: data?.meals || [],
    totals: data?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 },
    remaining: data?.remaining || {},
    loading,
    error,
    refetch
  };
};