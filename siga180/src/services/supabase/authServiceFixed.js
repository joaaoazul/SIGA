import { supabase } from './supabaseClient';

class AuthServiceFixed {
  /**
   * Login com múltiplas estratégias de fallback
   */
  async signIn(email, password) {
    console.log('🔐 Tentativa de login para:', email);
    
    try {
      // ESTRATÉGIA 1: Login normal
      console.log('Tentativa 1: Login normal via Supabase Auth');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Se houver erro específico de database, tentar estratégia alternativa
      if (authError && authError.message.includes('Database error')) {
        console.warn('⚠️ Database error detectado, tentando estratégia alternativa');
        return await this.signInAlternative(email, password);
      }

      if (authError) throw authError;

      // Se chegou aqui, o login funcionou
      console.log('✅ Login bem-sucedido');
      
      // Buscar perfil de forma segura
      const profile = await this.getProfileSafe(authData.user.id);

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        profile: profile
      };

    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Última tentativa: estratégia alternativa
      if (error.message && error.message.includes('Database error')) {
        return await this.signInAlternative(email, password);
      }

      return {
        success: false,
        error: error.message || 'Erro ao fazer login'
      };
    }
  }

  /**
   * Estratégia alternativa de login
   * Usa uma abordagem diferente para contornar o erro de database
   */
  async signInAlternative(email, password) {
    console.log('🔄 Usando estratégia alternativa de login');
    
    try {
      // Primeiro, fazer logout de qualquer sessão existente
      await supabase.auth.signOut();
      
      // Pequena pausa para garantir limpeza
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tentar login com opções mínimas
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Garantir formato consistente
        password: password
      });

      if (error) {
        console.error('❌ Estratégia alternativa falhou:', error);
        
        // Se ainda falhar, vamos verificar se o user existe
        const userExists = await this.checkUserExists(email);
        
        if (!userExists) {
          return {
            success: false,
            error: 'Utilizador não encontrado'
          };
        }
        
        return {
          success: false,
          error: 'Password incorreta ou problema de autenticação. Tente fazer reset à password.'
        };
      }

      // Buscar perfil
      const profile = await this.getProfileSafe(data.user.id);

      return {
        success: true,
        user: data.user,
        session: data.session,
        profile: profile
      };

    } catch (error) {
      console.error('❌ Erro crítico:', error);
      return {
        success: false,
        error: 'Erro de sistema. Por favor, contacte o suporte.'
      };
    }
  }

  /**
   * Verificar se o utilizador existe na base de dados
   */
  async checkUserExists(email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();
      
      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Buscar perfil de forma segura (com fallbacks)
   */
  async getProfileSafe(userId) {
    try {
      // Tentar buscar perfil completo
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('⚠️ Erro ao buscar perfil, retornando dados mínimos');
        return {
          id: userId,
          role: 'trainer' // Default seguro
        };
      }

      // Adicionar dados específicos do role se existirem
      if (profile.role === 'trainer') {
        const { data: trainerData } = await supabase
          .from('trainers')
          .select('*')
          .eq('profile_id', userId)
          .single();
        
        profile.trainer = trainerData;
      } else if (profile.role === 'athlete') {
        const { data: athleteData } = await supabase
          .from('athletes')
          .select('*')
          .eq('profile_id', userId)
          .single();
        
        profile.athlete = athleteData;
      }

      return profile;

    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      // Retornar perfil mínimo para não bloquear completamente
      return {
        id: userId,
        role: 'trainer'
      };
    }
  }

  /**
   * Criar conta com verificação extra
   */
  async signUp({ email, password, name, role = 'trainer' }) {
    try {
      // Verificar se email já existe
      const exists = await this.checkUserExists(email);
      if (exists) {
        return {
          success: false,
          error: 'Este email já está registado'
        };
      }

      // Criar conta
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
        message: 'Conta criada! Verifique o email para confirmar.'
      };

    } catch (error) {
      console.error('❌ Erro no registo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Logout seguro
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Aviso no logout:', error);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, considerar logout bem-sucedido
      return { success: true };
    }
  }

  /**
   * Obter sessão atual de forma segura
   */
  async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { 
          success: false, 
          user: null, 
          profile: null 
        };
      }

      const profile = await this.getProfileSafe(session.user.id);

      return {
        success: true,
        user: session.user,
        profile: profile
      };

    } catch (error) {
      console.error('Erro ao obter utilizador atual:', error);
      return { 
        success: false, 
        user: null, 
        profile: null 
      };
    }
  }

  /**
   * Reset de password com validação extra
   */
  async resetPassword(email) {
    try {
      // Verificar se o utilizador existe primeiro
      const exists = await this.checkUserExists(email);
      
      if (!exists) {
        return {
          success: false,
          error: 'Email não encontrado no sistema'
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) throw error;

      return {
        success: true,
        message: 'Email enviado! Verifique a caixa de entrada.'
      };

    } catch (error) {
      console.error('Erro no reset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listener de mudanças com proteção
   */
  onAuthStateChange(callback) {
    try {
      return supabase.auth.onAuthStateChange((event, session) => {
        console.log('📡 Auth event:', event);
        callback(event, session);
      });
    } catch (error) {
      console.error('Erro no listener:', error);
      // Retornar um unsubscribe vazio para não quebrar
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
}

// Exportar instância única
export default new AuthServiceFixed();