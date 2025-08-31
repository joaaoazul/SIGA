// src/services/supabase/inviteService.js

import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

class InviteService {
  
  // Gerar token único
  generateToken() {
    return crypto.randomUUID ? crypto.randomUUID() : 
      'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  // Criar convite
  async sendInvite({ athleteName, athleteEmail, trainerId, trainerName, personalMessage = null }) {
    try {
      console.log('📧 Criando convite para:', athleteEmail);

      // Verificar duplicado
      const { data: existing } = await supabase
        .from('invites')
        .select('*')
        .eq('athlete_email', athleteEmail)
        .eq('trainer_id', trainerId)
        .eq('status', 'pending')
        .single();

      if (existing) {
        const link = `${window.location.origin}/athlete-setup?token=${existing.token}`;
        console.log('♻️ Usando convite existente:', link);
        return { success: true, invite: existing, inviteLink: link };
      }

      // Criar novo
      const newToken = this.generateToken();
      
      const { data: newInvite, error } = await supabase
        .from('invites')
        .insert({
          trainer_id: trainerId,
          athlete_email: athleteEmail,
          athlete_name: athleteName || athleteEmail.split('@')[0],
          token: newToken,
          status: 'pending',
          invite_message: personalMessage,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        .select()
        .single();

      if (error) throw error;

      const inviteLink = `${window.location.origin}/athlete-setup?token=${newInvite.token}`;
      
      console.log('✅ Convite criado:', {
        id: newInvite.id,
        token: newInvite.token,
        link: inviteLink
      });
      
      toast.success('Convite criado!');
      return { success: true, invite: newInvite, inviteLink };

    } catch (error) {
      console.error('❌ Erro:', error);
      toast.error('Erro ao criar convite');
      return { success: false, error: error.message };
    }
  }

  // Validar token
  async validateInviteToken(token) {
    try {
      console.log('🔍 Validando token:', token);

      if (!token) {
        return { valid: false, error: 'Token não fornecido' };
      }

      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .single();

      console.log('📋 Resultado:', { data, error });

      if (error || !data) {
        return { valid: false, error: 'Convite não encontrado' };
      }

      if (data.status !== 'pending') {
        return { valid: false, error: `Convite ${data.status}` };
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, error: 'Convite expirado' };
      }

      return { valid: true, invite: data };

    } catch (err) {
      console.error('❌ Erro:', err);
      return { valid: false, error: 'Erro ao validar' };
    }
  }

  // Aceitar convite
  async acceptInvite(token, athleteId) {
    try {
      const { data: invite, error } = await supabase
        .from('invites')
        .update({
          status: 'accepted',
          accepted_at: new Date(),
          accepted_by: athleteId
        })
        .eq('token', token)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) throw error;

      // Criar relação
      await supabase.from('athletes').insert({
        profile_id: athleteId,
        trainer_id: invite.trainer_id
      });

      return { success: true, invite };
    } catch (error) {
      console.error('Erro:', error);
      return { success: false, error };
    }
  }
}

export default new InviteService();