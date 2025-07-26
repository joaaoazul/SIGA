import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Search, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  Save,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Users,
  FileText,
  Copy,
  Send,
  Eye,
  Download,
  Clock,
  CheckCircle,
  User,
  Activity,
  Settings,
  Filter,
  MoreVertical,
  Zap,
  Award
} from 'lucide-react';

// Componente Principal - Nutrição para Personal Trainer
const NutritionPageTrainer = () => {
  const [activeView, setActiveView] = useState('athletes');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data de atletas
  const [athletes] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: null,
      age: 28,
      weight: 75,
      height: 178,
      goal: 'Perder gordura',
      nutritionPlan: {
        name: 'Plano de Cutting',
        type: 'cutting',
        calories: 2400,
        protein: 180,
        carbs: 240,
        fat: 80,
        startDate: '2024-01-15',
        lastUpdate: '2024-01-26',
        weeklyCheckIn: true,
        progress: {
          weightChange: -2.5,
          compliance: 85
        }
      }
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: null,
      age: 25,
      weight: 58,
      height: 165,
      goal: 'Ganhar massa muscular',
      nutritionPlan: {
        name: 'Plano de Bulking',
        type: 'bulking',
        calories: 2200,
        protein: 110,
        carbs: 280,
        fat: 70,
        startDate: '2024-01-10',
        lastUpdate: '2024-01-25',
        weeklyCheckIn: true,
        progress: {
          weightChange: +1.2,
          compliance: 92
        }
      }
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      avatar: null,
      age: 35,
      weight: 82,
      height: 175,
      goal: 'Manter peso',
      nutritionPlan: null
    }
  ]);

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão Nutricional</h1>
          <p className="text-gray-600 mt-2">Crie e acompanhe planos nutricionais personalizados</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Atletas</p>
                <p className="text-2xl font-bold text-gray-900">{athletes.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Com Plano Ativo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {athletes.filter(a => a.nutritionPlan).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Check-ins Hoje</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-gray-900">88%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveView('athletes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === 'athletes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Atletas
              </button>
              <button
                onClick={() => setActiveView('plans')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === 'plans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Planos Ativos
              </button>
              <button
                onClick={() => setActiveView('templates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Templates
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeView === 'athletes' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar atletas..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowCreatePlan(true)}
                  className="ml-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Plano
                </button>
              </div>
            </div>

            {/* Athletes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map(athlete => (
                <div key={athlete.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {athlete.avatar ? (
                            <img src={athlete.avatar} alt={athlete.name} className="h-12 w-12 rounded-full" />
                          ) : (
                            <User className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
                          <p className="text-sm text-gray-500">{athlete.goal}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    {athlete.nutritionPlan ? (
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">{athlete.nutritionPlan.name}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              athlete.nutritionPlan.progress.compliance >= 90 
                                ? 'bg-green-100 text-green-800' 
                                : athlete.nutritionPlan.progress.compliance >= 70
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {athlete.nutritionPlan.progress.compliance}% compliance
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-gray-500">Calorias</p>
                              <p className="font-semibold">{athlete.nutritionPlan.calories}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Proteína</p>
                              <p className="font-semibold">{athlete.nutritionPlan.protein}g</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Progresso</p>
                              <p className={`font-semibold ${
                                athlete.nutritionPlan.progress.weightChange < 0 
                                  ? 'text-green-600' 
                                  : 'text-blue-600'
                              }`}>
                                {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                                {athlete.nutritionPlan.progress.weightChange}kg
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            Atualizado há {Math.floor((new Date() - new Date(athlete.nutritionPlan.lastUpdate)) / (1000 * 60 * 60 * 24))} dias
                          </span>
                          {athlete.nutritionPlan.weeklyCheckIn && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedAthlete(athlete)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            Ver Detalhes
                          </button>
                          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                            Editar Plano
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-3">Sem plano nutricional</p>
                        <button
                          onClick={() => {
                            setSelectedAthlete(athlete);
                            setShowCreatePlan(true);
                          }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          Criar Plano
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'plans' && (
          <ActivePlansView athletes={athletes.filter(a => a.nutritionPlan)} />
        )}

        {activeView === 'templates' && (
          <TemplatesView onUseTemplate={() => setShowCreatePlan(true)} />
        )}
      </div>

      {/* Modals */}
      {showCreatePlan && (
        <CreatePlanModal 
          onClose={() => setShowCreatePlan(false)}
          selectedAthlete={selectedAthlete}
          athletes={athletes}
        />
      )}

      {selectedAthlete && !showCreatePlan && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
        />
      )}
    </div>
  );
};

// Component: Active Plans View
const ActivePlansView = ({ athletes }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Atleta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plano
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Macros (P/C/G)
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progresso
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compliance
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Atualização
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                    <div className="text-sm text-gray-500">{athlete.goal}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-gray-900">{athlete.nutritionPlan.name}</div>
                  <div className="text-sm text-gray-500">{athlete.nutritionPlan.calories} kcal</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                {athlete.nutritionPlan.protein}/{athlete.nutritionPlan.carbs}/{athlete.nutritionPlan.fat}g
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-medium ${
                  athlete.nutritionPlan.progress.weightChange < 0 
                    ? 'text-green-600' 
                    : 'text-blue-600'
                }`}>
                  {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                  {athlete.nutritionPlan.progress.weightChange}kg
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  athlete.nutritionPlan.progress.compliance >= 90 
                    ? 'bg-green-100 text-green-800' 
                    : athlete.nutritionPlan.progress.compliance >= 70
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {athlete.nutritionPlan.progress.compliance}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {new Date(athlete.nutritionPlan.lastUpdate).toLocaleDateString('pt-PT')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 mr-3">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component: Templates View
const TemplatesView = ({ onUseTemplate }) => {
  const templates = [
    {
      id: 1,
      name: 'Cutting - Perda de Gordura',
      description: 'Défice calórico moderado com alta proteína para preservar massa muscular',
      type: 'cutting',
      macros: { protein: '2.2g/kg', carbs: '30-35%', fat: '25-30%' },
      calories: '75-80% TDEE',
      duration: '8-12 semanas',
      color: 'red'
    },
    {
      id: 2,
      name: 'Bulking - Ganho de Massa',
      description: 'Superávit calórico controlado para maximizar ganho muscular',
      type: 'bulking',
      macros: { protein: '1.8g/kg', carbs: '45-50%', fat: '25-30%' },
      calories: '110-120% TDEE',
      duration: '12-16 semanas',
      color: 'blue'
    },
    {
      id: 3,
      name: 'Manutenção',
      description: 'Manter peso e composição corporal atual',
      type: 'maintenance',
      macros: { protein: '2g/kg', carbs: '40-45%', fat: '30-35%' },
      calories: '100% TDEE',
      duration: 'Indefinido',
      color: 'green'
    },
    {
      id: 4,
      name: 'Recomposição Corporal',
      description: 'Perder gordura e ganhar músculo simultaneamente',
      type: 'recomp',
      macros: { protein: '2.4g/kg', carbs: '35-40%', fat: '25-30%' },
      calories: '95-100% TDEE',
      duration: '16-20 semanas',
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-50 border-red-200 hover:border-red-300',
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      green: 'bg-green-50 border-green-200 hover:border-green-300',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map(template => (
        <div 
          key={template.id} 
          className={`${getColorClasses(template.color)} border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer`}
          onClick={() => onUseTemplate(template)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
            <Zap className={`h-6 w-6 ${
              template.color === 'red' ? 'text-red-600' :
              template.color === 'blue' ? 'text-blue-600' :
              template.color === 'green' ? 'text-green-600' :
              'text-purple-600'
            }`} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Calorias:</span>
              <span className="font-medium">{template.calories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Proteína:</span>
              <span className="font-medium">{template.macros.protein}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Carboidratos:</span>
              <span className="font-medium">{template.macros.carbs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gordura:</span>
              <span className="font-medium">{template.macros.fat}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duração:</span>
              <span className="font-medium">{template.duration}</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Usar Template
          </button>
        </div>
      ))}
    </div>
  );
};

// Modal: Create Plan
const CreatePlanModal = ({ onClose, selectedAthlete, athletes }) => {
  const [step, setStep] = useState(1);
  const [planData, setPlanData] = useState({
    athleteId: selectedAthlete?.id || '',
    name: '',
    type: 'maintenance',
    duration: 'mensal',
    tdee: 0,
    calories: 0,
    proteinPerKg: 2,
    carbsPercentage: 40,
    fatPercentage: 30,
    fiberTarget: 38,
    waterTarget: 3000
  });

  // Calculate TDEE based on athlete data
  useEffect(() => {
    if (selectedAthlete) {
      // Simplified TDEE calculation
      const bmr = selectedAthlete.weight * 24; // Very simplified
      const tdee = Math.round(bmr * 1.5); // Moderate activity
      setPlanData(prev => ({ ...prev, tdee, calories: tdee }));
    }
  }, [selectedAthlete]);

  const calculateMacros = () => {
    const protein = Math.round(selectedAthlete?.weight * planData.proteinPerKg || 0);
    const proteinCalories = protein * 4;
    
    const carbsCalories = (planData.calories * planData.carbsPercentage) / 100;
    const carbs = Math.round(carbsCalories / 4);
    
    const fatCalories = (planData.calories * planData.fatPercentage) / 100;
    const fat = Math.round(fatCalories / 9);
    
    return { protein, carbs, fat };
  };

  const macros = calculateMacros();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Criar Plano Nutricional
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Informações Básicas</h4>
              
              {!selectedAthlete && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Atleta
                  </label>
                  <select
                    value={planData.athleteId}
                    onChange={(e) => setPlanData({ ...planData, athleteId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Escolher atleta...</option>
                    {athletes.map(athlete => (
                      <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={planData.name}
                  onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                  placeholder="Ex: Plano de Verão 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Plano
                  </label>
                  <select
                    value={planData.type}
                    onChange={(e) => setPlanData({ ...planData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cutting">Cutting</option>
                    <option value="bulking">Bulking</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="recomp">Recomposição</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração
                  </label>
                  <select
                    value={planData.duration}
                    onChange={(e) => setPlanData({ ...planData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Configuração de Macros</h4>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">TDEE Estimado</p>
                    <p className="text-2xl font-bold text-gray-900">{planData.tdee} kcal</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorias Diárias
                </label>
                <input
                  type="number"
                  value={planData.calories}
                  onChange={(e) => setPlanData({ ...planData, calories: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proteína (g/kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={planData.proteinPerKg}
                    onChange={(e) => setPlanData({ ...planData, proteinPerKg: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{macros.protein}g total</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carboidratos (%)
                  </label>
                  <input
                    type="number"
                    value={planData.carbsPercentage}
                    onChange={(e) => setPlanData({ ...planData, carbsPercentage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{macros.carbs}g total</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gordura (%)
                  </label>
                  <input
                    type="number"
                    value={planData.fatPercentage}
                    onChange={(e) => setPlanData({ ...planData, fatPercentage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{macros.fat}g total</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fibra (g/dia)
                  </label>
                  <input
                    type="number"
                    value={planData.fiberTarget}
                    onChange={(e) => setPlanData({ ...planData, fiberTarget: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Água (ml/dia)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={planData.waterTarget}
                    onChange={(e) => setPlanData({ ...planData, waterTarget: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              step === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Anterior
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Próximo
              </button>
            ) : (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Criar Plano
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal: Athlete Detail
const AthleteDetailModal = ({ athlete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{athlete.name}</h3>
              <p className="text-sm text-gray-500">Detalhes do Plano Nutricional</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {athlete.nutritionPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Compliance Média</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {athlete.nutritionPlan.progress.compliance}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Progresso de Peso</p>
                  <p className={`text-2xl font-bold ${
                    athlete.nutritionPlan.progress.weightChange < 0 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`}>
                    {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                    {athlete.nutritionPlan.progress.weightChange}kg
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Dias no Plano</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor((new Date() - new Date(athlete.nutritionPlan.startDate)) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Distribuição de Macros</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Calorias</p>
                      <p className="text-xl font-bold text-blue-600">{athlete.nutritionPlan.calories}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Proteína</p>
                      <p className="text-xl font-bold text-green-600">{athlete.nutritionPlan.protein}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carboidratos</p>
                      <p className="text-xl font-bold text-orange-600">{athlete.nutritionPlan.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gordura</p>
                      <p className="text-xl font-bold text-yellow-600">{athlete.nutritionPlan.fat}g</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Editar Plano
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Ver Relatório
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionPageTrainer;