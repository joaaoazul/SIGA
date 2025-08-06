import { supabase } from './supabaseClient';

class AuthService {
  /**
   * Login de utilizador
   * Autentica o utilizador e carrega o perfil completo
   */
  async signIn(email, password) {
    try {
      // Passo 1: Autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Passo 2: Buscar o perfil completo do utilizador
      // Isto inclui informação de profiles, trainers ou athletes conforme o role
      const profile = await this.getFullProfile(authData.user.id);

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        profile: profile
      };
    } catch (error) {
      console.error('SignIn Error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao fazer login'
      };
    }
  }

  /**
   * Registo de novo utilizador (principalmente para trainers)
   * Cria conta e perfil automaticamente via trigger
   */
  async signUp({ email, password, name, role = 'trainer' }) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      });

      if (authError) throw authError;

      return {
        success: true,
        user: authData.user,
        message: 'Conta criada com sucesso! Verifique o seu email para confirmar.'
      };
    } catch (error) {
      console.error('SignUp Error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar conta'
      };
    }
  }

  /**
   * Logout do utilizador
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('SignOut Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar perfil completo do utilizador
   * Inclui dados específicos de trainer ou athlete
   */
  async getFullProfile(userId) {
    try {
      // Buscar perfil base
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Buscar dados específicos baseado no role
      if (profile.role === 'trainer') {
        const { data: trainerData } = await supabase
          .from('trainers')
          .select('*')
          .eq('profile_id', userId)
          .single();
        
        return { ...profile, trainer: trainerData };
      } else if (profile.role === 'athlete') {
        const { data: athleteData } = await supabase
          .from('athletes')
          .select('*, trainer:trainers(*)')
          .eq('profile_id', userId)
          .single();
        
        return { ...profile, athlete: athleteData };
      }

      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Obter utilizador atual
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { success: false, user: null, profile: null };
      }

      const profile = await this.getFullProfile(user.id);

      return {
        success: true,
        user: user,
        profile: profile
      };
    } catch (error) {
      console.error('GetCurrentUser Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Recuperar password
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Email de recuperação enviado! Verifique a sua caixa de entrada.'
      };
    } catch (error) {
      console.error('ResetPassword Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualizar password (após reset)
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password atualizada com sucesso!'
      };
    } catch (error) {
      console.error('UpdatePassword Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualizar perfil do utilizador
   */
  async updateProfile(updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilizador não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        profile: data
      };
    } catch (error) {
      console.error('UpdateProfile Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listener para mudanças de autenticação
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Exportar instância única do serviço
export default new AuthService();