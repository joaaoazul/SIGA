// siga180/src/services/supabase/inviteService.js

import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

class InviteService {
  /**
   * Criar e enviar convite para atleta
   */
  async sendInvite({ athleteName, athleteEmail, trainerId, trainerName, personalMessage = null }) {
    try {
      console.log('📧 Criando convite para:', athleteEmail);

      // 1. Verificar se já existe convite pendente
      const { data: existingInvite } = await supabase
        .from('invites')
        .select('*')
        .eq('athlete_email', athleteEmail)
        .eq('trainer_id', trainerId)
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        console.log('ℹ️ Convite já existe, reenviando...');
        
        // Gerar link do convite existente
        const inviteLink = `${window.location.origin}/athlete-setup?token=${existingInvite.token}`;
        
        toast.info('Este atleta já tem um convite pendente. Link regenerado.');
        
        return { 
          success: true, 
          invite: existingInvite, 
          inviteLink,
          resent: true 
        };
      }

      // 2. Gerar token único
      const token = this.generateSecureToken();
      
      // 3. Criar invite na base de dados
      const { data: newInvite, error: inviteError } = await supabase
        .from('invites')
        .insert({
          trainer_id: trainerId,
          athlete_email: athleteEmail,
          athlete_name: athleteName,
          token: token,
          status: 'pending',
          invite_message: personalMessage,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
        })
        .select()
        .single();

      if (inviteError) {
        console.error('❌ Erro ao criar convite:', inviteError);
        throw inviteError;
      }

      // 4. Gerar link do convite
      const inviteLink = `${window.location.origin}/athlete-setup?token=${token}`;

      // 5. Log do email (em desenvolvimento)
      console.log('📨 Email seria enviado:');
      console.log('Para:', athleteEmail);
      console.log('De:', trainerName);
      console.log('Link:', inviteLink);
      console.log('Mensagem:', personalMessage || 'Sem mensagem personalizada');
      
      // TODO: Implementar envio real de email com SendGrid/Resend
      // Por agora, apenas mostrar o link para copiar

      toast.success('Convite criado com sucesso!');
      
      return { 
        success: true, 
        invite: newInvite, 
        inviteLink 
      };

    } catch (error) {
      console.error('❌ Erro ao enviar convite:', error);
      
      let errorMessage = 'Erro ao enviar convite. ';
      
      if (error.code === '23505') {
        errorMessage = 'Este email já tem um convite. Verifique a lista de convites.';
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  /**
   * Validar token do convite
   */
  async validateInviteToken(token) {
    try {
      console.log('🔍 Validando token:', token);

      if (!token) {
        return { 
          valid: false, 
          error: 'Token não fornecido' 
        };
      }

      // Buscar convite pelo token
      const { data: invite, error } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !invite) {
        console.error('❌ Token não encontrado:', error);
        return { 
          valid: false, 
          error: 'Convite inválido ou não encontrado' 
        };
      }

      // Verificar status
      if (invite.status === 'accepted') {
        return { 
          valid: false, 
          error: 'Este convite já foi aceite' 
        };
      }

      if (invite.status === 'cancelled') {
        return { 
          valid: false, 
          error: 'Este convite foi cancelado' 
        };
      }

      // Verificar expiração
      if (new Date(invite.expires_at) < new Date()) {
        // Atualizar status para expirado
        await supabase
          .from('invites')
          .update({ status: 'expired' })
          .eq('id', invite.id);

        return { 
          valid: false, 
          error: 'Este convite expirou. Solicite um novo ao seu trainer.' 
        };
      }

      console.log('✅ Token válido!');
      
      // Retornar dados do convite válido
      return { 
        valid: true, 
        invite: invite
      };

    } catch (error) {
      console.error('❌ Erro ao validar convite:', error);
      return { 
        valid: false, 
        error: 'Erro ao validar convite' 
      };
    }
  }

  /**
   * Aceitar convite
   */
  async acceptInvite(token, userId) {
    try {
      console.log('✅ Aceitando convite...');

      // Buscar o convite
      const { data: invite, error: findError } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .single();

      if (findError || !invite) {
        throw new Error('Convite não encontrado');
      }

      // Atualizar status do convite
      const { error: updateError } = await supabase
        .from('invites')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: userId
        })
        .eq('id', invite.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar convite:', updateError);
        throw updateError;
      }

      console.log('✅ Convite aceite com sucesso!');
      
      return { 
        success: true,
        trainerId: invite.trainer_id 
      };

    } catch (error) {
      console.error('❌ Erro ao aceitar convite:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Buscar convites do trainer
   */
  async getTrainerInvites(trainerId, status = null) {
    try {
      let query = supabase
        .from('invites')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, invites: data || [] };

    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      return { success: false, error, invites: [] };
    }
  }

  /**
   * Cancelar convite
   */
  async cancelInvite(inviteId) {
    try {
      const { error } = await supabase
        .from('invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Convite cancelado');
      return { success: true };

    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      toast.error('Erro ao cancelar convite');
      return { success: false, error };
    }
  }

  /**
   * Helper - Gerar token seguro
   */
  generateSecureToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token + '-' + Date.now();
  }

  /**
   * Helper - Calcular tempo restante
   */
  calculateTimeRemaining(expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'expirado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`;
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
}

export default new InviteService();