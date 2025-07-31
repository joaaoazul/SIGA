import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Apple,
  Clock,
  Edit,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Droplets,
  Scale,
  FileText,
  BarChart3,
  ChevronRight,
  Download,
  Send,
  MessageSquare
} from 'lucide-react';

const AthleteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [athlete, setAthlete] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAthleteData();
  }, [id]);

  const fetchAthleteData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [athleteRes, planRes, checkInsRes] = await Promise.all([
      //   nutritionAPI.getAthlete(id),
      //   nutritionAPI.getActivePlan(id),
      //   nutritionAPI.getCheckIns(id)
      // ]);
      
      // Mock data
      const mockAthlete = {
        id: parseInt(id),
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+351 912 345 678',
        age: 28,
        gender: 'Masculino',
        height: 175,
        currentWeight: 78.5,
        targetWeight: 82,
        goal: 'Ganho de Massa',
        activityLevel: 'Moderado',
        avatar: 'https://i.pravatar.cc/150?img=1',
        joinedDate: '2024-06-15',
        notes: 'Atleta dedicado, treina 5x por semana. Sem restrições alimentares.',
        preferences: {
          mealTiming: 'flexible',
          allergies: [],
          dislikes: ['Brócolos'],
          supplements: ['Whey Protein', 'Creatina']
        }
      };

      const mockPlan = {
        id: 1,
        name: 'Bulking 3500kcal',
        type: 'bulking',
        startDate: '2025-01-01',
        status: 'active',
        targets: {
          calories: 3500,
          protein: 175,
          carbs: 437,
          fat: 117,
          fiber: 35,
          water: 3500
        },
        mealDistribution: [
          { name: 'Pequeno-almoço', percentage: 20, time: '08:00' },
          { name: 'Meio da manhã', percentage: 15, time: '10:30' },
          { name: 'Almoço', percentage: 25, time: '13:00' },
          { name: 'Lanche', percentage: 15, time: '16:00' },
          { name: 'Jantar', percentage: 20, time: '20:00' },
          { name: 'Ceia', percentage: 5, time: '22:00' }
        ],
        compliance: {
          overall: 92,
          weekly: [95, 90, 93, 91, 89, 94, 92],
          byMacro: {
            calories: 94,
            protein: 96,
            carbs: 88,
            fat: 92
          }
        }
      };

      const mockCheckIns = [
        {
          id: 1,
          date: '2025-01-25',
          weight: 78.5,
          bodyFat: 16.2,
          muscleMass: 39.8,
          waterPercentage: 58.5,
          visceralFat: 4,
          measurements: {
            chest: 104,
            waist: 81,
            hips: 98,
            armRight: 36.5,
            armLeft: 36,
            thighRight: 58,
            thighLeft: 57.5
          },
          photos: {
            front: true,
            side: true,
            back: true
          },
          compliance: {
            meals: 92,
            training: 90,
            hydration: 95,
            sleep: 85,
            supplements: 100
          },
          energy: 4, // 1-5
          hunger: 3, // 1-5
          digestion: 5, // 1-5
          mood: 4, // 1-5
          notes: 'Semana produtiva, energia boa. Ligeira retenção no fim de semana.'
        },
        {
          id: 2,
          date: '2025-01-18',
          weight: 78.2,
          bodyFat: 16.4,
          muscleMass: 39.5,
          waterPercentage: 58.2,
          visceralFat: 4,
          measurements: {
            chest: 103.5,
            waist: 81.5,
            hips: 98,
            armRight: 36,
            armLeft: 35.8,
            thighRight: 57.5,
            thighLeft: 57.5
          },
          photos: {
            front: true,
            side: true,
            back: false
          },
          compliance: {
            meals: 88,
            training: 85,
            hydration: 90,
            sleep: 80,
            supplements: 95
          },
          energy: 3,
          hunger: 4,
          digestion: 4,
          mood: 3,
          notes: 'Semana mais stressante no trabalho, afetou o sono.'
        }
      ];

      setTimeout(() => {
        setAthlete(mockAthlete);
        setActivePlan(mockPlan);
        setCheckIns(mockCheckIns);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching athlete data:', error);
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!athlete || checkIns.length < 2) return null;
    
    const latestWeight = checkIns[0].weight;
    const previousWeight = checkIns[1].weight;
    const weightChange = latestWeight - previousWeight;
    const percentageChange = ((weightChange / previousWeight) * 100).toFixed(1);
    
    return {
      weightChange,
      percentageChange,
      daysRemaining: Math.round((athlete.targetWeight - latestWeight) / 0.5 * 7), // Assuming 0.5kg/week
      progressPercentage: ((latestWeight - 75) / (athlete.targetWeight - 75) * 100).toFixed(0) // Assuming start weight was 75kg
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">Atleta não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/nutrition/athletes')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar aos Atletas
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="h-16 w-16 rounded-full mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
              <p className="text-gray-600">{athlete.email} • {athlete.phone}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-gray-500">
                  {athlete.age} anos • {athlete.height}cm • {athlete.currentWeight}kg
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {athlete.goal}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate('/messages?userId=' + athlete.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Enviar Mensagem"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate(`/athletes/${athlete.id}/edit`)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Editar Atleta"
            >
              <Edit className="h-5 w-5" />
            </button>
            <div className="relative">
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Mais Opções"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Peso Atual</span>
              <Scale className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{athlete.currentWeight}kg</p>
            <p className={`text-sm mt-1 ${progress.weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {progress.weightChange > 0 && '+'}{progress.weightChange}kg esta semana
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Objetivo</span>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{athlete.targetWeight}kg</p>
            <p className="text-sm text-gray-600 mt-1">
              {Math.abs(athlete.targetWeight - athlete.currentWeight)}kg restantes
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{progress.progressPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Compliance</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{activePlan?.compliance.overall}%</p>
            <p className="text-sm text-gray-600 mt-1">Média semanal</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'plan', 'checkins', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Visão Geral'}
                {tab === 'plan' && 'Plano Nutricional'}
                {tab === 'checkins' && 'Check-ins'}
                {tab === 'analytics' && 'Análises'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Plan Summary */}
              {activePlan ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Plano Ativo</h3>
                    <button 
                      onClick={() => navigate(`/nutrition/plans/edit/${activePlan.id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Editar Plano
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Calorias</p>
                      <p className="text-lg font-semibold">{activePlan.targets.calories} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Proteína</p>
                      <p className="text-lg font-semibold">{activePlan.targets.protein}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carboidratos</p>
                      <p className="text-lg font-semibold">{activePlan.targets.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gordura</p>
                      <p className="text-lg font-semibold">{activePlan.targets.fat}g</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Distribuição de Refeições</p>
                    <div className="space-y-1">
                      {activePlan.mealDistribution.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{meal.name}</span>
                          <span className="text-gray-600">{meal.time} • {meal.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800">Este atleta não tem um plano nutricional ativo</p>
                  </div>
                  <button
                    onClick={() => navigate('/nutrition/plans/create?athleteId=' + athlete.id)}
                    className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Criar Plano
                  </button>
                </div>
              )}

              {/* Latest Check-in */}
              {checkIns.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Último Check-in</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        {new Date(checkIns[0].date).toLocaleDateString('pt-PT', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <button 
                        onClick={() => navigate(`/nutrition/athlete/${athlete.id}/checkin/${checkIns[0].id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver Detalhes
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Peso</p>
                        <p className="text-lg font-semibold">{checkIns[0].weight}kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">% Gordura</p>
                        <p className="text-lg font-semibold">{checkIns[0].bodyFat}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Massa Muscular</p>
                        <p className="text-lg font-semibold">{checkIns[0].muscleMass}kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">% Água</p>
                        <p className="text-lg font-semibold">{checkIns[0].waterPercentage}%</p>
                      </div>
                    </div>

                    {checkIns[0].notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Notas:</p>
                        <p className="text-sm text-gray-800 mt-1">{checkIns[0].notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences & Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Preferências e Notas</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {athlete.preferences.allergies.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Alergias:</p>
                      <p className="text-sm text-gray-800">{athlete.preferences.allergies.join(', ')}</p>
                    </div>
                  )}
                  {athlete.preferences.dislikes.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Não gosta:</p>
                      <p className="text-sm text-gray-800">{athlete.preferences.dislikes.join(', ')}</p>
                    </div>
                  )}
                  {athlete.preferences.supplements.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Suplementos:</p>
                      <p className="text-sm text-gray-800">{athlete.preferences.supplements.join(', ')}</p>
                    </div>
                  )}
                  {athlete.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notas gerais:</p>
                      <p className="text-sm text-gray-800">{athlete.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Plan Tab */}
          {activeTab === 'plan' && (
            <div>
              {activePlan ? (
                <div className="space-y-6">
                  {/* Plan details implementation here */}
                  <p className="text-gray-600">Detalhes completos do plano nutricional...</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Sem plano nutricional ativo</p>
                  <button
                    onClick={() => navigate('/nutrition/plans/create?athleteId=' + athlete.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar Novo Plano
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Check-ins Tab */}
          {activeTab === 'checkins' && (
            <div>
              {checkIns.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Histórico de Check-ins</h3>
                    <button
                      onClick={() => navigate(`/nutrition/athlete/${athlete.id}/checkin/new`)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Novo Check-in
                    </button>
                  </div>
                  {checkIns.map((checkIn) => (
                    <div 
                      key={checkIn.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/nutrition/athlete/${athlete.id}/checkin/${checkIn.id}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900">
                          {new Date(checkIn.date).toLocaleDateString('pt-PT')}
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Peso:</span>
                          <span className="ml-1 font-medium">{checkIn.weight}kg</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gordura:</span>
                          <span className="ml-1 font-medium">{checkIn.bodyFat}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Compliance:</span>
                          <span className="ml-1 font-medium">{checkIn.compliance.meals}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Energia:</span>
                          <span className="ml-1 font-medium">{checkIn.energy}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Ainda sem check-ins registados</p>
                  <button
                    onClick={() => navigate(`/nutrition/athlete/${athlete.id}/checkin/new`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Registar Primeiro Check-in
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Análises e gráficos em desenvolvimento...</p>
                <button
                  onClick={() => navigate('/nutrition/analytics')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Ver Análises Gerais
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AthleteDetailView;