import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Calendar,
  Target,
  Activity,
  Apple,
  MessageSquare,
  Clock,
  TrendingUp,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle,
  Plus,
  ChevronRight,
  Camera,
  FileText,
  Heart,
  Brain,
  Scale
} from 'lucide-react';

// Import dos componentes existentes
import MealChatComponent from '../components/MealChatComponent';
import CheckInForm from '../components/forms/CheckInForm';

const AthleteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMealChat, setShowMealChat] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [chatMinimized, setChatMinimized] = useState(false);

  // Mock data - substituir com API
  const [athlete] = useState({
    id: parseInt(id),
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+351 912 345 678',
    location: 'Lisboa, Portugal',
    avatar: null,
    age: 28,
    height: 175,
    weight: 75.5,
    weightGoal: 72,
    startWeight: 78,
    joinedDate: '2024-09-15',
    goal: 'Perder gordura',
    activityLevel: 'moderate',
    trainingDays: 5,
    status: 'active',
    compliance: {
      training: 92,
      nutrition: 88,
      checkin: 95
    },
    preferences: {
      allergies: ['Lactose'],
      dislikes: ['Brócolos', 'Couve-flor'],
      mealTiming: 'flexible',
      supplements: ['Whey Protein', 'Creatina', 'Multivitamínico']
    },
    notes: 'Prefere treinar de manhã. Tem compromisso com os resultados.',
    lastCheckIn: '2025-01-28',
    nextCheckIn: '2025-02-04'
  });

  const [activePlan] = useState({
    id: 1,
    name: 'Plano de Cutting Progressivo',
    type: 'cutting',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    calories: 2100,
    macros: {
      protein: 158,
      carbs: 210,
      fat: 70
    },
    meals: [
      {
        id: 1,
        name: 'Pequeno-almoço',
        time: '08:00',
        calories: 420,
        status: 'pending'
      },
      {
        id: 2,
        name: 'Almoço',
        time: '13:00',
        calories: 735,
        status: 'approved'
      },
      {
        id: 3,
        name: 'Lanche',
        time: '16:00',
        calories: 315,
        status: 'pending'
      },
      {
        id: 4,
        name: 'Jantar',
        time: '20:00',
        calories: 630,
        status: 'needs_review'
      }
    ]
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'meal_photo',
      meal: 'Almoço',
      time: '2 horas atrás',
      status: 'approved'
    },
    {
      id: 2,
      type: 'weight_update',
      value: '75.5kg',
      change: '-0.3kg',
      time: '1 dia atrás'
    },
    {
      id: 3,
      type: 'workout_complete',
      workout: 'Treino A - Peito/Tríceps',
      time: '1 dia atrás'
    }
  ]);

  const handleOpenMealChat = (meal) => {
    setSelectedMeal(meal);
    setShowMealChat(true);
    setChatMinimized(false);
  };

  const getMealStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'needs_review':
        return 'text-orange-600 bg-orange-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getMealStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'needs_review':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {athlete.avatar ? (
                    <img src={athlete.avatar} alt={athlete.name} className="h-12 w-12 rounded-full" />
                  ) : (
                    <User className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{athlete.name}</h1>
                  <p className="text-sm text-gray-600">{athlete.goal} • {athlete.age} anos</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Mail className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigate(`/nutrition/athlete/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4 inline mr-2" />
                Editar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'plan', label: 'Plano Atual' },
              { id: 'checkins', label: 'Check-ins' },
              { id: 'history', label: 'Histórico' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Plan Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Plano Ativo</h3>
                  <button
                    onClick={() => navigate(`/nutrition/plans/edit/${activePlan.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Ver detalhes
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Objetivo Diário</p>
                      <p className="text-2xl font-bold text-gray-900">{activePlan.calories} kcal</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-gray-600">Proteína</p>
                        <p className="font-semibold">{activePlan.macros.protein}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Carbos</p>
                        <p className="font-semibold">{activePlan.macros.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gordura</p>
                        <p className="font-semibold">{activePlan.macros.fat}g</p>
                      </div>
                    </div>
                  </div>

                  {/* Meals Status */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Refeições de Hoje</p>
                    <div className="space-y-2">
                      {activePlan.meals.map(meal => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleOpenMealChat(meal)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getMealStatusColor(meal.status)}`}>
                              {getMealStatusIcon(meal.status)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{meal.name}</p>
                              <p className="text-sm text-gray-500">{meal.time} • {meal.calories} kcal</p>
                            </div>
                          </div>
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {activity.type === 'meal_photo' && <Camera className="h-4 w-4 text-gray-600" />}
                        {activity.type === 'weight_update' && <Scale className="h-4 w-4 text-gray-600" />}
                        {activity.type === 'workout_complete' && <Activity className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.type === 'meal_photo' && `Foto do ${activity.meal} enviada`}
                          {activity.type === 'weight_update' && `Peso atualizado: ${activity.value} (${activity.change})`}
                          {activity.type === 'workout_complete' && `Completou: ${activity.workout}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Compliance Treino</span>
                      <span className="text-sm font-medium">{athlete.compliance.training}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${athlete.compliance.training}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Compliance Nutrição</span>
                      <span className="text-sm font-medium">{athlete.compliance.nutrition}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${athlete.compliance.nutrition}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Peso Atual</span>
                      <span className="font-medium">{athlete.weight} kg</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Objetivo</span>
                      <span className="font-medium">{athlete.weightGoal} kg</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-medium text-green-600">
                        -{(athlete.startWeight - athlete.weight).toFixed(1)} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{athlete.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{athlete.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{athlete.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
      </div>

      {/* Meal Chat Component */}
      {showMealChat && selectedMeal && (
        <MealChatComponent
          mealId={selectedMeal.id}
          mealName={selectedMeal.name}
          athleteId={athlete.id}
          athleteName={athlete.name}
          isMinimized={chatMinimized}
          onToggleMinimize={() => setChatMinimized(!chatMinimized)}
          position="floating"
        />
      )}
    </div>
  );
};

export default AthleteDetailView;