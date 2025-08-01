import { useApi, useApiMutation } from '../../shared/hooks/useApi';

export const useMyCheckIns = () => {
  const { data, loading, error, refetch } = useApi('/athlete/my-checkins');

  return {
    checkIns: data?.checkIns || [],
    nextCheckIn: data?.nextCheckIn,
    loading,
    error,
    refetch
  };
};

export const useSubmitCheckIn = () => {
  const [submitting, setSubmitting] = useState(false);

  const submitCheckIn = useCallback(async (checkInData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add measurements
      Object.keys(checkInData.measurements).forEach(key => {
        formData.append(`measurements[${key}]`, checkInData.measurements[key]);
      });

      // Add photos
      if (checkInData.photos) {
        checkInData.photos.forEach((photo, index) => {
          if (photo.file) {
            formData.append(`photos`, photo.file);
          }
        });
      }

      // Add other data
      formData.append('weight', checkInData.weight);
      formData.append('notes', checkInData.notes || '');

      const response = await fetch('/api/athlete/checkins', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitCheckIn, submitting };
};