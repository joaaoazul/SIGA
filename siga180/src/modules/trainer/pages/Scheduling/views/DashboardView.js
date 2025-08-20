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
  XCircle,
  Plus,
  ChevronRight,
  Activity,
  Target,
  CalendarDays,
  UserCheck,
  UserX,
  Video,
  MapPin,
  Timer,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';
import scheduleService from '../services/scheduleService';

const DashboardView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estado
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [weekSchedules, setWeekSchedules] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    scheduled: 0,
    completionRate: 0,
    cancellationRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Data de hoje
      const today = new Date().toISOString().split('T')[0];
      
      // Início e fim da semana
      const weekStart = new Date();
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Buscar agendamentos de hoje
      const todayResult = await scheduleService.getSchedules({
        trainerId: user?.id,
        date: today
      });
      
      // Buscar agendamentos da semana
      const weekResult = await scheduleService.getSchedules({
        trainerId: user?.id,
        dateFrom: weekStart.toISOString().split('T')[0],
        dateTo: weekEnd.toISOString().split('T')[0]
      });
      
      // Buscar próximos agendamentos (próximos 7 dias)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcomingResult = await scheduleService.getSchedules({
        trainerId: user?.id,
        dateFrom: today,
        dateTo: nextWeek.toISOString().split('T')[0],
        status: ['scheduled', 'confirmed']
      });
      
      // Buscar estatísticas
      const statsResult = await scheduleService.getScheduleStats(user?.id, 'month');
      
      // Atualizar estados
      if (todayResult.success) {
        setTodaySchedules(todayResult.data);
      }
      
      if (weekResult.success) {
        setWeekSchedules(weekResult.data);
      }
      
      if (upcomingResult.success) {
        setUpcomingSchedules(upcomingResult.data.slice(0, 5));
      }
      
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      // Simular atividade recente (substituir com dados reais)
      setRecentActivity([
        { 
          type: 'confirmation', 
          message: 'João Silva confirmou presença para hoje às 15:00',
          time: '10 min atrás'
        },
        {
          type: 'reschedule',
          message: 'Maria Santos solicitou remarcação da sessão de amanhã',
          time: '1 hora atrás'
        },
        {
          type: 'completion',
          message: 'Sessão com Pedro Oliveira concluída com sucesso',
          time: '2 horas atrás'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Cards de estatísticas
  const statsCards = [
    {
      title: 'Sessões Hoje',
      value: todaySchedules.length,
      subValue: `${todaySchedules.filter(s => s.status === 'completed').length} concluídas`,
      icon: Calendar,
      color: 'blue',
      trend: '+12%',
      onClick: () => navigate('/scheduling/calendar')
    },
    {
      title: 'Esta Semana',
      value: weekSchedules.length,
      subValue: `${weekSchedules.filter(s => s.athlete_confirmed).length} confirmadas`,
      icon: CalendarDays,
      color: 'purple',
      trend: '+8%',
      onClick: () => navigate('/scheduling/calendar')
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats.completionRate}%`,
      subValue: `${stats.completed} de ${stats.total} sessões`,
      icon: TrendingUp,
      color: 'green',
      trend: '+5%',
      onClick: () => navigate('/scheduling/list?status=completed')
    },
    {
      title: 'Taxa de Cancelamento',
      value: `${stats.cancellationRate}%`,
      subValue: `${stats.cancelled} canceladas`,
      icon: AlertCircle,
      color: stats.cancellationRate > 20 ? 'red' : 'yellow',
      trend: stats.cancellationRate > 20 ? '+2%' : '-3%',
      onClick: () => navigate('/scheduling/list?status=cancelled')
    }
  ];

  // Função para obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'yellow',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
      no_show: 'gray',
      in_progress: 'purple'
    };
    return colors[status] || 'gray';
  };

  // Função para obter ícone do status
  const getStatusIcon = (status) => {
    const icons = {
      scheduled: Clock,
      confirmed: CheckCircle,
      completed: CheckCircle,
      cancelled: XCircle,
      no_show: UserX,
      in_progress: Activity
    };
    const Icon = icons[status] || Clock;
    return <Icon size={14} />;
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Agendamentos</h1>
          <p className="text-gray-600 mt-1">
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
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={() => navigate('/scheduling/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${card.color}-100 rounded-lg`}>
                  <Icon size={24} className={`text-${card.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${
                  card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-xs text-gray-500 mt-1">{card.subValue}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessões de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Sessões de Hoje
              </h2>
              <button
                onClick={() => navigate('/scheduling/calendar')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Ver todas
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {todaySchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Sem sessões agendadas para hoje</p>
                <button
                  onClick={() => navigate('/scheduling/create')}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Agendar uma sessão
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/scheduling/detail/${schedule.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.start_time.slice(0, 5)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {schedule.duration_minutes} min
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {schedule.athlete?.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {schedule.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {schedule.is_online ? (
                              <>
                                <Video size={12} />
                                Online
                              </>
                            ) : (
                              <>
                                <MapPin size={12} />
                                {schedule.location || 'Presencial'}
                              </>
                            )}
                          </span>
                          {schedule.athlete_confirmed && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <UserCheck size={12} />
                              Confirmado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        bg-${getStatusColor(schedule.status)}-100 
                        text-${getStatusColor(schedule.status)}-700`}
                      >
                        {getStatusIcon(schedule.status)}
                        {schedule.status === 'completed' ? 'Concluído' :
                         schedule.status === 'confirmed' ? 'Confirmado' :
                         schedule.status === 'cancelled' ? 'Cancelado' :
                         schedule.status === 'no_show' ? 'Não compareceu' :
                         'Agendado'}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/scheduling/edit/${schedule.id}`);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Próximas Sessões */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Próximas Sessões
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {upcomingSchedules.length}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {upcomingSchedules.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Sem sessões próximas
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
                      onClick={() => navigate(`/scheduling/detail/${schedule.id}`)}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.athlete?.full_name?.split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })} às {schedule.start_time.slice(0, 5)}
                        </p>
                      </div>
                      
                      {!schedule.athlete_confirmed && (
                        <span className="p-1 bg-yellow-100 rounded-full">
                          <AlertCircle size={14} className="text-yellow-600" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Atividade Recente */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Atividade Recente
                </h2>
                <Bell size={18} className="text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`p-1.5 rounded-full flex-shrink-0
                      ${activity.type === 'confirmation' ? 'bg-green-100' :
                        activity.type === 'reschedule' ? 'bg-yellow-100' :
                        activity.type === 'completion' ? 'bg-blue-100' :
                        'bg-gray-100'}`}
                    >
                      {activity.type === 'confirmation' ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : activity.type === 'reschedule' ? (
                        <Clock size={14} className="text-yellow-600" />
                      ) : (
                        <Activity size={14} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/scheduling/availability')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Timer className="text-gray-600" size={18} />
                  <span className="text-sm font-medium">Gerir Disponibilidade</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              
              <button
                onClick={() => navigate('/scheduling/recurring')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="text-gray-600" size={18} />
                  <span className="text-sm font-medium">Sessões Recorrentes</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              
              <button
                onClick={() => navigate('/scheduling/list')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Eye className="text-gray-600" size={18} />
                  <span className="text-sm font-medium">Ver Lista Completa</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              
              <button
                onClick={() => toast.success('Funcionalidade em desenvolvimento')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="text-gray-600" size={18} />
                  <span className="text-sm font-medium">Exportar Relatório</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;