// src/modules/trainer/pages/Scheduling/views/DashboardView.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  ChevronRight,
  RefreshCw,
  Bell,
  CalendarDays,
  UserCheck,
  UserX,
  Video,
  MapPin,
  Timer,
  Activity,
  Target,
  Filter,
  Download,
  Eye,
  Edit,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { supabase } from '../../../../../services/supabase/supabaseClient';
const DashboardView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [weekSchedules, setWeekSchedules] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    scheduled: 0,
    completionRate: 0,
    cancellationRate: 0
  });
  const [weekStats, setWeekStats] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  });

  // Fetch todos os dados do dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Data de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Início e fim da semana
      const weekStart = new Date(today);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // 1. BUSCAR SESSÕES DE HOJE
      const { data: todayData, error: todayError } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:profiles!schedules_athlete_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('trainer_id', user?.id)
        .gte('scheduled_date', today.toISOString().split('T')[0])
        .lt('scheduled_date', tomorrow.toISOString().split('T')[0])
        .order('start_time', { ascending: true });

      if (todayError) {
        console.error('Error fetching today schedules:', todayError);
        toast.error('Erro ao carregar sessões de hoje');
      } else {
        // Adicionar iniciais aos atletas
        const schedulesWithInitials = (todayData || []).map(schedule => ({
          ...schedule,
          athlete: {
            ...schedule.athlete,
            initials: schedule.athlete?.full_name
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase() || '??'
          }
        }));
        setTodaySchedules(schedulesWithInitials);
      }

      // 2. BUSCAR SESSÕES DA SEMANA
      const { data: weekData, error: weekError } = await supabase
        .from('schedules')
        .select('*')
        .eq('trainer_id', user?.id)
        .gte('scheduled_date', weekStart.toISOString().split('T')[0])
        .lte('scheduled_date', weekEnd.toISOString().split('T')[0]);

      if (weekError) {
        console.error('Error fetching week schedules:', weekError);
      } else {
        setWeekSchedules(weekData || []);
        
        // Calcular estatísticas da semana
        const weekStatsTemp = {
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
        };
        
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        (weekData || []).forEach(schedule => {
          const date = new Date(schedule.scheduled_date);
          const dayName = dayNames[date.getDay()];
          weekStatsTemp[dayName]++;
        });
        
        setWeekStats(weekStatsTemp);
      }

      // 3. BUSCAR PRÓXIMAS SESSÕES (próximos 7 dias)
      const nextWeek = new Date(tomorrow);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:profiles!schedules_athlete_id_fkey(
            id,
            full_name,
            email
          )
        `)
        .eq('trainer_id', user?.id)
        .gte('scheduled_date', tomorrow.toISOString().split('T')[0])
        .lte('scheduled_date', nextWeek.toISOString().split('T')[0])
        .in('status', ['scheduled', 'confirmed'])
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5);

      if (upcomingError) {
        console.error('Error fetching upcoming schedules:', upcomingError);
      } else {
        const upcomingWithInitials = (upcomingData || []).map(schedule => ({
          ...schedule,
          athlete: {
            ...schedule.athlete,
            initials: schedule.athlete?.full_name
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase() || '??'
          }
        }));
        setUpcomingSchedules(upcomingWithInitials);
      }

      // 4. CALCULAR ESTATÍSTICAS DO MÊS
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const { data: monthData, error: monthError } = await supabase
        .from('schedules')
        .select('status')
        .eq('trainer_id', user?.id)
        .gte('scheduled_date', monthStart.toISOString().split('T')[0])
        .lte('scheduled_date', monthEnd.toISOString().split('T')[0]);

      if (monthError) {
        console.error('Error fetching month stats:', monthError);
      } else {
        const statsTemp = {
          total: monthData?.length || 0,
          completed: 0,
          cancelled: 0,
          noShow: 0,
          scheduled: 0,
          completionRate: 0,
          cancellationRate: 0
        };
        
        (monthData || []).forEach(schedule => {
          switch(schedule.status) {
            case 'completed':
              statsTemp.completed++;
              break;
            case 'cancelled':
              statsTemp.cancelled++;
              break;
            case 'no_show':
              statsTemp.noShow++;
              break;
            case 'scheduled':
            case 'confirmed':
              statsTemp.scheduled++;
              break;
          }
        });
        
        // Calcular percentagens
        if (statsTemp.total > 0) {
          statsTemp.completionRate = ((statsTemp.completed / statsTemp.total) * 100).toFixed(1);
          statsTemp.cancellationRate = ((statsTemp.cancelled / statsTemp.total) * 100).toFixed(1);
        }
        
        setStats(statsTemp);
      }

      // 5. BUSCAR NOTIFICAÇÕES RECENTES (últimas 48h)
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const { data: notificationData, error: notificationError } = await supabase
        .from('schedule_notifications')
        .select(`
          *,
          schedule:schedules(
            title,
            athlete:profiles!schedules_athlete_id_fkey(
              full_name
            )
          )
        `)
        .eq('recipient_id', user?.id)
        .gte('created_at', twoDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      if (notificationError) {
        console.error('Error fetching notifications:', notificationError);
      } else {
        setRecentNotifications(notificationData || []);
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar dados ao montar o componente
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  // Função para refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Função para obter cor do tipo
  const getTypeColor = (type) => {
    const colors = {
      training: 'blue',
      consultation: 'purple',
      assessment: 'green',
      recovery: 'orange',
      group_class: 'pink',
      online: 'indigo'
    };
    return colors[type] || 'gray';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString('pt-PT', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  refreshing ? 'animate-spin' : ''
                }`}
                title="Atualizar"
                disabled={refreshing}
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>
              
              <button
                onClick={() => navigate('/schedule/calendar')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ver Calendário"
              >
                <Calendar size={20} className="text-gray-600" />
              </button>
              
              <button
                onClick={() => navigate('/schedule/create')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              >
                <Plus size={18} />
                <span className="font-medium">Novo Agendamento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1 - Sessões Hoje */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoje
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todaySchedules.length}</p>
                <p className="text-sm text-gray-600 mt-1">Sessões Hoje</p>
                <p className="text-xs text-gray-500 mt-2">
                  {todaySchedules.filter(s => s.status === 'completed').length} concluídas
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button 
                onClick={() => navigate('/schedule/calendar')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                Ver detalhes
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2 - Esta Semana */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CalendarDays size={24} className="text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  7 dias
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{weekSchedules.length}</p>
                <p className="text-sm text-gray-600 mt-1">Esta Semana</p>
                <p className="text-xs text-gray-500 mt-2">
                  {weekSchedules.filter(s => s.athlete_confirmed).length} confirmadas
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button 
                onClick={() => navigate('/schedule/list')}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              >
                Ver todas
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3 - Taxa de Conclusão */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Mês
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Taxa de Conclusão</p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.completed} de {stats.total}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button className="text-xs text-green-600 hover:text-green-800 font-medium flex items-center gap-1">
                Ver análise
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 4 - Cancelamentos */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stats.cancellationRate > 10 
                    ? 'text-red-600 bg-red-100' 
                    : 'text-yellow-600 bg-yellow-100'
                }`}>
                  Mês
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.cancellationRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Cancelamentos</p>
                <p className="text-xs text-gray-500 mt-2">{stats.cancelled} este mês</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button className="text-xs text-yellow-600 hover:text-yellow-800 font-medium flex items-center gap-1">
                Ver relatório
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Sessões de Hoje */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">Agenda de Hoje</h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {todaySchedules.length} {todaySchedules.length === 1 ? 'sessão' : 'sessões'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/schedule/calendar')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver calendário
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {todaySchedules.length === 0 ? (
                  <div className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Sem sessões agendadas para hoje</p>
                    <button
                      onClick={() => navigate('/schedule/create')}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Agendar uma sessão →
                    </button>
                  </div>
                ) : (
                  todaySchedules.map((schedule, index) => (
                    <div
                      key={schedule.id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/schedule/detail/${schedule.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Hora */}
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-semibold text-gray-900">
                              {schedule.start_time?.slice(0, 5) || '??:??'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {schedule.duration_minutes || 60}min
                            </p>
                          </div>

                          {/* Avatar */}
                          {schedule.athlete?.avatar_url ? (
                            <img 
                              src={schedule.athlete.avatar_url} 
                              alt={schedule.athlete.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                              ${index % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                                index % 3 === 1 ? 'bg-purple-100 text-purple-600' : 
                                'bg-green-100 text-green-600'}
                            `}>
                              {schedule.athlete?.initials || '??'}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {schedule.athlete?.full_name || 'Sem atleta'}
                              </p>
                              {schedule.athlete_confirmed && (
                                <CheckCircle size={14} className="text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {schedule.title || 'Sessão de treino'}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              {schedule.is_online ? (
                                <span className="flex items-center gap-1 text-xs text-indigo-600">
                                  <Video size={12} />
                                  Online
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin size={12} />
                                  {schedule.location || 'Presencial'}
                                </span>
                              )}
                              <span className={`
                                inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                                ${schedule.type === 'training' ? 'bg-blue-100 text-blue-700' :
                                  schedule.type === 'assessment' ? 'bg-green-100 text-green-700' :
                                  schedule.type === 'recovery' ? 'bg-orange-100 text-orange-700' :
                                  schedule.type === 'consultation' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-700'}
                              `}>
                                {schedule.type === 'training' ? 'Treino' :
                                 schedule.type === 'assessment' ? 'Avaliação' :
                                 schedule.type === 'recovery' ? 'Recuperação' :
                                 schedule.type === 'consultation' ? 'Consulta' :
                                 schedule.type || 'Sessão'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/schedule/edit/${schedule.id}`);
                            }}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/schedule/detail/${schedule.id}`);
                            }}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {todaySchedules.length > 0 && (
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => navigate('/schedule/calendar')}
                    className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Ver agenda completa →
                  </button>
                </div>
              )}
            </div>

            {/* Gráfico de Atividade Semanal */}
            <div className="bg-white rounded-xl shadow-sm mt-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Atividade Semanal</h2>
              </div>
              <div className="p-6">
                <div className="flex items-end justify-between gap-2" style={{ height: '120px' }}>
                  {Object.entries(weekStats).map(([day, count]) => (
                    <div key={day} className="flex-1 flex flex-col items-center justify-end gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                        style={{ 
                          height: `${Math.min((count / 10) * 100, 100)}%`,
                          minHeight: count > 0 ? '20px' : '0'
                        }}
                      />
                      <span className="text-xs text-gray-600 font-medium">
                        {day === 'monday' ? 'Seg' :
                         day === 'tuesday' ? 'Ter' :
                         day === 'wednesday' ? 'Qua' :
                         day === 'thursday' ? 'Qui' :
                         day === 'friday' ? 'Sex' :
                         day === 'saturday' ? 'Sáb' :
                         'Dom'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total da semana</span>
                  <span className="text-sm font-semibold text-gray-900">{weekSchedules.length} sessões</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Próximas Sessões */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Próximas</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {upcomingSchedules.length}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {upcomingSchedules.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Sem sessões próximas agendadas
                  </p>
                ) : (
                  upcomingSchedules.map((schedule, index) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 -m-3 rounded-lg transition-colors"
                      onClick={() => navigate(`/schedule/detail/${schedule.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                          ${index % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}
                        `}>
                          {schedule.athlete?.initials || '??'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {schedule.athlete?.full_name?.split(' ')[0] || 'Atleta'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
                              weekday: 'short',
                              day: 'numeric'
                            })} às {schedule.start_time?.slice(0, 5) || '??:??'}
                          </p>
                        </div>
                      </div>
                      
                      {!schedule.athlete_confirmed && (
                        <span className="p-1 bg-yellow-100 rounded-full">
                          <AlertCircle size={14} className="text-yellow-600" />
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/schedule/calendar')}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">Ver Calendário</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/schedule/availability')}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Timer className="text-purple-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">Disponibilidade</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/schedule/recurring')}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="text-green-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">Recorrentes</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => toast.info('Relatório em desenvolvimento')}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="text-indigo-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">Exportar</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;