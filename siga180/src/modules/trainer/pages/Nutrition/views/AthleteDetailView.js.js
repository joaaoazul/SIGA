import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
  Activity,
  FileText,
  Edit2,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  MessageSquare,
  Apple,
  Utensils,
  Droplets,
  Moon,
  ChevronRight,
  Eye
} from 'lucide-react';

const AthleteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchAthleteData();
  }, [id]);

  const fetchAthleteData = async () => {
    // TODO: Substituir com API call real
    setTimeout(() => {
      setAthlete({
        id: parseInt(id),
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '+351 912 345 678',
        age: 28,
        height: 175,
        currentWeight: 78.5,
        startWeight: 82.0,
        targetWeight: 75.0,
        currentPlan: {
          id: 1,
          name: 'Cutting Moderado',
          startDate: '2024-01-01',
          endDate: '2024-03-01',
          calories: 2100,
          protein: 180,
          carbs: 200,
          fat: 60,
          meals: 6
        },
        stats: {
          adherence: 82,
          lastCheckIn: '2024-01-28',
          weeklyCheckIns: 6,
          totalCheckIns: 42
        },
        recentCheckIns: [
          {
            date: '2024-01-28',
            weight: 78.5,
            adherence: 90,
            macros: { protein: 95, carbs: 85, fat: 90 },
            water: 3.2,
            sleep: 7.5,
            mood: 'great',
            notes: 'Dia excelente, energia alta!'
          },
          {
            date: '2024-01-27',
            weight: 78.7,
            adherence: 85,
            macros: { protein: 90, carbs: 80, fat: 85 },
            water: 2.8,
            sleep: 7,
            mood: 'good',
            notes: 'Saltou o lanche da tarde'
          }
        ]
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

  if (!athlete) {
    return <div className="p-6">Atleta não encontrado</div>;
  }

  const weightProgress = ((athlete.startWeight - athlete.currentWeight) / 
                         (athlete.startWeight - athlete.targetWeight) * 100).toFixed(1);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'plan', label: 'Plano Atual', icon: FileText },
    { id: 'history', label: 'Histórico', icon: Calendar },
    { id: 'education', label: 'Educação', icon: MessageSquare }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/nutrition/athletes')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
              <p className="text-gray-600">{athlete.email} • {athlete.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Mensagem
            </button>
            <button
              onClick={() => navigate(`/nutrition/plans/edit/${athlete.currentPlan.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar Plano
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Scale className="h-5 w-5 text-gray-400" />
            <span className={`text-xs font-medium ${
              athlete.currentWeight < athlete.startWeight ? 'text-green-600' : 'text-red-600'
            }`}>
              {athlete.currentWeight < athlete.startWeight ? '↓' : '↑'}
              {Math.abs(athlete.currentWeight - athlete.startWeight).toFixed(1)}kg
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{athlete.currentWeight}kg</p>
          <p className="text-xs text-gray-600">Peso Atual</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-gray-400" />
            <span className="text-xs font-medium text-blue-600">{weightProgress}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{athlete.targetWeight}kg</p>
          <p className="text-xs text-gray-600">Objetivo</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{athlete.stats.adherence}%</p>
          <p className="text-xs text-gray-600">Adesão</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{athlete.stats.weeklyCheckIns}/7</p>
          <p className="text-xs text-gray-600">Check-ins Semana</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {Math.ceil((new Date(athlete.currentPlan.endDate) - new Date()) / (1000 * 60 * 60 * 24))}d
          </p>
          <p className="text-xs text-gray-600">Fim do Plano</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weight Progress */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-300 rounded-t relative">
                          <div
                            className="bg-blue-500 rounded-t absolute bottom-0 w-full"
                            style={{ height: `${80 - i * 5}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 mt-2">
                          {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
                            .toLocaleDateString('pt-PT', { day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Check-ins */}
                <h3 className="font-semibold text-gray-900 mb-4">Check-ins Recentes</h3>
                <div className="space-y-4">
                  {athlete.recentCheckIns.map((checkIn, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">
                          {new Date(checkIn.date).toLocaleDateString('pt-PT', { 
                            weekday: 'long', day: 'numeric', month: 'long' 
                          })}
                        </p>
                        <span className="text-lg font-bold">{checkIn.weight}kg</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-3 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Adesão</p>
                          <p className={`font-bold ${
                            checkIn.adherence >= 80 ? 'text-green-600' : 'text-yellow-600'
                          }`}>{checkIn.adherence}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Proteína</p>
                          <p className="font-bold text-green-600">{checkIn.macros.protein}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Carbs</p>
                          <p className="font-bold text-orange-600">{checkIn.macros.carbs}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Água</p>
                          <p className="font-bold text-blue-600">{checkIn.water}L</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Sono</p>
                          <p className="font-bold text-purple-600">{checkIn.sleep}h</p>
                        </div>
                      </div>
                      
                      {checkIn.notes && (
                        <p className="text-sm text-gray-600 italic">"{checkIn.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4">
                {/* Current Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Plano Atual</h4>
                  <p className="font-medium text-gray-900">{athlete.currentPlan.name}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(athlete.currentPlan.startDate).toLocaleDateString('pt-PT')} - 
                    {new Date(athlete.currentPlan.endDate).toLocaleDateString('pt-PT')}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Calorias</span>
                      <span className="font-medium">{athlete.currentPlan.calories} kcal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Proteína</span>
                      <span className="font-medium text-green-600">{athlete.currentPlan.protein}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Carboidratos</span>
                      <span className="font-medium text-orange-600">{athlete.currentPlan.carbs}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gordura</span>
                      <span className="font-medium text-yellow-600">{athlete.currentPlan.fat}g</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('plan')}
                    className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                  >
                    Ver Plano Completo
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Ações Rápidas</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        Gerar Relatório
                      </span>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button className="w-full px-3 py-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        Agendar Check-in
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Notas
                  </h4>
                  <p className="text-sm text-gray-700">
                    Cliente tem dificuldade com o pequeno-almoço. 
                    Considerar opções mais práticas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Plano Nutricional Detalhado</h3>
              <p className="text-gray-600">Vista detalhada do plano alimentar...</p>
              {/* Aqui entraria o componente de visualização do plano */}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Histórico Completo</h3>
              <p className="text-gray-600">Histórico de check-ins e evolução...</p>
              {/* Aqui entraria o componente de histórico */}
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Material Educativo</h3>
              <p className="text-gray-600">Recursos educacionais enviados...</p>
              {/* Aqui entraria o componente de educação */}
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enviar Mensagem para {athlete.name}
              </h3>
              <textarea
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escreva sua mensagem..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // TODO: Enviar mensagem
                    setShowMessageModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteDetailView;