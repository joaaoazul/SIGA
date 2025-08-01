import { useApi } from '../../shared/hooks/useApi';

export const useMyProgress = (period = 'month') => {
  const { data, loading, error, refetch } = useApi(
    `/athlete/my-progress?period=${period}`,
    { dependencies: [period] }
  );

  return {
    progress: data || {
      weight: [],
      measurements: [],
      photos: [],
      compliance: {},
      achievements: []
    },
    loading,
    error,
    refetch
  };
};

export const useMyStats = () => {
  const { data, loading, error } = useApi('/athlete/my-stats');

  return {
    stats: data || {
      currentWeight: 0,
      targetWeight: 0,
      weightChange: 0,
      complianceRate: 0,
      streak: 0,
      totalCheckIns: 0
    },
    loading,
    error
  };
};
