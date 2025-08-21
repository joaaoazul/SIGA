// src/modules/trainer/pages/Scheduling/hooks/useSchedule.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { toast } from 'react-hot-toast';

export const useSchedule = (filters = {}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('schedules')
        .select(`
          *,
          athlete:profiles!schedules_athlete_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          ),
          workout_plan:workout_plans(
            id,
            name,
            type
          )
        `)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true });

      // Aplicar filtros
      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      if (filters.dateFrom) {
        query = query.gte('scheduled_date', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('scheduled_date', filters.dateTo);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setSchedules(data || []);
    } catch (err) {
      setError(err.message);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createSchedule = async (scheduleData) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;
      
      setSchedules(prev => [...prev, data]);
      toast.success('Agendamento criado com sucesso');
      return { success: true, data };
    } catch (err) {
      toast.error('Erro ao criar agendamento');
      return { success: false, error: err.message };
    }
  };

  const updateSchedule = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSchedules(prev => prev.map(s => s.id === id ? data : s));
      toast.success('Agendamento atualizado');
      return { success: true, data };
    } catch (err) {
      toast.error('Erro ao atualizar agendamento');
      return { success: false, error: err.message };
    }
  };

  const deleteSchedule = async (id) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Agendamento eliminado');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao eliminar agendamento');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
  };
};