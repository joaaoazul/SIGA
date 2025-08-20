// src/services/emails/emailService.js
import { Resend } from 'resend';
import { supabase } from '../supabase/supabaseClient';

// Inicializar Resend com a API Key
const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

class EmailService {
  constructor() {
    this.from = process.env.REACT_APP_EMAIL_FROM || 'noreply@siga180.pt';
    this.replyTo = process.env.REACT_APP_EMAIL_REPLY_TO || 'support@siga180.pt';
  }

  // ========================================
  // CORE EMAIL FUNCTIONS
  // ========================================

  /**
   * Enviar email genérico
   */
  async sendEmail({ to, subject, html, text, attachments = [], tags = {} }) {
    try {
      const { data, error } = await resend.emails.send({
        from: `180 Performance <${this.from}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || this.htmlToText(html),
        reply_to: this.replyTo,
        attachments,
        tags
      });

      if (error) {
        console.error('❌ Erro Resend:', error);
        await this.logEmailError(to, subject, error);
        return { success: false, error };
      }

      // Log de sucesso
      await this.logEmailSent(to, subject, data.id);
      
      console.log('✅ Email enviado:', data.id);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      await this.logEmailError(to, subject, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar email em batch
   */
  async sendBatchEmails(emails) {
    try {
      const { data, error } = await resend.batch.send(emails.map(email => ({
        from: `180 Performance <${this.from}>`,
        ...email,
        reply_to: this.replyTo
      })));

      if (error) {
        console.error('❌ Erro batch Resend:', error);
        return { success: false, error };
      }

      console.log('✅ Batch enviado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao enviar batch:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // SCHEDULING NOTIFICATIONS
  // ========================================

  /**
   * Enviar lembrete de agendamento
   */
  async sendScheduleReminder(schedule) {
    try {
      // Buscar dados completos
      const { data: scheduleData } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(full_name, email),
          trainer:trainer_id(full_name)
        `)
        .eq('id', schedule.id)
        .single();

      if (!scheduleData || !scheduleData.athlete) {
        throw new Error('Dados do agendamento não encontrados');
      }

      const html = this.generateReminderHTML(scheduleData);
      
      return await this.sendEmail({
        to: scheduleData.athlete.email,
        subject: `🔔 Lembrete: ${scheduleData.title || 'Sessão de Treino'}`,
        html,
        tags: {
          type: 'reminder',
          schedule_id: schedule.id,
          athlete_id: scheduleData.athlete_id
        }
      });
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar pedido de confirmação
   */
  async sendConfirmationRequest(schedule) {
    try {
      const { data: scheduleData } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(full_name, email),
          trainer:trainer_id(full_name)
        `)
        .eq('id', schedule.id)
        .single();

      if (!scheduleData || !scheduleData.athlete) {
        throw new Error('Dados do agendamento não encontrados');
      }

      const confirmLink = `${process.env.REACT_APP_BASE_URL}/confirm-schedule/${schedule.id}`;
      const html = this.generateConfirmationHTML(scheduleData, confirmLink);
      
      return await this.sendEmail({
        to: scheduleData.athlete.email,
        subject: `📅 Confirme a sua presença: ${scheduleData.title}`,
        html,
        tags: {
          type: 'confirmation_request',
          schedule_id: schedule.id
        }
      });
    } catch (error) {
      console.error('Erro ao enviar pedido de confirmação:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar notificação de cancelamento
   */
  async sendCancellationNotice(schedule, reason = '') {
    try {
      const { data: scheduleData } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(full_name, email),
          trainer:trainer_id(full_name, phone)
        `)
        .eq('id', schedule.id)
        .single();

      if (!scheduleData || !scheduleData.athlete) {
        throw new Error('Dados do agendamento não encontrados');
      }

      const html = this.generateCancellationHTML(scheduleData, reason);
      
      return await this.sendEmail({
        to: scheduleData.athlete.email,
        subject: `❌ Sessão Cancelada: ${scheduleData.title}`,
        html,
        tags: {
          type: 'cancellation',
          schedule_id: schedule.id
        }
      });
    } catch (error) {
      console.error('Erro ao enviar cancelamento:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar notificação de reagendamento
   */
  async sendRescheduleNotice(oldSchedule, newSchedule) {
    try {
      const { data: newData } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(full_name, email),
          trainer:trainer_id(full_name)
        `)
        .eq('id', newSchedule.id)
        .single();

      if (!newData || !newData.athlete) {
        throw new Error('Dados do agendamento não encontrados');
      }

      const html = this.generateRescheduleHTML(oldSchedule, newData);
      
      return await this.sendEmail({
        to: newData.athlete.email,
        subject: `🔄 Sessão Reagendada: ${newData.title}`,
        html,
        tags: {
          type: 'reschedule',
          schedule_id: newSchedule.id
        }
      });
    } catch (error) {
      console.error('Erro ao enviar reagendamento:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // ATHLETE INVITES
  // ========================================

  /**
   * Enviar convite para atleta
   */
  async sendAthleteInvite({ athleteEmail, athleteName, trainerName, inviteLink, personalMessage }) {
    try {
      const html = this.generateInviteHTML({
        athleteName,
        trainerName,
        inviteLink,
        personalMessage,
        expiresIn: '7 dias'
      });

      return await this.sendEmail({
        to: athleteEmail,
        subject: `🎯 ${trainerName} convidou-te para o 180 Performance`,
        html,
        tags: {
          type: 'invite',
          trainer_name: trainerName
        }
      });
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // EMAIL TEMPLATES
  // ========================================

  /**
   * Template para lembrete
   */
  generateReminderHTML(schedule) {
    const date = new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const startTime = schedule.start_time?.slice(0, 5);
    const endTime = schedule.end_time?.slice(0, 5);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .info-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🔔 Lembrete de Sessão</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${schedule.athlete?.full_name}</strong>,</p>
      
      <p>Este é um lembrete da sua sessão agendada:</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #374151;">📅 ${schedule.title || 'Sessão de Treino'}</h3>
        <p style="margin: 5px 0;"><strong>Data:</strong> ${date}</p>
        <p style="margin: 5px 0;"><strong>Horário:</strong> ${startTime} - ${endTime}</p>
        <p style="margin: 5px 0;"><strong>Treinador:</strong> ${schedule.trainer?.full_name}</p>
        ${schedule.location ? `<p style="margin: 5px 0;"><strong>Local:</strong> ${schedule.location}</p>` : ''}
        ${schedule.is_online ? `
          <p style="margin: 5px 0;"><strong>Formato:</strong> Online</p>
          ${schedule.meeting_link ? `<p style="margin: 5px 0;"><strong>Link:</strong> <a href="${schedule.meeting_link}">Entrar na sessão</a></p>` : ''}
        ` : ''}
      </div>
      
      ${schedule.notes ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Notas:</strong> ${schedule.notes}</p>
        </div>
      ` : ''}
      
      <p>Não te esqueças de trazer:</p>
      <ul>
        <li>Roupa adequada para treino</li>
        <li>Água para hidratação</li>
        <li>Toalha</li>
        <li>Boa disposição! 💪</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.REACT_APP_BASE_URL}/athlete/schedule" class="button">Ver Agenda Completa</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Se precisares de cancelar ou reagendar, por favor contacta o teu treinador com antecedência.
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 180 Performance - Todos os direitos reservados</p>
      <p style="font-size: 12px;">Este email foi enviado automaticamente. Por favor não responda.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Template para confirmação
   */
  generateConfirmationHTML(schedule, confirmLink) {
    const date = new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .button-group { display: flex; gap: 15px; justify-content: center; margin: 30px 0; }
    .button { padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; }
    .confirm { background: #10b981; color: white; }
    .cancel { background: #ef4444; color: white; }
    .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">📅 Confirmação de Presença</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${schedule.athlete?.full_name}</strong>,</p>
      
      <p>Por favor confirme a sua presença na sessão agendada:</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">${schedule.title || 'Sessão de Treino'}</h3>
        <p><strong>📅 Data:</strong> ${date}</p>
        <p><strong>⏰ Horário:</strong> ${schedule.start_time?.slice(0, 5)} - ${schedule.end_time?.slice(0, 5)}</p>
        <p><strong>👤 Treinador:</strong> ${schedule.trainer?.full_name}</p>
      </div>
      
      <div class="button-group">
        <a href="${confirmLink}?action=confirm" class="button confirm">✅ Confirmar Presença</a>
        <a href="${confirmLink}?action=cancel" class="button cancel">❌ Não Posso Comparecer</a>
      </div>
      
      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Por favor confirme até 4 horas antes da sessão
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Template para cancelamento
   */
  generateCancellationHTML(schedule, reason) {
    const date = new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .alert { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .contact-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">❌ Sessão Cancelada</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${schedule.athlete?.full_name}</strong>,</p>
      
      <div class="alert">
        <p style="margin: 0;"><strong>A sua sessão foi cancelada:</strong></p>
        <p style="margin: 10px 0 0 0;">📅 ${schedule.title} - ${date} às ${schedule.start_time?.slice(0, 5)}</p>
        ${reason ? `<p style="margin: 10px 0 0 0;"><strong>Motivo:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>Pedimos desculpa pelo inconveniente. Por favor contacte o seu treinador para reagendar.</p>
      
      <div class="contact-box">
        <h3 style="margin-top: 0;">Contacto do Treinador</h3>
        <p style="margin: 5px 0;">👤 ${schedule.trainer?.full_name}</p>
        ${schedule.trainer?.phone ? `<p style="margin: 5px 0;">📱 ${schedule.trainer.phone}</p>` : ''}
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="${process.env.REACT_APP_BASE_URL}/athlete/schedule" style="color: #667eea;">Ver outras sessões agendadas →</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Template para reagendamento
   */
  generateRescheduleHTML(oldSchedule, newSchedule) {
    const oldDate = new Date(oldSchedule.scheduled_date).toLocaleDateString('pt-PT');
    const newDate = new Date(newSchedule.scheduled_date).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .change-box { display: flex; gap: 20px; margin: 20px 0; }
    .old { background: #fef2f2; padding: 15px; border-radius: 8px; flex: 1; }
    .new { background: #d1fae5; padding: 15px; border-radius: 8px; flex: 1; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🔄 Sessão Reagendada</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${newSchedule.athlete?.full_name}</strong>,</p>
      
      <p>A sua sessão foi reagendada. Por favor tome nota das novas informações:</p>
      
      <div class="change-box">
        <div class="old">
          <h4 style="margin-top: 0; color: #dc2626;">❌ Data Anterior</h4>
          <p style="margin: 5px 0;">${oldDate}</p>
          <p style="margin: 5px 0;">${oldSchedule.start_time?.slice(0, 5)}</p>
        </div>
        
        <div class="new">
          <h4 style="margin-top: 0; color: #059669;">✅ Nova Data</h4>
          <p style="margin: 5px 0;"><strong>${newDate}</strong></p>
          <p style="margin: 5px 0;"><strong>${newSchedule.start_time?.slice(0, 5)} - ${newSchedule.end_time?.slice(0, 5)}</strong></p>
        </div>
      </div>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📋 Detalhes da Sessão</h3>
        <p style="margin: 5px 0;"><strong>Título:</strong> ${newSchedule.title || 'Sessão de Treino'}</p>
        <p style="margin: 5px 0;"><strong>Treinador:</strong> ${newSchedule.trainer?.full_name}</p>
        ${newSchedule.location ? `<p style="margin: 5px 0;"><strong>Local:</strong> ${newSchedule.location}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.REACT_APP_BASE_URL}/athlete/schedule/${newSchedule.id}" class="button">Ver Detalhes</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        Se esta nova data não for conveniente, por favor contacte o seu treinador.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Template para convite
   */
  generateInviteHTML({ athleteName, trainerName, inviteLink, personalMessage, expiresIn }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .features { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 30px 0; }
    .feature { margin: 15px 0; display: flex; align-items: center; }
    .icon { font-size: 24px; margin-right: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🎯 Bem-vindo ao 180 Performance!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Olá <strong>${athleteName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        O teu personal trainer <strong>${trainerName}</strong> convidou-te para fazer parte do 
        <strong>180 Performance</strong> - a plataforma completa para gestão e acompanhamento do teu treino!
      </p>
      
      ${personalMessage ? `
        <div style="background: #eef2ff; padding: 20px; border-left: 4px solid #667eea; margin: 25px 0;">
          <p style="margin: 0; font-style: italic;">"${personalMessage}"</p>
          <p style="margin: 10px 0 0 0; text-align: right; color: #6b7280;">- ${trainerName}</p>
        </div>
      ` : ''}
      
      <div class="features">
        <h3 style="margin-top: 0;">O que vais ter acesso:</h3>
        
        <div class="feature">
          <span class="icon">📱</span>
          <span>Planos de treino personalizados na palma da mão</span>
        </div>
        
        <div class="feature">
          <span class="icon">📊</span>
          <span>Acompanhamento detalhado do teu progresso</span>
        </div>
        
        <div class="feature">
          <span class="icon">🍎</span>
          <span>Planos nutricionais adaptados aos teus objetivos</span>
        </div>
        
        <div class="feature">
          <span class="icon">💬</span>
          <span>Comunicação direta com o teu treinador</span>
        </div>
        
        <div class="feature">
          <span class="icon">📅</span>
          <span>Agendamento fácil de sessões</span>
        </div>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${inviteLink}" class="button">Aceitar Convite e Começar →</a>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #92400e;">
          ⏰ <strong>Este convite expira em ${expiresIn}</strong>
        </p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Ou copia e cola este link no teu navegador:<br>
        <span style="color: #667eea; word-break: break-all;">${inviteLink}</span>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Converter HTML para texto simples
   */
  htmlToText(html) {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Log de email enviado
   */
  async logEmailSent(to, subject, messageId) {
    try {
      await supabase.from('email_logs').insert({
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        message_id: messageId,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao registar log de email:', error);
    }
  }

  /**
   * Log de erro de email
   */
  async logEmailError(to, subject, error) {
    try {
      await supabase.from('email_logs').insert({
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        status: 'failed',
        error: error.message || error,
        sent_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao registar log de erro:', error);
    }
  }
}

// Criar instância singleton
const emailService = new EmailService();

export default emailService;