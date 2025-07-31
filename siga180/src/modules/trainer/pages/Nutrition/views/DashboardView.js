import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Scale,
  Target,
  Activity,
  ChevronRight,
  Plus,
  FileText,
  MessageSquare,
  Award
} from 'lucide-react';

const DashboardView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // TODO: Substituir com API real
    setTimeout(() => {
      setDashboardData({
        stats: {
          activeAthletes: 18,
          plansExpiring: 3,
          checkInsToday: 5,
          avgCompliance: 82
        },
        athletesNeedingAttention: [
          {
            id: 1,
            name: 'João Silva',
            photo: null,
            issue: 'Peso estagnado há 2 semanas',
            lastWeight: '78.5kg',
            compliance: 65,
            daysSinceCheckIn: 3,
            priority: 'high'
          },
          {
            id: 2,
            name: 'Maria Santos',
            photo: null,
            issue: 'Adesão baixa esta semana',
            lastWeight: '62.3kg',
            compliance: 45,
            daysSinceCheckIn: 1,
            priority: 'high'
          },
          {
            id: 3,
            name: 'Pedro Costa',
            photo: null,
            issue: 'Plano expira em 3 dias',
            lastWeight: '85.0kg',
            compliance: 88,
            daysSinceCheckIn: 0,
            priority: 'medium'
          }
        ],
        recentCheckIns: [
          {
            id: 1,
            athlete: 'Ana Ferreira',
            time: '07:30',
            weight: '58.2kg',
            weightChange: -0.3,
            macrosCompliance: { protein: 95, carbs: 85, fat: 90 },
            feedback: 'Sentindo-me muito bem! Energia em alta.'
          },
          {
            id: 2,
            athlete: 'Carlos Mendes',
            time: '08:15',
            weight: '92.1kg',
            weightChange: +0.2,
            macrosCompliance: { protein: 100, carbs: 120, fat: 100 },
            feedback: 'Ontem foi dia de refeed, como planeado.'
          }
        ],
        weeklyMetrics: {
          athletesOnTarget: 67,
          checkInRate: 80,
          avgSatisfaction: 4.7
        }
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { stats, athletesNeedingAttention, recentCheckIns, weeklyMetrics } = dashboardData;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header com saudação */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Boa {new Date().getHours() < 12 ? 'manhã' : new Date().getHours() < 18 ? 'tarde' : 'noite'}, Coach! 💪
        </h1>
        <p className="text-gray-600 mt-1">
          {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atletas Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAthletes}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Planos a Expirar</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.plansExpiring}</p>
              <p className="text-xs text-yellow-600 mt-1">Próximos 7 dias</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Check-ins Hoje</p>
              <p className="text-2xl font-bold text-green-700">{stats.checkInsToday}</p>
              <p className="text-xs text-green-600 mt-1">+2 vs ontem</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Adesão</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgCompliance}%</p>
              <p className="text-xs text-green-600 mt-1">+5% vs mês passado</p>
            </div>
            <Target className="h-8 w-8 text-gray-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Needs Attention */}
        <div className="lg:col-span-2 space-y-6">
          {/* Athletes Needing Attention */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Precisam da Tua Atenção
                </h2>
                <button 
                  onClick={() => navigate('/nutrition/athletes')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Ver todos →
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {athletesNeedingAttention.map((athlete) => (
                <div 
                  key={athlete.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/nutrition/athlete/${athlete.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{athlete.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{athlete.issue}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            {athlete.lastWeight}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {athlete.compliance}% adesão
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Check-in há {athlete.daysSinceCheckIn}d
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        athlete.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {athlete.priority === 'high' ? 'Alta' : 'Média'}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Check-ins */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Check-ins de Hoje</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{checkIn.athlete}</h3>
                      <p className="text-sm text-gray-500">{checkIn.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{checkIn.weight}</p>
                      <p className={`text-sm ${checkIn.weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {checkIn.weightChange > 0 && '+'}{checkIn.weightChange}kg
                      </p>
                    </div>
                  </div>

                  {/* Macros Compliance */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Proteína</p>
                      <p className={`text-sm font-medium ${
                        checkIn.macrosCompliance.protein >= 90 ? 'text-green-600' : 'text-yellow-600'
                      }`}>{checkIn.macrosCompliance.protein}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Carbs</p>
                      <p className={`text-sm font-medium ${
                        checkIn.macrosCompliance.carbs >= 90 ? 'text-green-600' : 'text-yellow-600'
                      }`}>{checkIn.macrosCompliance.carbs}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Gordura</p>
                      <p className={`text-sm font-medium ${
                        checkIn.macrosCompliance.fat >= 90 ? 'text-green-600' : 'text-yellow-600'
                      }`}>{checkIn.macrosCompliance.fat}%</p>
                    </div>
                  </div>

                  {checkIn.feedback && (
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-gray-700 italic">"{checkIn.feedback}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Insights */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/nutrition/tools')}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <span className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  <span>Calcular Macros</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/nutrition/plans/create')}
                className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>Criar Plano</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/nutrition/database')}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Base de Dados</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekly Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Performance da Semana
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Atletas no Peso Alvo</span>
                  <span className="font-medium">{weeklyMetrics.athletesOnTarget}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${weeklyMetrics.athletesOnTarget}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taxa de Check-ins</span>
                  <span className="font-medium">{weeklyMetrics.checkInRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${weeklyMetrics.checkInRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Satisfação dos Atletas</span>
                  <span className="font-medium">{weeklyMetrics.avgSatisfaction}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(weeklyMetrics.avgSatisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coach Insights */}
          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Coach Insights</h3>
            <p className="text-sm text-gray-700 mb-2">
              70% dos atletas com baixa adesão ao pequeno-almoço. 
              Considera opções mais práticas.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver sugestões →
            </button>
          </div>

          {/* Quick Message */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              Mensagem Rápida
            </h3>
            <button className="w-full p-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100">
              Enviar motivação para quem não fez check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;