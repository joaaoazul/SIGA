import { useCallback } from 'react';
import { useApiMutation } from '../../shared/hooks/useApi';
import wsService from '../../../services/websocket/WebSocketService';

export const useMealApproval = () => {
  const approveMutation = useApiMutation('/trainer/meals/approve', {
    method: 'POST'
  });

  const approveMeal = useCallback(async (athleteId, mealId, approved, feedback = '') => {
    try {
      const result = await approveMutation.mutate({
        athleteId,
        mealId,
        approved,
        feedback
      });

      // Send real-time notification
      wsService.send('meal-approval', {
        athleteId,
        mealId,
        approved,
        feedback
      });

      return result;
    } catch (error) {
      throw error;
    }
  }, [approveMutation]);

  return {
    approveMeal,
    approving: approveMutation.loading,
    error: approveMutation.error
  };
};
