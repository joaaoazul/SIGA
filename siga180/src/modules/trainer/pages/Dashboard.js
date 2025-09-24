// src/modules/trainer/pages/Dashboard/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Dumbbell, 
  Calendar,
  TrendingUp,
  Clock,
  Activity,
  ChevronRight,
  RefreshCw,
  Bell,
  Plus,
  Target,
  Award,
  BarChart3,
  Mail,
  Trophy
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import toast from 'react-hot-toast';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const { stats, athletes, workoutSessions, invites, isLoading, refresh } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    toast.success('Dashboard atualizado!');
    setTimeout(() => setRefreshing(false), 500);
  };
  
  // Quick Actions
  const quickActions = [
    {
      title: 'Novo Atleta',
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => navigate('/trainer/athletes?action=new')
    },
    {
      title: 'Criar Template',
      icon: Dumbbell,
      color: 'bg-green-500',
      onClick: () => navigate('/trainer/workouts/templates/new')
    },
    {
      title: 'Agendar Sessão',
      icon: Calendar,
      color: 'bg-purple-500',
      onClick: () => navigate('/trainer/schedule/new')
    },
    {
      title: 'Plano Nutricional',
      icon: Target,
      color: 'bg-orange-500',
      onClick: () => navigate('/trainer/nutrition/plans/new')
    }
  ];
  
  if (isLoading && !athletes.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">A carregar dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Bem-vindo de volta! Aqui está o resumo do dia.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total de Atletas"
            value={stats.totalAthletes}
            trend={`${stats.pendingInvites} convites pendentes`}
            icon={Users}
            color="blue"
            onClick={() => navigate('/trainer/athletes')}
          />
          <StatCard
            title="Sessões Esta Semana"
            value={stats.upcomingSessions}
            trend={`${stats.completionRate}% concluídas`}
            icon={Calendar}
            color="green"
            onClick={() => navigate('/trainer/schedule')}
          />
          <StatCard
            title="Taxa de Conclusão"
            value={`${stats.completionRate}%`}
            trend={stats.weeklyProgress.completed > 0 ? '+2% esta semana' : 'Estável'}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Treinos Ativos"
            value={stats.activeWorkouts}
            trend="Em tempo real"
            icon={Activity}
            color="orange"
            live={true}
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className={`p-2 ${action.color} rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
                  <button
                    onClick={() => navigate('/trainer/activity')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver Tudo
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p>Sem atividade recente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            </div>
            <div className="p-6">
              {stats.topPerformers.length > 0 ? (
                <div className="space-y-4">
                  {stats.topPerformers.map((athlete, index) => (
                    <div key={athlete.id} className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Award className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Award className="h-5 w-5 text-orange-600" />}
                        {index > 2 && <span className="text-sm text-gray-500">{index + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {athlete.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {athlete.stats.completed}/{athlete.stats.total} treinos
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          athlete.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                          athlete.completionRate >= 70 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {athlete.completionRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm">Sem dados suficientes</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pending Invites Alert */}
        {invites.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  {invites.length} convite{invites.length > 1 ? 's' : ''} pendente{invites.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Aguardando resposta dos atletas
                </p>
              </div>
              <button
                onClick={() => navigate('/trainer/athletes?tab=invites')}
                className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
              >
                Ver Convites
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== SUB-COMPONENTS ==========

const StatCard = ({ title, value, trend, icon: Icon, color, onClick, live }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };
  
  const Card = onClick ? 'button' : 'div';
  
  return (
    <Card
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${
        onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors[color]} rounded-lg bg-opacity-10`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {live && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
        {trend && (
          <p className="text-xs text-gray-500 mt-2">{trend}</p>
        )}
      </div>
    </Card>
  );
};

const ActivityItem = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'workout':
        return <Dumbbell className="h-4 w-4" />;
      case 'invite':
        return <Mail className="h-4 w-4" />;
      case 'nutrition':
        return <Target className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = () => {
    switch (activity.status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${getStatusColor()}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(activity.time).toLocaleString('pt-PT', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default TrainerDashboard;