import { useApi } from '../../shared/hooks/useApi';

export const useTrainerAnalytics = (period = 'month') => {
  const { data, loading, error, refetch } = useApi(
    `/trainer/analytics?period=${period}`,
    { dependencies: [period] }
  );

  return {
    analytics: data || {
      totalAthletes: 0,
      activePlans: 0,
      avgCompliance: 0,
      monthlyRevenue: 0,
      checkInsCompleted: 0,
      mealPhotosReceived: 0
    },
    loading,
    error,
    refetch
  };
};

export const useAthleteCompliance = (athleteId, period = 'week') => {
  const { data, loading, error } = useApi(
    `/trainer/athletes/${athleteId}/compliance?period=${period}`,
    { dependencies: [athleteId, period] }
  );

  return {
    compliance: data?.compliance || {},
    trends: data?.trends || [],
    loading,
    error
  };
};
