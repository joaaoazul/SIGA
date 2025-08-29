// src/services/notifications/notificationWorker.js
import { supabase } from '../supabase/supabaseClient';
import emailService from '../emails/emailService';

class NotificationWorker {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 60000; // Verificar a cada minuto
  }

  /**
   * Iniciar o worker
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ NotificationWorker já está em execução');
      return;
    }

    console.log('🚀 NotificationWorker iniciado');
    this.isRunning = true;
    
    // Processar imediatamente
    this.processNotifications();
    
    // Configurar intervalo
    this.intervalId = setInterval(() => {
      this.processNotifications();
    }, this.checkInterval);
  }

  /**
   * Parar o worker
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 NotificationWorker parado');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Processar notificações pendentes
   */
  async processNotifications() {
    try {
      // Buscar notificações pendentes que devem ser enviadas
      const now = new Date().toISOString();
      
      const { data: notifications, error } = await supabase
        .from('schedule_notifications')
        .select(`
          *,
          schedule:schedule_id(
            *,
            athlete:athlete_id(name, email),
            trainer:trainer_id(name, phone)
          )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .limit(10); // Processar até 10 por vez

      if (error) {
        console.error('❌ Erro ao buscar notificações:', error);
        return;
      }

      if (!notifications || notifications.length === 0) {
        return; // Nada para processar
      }

      console.log(`📧 Processando ${notifications.length} notificação(ões)...`);

      // Processar cada notificação
      for (const notification of notifications) {
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error('❌ Erro no processamento de notificações:', error);
    }
  }

  /**
   * Processar uma notificação individual
   */
  async processNotification(notification) {
    try {
      let result = { success: false };
      
      // Enviar baseado no tipo
      switch (notification.type) {
        case 'reminder':
          result = await emailService.sendScheduleReminder(notification.schedule);
          break;
          
        case 'confirmation_request':
          result = await emailService.sendConfirmationRequest(notification.schedule);
          break;
          
        case 'cancellation':
          result = await emailService.sendCancellationNotice(
            notification.schedule,
            notification.additional_data?.reason
          );
          break;
          
        case 'reschedule':
          if (notification.additional_data?.oldSchedule) {
            result = await emailService.sendRescheduleNotice(
              notification.additional_data.oldSchedule,
              notification.schedule
            );
          }
          break;
          
        default:
          console.warn(`⚠️ Tipo de notificação desconhecido: ${notification.type}`);
      }

      // Atualizar status da notificação
      const newStatus = result.success ? 'sent' : 'failed';
      
      await supabase
        .from('schedule_notifications')
        .update({
          status: newStatus,
          sent_at: result.success ? new Date().toISOString() : null,
          error: result.error || null,
          attempts: (notification.attempts || 0) + 1
        })
        .eq('id', notification.id);

      if (result.success) {
        console.log(`✅ Notificação ${notification.id} enviada com sucesso`);
      } else {
        console.error(`❌ Falha ao enviar notificação ${notification.id}:`, result.error);
        
        // Retentar se não excedeu o limite
        if (notification.attempts < 3) {
          await this.scheduleRetry(notification);
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar notificação ${notification.id}:`, error);
    }
  }

  /**
   * Agendar retry para notificação falhada
   */
  async scheduleRetry(notification) {
    try {
      // Calcular próxima tentativa (exponential backoff)
      const delayMinutes = Math.pow(2, notification.attempts || 1) * 5;
      const nextAttempt = new Date();
      nextAttempt.setMinutes(nextAttempt.getMinutes() + delayMinutes);

      await supabase
        .from('schedule_notifications')
        .update({
          scheduled_for: nextAttempt.toISOString(),
          status: 'pending'
        })
        .eq('id', notification.id);

      console.log(`🔄 Retry agendado para notificação ${notification.id} em ${delayMinutes} minutos`);
    } catch (error) {
      console.error('❌ Erro ao agendar retry:', error);
    }
  }

  /**
   * Criar notificações para um novo agendamento
   */
  async createScheduleNotifications(scheduleId) {
    try {
      // Buscar dados do agendamento
      const { data: schedule, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', scheduleId)
        .single();

      if (error || !schedule) {
        throw new Error('Agendamento não encontrado');
      }

      const notifications = [];
      const scheduleDateTime = new Date(`${schedule.scheduled_date} ${schedule.start_time}`);

      // Lembrete (baseado em reminder_minutes)
      if (schedule.reminder_minutes && schedule.reminder_minutes > 0) {
        const reminderTime = new Date(scheduleDateTime);
        reminderTime.setMinutes(reminderTime.getMinutes() - schedule.reminder_minutes);

        // Só criar se for no futuro
        if (reminderTime > new Date()) {
          notifications.push({
            schedule_id: scheduleId,
            recipient_id: schedule.athlete_id,
            type: 'reminder',
            channel: 'email',
            scheduled_for: reminderTime.toISOString(),
            status: 'pending'
          });
        }
      }

      // Pedido de confirmação (24h antes)
      const confirmTime = new Date(scheduleDateTime);
      confirmTime.setHours(confirmTime.getHours() - 24);
      
      if (confirmTime > new Date()) {
        notifications.push({
          schedule_id: scheduleId,
          recipient_id: schedule.athlete_id,
          type: 'confirmation_request',
          channel: 'email',
          scheduled_for: confirmTime.toISOString(),
          status: 'pending'
        });
      }

      // Inserir notificações
      if (notifications.length > 0) {
        const { error: insertError } = await supabase
          .from('schedule_notifications')
          .insert(notifications);

        if (insertError) {
          console.error('❌ Erro ao criar notificações:', insertError);
          return { success: false, error: insertError };
        }

        console.log(`✅ ${notifications.length} notificação(ões) criada(s) para agendamento ${scheduleId}`);
      }

      return { success: true, count: notifications.length };
    } catch (error) {
      console.error('❌ Erro ao criar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancelar notificações de um agendamento
   */
  async cancelScheduleNotifications(scheduleId) {
    try {
      const { error } = await supabase
        .from('schedule_notifications')
        .update({ status: 'cancelled' })
        .eq('schedule_id', scheduleId)
        .eq('status', 'pending');

      if (error) {
        console.error('❌ Erro ao cancelar notificações:', error);
        return { success: false, error };
      }

      console.log(`✅ Notificações canceladas para agendamento ${scheduleId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao cancelar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obter estatísticas de notificações
   */
  async getStats() {
    try {
      const { data, error } = await supabase
        .from('schedule_notifications')
        .select('status')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Últimas 24h

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        pending: data.filter(n => n.status === 'pending').length,
        sent: data.filter(n => n.status === 'sent').length,
        failed: data.filter(n => n.status === 'failed').length,
        cancelled: data.filter(n => n.status === 'cancelled').length
      };

      return stats;
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return null;
    }
  }
}

// Criar instância singleton
const notificationWorker = new NotificationWorker();

export default notificationWorker;