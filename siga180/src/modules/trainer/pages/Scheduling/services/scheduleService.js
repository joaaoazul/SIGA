// src/modules/trainer/pages/Scheduling/services/scheduleService.js
import { supabase } from '../../../../../lib/supabase';

class ScheduleService {
  // ========================================
  // CRUD OPERATIONS
  // ========================================

  /**
   * Buscar agendamentos com filtros
   */
  async getSchedules(filters = {}) {
    try {
      let query = supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(
            id,
            full_name,
            email,
            avatar_url,
            phone
          ),
          trainer:trainer_id(
            id,
            full_name,
            email,
            avatar_url
          )
        `);

      // Filtro por trainer
      if (filters.trainerId) {
        query = query.eq('trainer_id', filters.trainerId);
      }

      // Filtro por atleta
      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }

      // Filtro por intervalo de datas
      if (filters.dateFrom) {
        query = query.gte('scheduled_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('scheduled_date', filters.dateTo);
      }

      // Filtro por data específica
      if (filters.date) {
        query = query.eq('scheduled_date', filters.date);
      }

      // Filtro por status
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      // Filtro por tipo
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      // Ordenação
      const orderBy = filters.orderBy || 'scheduled_date';
      const ascending = filters.ascending !== false;
      query = query.order(orderBy, { ascending });
      
      // Se ordenar por data, adicionar ordenação secundária por hora
      if (orderBy === 'scheduled_date') {
        query = query.order('start_time', { ascending });
      }

      const { data, error } = await query;

      if (error) throw error;

      return { 
        success: true, 
        data: data || [],
        count: data?.length || 0
      };
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return { 
        success: false, 
        error: error.message,
        data: [] 
      };
    }
  }

  /**
   * Buscar um agendamento específico
   */
  async getScheduleById(id) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(
            id,
            full_name,
            email,
            avatar_url,
            phone,
            emergency_contact
          ),
          trainer:trainer_id(
            id,
            full_name,
            email,
            avatar_url,
            phone
          ),
          attendance:schedule_attendance(
            *
          ),
          reschedule_requests(
            *,
            status
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Criar novo agendamento
   */
  async createSchedule(scheduleData) {
    try {
      // Verificar conflitos primeiro
      const conflicts = await this.checkConflicts({
        trainerId: scheduleData.trainer_id,
        date: scheduleData.scheduled_date,
        startTime: scheduleData.start_time,
        endTime: scheduleData.end_time
      });

      if (conflicts.hasConflict) {
        return { 
          success: false, 
          error: 'Conflito de horário detectado',
          conflicts: conflicts.data 
        };
      }

      // Calcular duração em minutos
      const duration = this.calculateDuration(
        scheduleData.start_time, 
        scheduleData.end_time
      );

      // Preparar dados para inserção
      const insertData = {
        ...scheduleData,
        duration_minutes: duration,
        status: scheduleData.status || 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('schedules')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Criar notificações automáticas
      if (data && scheduleData.reminder_minutes) {
        await this.createScheduleNotifications(data);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating schedule:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar agendamento
   */
  async updateSchedule(id, updates) {
    try {
      // Se mudou horário, verificar conflitos
      if (updates.scheduled_date || updates.start_time || updates.end_time) {
        const conflicts = await this.checkConflicts({
          trainerId: updates.trainer_id,
          date: updates.scheduled_date,
          startTime: updates.start_time,
          endTime: updates.end_time,
          excludeId: id
        });

        if (conflicts.hasConflict) {
          return { 
            success: false, 
            error: 'Conflito de horário detectado',
            conflicts: conflicts.data 
          };
        }
      }

      // Recalcular duração se necessário
      if (updates.start_time && updates.end_time) {
        updates.duration_minutes = this.calculateDuration(
          updates.start_time, 
          updates.end_time
        );
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating schedule:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancelar agendamento
   */
  async cancelSchedule(id, reason, cancelledBy) {
    try {
      const updates = {
        status: 'cancelled',
        cancelled_reason: reason,
        cancelled_by: cancelledBy,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Enviar notificação de cancelamento
      await this.sendCancellationNotification(data);

      return { success: true, data };
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar agendamento
   */
  async deleteSchedule(id) {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // BULK OPERATIONS
  // ========================================

  /**
   * Criar múltiplos agendamentos
   */
  async createBulkSchedules(schedulesArray) {
    try {
      // Verificar conflitos para todos
      const conflictChecks = await Promise.all(
        schedulesArray.map(schedule => 
          this.checkConflicts({
            trainerId: schedule.trainer_id,
            date: schedule.scheduled_date,
            startTime: schedule.start_time,
            endTime: schedule.end_time
          })
        )
      );

      const hasAnyConflict = conflictChecks.some(check => check.hasConflict);
      if (hasAnyConflict) {
        return { 
          success: false, 
          error: 'Conflitos detectados',
          conflicts: conflictChecks.filter(c => c.hasConflict)
        };
      }

      // Preparar dados
      const insertData = schedulesArray.map(schedule => ({
        ...schedule,
        duration_minutes: this.calculateDuration(
          schedule.start_time, 
          schedule.end_time
        ),
        status: schedule.status || 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('schedules')
        .insert(insertData)
        .select();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating bulk schedules:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // RECURRING SCHEDULES
  // ========================================

  /**
   * Criar agendamentos recorrentes
   */
  async createRecurringSchedule(baseSchedule, pattern) {
    try {
      const dates = this.generateRecurringDates(
        baseSchedule.scheduled_date,
        pattern
      );

      // Criar o agendamento pai
      const parentResult = await this.createSchedule({
        ...baseSchedule,
        is_recurring: true,
        recurring_pattern: pattern
      });

      if (!parentResult.success) {
        return parentResult;
      }

      const parentId = parentResult.data.id;

      // Criar as ocorrências
      const occurrences = dates.slice(1).map((date, index) => ({
        ...baseSchedule,
        scheduled_date: date,
        is_recurring: true,
        parent_schedule_id: parentId,
        occurrence_number: index + 2,
        recurring_pattern: pattern
      }));

      const bulkResult = await this.createBulkSchedules(occurrences);

      return {
        success: bulkResult.success,
        data: {
          parent: parentResult.data,
          occurrences: bulkResult.data
        }
      };
    } catch (error) {
      console.error('Error creating recurring schedule:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gerar datas para agendamentos recorrentes
   */
  generateRecurringDates(startDate, pattern) {
    const dates = [];
    const { frequency, interval, count, until, daysOfWeek } = pattern;
    
    let currentDate = new Date(startDate);
    let occurrenceCount = 0;
    const maxOccurrences = count || 52; // Máximo 1 ano se não especificado
    const endDate = until ? new Date(until) : null;

    while (occurrenceCount < maxOccurrences) {
      // Verificar se passou da data limite
      if (endDate && currentDate > endDate) {
        break;
      }

      // Adicionar data baseado na frequência
      if (frequency === 'daily') {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + (interval || 1));
      } 
      else if (frequency === 'weekly') {
        if (daysOfWeek && daysOfWeek.length > 0) {
          // Específico para dias da semana
          for (let i = 0; i < 7; i++) {
            const dayOfWeek = currentDate.getDay();
            if (daysOfWeek.includes(dayOfWeek)) {
              dates.push(currentDate.toISOString().split('T')[0]);
              occurrenceCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          currentDate.setDate(currentDate.getDate() + ((interval - 1) * 7));
        } else {
          dates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + (7 * (interval || 1)));
        }
      }
      else if (frequency === 'monthly') {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setMonth(currentDate.getMonth() + (interval || 1));
      }

      occurrenceCount++;
    }

    return dates;
  }

  // ========================================
  // CONFLICT DETECTION
  // ========================================

  /**
   * Verificar conflitos de horário
   */
  async checkConflicts({ trainerId, date, startTime, endTime, excludeId }) {
    try {
      // Usar a função SQL que criámos
      const { data, error } = await supabase
        .rpc('check_schedule_conflicts', {
          p_trainer_id: trainerId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime,
          p_exclude_id: excludeId || null
        });

      if (error) throw error;

      return {
        hasConflict: data && data.length > 0,
        data: data || []
      };
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return { hasConflict: false, data: [] };
    }
  }

  // ========================================
  // ATTENDANCE
  // ========================================

  /**
   * Marcar presença
   */
  async markAttendance(scheduleId, athleteId, status, notes) {
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('schedule_attendance')
        .select('id')
        .eq('schedule_id', scheduleId)
        .eq('athlete_id', athleteId)
        .single();

      let result;
      
      if (existing) {
        // Atualizar existente
        result = await supabase
          .from('schedule_attendance')
          .update({
            status,
            notes,
            marked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Criar novo
        result = await supabase
          .from('schedule_attendance')
          .insert([{
            schedule_id: scheduleId,
            athlete_id: athleteId,
            status,
            notes,
            marked_at: new Date().toISOString()
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Atualizar status da sessão se necessário
      if (status === 'present') {
        await this.updateSchedule(scheduleId, { status: 'completed' });
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error marking attendance:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Confirmar presença (pelo atleta)
   */
  async confirmAttendance(scheduleId, athleteId) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({
          athlete_confirmed: true,
          athlete_confirmed_at: new Date().toISOString()
        })
        .eq('id', scheduleId)
        .eq('athlete_id', athleteId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error confirming attendance:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // NOTIFICATIONS
  // ========================================

  /**
   * Criar notificações para um agendamento
   */
  async createScheduleNotifications(schedule) {
    try {
      const notifications = [];
      
      // Notificação de lembrete
      if (schedule.reminder_minutes) {
        const reminderTime = new Date(schedule.scheduled_date + ' ' + schedule.start_time);
        reminderTime.setMinutes(reminderTime.getMinutes() - schedule.reminder_minutes);

        notifications.push({
          schedule_id: schedule.id,
          recipient_id: schedule.athlete_id,
          type: 'reminder',
          channel: 'email',
          subject: `Lembrete: ${schedule.title}`,
          message: `Tem uma sessão agendada para hoje às ${schedule.start_time}`,
          scheduled_for: reminderTime.toISOString(),
          status: 'pending'
        });
      }

      // Pedido de confirmação (24h antes)
      const confirmTime = new Date(schedule.scheduled_date + ' ' + schedule.start_time);
      confirmTime.setHours(confirmTime.getHours() - 24);
      
      notifications.push({
        schedule_id: schedule.id,
        recipient_id: schedule.athlete_id,
        type: 'confirmation_request',
        channel: 'email',
        subject: `Confirme a sua presença: ${schedule.title}`,
        message: `Por favor confirme a sua presença na sessão de amanhã`,
        scheduled_for: confirmTime.toISOString(),
        status: 'pending'
      });

      if (notifications.length > 0) {
        const { error } = await supabase
          .from('schedule_notifications')
          .insert(notifications);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating notifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar notificação de cancelamento
   */
  async sendCancellationNotification(schedule) {
    try {
      const notification = {
        schedule_id: schedule.id,
        recipient_id: schedule.athlete_id,
        type: 'cancellation',
        channel: 'email',
        subject: `Sessão Cancelada: ${schedule.title}`,
        message: `A sua sessão foi cancelada. ${schedule.cancelled_reason || ''}`,
        scheduled_for: new Date().toISOString(),
        status: 'pending'
      };

      const { error } = await supabase
        .from('schedule_notifications')
        .insert([notification]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // STATISTICS
  // ========================================

  /**
   * Obter estatísticas de agendamentos
   */
  async getScheduleStats(trainerId, period = 'month') {
    try {
      const now = new Date();
      let dateFrom;
      
      switch(period) {
        case 'week':
          dateFrom = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateFrom = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          dateFrom = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          dateFrom = new Date(now.setMonth(now.getMonth() - 1));
      }

      const { data, error } = await supabase
        .from('schedules')
        .select('status, type')
        .eq('trainer_id', trainerId)
        .gte('scheduled_date', dateFrom.toISOString().split('T')[0]);

      if (error) throw error;

      // Calcular estatísticas
      const stats = {
        total: data.length,
        completed: data.filter(s => s.status === 'completed').length,
        cancelled: data.filter(s => s.status === 'cancelled').length,
        noShow: data.filter(s => s.status === 'no_show').length,
        scheduled: data.filter(s => s.status === 'scheduled').length,
        byType: {}
      };

      // Agrupar por tipo
      data.forEach(schedule => {
        if (!stats.byType[schedule.type]) {
          stats.byType[schedule.type] = 0;
        }
        stats.byType[schedule.type]++;
      });

      // Calcular taxas
      stats.completionRate = stats.total > 0 
        ? ((stats.completed / stats.total) * 100).toFixed(1)
        : 0;
      
      stats.cancellationRate = stats.total > 0
        ? ((stats.cancelled / stats.total) * 100).toFixed(1)
        : 0;

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting schedule stats:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Calcular duração em minutos
   */
  calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end - start;
    return Math.floor(diffMs / 60000); // Converter para minutos
  }

  /**
   * Formatar horário para display
   */
  formatTimeRange(startTime, endTime) {
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  }

  /**
   * Obter cor baseada no status
   */
  getStatusColor(status) {
    const colors = {
      scheduled: '#3B82F6',  // Blue
      confirmed: '#10B981',  // Green
      in_progress: '#F59E0B', // Yellow
      completed: '#059669',   // Dark Green
      cancelled: '#EF4444',   // Red
      no_show: '#6B7280'      // Gray
    };
    return colors[status] || '#3B82F6';
  }

  /**
   * Obter próximas sessões do atleta
   */
  async getUpcomingSessions(athleteId, limit = 10) {
    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_sessions', {
          p_athlete_id: athleteId,
          p_limit: limit
        });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error getting upcoming sessions:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ScheduleService();