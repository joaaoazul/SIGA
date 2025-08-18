// src/modules/trainer/pages/Workouts/views/DashboardView.js
import React from 'react';
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
  Send
} from 'lucide-react';

const DashboardView = () => {
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da BD
  const stats = {
    totalTemplates: 12,
    activeAthletes: 28,
    sessionsThisWeek: 84,
    avgCompletion: 92,
    trending: {
      templates: '+3',
      athletes: '+5',
      sessions: '+12%',
      completion: '+2%'
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'completed',
      athlete: 'João Silva',
      workout: 'Treino A - Peito e Tríceps',
      time: 'Há 2 horas',
      completion: 100,
      duration: '58 min'
    },
    {
      id: 2,
      type: 'started',
      athlete: 'Maria Santos',
      workout: 'Treino B - Costas e Bíceps',
      time: 'Há 3 horas',
      completion: 45,
      duration: '25 min'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      athlete: 'Ana Rodrigues',
      workout: 'HIIT Cardio',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: 2,
      athlete: 'Carlos Mendes',
      workout: 'Treino A - Peito',
      time: '15:30',
      status: 'confirmed'
    }
  ];

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
        
        <button
          onClick={() => navigate('/workouts/builder')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Novo Template
        </button>
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
            <span className="text-sm text-green-600 font-medium">
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
            <span className="text-sm text-green-600 font-medium">
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

          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'completed' ? 'bg-green-100' :
                    activity.type === 'started' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'completed' ? (
                      <Activity className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
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

          <div className="space-y-3">
            {upcomingSessions.map(session => (
              <div key={session.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{session.time}</p>
                    <p className="text-sm text-gray-600">{session.athlete}</p>
                    <p className="text-xs text-gray-500">{session.workout}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {session.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          onClick={() => navigate('/workouts/calendar')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="p-3 bg-yellow-100 rounded-lg inline-block mb-2 group-hover:bg-yellow-200 transition-colors">
            <Calendar className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="font-medium text-gray-900">Ver Calendário</p>
          <p className="text-xs text-gray-500 mt-1">Sessões agendadas</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardView;