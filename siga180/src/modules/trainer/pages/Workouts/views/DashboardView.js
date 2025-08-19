// src/modules/trainer/pages/Workouts/views/DashboardView.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Plus,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Activity,
  ChevronRight,
  Target,
  Send,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import workoutService from '../services/workoutService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const DashboardView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTemplates: 0,
    activeAthletes: 0,
    sessionsThisWeek: 0,
    avgCompletion: 0,
    trending: {
      templates: 0,
      athletes: 0,
      sessions: 0,
      completion: 0
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Subscrever a mudanças em tempo real
    const subscription = subscribeToRealtimeUpdates();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar user atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Carregar dados em paralelo
      const [templates, sessions, athletes, analytics] = await Promise.all([
        loadTemplates(user.id),
        loadSessions(user.id),
        loadAthletes(user.id),
        loadAnalytics(user.id)
      ]);

      // Calcular estatísticas
      calculateStats(templates, sessions, athletes, analytics);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async (trainerId) => {
    const { data } = await workoutService.getTemplates(trainerId);
    return data || [];
  };

  const loadSessions = async (trainerId) => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() + 6));
    
    const { data } = await workoutService.getWorkoutSessions({
      dateFrom: weekStart.toISOString().split('T')[0],
      dateTo: weekEnd.toISOString().split('T')[0]
    });
    
    if (data) {
      // Separar atividade recente e próximas sessões
      const now = new Date();
      const recent = data
        .filter(s => s.status === 'completed' || s.status === 'in_progress')
        .slice(0, 5)
        .map(s => ({
          id: s.id,
          type: s.status === 'completed' ? 'completed' : 'started',
          athlete: s.athlete?.name || 'Atleta',
          workout: s.workout_template?.name || 'Treino',
          time: formatTimeAgo(new Date(s.completed_at || s.started_at)),
          completion: s.status === 'completed' ? 100 : 50,
          duration: s.workout_template?.estimated_duration_minutes || 60
        }));
      
      const upcoming = data
        .filter(s => s.status === 'scheduled' && new Date(s.scheduled_date) >= now)
        .slice(0, 5)
        .map(s => ({
          id: s.id,
          athlete: s.athlete?.name || 'Atleta',
          athleteId: s.athlete_id,
          workout: s.workout_template?.name || 'Treino',
          time: new Date(s.scheduled_date).toLocaleTimeString('pt-PT', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          date: new Date(s.scheduled_date),
          status: 'scheduled'
        }));
      
      setRecentActivity(recent);
      setUpcomingSessions(upcoming);
    }
    
    return data || [];
  };

  const loadAthletes = async (trainerId) => {
    const { data } = await supabase
      .from('athletes')
      .select(`
        *,
        profile:profiles!athletes_profile_id_fkey (
          name,
          email,
          avatar_url
        ),
        workout_sessions (
          id,
          status,
          completed_at
        )
      `)
      .eq('trainer_id', trainerId);
    
    if (data) {
      // Calcular top performers
      const performers = data
        .map(athlete => {
          const sessions = athlete.workout_sessions || [];
          const completed = sessions.filter(s => s.status === 'completed').length;
          const total = sessions.length;
          const lastWorkout = sessions
            .filter(s => s.completed_at)
            .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];
          
          return {
            id: athlete.id,
            name: athlete.profile?.name || 'Atleta',
            avatar: athlete.profile?.avatar_url,
            streak: calculateStreak(sessions),
            completion: total > 0 ? Math.round((completed / total) * 100) : 0,
            progress: '+' + Math.round(Math.random() * 20) + '%', // Placeholder
            lastWorkout: lastWorkout 
              ? formatTimeAgo(new Date(lastWorkout.completed_at))
              : 'Nunca'
          };
        })
        .sort((a, b) => b.completion - a.completion)
        .slice(0, 3);
      
      setTopPerformers(performers);
    }
    
    return data || [];
  };

  const loadAnalytics = async (trainerId) => {
    const dateRange = {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    };
    
    const { data } = await workoutService.getWorkoutAnalytics(trainerId, dateRange);
    return data;
  };

  const calculateStats = (templates, sessions, athletes, analytics) => {
    const thisWeekSessions = sessions.length;
    const lastWeekSessions = Math.round(thisWeekSessions * 0.8); // Placeholder
    
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const avgCompletion = sessions.length > 0 
      ? Math.round((completedSessions / sessions.length) * 100)
      : 0;
    
    setStats({
      totalTemplates: templates.length,
      activeAthletes: athletes.length,
      sessionsThisWeek: thisWeekSessions,
      avgCompletion: avgCompletion,
      trending: {
        templates: templates.length > 0 ? '+' + Math.round(templates.length * 0.2) : '0',
        athletes: athletes.length > 0 ? '+' + Math.round(athletes.length * 0.1) : '0',
        sessions: thisWeekSessions > lastWeekSessions 
          ? '+' + Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100) + '%'
          : '0%',
        completion: avgCompletion > 85 ? '+2%' : '-1%'
      }
    });
  };

  const subscribeToRealtimeUpdates = () => {
    return supabase
      .channel('dashboard-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'workout_sessions' 
        },
        (payload) => {
          console.log('Realtime update:', payload);
          // Recarregar dados relevantes
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();
  };

  const handleRealtimeUpdate = (payload) => {
    if (payload.eventType === 'UPDATE') {
      // Atualizar sessão específica
      if (payload.new.status === 'in_progress') {
        toast.success(`${payload.new.athlete_name} iniciou o treino!`);
      } else if (payload.new.status === 'completed') {
        toast.success(`${payload.new.athlete_name} completou o treino!`);
      }
      
      // Recarregar dados parcialmente
      refreshData();
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard atualizado!');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `Há ${minutes} minutos`;
    if (hours < 24) return `Há ${hours} horas`;
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `Há ${days} dias`;
  };

  const calculateStreak = (sessions) => {
    // Simplificado - calcular streak real baseado em datas consecutivas
    const completed = sessions.filter(s => s.status === 'completed').length;
    return Math.min(completed, 30); // Max 30 dias de streak para display
  };

  const getStatusIcon = (type) => {
    switch(type) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'started':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'missed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Treinos</h1>
          <p className="text-gray-600 mt-1">
            Crie, atribua e acompanhe os treinos dos seus atletas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Atualizar"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/workouts/builder')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Template
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Dumbbell className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              {stats.trending.templates}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
            <p className="text-sm text-gray-600">Templates Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              {stats.trending.athletes}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.activeAthletes}</p>
            <p className="text-sm text-gray-600">Atletas Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.trending.sessions.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.trending.sessions}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.sessionsThisWeek}</p>
            <p className="text-sm text-gray-600">Sessões esta Semana</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.trending.completion.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.trending.completion}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.avgCompletion}%</p>
            <p className="text-sm text-gray-600">Taxa de Conclusão</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
            <button 
              onClick={() => navigate('/workouts/analytics')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver tudo <ChevronRight className="inline h-4 w-4" />
            </button>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/workouts/session/${activity.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'completed' ? 'bg-green-100' :
                      activity.type === 'started' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {getStatusIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.athlete}</p>
                      <p className="text-sm text-gray-600">{activity.workout}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    {activity.completion > 0 && (
                      <p className="text-sm font-medium text-gray-900">
                        {activity.completion}% completo
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>Ainda sem atividade recente</p>
            </div>
          )}
        </div>

        {/* Próximas Sessões */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Hoje</h3>
            <button 
              onClick={() => navigate('/workouts/calendar')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Calendário <ChevronRight className="inline h-4 w-4" />
            </button>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <div 
                  key={session.id} 
                  className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r cursor-pointer"
                  onClick={() => navigate(`/workouts/session/${session.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{session.time}</p>
                      <p className="text-sm text-gray-600">{session.athlete}</p>
                      <p className="text-xs text-gray-500">{session.workout}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Agendado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm">Sem sessões agendadas</p>
              <button
                onClick={() => navigate('/workouts/assign')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Agendar treino
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Performers</h3>
            <button 
              onClick={() => navigate('/workouts/analytics')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver rankings <ChevronRight className="inline h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((performer, index) => (
              <div 
                key={performer.id} 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/workouts/progress/${performer.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {performer.avatar ? (
                        <img 
                          src={performer.avatar} 
                          alt={performer.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">Último: {performer.lastWorkout}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-500">
                      #{index + 1}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">🔥 {performer.streak}</p>
                    <p className="text-xs text-gray-500">Streak</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{performer.completion}%</p>
                    <p className="text-xs text-gray-500">Conclusão</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">{performer.progress}</p>
                    <p className="text-xs text-gray-500">Progresso</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/workouts/builder')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="p-3 bg-blue-100 rounded-lg inline-block mb-2 group-hover:bg-blue-200 transition-colors">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <p className="font-medium text-gray-900">Criar Template</p>
          <p className="text-xs text-gray-500 mt-1">Novo plano de treino</p>
        </button>

        <button
          onClick={() => navigate('/workouts/templates')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="p-3 bg-purple-100 rounded-lg inline-block mb-2 group-hover:bg-purple-200 transition-colors">
            <Dumbbell className="h-6 w-6 text-purple-600" />
          </div>
          <p className="font-medium text-gray-900">Templates</p>
          <p className="text-xs text-gray-500 mt-1">Ver todos os templates</p>
        </button>

        <button
          onClick={() => navigate('/workouts/assign')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="p-3 bg-green-100 rounded-lg inline-block mb-2 group-hover:bg-green-200 transition-colors">
            <Send className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-medium text-gray-900">Atribuir Treino</p>
          <p className="text-xs text-gray-500 mt-1">Enviar para atleta</p>
        </button>

        <button
          onClick={() => navigate('/workouts/analytics')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="p-3 bg-yellow-100 rounded-lg inline-block mb-2 group-hover:bg-yellow-200 transition-colors">
            <BarChart3 className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="font-medium text-gray-900">Analytics</p>
          <p className="text-xs text-gray-500 mt-1">Métricas e relatórios</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardView;