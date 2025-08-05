// src/services/supabase/invite.service.js
import { supabase } from './supabaseClient';

class InviteService {
  /**
   * Criar convite para novo atleta
   * Este método é chamado pelo trainer quando envia um convite
   */
  async createAthleteInvite(inviteData) {
    try {
      // Obter o ID do trainer atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      // Gerar token único e seguro
      const token = this.generateSecureToken();
      
      // Criar registo do convite no Supabase
      const { data, error } = await supabase
        .from('athlete_invites')
        .insert({
          trainer_id: user.id,
          athlete_name: inviteData.name,
          athlete_email: inviteData.email,
          token: token
        })
        .select()
        .single();

      if (error) throw error;

      // Gerar o link completo
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/auth/callback?token=${token}`;

      // Aqui você integraria com um serviço de email
      // Por agora, vamos simular
      await this.sendInviteEmail({
        to: inviteData.email,
        athleteName: inviteData.name,
        inviteLink: inviteLink,
        trainerName: user.user_metadata?.name || 'Seu trainer'
      });

      return {
        success: true,
        data: {
          ...data,
          inviteLink
        }
      };
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validar token de convite
   * Usado quando o atleta clica no link
   */
  async validateInviteToken(token) {
    try {
      // Usar a função SQL que criámos
      const { data, error } = await supabase
        .rpc('validate_athlete_invite', { p_token: token });

      if (error) throw error;

      return data; // Retorna { valid: boolean, invite?: {...}, error?: string }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return {
        valid: false,
        error: 'Erro ao validar convite'
      };
    }
  }

  /**
   * Aceitar convite após criar conta
   * Chamado após o atleta completar o setup
   */
  async acceptInvite(token, athleteId) {
    try {
      const { data, error } = await supabase
        .rpc('accept_athlete_invite', {
          p_token: token,
          p_athlete_id: athleteId
        });

      if (error) throw error;

      // Criar relação trainer-atleta
      const inviteData = await this.validateInviteToken(token);
      if (inviteData.valid && inviteData.invite) {
        await supabase
          .from('trainer_athlete_relationships')
          .insert({
            trainer_id: inviteData.invite.trainer_id,
            athlete_id: athleteId,
            status: 'active'
          });
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gerar token seguro
   * Cria um token único e difícil de adivinhar
   */
  generateSecureToken() {
    // Combinar timestamp, random e codificar
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    const randomStr2 = Math.random().toString(36).substring(2, 15);
    
    return `${timestamp}-${randomStr}-${randomStr2}`;
  }

  /**
   * Simular envio de email
   * Em produção, isto seria substituído por um serviço real
   */
  async sendInviteEmail({ to, athleteName, inviteLink, trainerName }) {
    console.log('📧 Enviando email de convite:');
    console.log(`Para: ${to}`);
    console.log(`Nome: ${athleteName}`);
    console.log(`Link: ${inviteLink}`);
    console.log(`Trainer: ${trainerName}`);

    // Em produção, usar SendGrid, Resend, ou outro serviço
    // Por exemplo:
    // await resend.sendEmail({
    //   to,
    //   subject: `${trainerName} convidou você para o SIGA180`,
    //   html: `...`
    // });

    return true;
  }

  /**
   * Obter convites pendentes do trainer
   */
  async getTrainerInvites(trainerId) {
    try {
      const { data, error } = await supabase
        .from('athlete_invites')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      return [];
    }
  }

  /**
   * Cancelar convite
   */
  async cancelInvite(inviteId) {
    try {
      const { error } = await supabase
        .from('athlete_invites')
        .update({ status: 'expired' })
        .eq('id', inviteId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new InviteService();