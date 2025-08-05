// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './services/supabase/supabaseClient';
import { Toaster } from 'react-hot-toast';
import { PublicRoutes } from './routes/PublicRoutes';
import { TrainerRoutes } from './routes/trainerRoutes';
import { AthleteRoutes } from './routes/AthleteRoutes';

// Context para Auth
const AuthContext = React.createContext({});

export const useAuth = () => React.useContext(AuthContext);

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  };

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const authValue = {
    user,
    profile,
    loading,
    isTrainer: profile?.role === 'trainer',
    isAthlete: profile?.role === 'athlete',
    refreshProfile: () => user && loadProfile(user.id)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Toaster position="top-right" />
        {!user ? (
          <PublicRoutes />
        ) : profile?.role === 'trainer' ? (
          <TrainerRoutes />
        ) : profile?.role === 'athlete' ? (
          <AthleteRoutes />
        ) : (
          <PublicRoutes />
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;