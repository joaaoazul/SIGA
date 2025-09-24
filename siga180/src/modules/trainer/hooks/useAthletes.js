
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

// Cache global para garantir consistência entre componentes
const globalCache = {
  athletes: [],
  stats: null,
  lastFetch: null,
  ttl: 30000 // 30 segundos
};

export const useAthletes = (options = {}) => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState(globalCache.athletes || []);
  const [loading, setLoading] = useState(!globalCache.athletes.length);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  
  // Opções configuráveis
  const {
    autoRefresh = true,
    refreshInterval = 60000, // 1 minuto
    realtimeSync = true,
    cacheResults = true
  } = options;

  // Verificar se cache está válido
  const isCacheValid = useCallback(() => {
    if (!globalCache.lastFetch) return false;
    const age = Date.now() - globalCache.lastFetch;
    return age < globalCache.ttl;
  }, []);

  // Buscar atletas com gestão de cache
  const fetchAthletes = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    // Usar cache se válido e não forçar refresh
    if (!forceRefresh && isCacheValid() && cacheResults) {
      setAthletes(globalCache.athletes);
      setLoading(false);
      return globalCache.athletes;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Query otimizada com todos os dados necessários
      const { data: invites, error: invitesError } = await supabase
        .from('invites')
        .select(`
          *,
          athlete:accepted_by (
            id,
            email,
            name,
            phone,
            created_at,
            updated_at
          )
        `)
        .eq('trainer_id', user.id)
        .eq('status', 'accepted');

      if (invitesError) throw invitesError;

      // Buscar dados adicionais (planos, métricas, etc.)
      const athleteIds = invites?.map(i => i.athlete?.id).filter(Boolean) || [];
      
      let nutritionPlans = [];
      let workoutPlans = [];
      let checkIns = [];

      if (athleteIds.length > 0) {
        // Buscar planos nutricionais
        const { data: nutritionData } = await supabase
          .from('nutrition_plans')
          .select('*')
          .in('athlete_id', athleteIds)
          .eq('status', 'active');
        nutritionPlans = nutritionData || [];

        // Buscar planos de treino
        const { data: workoutData } = await supabase
          .from('workout_plans')
          .select('*')
          .in('athlete_id', athleteIds)
          .eq('status', 'active');
        workoutPlans = workoutData || [];

        // Buscar check-ins recentes (últimos 7 dias)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: checkInData } = await supabase
          .from('check_ins')
          .select('*')
          .in('athlete_id', athleteIds)
          .gte('created_at', sevenDaysAgo.toISOString());
        checkIns = checkInData || [];
      }

      // Mapear e enriquecer dados dos atletas
      const athletesList = invites?.map(invite => {
        const athleteId = invite.athlete?.id;
        const nutritionPlan = nutritionPlans.find(p => p.athlete_id === athleteId);
        const workoutPlan = workoutPlans.find(p => p.athlete_id === athleteId);
        const athleteCheckIns = checkIns.filter(c => c.athlete_id === athleteId);
        
        // Calcular compliance
        const compliance = calculateCompliance(athleteCheckIns, nutritionPlan);
        
        // Determinar status
        const status = determineStatus(
          invite.athlete,
          nutritionPlan,
          workoutPlan,
          athleteCheckIns,
          compliance
        );

        return {
          id: athleteId || invite.id,
          inviteId: invite.id,
          name: invite.athlete?.name || invite.athlete_name,
          email: invite.athlete?.email || invite.athlete_email,
          phone: invite.athlete?.phone || '',
          status,
          compliance,
          joinedAt: invite.accepted_at,
          lastActivity: athleteCheckIns[0]?.created_at || invite.athlete?.updated_at,
          hasNutritionPlan: !!nutritionPlan,
          hasWorkoutPlan: !!workoutPlan,
          nutritionPlan,
          workoutPlan,
          recentCheckIns: athleteCheckIns.length,
          needsAttention: compliance < 60 || athleteCheckIns.length === 0
        };
      }) || [];

      // Atualizar cache global
      if (cacheResults) {
        globalCache.athletes = athletesList;
        globalCache.lastFetch = Date.now();
        globalCache.stats = calculateStats(athletesList);
      }

      setAthletes(athletesList);
      setIsStale(false);

      return athletesList;

    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
      setError(error.message);
      toast.error('Erro ao carregar atletas');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, isCacheValid, cacheResults]);

  // Calcular compliance do atleta
  const calculateCompliance = (checkIns, nutritionPlan) => {
    if (!nutritionPlan) return 100;
    
    const expectedCheckIns = 7;
    const actualCheckIns = checkIns.length;
    const checkInScore = (actualCheckIns / expectedCheckIns) * 100;
    
    // Se tiver compliance no plano, fazer média
    if (nutritionPlan.compliance_percentage !== undefined) {
      return Math.round((checkInScore + nutritionPlan.compliance_percentage) / 2);
    }
    
    return Math.round(checkInScore);
  };

  // Determinar status do atleta
  const determineStatus = (athlete, nutritionPlan, workoutPlan, checkIns, compliance) => {
    // Sem planos = inativo
    if (!nutritionPlan && !workoutPlan) return 'inactive';
    
    // Compliance baixa = em risco
    if (compliance < 50) return 'at_risk';
    
    // Sem check-ins recentes = precisa acompanhamento
    if (checkIns.length === 0) return 'needs_followup';
    
    const lastCheckIn = checkIns[0];
    const daysSinceCheckIn = (Date.now() - new Date(lastCheckIn.created_at)) / (1000 * 60 * 60 * 24);
    if (daysSinceCheckIn > 3) return 'needs_followup';
    
    return 'active';
  };

  // Calcular estatísticas
  const calculateStats = (athletesList) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      total: athletesList.length,
      active: athletesList.filter(a => a.status === 'active').length,
      inactive: athletesList.filter(a => a.status === 'inactive').length,
      atRisk: athletesList.filter(a => a.status === 'at_risk').length,
      needsFollowup: athletesList.filter(a => a.status === 'needs_followup').length,
      withNutritionPlan: athletesList.filter(a => a.hasNutritionPlan).length,
      withWorkoutPlan: athletesList.filter(a => a.hasWorkoutPlan).length,
      needingAttention: athletesList.filter(a => a.needsAttention).length,
      newThisMonth: athletesList.filter(a => 
        new Date(a.joinedAt) >= startOfMonth
      ).length,
      avgCompliance: 0,
      checkInsToday: 0
    };

    // Calcular compliance média
    const athletesWithCompliance = athletesList.filter(a => a.compliance !== null);
    if (athletesWithCompliance.length > 0) {
      const totalCompliance = athletesWithCompliance.reduce((sum, a) => sum + a.compliance, 0);
      stats.avgCompliance = Math.round(totalCompliance / athletesWithCompliance.length);
    }

    // Contar check-ins de hoje
    const today = new Date().toDateString();
    athletesList.forEach(athlete => {
      if (athlete.lastActivity && new Date(athlete.lastActivity).toDateString() === today) {
        stats.checkInsToday++;
      }
    });

    return stats;
  };

  // Setup realtime sync
  useEffect(() => {
    if (!user || !realtimeSync) return;

    const subscriptions = [];

    // Subscrever mudanças em invites
    const invitesChannel = supabase
      .channel('invites-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invites',
          filter: `trainer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Invites update:', payload);
          setIsStale(true);
          fetchAthletes(true);
        }
      )
      .subscribe();

    subscriptions.push(invitesChannel);

    // Subscrever mudanças em nutrition_plans
    const nutritionChannel = supabase
      .channel('nutrition-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nutrition_plans'
        },
        (payload) => {
          console.log('Nutrition plan update:', payload);
          setIsStale(true);
          fetchAthletes(true);
        }
      )
      .subscribe();

    subscriptions.push(nutritionChannel);

    // Subscrever mudanças em check_ins
    const checkInsChannel = supabase
      .channel('checkins-sync')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'check_ins'
        },
        (payload) => {
          console.log('New check-in:', payload);
          setIsStale(true);
          fetchAthletes(true);
        }
      )
      .subscribe();

    subscriptions.push(checkInsChannel);

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [user, realtimeSync, fetchAthletes]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAthletes(false); // Usar cache se disponível
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAthletes]);

  // Fetch inicial
  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Métodos públicos
  const refreshData = useCallback(() => {
    return fetchAthletes(true);
  }, [fetchAthletes]);

  const getAthleteById = useCallback((id) => {
    return athletes.find(a => a.id === parseInt(id));
  }, [athletes]);

  const searchAthletes = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return athletes.filter(athlete => 
      athlete.name?.toLowerCase().includes(lowercaseQuery) ||
      athlete.email?.toLowerCase().includes(lowercaseQuery)
    );
  }, [athletes]);

  const filterAthletes = useCallback((criteria) => {
    return athletes.filter(athlete => {
      if (criteria.status && athlete.status !== criteria.status) return false;
      if (criteria.hasNutritionPlan !== undefined && athlete.hasNutritionPlan !== criteria.hasNutritionPlan) return false;
      if (criteria.hasWorkoutPlan !== undefined && athlete.hasWorkoutPlan !== criteria.hasWorkoutPlan) return false;
      if (criteria.needsAttention !== undefined && athlete.needsAttention !== criteria.needsAttention) return false;
      if (criteria.minCompliance !== undefined && athlete.compliance < criteria.minCompliance) return false;
      return true;
    });
  }, [athletes]);

  // Adicionar novo atleta (criar convite)
  const addAthlete = async (athleteData) => {
    try {
      // Implementar com inviteService
      console.log('Adicionar atleta:', athleteData);
      await fetchAthletes(true);
      toast.success('Atleta adicionado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar atleta:', error);
      toast.error('Erro ao adicionar atleta');
      return { success: false, error };
    }
  };

  // Calcular stats usando useMemo para otimização
  const stats = useMemo(() => {
    if (globalCache.stats && isCacheValid()) {
      return globalCache.stats;
    }
    return calculateStats(athletes);
  }, [athletes, isCacheValid]);

  // Atletas que precisam de atenção
  const athletesNeedingAttention = useMemo(() => {
    return athletes
      .filter(a => a.needsAttention)
      .sort((a, b) => a.compliance - b.compliance);
  }, [athletes]);

  return {
    // Estado
    athletes,
    loading,
    error,
    stats,
    isStale,
    
    // Atletas filtrados
    athletesNeedingAttention,
    activeAthletes: athletes.filter(a => a.status === 'active'),
    inactiveAthletes: athletes.filter(a => a.status === 'inactive'),
    
    // Métodos
    refreshData,
    addAthlete,
    getAthleteById,
    searchAthletes,
    filterAthletes,
    
    // Utilidades
    isCacheValid: isCacheValid(),
    lastSync: globalCache.lastFetch ? new Date(globalCache.lastFetch) : null
  };
};

// Hook para um atleta específico
export const useAthlete = (athleteId) => {
  const { athletes, getAthleteById, loading } = useAthletes();
  const [athlete, setAthlete] = useState(null);

  useEffect(() => {
    if (!loading) {
      const foundAthlete = getAthleteById(athleteId);
      setAthlete(foundAthlete);
    }
  }, [athleteId, athletes, getAthleteById, loading]);

  return {
    athlete,
    loading
  };
};

// Hook para métricas do dashboard
export const useDashboardMetrics = () => {
  const { stats, athletesNeedingAttention, athletes, lastSync } = useAthletes({
    autoRefresh: true,
    refreshInterval: 30000 // 30 segundos para dashboard
  });

  // Processar métricas específicas do dashboard
  const dashboardData = useMemo(() => {
    const today = new Date().toDateString();
    const checkInsToday = athletes.filter(a => 
      a.lastActivity && new Date(a.lastActivity).toDateString() === today
    );

    return {
      quickStats: {
        activeAthletes: stats.active,
        totalAthletes: stats.total,
        checkInsToday: checkInsToday.length,
        avgCompliance: stats.avgCompliance,
        needingAttention: athletesNeedingAttention.length
      },
      trends: {
        newThisMonth: stats.newThisMonth,
        atRisk: stats.atRisk,
        improved: athletes.filter(a => a.compliance > 80).length
      },
      alerts: athletesNeedingAttention.slice(0, 5), // Top 5 que precisam atenção
      lastSync
    };
  }, [stats, athletesNeedingAttention, athletes, lastSync]);

  return dashboardData;
};