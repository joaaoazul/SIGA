// src/modules/trainer/hooks/useSupabaseAthletes.js
import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import nutritionService from '../../../services/supabase/nutrition.service';
import { useAuth } from '../../shared/hooks/useAuth';

export const useAthletes = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'TRAINER') return;

    fetchAthletes();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('athletes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'athletes',
          filter: `trainer_id=eq.${user.trainer_id}`
        },
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getAthletes(user.trainer_id);
      setAthletes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (payload) => {
    switch (payload.eventType) {
      case 'INSERT':
        setAthletes(prev => [...prev, payload.new]);
        break;
      case 'UPDATE':
        setAthletes(prev => prev.map(a => 
          a.id === payload.new.id ? payload.new : a
        ));
        break;
      case 'DELETE':
        setAthletes(prev => prev.filter(a => a.id !== payload.old.id));
        break;
    }
  };

  const createAthlete = async (athleteData) => {
    try {
      const newAthlete = await nutritionService.createAthlete({
        ...athleteData,
        trainer_id: user.trainer_id
      });
      return { success: true, data: newAthlete };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    athletes,
    loading,
    error,
    refetch: fetchAthletes,
    createAthlete
  };
};