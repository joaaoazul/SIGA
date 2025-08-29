// siga180/src/modules/shared/hooks/useAuth.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Iniciando...');
    
    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('⚠️ Loading timeout - forçando false');
        setLoading(false);
      }
    }, 5000); // 5 segundos

    // Check current session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth State Changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          // Buscar role do perfil quando fizer login - QUERY MAIS ROBUSTA
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);
          
          const profile = profiles?.[0];
          console.log('📊 Profile data on SIGNED_IN:', profile);
          
          // Fallback para trainer se for o teu email
          let finalRole = profile?.role;
          if (!finalRole && session.user.email === 'joaoazul74@gmail.com') {
            finalRole = 'trainer';
          }
          
          const userWithRole = {
            ...session.user,
            role: finalRole || 'athlete',
            name: profile?.name || session.user.email
          };
          
          console.log('✅ User logged in with role:', userWithRole.role);
          setUser(userWithRole);
          setLoading(false);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User logged out');
          setUser(null);
          setLoading(false);
          
        } else if (event === 'USER_UPDATED' && session) {
          // Atualizar dados do user
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);
          
          const profile = profiles?.[0];
          
          let finalRole = profile?.role;
          if (!finalRole && session.user.email === 'joaoazul74@gmail.com') {
            finalRole = 'trainer';
          }
          
          const updatedUser = {
            ...session.user,
            role: finalRole || 'athlete',
            name: profile?.name || session.user.email
          };
          
          console.log('🔄 User updated:', updatedUser.role);
          setUser(updatedUser);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []); // Array vazio - só executa uma vez

  const checkUser = async () => {
    try {
      console.log('🔍 Checking current user...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('👤 User found:', user.email);
        
        // Query mais robusta sem .single() para evitar erros
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        
        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
        }
        
        const profile = profiles?.[0];
        console.log('📊 Profile fetched:', profile);
        console.log('📊 Profile role:', profile?.role);
        
        // Fallback específico para ti
        let finalRole = profile?.role;
        if (!finalRole && user.email === 'joaoazul74@gmail.com') {
          console.log('⚠️ Using trainer fallback for joaoazul74@gmail.com');
          finalRole = 'trainer';
        }
        
        const userWithRole = {
          ...user,
          role: finalRole || 'athlete',
          name: profile?.name || user.email
        };
        
        console.log('✅ User role:', userWithRole.role);
        setUser(userWithRole);
      } else {
        console.log('❌ No user found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error checking user:', error);
      setUser(null);
    } finally {
      console.log('✅ Check complete, setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    console.log('🔐 Attempting login for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      
      if (error) {
        console.error('❌ Login error:', error);
        return { data: null, error };
      }
      
      if (data.user) {
        console.log('✅ Login successful:', data.user.email);
        
        // Buscar role após login - query mais robusta
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error('⚠️ Profile fetch error:', profileError);
        }
        
        const profile = profiles?.[0];
        console.log('📊 Profile on signIn:', profile);
        
        // Fallback para trainer
        let finalRole = profile?.role;
        if (!finalRole && data.user.email === 'joaoazul74@gmail.com') {
          finalRole = 'trainer';
        }
        
        const userWithRole = {
          ...data.user,
          role: finalRole || 'athlete',
          name: profile?.name || data.user.email
        };
        
        console.log('✅ Setting user with role:', userWithRole.role);
        setUser(userWithRole);
        setLoading(false);
        
        return { data: { ...data, user: userWithRole }, error: null };
      }
      
      return { data, error };
    } catch (error) {
      console.error('❌ SignIn exception:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        console.log('✅ Signed out successfully');
      } else {
        console.error('❌ SignOut error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('❌ SignOut exception:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    checkUser // Expor para poder forçar recheck se necessário
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