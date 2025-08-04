import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // Timeout de segurança - IMPORTANTE!
  const timeoutId = setTimeout(() => {
    if (loading) {
      console.error('⚠️ Loading timeout - forçando false');
      setLoading(false);
    }
  }, 3000); // 3 segundos

  // Check current session
  checkUser();

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      // ... resto do código
    }
  );

  return () => {
    clearTimeout(timeoutId);
    subscription.unsubscribe();
  };
}, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Buscar role do perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        setUser({
          ...user,
          role: profile?.role || 'athlete'
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.user) {
      // Buscar role após login
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      setUser({
        ...data.user,
        role: profile?.role || 'athlete'
      });
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};