// src/modules/trainer/pages/Scheduling/hooks/useRecurring.js
import { useState, useCallback } from 'react';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { toast } from 'react-hot-toast';
import { addDays, addWeeks, addMonths, format } from 'date-fns';

export const useRecurring = () => {
  const [recurringPatterns, setRecurringPatterns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gerar ocorrências baseado no padrão
  const generateOccurrences = (pattern, startDate, endDate) => {
    const occurrences = [];
    let currentDate = new Date(startDate);
    const end = endDate ? new Date(endDate) : addMonths(currentDate, 6);

    while (currentDate <= end) {
      switch (pattern.type) {
        case 'daily':
          occurrences.push(new Date(currentDate));
          currentDate = addDays(currentDate, 1);
          break;
          
        case 'weekly':
          pattern.weekDays.forEach(day => {
            const dayOccurrence = getNextWeekday(currentDate, day);
            if (dayOccurrence <= end) {
              occurrences.push(dayOccurrence);
            }
          });
          currentDate = addWeeks(currentDate, 1);
          break;
          
        case 'biweekly':
          pattern.weekDays.forEach(day => {
            const dayOccurrence = getNextWeekday(currentDate, day);
            if (dayOccurrence <= end) {
              occurrences.push(dayOccurrence);
            }
          });
          currentDate = addWeeks(currentDate, 2);
          break;
          
        case 'monthly':
          if (pattern.dayOfMonth) {
            const monthOccurrence = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              pattern.dayOfMonth
            );
            if (monthOccurrence <= end) {
              occurrences.push(monthOccurrence);
            }
          }
          currentDate = addMonths(currentDate, 1);
          break;
      }

      // Limite de segurança
      if (occurrences.length > 365) break;
    }

    return occurrences;
  };

  // Auxiliar para obter próximo dia da semana
  const getNextWeekday = (date, targetDay) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const targetIndex = days.indexOf(targetDay);
    const currentIndex = date.getDay();
    const daysToAdd = (targetIndex - currentIndex + 7) % 7 || 7;
    return addDays(date, daysToAdd);
  };

  // Criar padrão recorrente e gerar agendamentos
  const createRecurringPattern = async (patternData) => {
    setLoading(true);
    
    try {
      // Salvar padrão
      const { data: pattern, error: patternError } = await supabase
        .from('recurring_patterns')
        .insert([{
          trainer_id: patternData.trainerId,
          athlete_id: patternData.athleteId,
          title: patternData.title,
          pattern_type: patternData.pattern,
          pattern_config: {
            weekDays: patternData.selectedDays,
            dayOfMonth: patternData.dayOfMonth,
            time: patternData.time,
            duration: patternData.duration
          },
          start_date: patternData.startDate,
          end_date: patternData.endDate,
          status: 'active'
        }])
        .select()
        .single();

      if (patternError) throw patternError;

      // Gerar ocorrências
      const occurrences = generateOccurrences(
        {
          type: patternData.pattern,
          weekDays: patternData.selectedDays,
          dayOfMonth: patternData.dayOfMonth
        },
        patternData.startDate,
        patternData.endDate
      );

      // Criar agendamentos em batch
      const schedules = occurrences.map(date => ({
        trainer_id: patternData.trainerId,
        athlete_id: patternData.athleteId,
        recurring_pattern_id: pattern.id,
        title: patternData.title,
        scheduled_date: format(date, 'yyyy-MM-dd'),
        start_time: patternData.time,
        end_time: calculateEndTime(patternData.time, patternData.duration),
        duration_minutes: patternData.duration,
        type: patternData.type || 'training',
        status: 'scheduled',
        location: patternData.location,
        is_online: patternData.isOnline,
        meeting_link: patternData.meetingLink
      }));

      const { error: schedulesError } = await supabase
        .from('schedules')
        .insert(schedules);

      if (schedulesError) throw schedulesError;

      toast.success(`${schedules.length} agendamentos criados com sucesso`);
      return { success: true, pattern, schedules };
      
    } catch (error) {
      toast.error('Erro ao criar padrão recorrente');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Calcular horário de fim
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  // Pausar/Retomar padrão
  const togglePatternStatus = async (patternId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('recurring_patterns')
        .update({ status: newStatus })
        .eq('id', patternId);

      if (error) throw error;

      // Atualizar agendamentos futuros
      if (newStatus === 'paused') {
        await supabase
          .from('schedules')
          .update({ status: 'cancelled' })
          .eq('recurring_pattern_id', patternId)
          .gte('scheduled_date', format(new Date(), 'yyyy-MM-dd'))
          .eq('status', 'scheduled');
      }

      toast.success(`Padrão ${newStatus === 'active' ? 'retomado' : 'pausado'}`);
      return { success: true };
      
    } catch (error) {
      toast.error('Erro ao atualizar padrão');
      return { success: false, error: error.message };
    }
  };

  // Eliminar padrão e agendamentos futuros
  const deletePattern = async (patternId) => {
    try {
      // Eliminar agendamentos futuros
      await supabase
        .from('schedules')
        .delete()
        .eq('recurring_pattern_id', patternId)
        .gte('scheduled_date', format(new Date(), 'yyyy-MM-dd'))
        .eq('status', 'scheduled');

      // Eliminar padrão
      const { error } = await supabase
        .from('recurring_patterns')
        .delete()
        .eq('id', patternId);

      if (error) throw error;

      toast.success('Padrão eliminado com sucesso');
      return { success: true };
      
    } catch (error) {
      toast.error('Erro ao eliminar padrão');
      return { success: false, error: error.message };
    }
  };

  return {
    recurringPatterns,
    loading,
    createRecurringPattern,
    generateOccurrences,
    togglePatternStatus,
    deletePattern
  };
};