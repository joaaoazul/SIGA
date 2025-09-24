// src/hooks/useDashboard.js
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import useStore from '../../../store/useStore';
import { useAuth } from '../../shared/hooks/useAuth';

export const useDashboard = () => {
  const { user } = useAuth();
  
  // Selecionar apenas o que precisamos do store (evita re-renders)
  const {
    // State
    athletes,
    athletesLoading,
    workoutTemplates,
    workoutSessions,
    workoutsLoading,
    invites,
    invitesLoading,
    dashboardStats,
    
    // Actions
    refreshDashboard,
    subscribeToChanges,
    unsubscribeAll
  } = useStore(
    (state) => ({
      athletes: state.athletes,
      athletesLoading: state.athletesLoading,
      workoutTemplates: state.workoutTemplates,
      workoutSessions: state.workoutSessions,
      workoutsLoading: state.workoutsLoading,
      invites: state.invites,
      invitesLoading: state.invitesLoading,
      dashboardStats: state.dashboardStats,
      refreshDashboard: state.refreshDashboard,
      subscribeToChanges: state.subscribeToChanges,
      unsubscribeAll: state.unsubscribeAll
    }),
    shallow
  );
  
  // Setup inicial e subscriptions
  useEffect(() => {
    if (user?.id) {
      // Carregar dados iniciais
      refreshDashboard(user.id);
      
      // Setup real-time subscriptions
      subscribeToChanges(user.id);
      
      // Cleanup ao desmontar
      return () => {
        unsubscribeAll();
      };
    }
  }, [user?.id]);
  
  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    if (user?.id) {
      const interval = setInterval(() => {
        refreshDashboard(user.id);
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id]);
  
  const isLoading = athletesLoading || workoutsLoading || invitesLoading;
  
  return {
    // Dados agregados
    stats: {
      ...dashboardStats,
      recentActivity: getRecentActivity(athletes, workoutSessions, invites),
      weeklyProgress: calculateWeeklyProgress(workoutSessions),
      topPerformers: getTopPerformers(athletes, workoutSessions)
    },
    
    // Dados raw
    athletes,
    workoutTemplates,
    workoutSessions,
    invites,
    
    // Estado
    isLoading,
    
    // Actions
    refresh: () => refreshDashboard(user?.id)
  };
};

// ========== HELPER FUNCTIONS ==========

const getRecentActivity = (athletes, sessions, invites) => {
  const activities = [];
  
  // Sessões recentes
  sessions.slice(0, 3).forEach(session => {
    activities.push({
      id: session.id,
      type: 'workout',
      title: `${session.athlete?.name} - ${session.template?.name}`,
      time: session.scheduled_date,
      status: session.status,
      icon: 'dumbbell'
    });
  });
  
  // Convites recentes
  invites.slice(0, 2).forEach(invite => {
    activities.push({
      id: invite.id,
      type: 'invite',
      title: `Convite enviado para ${invite.athlete_email}`,
      time: invite.created_at,
      status: 'pending',
      icon: 'mail'
    });
  });
  
  // Ordenar por data
  return activities.sort((a, b) => 
    new Date(b.time) - new Date(a.time)
  ).slice(0, 5);
};

const calculateWeeklyProgress = (sessions) => {
  const thisWeek = sessions.filter(s => {
    const sessionDate = new Date(s.scheduled_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  
  const completed = thisWeek.filter(s => s.status === 'completed').length;
  const total = thisWeek.length;
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

const getTopPerformers = (athletes, sessions) => {
  const athleteStats = {};
  
  // Calcular estatísticas por atleta
  sessions.forEach(session => {
    if (!session.athlete_id) return;
    
    if (!athleteStats[session.athlete_id]) {
      athleteStats[session.athlete_id] = {
        total: 0,
        completed: 0
      };
    }
    
    athleteStats[session.athlete_id].total++;
    if (session.status === 'completed') {
      athleteStats[session.athlete_id].completed++;
    }
  });
  
  // Criar ranking
  return athletes
    .map(athlete => ({
      ...athlete,
      stats: athleteStats[athlete.id] || { total: 0, completed: 0 },
      completionRate: athleteStats[athlete.id]
        ? Math.round((athleteStats[athlete.id].completed / athleteStats[athlete.id].total) * 100)
        : 0
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);
};

export default useDashboard;