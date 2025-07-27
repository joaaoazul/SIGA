// src/modules/trainer/pages/Nutrition/components/DashboardView.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Apple,
  Calculator,
  FileText,
  AlertCircle,
  Calendar,
  ChevronRight,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
  PieChart,
  Scale,
  Droplets,
  Heart,
  Brain,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  MoreVertical,
  Eye,
  Plus,
  Dumbbell,
  MessageSquare
} from 'lucide-react';

const DashboardView = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data - em produção viria da API
  const stats = {
    totalAthletes: 24,
    activePlans: 21,
    avgCompliance: 85,
    pendingCheckIns: 5,
    weeklyProgress: {
      compliance: +5,
      newPlans: +3,
      completedCheckIns: 12
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'checkin',
      athlete: 'João Silva',
      action: 'Completou check-in semanal',
      time: '2 horas atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'plan',
      athlete: 'Maria Santos',
      action: 'Novo plano de cutting criado',
      time: '5 horas atrás',
      status: 'info'
    },
    {
      id: 3,
      type: 'alert',
      athlete: 'Pedro Costa',
      action: 'Compliance abaixo de 70%',
      time: '1 dia atrás',
      status: 'warning'
    }
  ];

  const upcomingCheckIns = [
    { id: 1, athlete: 'João Silva', date: 'Hoje', time: '15:00', type: 'Semanal' },
    { id: 2, athlete: 'Maria Santos', date: 'Amanhã', time: '10:00', type: 'Quinzenal' },
    { id: 3, athlete: 'Pedro Costa', date: 'Quarta', time: '18:00', type: 'Mensal' }
  ];

  return (
    <div>
      {/* Stats Overview - Estilo consistente com o dashboard principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Atletas Ativos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.totalAthletes}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                2 este mês
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planos Ativos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.activePlans}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats.weeklyProgress.newPlans} novos
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Média</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.avgCompliance}%
              </p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats.weeklyProgress.compliance}%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-ins Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.pendingCheckIns}
              </p>
              <p className="text-sm text-orange-600 flex items-center mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Atenção necessária
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Integrado com navegação do módulo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => onNavigate('plans')}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Novo Plano</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Calculadoras</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('meals')}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <Apple className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Refeições</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Analytics</span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
                <button 
                  onClick={() => onNavigate('athletes')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Ver tudo
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : activity.status === 'warning' ? (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Activity className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.athlete}</span>
                        {' - '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance Chart */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Semanal</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                  <option value="quarter">Último Trimestre</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <ComplianceChart timeRange={timeRange} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Check-ins */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Próximos Check-ins</h3>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {upcomingCheckIns.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{checkIn.athlete}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {checkIn.date} às {checkIn.time} • {checkIn.type}
                      </p>
                    </div>
                    <button className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('athletes')}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Ver Calendário
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Perda Média</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">1.8 kg/mês</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Taxa de Sucesso</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Objetivos Alcançados</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">Satisfação</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">4.8/5</span>
              </div>
            </div>
          </div>

          {/* Integration Links */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Integrações</h3>
            <div className="space-y-3">
              <Link 
                to="/workouts"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Treinos</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
              <Link 
                to="/messages"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Mensagens</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compliance Chart Component
const ComplianceChart = ({ timeRange }) => {
  // Mock data
  const data = [
    { day: 'Seg', compliance: 88 },
    { day: 'Ter', compliance: 85 },
    { day: 'Qua', compliance: 92 },
    { day: 'Qui', compliance: 87 },
    { day: 'Sex', compliance: 90 },
    { day: 'Sáb', compliance: 82 },
    { day: 'Dom', compliance: 85 }
  ];

  const maxCompliance = Math.max(...data.map(d => d.compliance));

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-100 rounded-t relative flex-1 flex items-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ 
                  height: `${(day.compliance / maxCompliance) * 100}%`,
                  minHeight: '20px'
                }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {day.compliance}%
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;