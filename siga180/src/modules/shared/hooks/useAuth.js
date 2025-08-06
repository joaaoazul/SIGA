import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../../../services/supabase/authService';

// Criar contexto de autenticação
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão ao carregar
    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // Utilizador fez login
          await checkUser();
        } else if (event === 'SIGNED_OUT') {
          // Utilizador fez logout
          setUser(null);
          setProfile(null);
        } else if (event === 'USER_UPDATED') {
          // Dados do utilizador foram atualizados
          await checkUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Verificar utilizador atual e carregar perfil
  const checkUser = async () => {
    try {
      const result = await authService.getCurrentUser();
      
      if (result.success && result.user) {
        setUser(result.user);
        setProfile(result.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const signIn = async (email, password) => {
    try {
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        setUser(result.user);
        setProfile(result.profile);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de registo
  const signUp = async (userData) => {
    try {
      const result = await authService.signUp(userData);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      const result = await authService.signOut();
      
      if (result.success) {
        setUser(null);
        setProfile(null);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função para recuperar password
  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  // Função para atualizar password
  const updatePassword = async (newPassword) => {
    return await authService.updatePassword(newPassword);
  };

  // Função para atualizar perfil
  const updateProfile = async (updates) => {
    const result = await authService.updateProfile(updates);
    
    if (result.success) {
      setProfile(result.profile);
    }
    
    return result;
  };

  // Valores e funções disponíveis no contexto
  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    
    // Helpers úteis
    isAuthenticated: !!user,
    isTrainer: profile?.role === 'trainer',
    isAthlete: profile?.role === 'athlete',
    isAdmin: profile?.role === 'admin',
    
    // IDs úteis
    trainerId: profile?.trainer?.id || null,
    athleteId: profile?.athlete?.id || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};