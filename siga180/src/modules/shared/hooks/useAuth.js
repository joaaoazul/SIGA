// siga180/src/modules/shared/hooks/useAuth.js
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import {
  clearProfileCache,
  resolveUserWithProfile
} from './profileUtils';

const AuthContext = createContext({});
const isDebug = process.env.NODE_ENV !== 'production';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);

  const checkUser = useCallback(async () => {
    try {
      if (isDebug) {
        console.log('🔍 Checking current user...');
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        if (isDebug) {
          console.log('👤 User found:', user.email);
        }

        const userWithRole = await resolveUserWithProfile(user);

        if (isDebug) {
          console.log('✅ User role:', userWithRole?.role);
        }

        setUser(userWithRole);
      } else {
        if (isDebug) {
          console.log('❌ No user found');
        }
        setUser(null);
      }
    } catch (error) {
      if (isDebug) {
        console.error('❌ Error checking user:', error);
      }
      setUser(null);
    } finally {
      if (isDebug) {
        console.log('✅ Check complete, setting loading to false');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (isDebug) {
      console.log('🔐 AuthProvider: Iniciando...');
    }

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      setLoading((prev) => {
        if (!prev) {
          return prev;
        }

        if (isDebug) {
          console.error('⚠️ Loading timeout - forçando false');
        }

        return false;
      });
    }, 5000); // 5 segundos

    // Check current session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isDebug) {
          console.log('🔄 Auth State Changed:', event, session?.user?.email);
        }

        if (event === 'SIGNED_IN' && session) {
          const userWithRole = await resolveUserWithProfile(session.user);

          if (isDebug) {
            console.log('✅ User logged in with role:', userWithRole?.role);
          }

          setUser(userWithRole);
          setLoading(false);

        } else if (event === 'SIGNED_OUT') {
          if (isDebug) {
            console.log('👋 User logged out');
          }
          clearProfileCache(userRef.current?.id);
          setUser(null);
          setLoading(false);

        } else if (event === 'USER_UPDATED' && session) {
          const updatedUser = await resolveUserWithProfile(session.user, { forceRefresh: true });

          if (isDebug) {
            console.log('🔄 User updated:', updatedUser?.role);
          }

          setUser(updatedUser);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [checkUser]);

  const signIn = async (email, password) => {
    if (isDebug) {
      console.log('🔐 Attempting login for:', email);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        if (isDebug) {
          console.error('❌ Login error:', error);
        }
        return { data: null, error };
      }

      if (data.user) {
        if (isDebug) {
          console.log('✅ Login successful:', data.user.email);
        }

        const userWithRole = await resolveUserWithProfile(data.user);

        if (isDebug) {
          console.log('✅ Setting user with role:', userWithRole?.role);
        }

        setUser(userWithRole);
        setLoading(false);

        return { data: { ...data, user: userWithRole }, error: null };
      }

      return { data, error };
    } catch (error) {
      if (isDebug) {
        console.error('❌ SignIn exception:', error);
      }
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (isDebug) {
      console.log('👋 Signing out...');
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        const currentUserId = userRef.current?.id;
        setUser(null);
        if (isDebug) {
          console.log('✅ Signed out successfully');
        }
        clearProfileCache(currentUserId);
      } else {
        if (isDebug) {
          console.error('❌ SignOut error:', error);
        }
      }

      return { error };
    } catch (error) {
      if (isDebug) {
        console.error('❌ SignOut exception:', error);
      }
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