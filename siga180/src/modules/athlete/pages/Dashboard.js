import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Target,
  TrendingUp,
  Apple,
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Utensils,
  Droplets,
  Activity,
  Award,
  BarChart3,
  MessageSquare
} from 'lucide-react';

// Hooks
import { useAuth } from '../../shared/hooks/useAuth';
import { useMyNutritionPlan } from '../hooks/useMyPlan';
import { useMyMealsToday } from '../hooks/useMyPlan';
import { useMyProgress } from '../hooks/useMyProgress';
import { useMealLogging } from '../hooks/useMealLogging';
// Components
import MacroProgressBar from '../../shared/components/MacroProgressBar';
import QuickLogModal from '../components/QuickLogModal';
import MealPhotoUpload from '../components/MealPhotoUpload';

const AthleteDashboard = () => {
  const { user } = useAuth();
  const { plan, loading: planLoading } = useMyNutritionPlan();
  const { meals, totals, remaining } = useMyMealsToday();
  const { stats } = useMyProgress();
const { logMeal, uploadProgress: logging } = useMealLogging();
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  // Calculate compliance
  const calculateDayCompliance = () => {
    if (!plan) return 0;
    const calorieCompliance = Math.max(0, 100 - Math.abs((totals.calories - plan.calories) / plan.calories * 100));
    return Math.round(calorieCompliance);
  };

  const mealTypes = [
    { id: 'breakfast', name: 'Pequeno-almoço', icon: '☕', time: '08:00' },
    { id: 'lunch', name: 'Almoço', icon: '🍽️', time: '13:00' },
    { id: 'snack', name: 'Lanche', icon: '🥜', time: '16:00' },
    { id: 'dinner', name: 'Jantar', icon: '🍴', time: '20:00' }
  ];

  const handleQuickLog = (mealType) => {
    setSelectedMealType(mealType);
    setShowQuickLog(true);
  };

  const handlePhotoLog = (mealType) => {
    setSelectedMealType(mealType);
    setShowPhotoUpload(true);
  };

  if (planLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar o teu plano...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ainda não tens um plano nutricional
            </h2>
            <p className="text-gray-600 mb-6">
              Contacta o teu treinador para criar um plano personalizado para ti.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="h-5 w-5 inline mr-2" />
              Contactar Treinador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user?.name?.split(' ')[0]}! 💪
              </h1>
              <p className="text-gray-600 mt-1">
                {remaining.calories > 0 
                  ? `Faltam ${remaining.calories} kcal para hoje`
                  : remaining.calories < 0
                  ? `Excedeste ${Math.abs(remaining.calories)} kcal hoje`
                  : 'Objetivo calórico atingido! 🎉'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>Sequência</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats?.streak || 0} dias</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Daily Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Progresso Diário</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              calculateDayCompliance() >= 90 ? 'bg-green-100 text-green-700' :
              calculateDayCompliance() >= 70 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {calculateDayCompliance()}% Aderência
            </span>
          </div>

          <div className="space-y-4">
            <MacroProgressBar
              label="Calorias"
              current={totals.calories}
              target={plan.calories}
              unit="kcal"
              color="blue"
            />
            <MacroProgressBar
              label="Proteína"
              current={totals.protein}
              target={plan.protein}
              unit="g"
              color="green"
            />
            <MacroProgressBar
              label="Carboidratos"
              current={totals.carbs}
              target={plan.carbs}
              unit="g"
              color="orange"
            />
            <MacroProgressBar
              label="Gordura"
              current={totals.fat}
              target={plan.fat}
              unit="g"
              color="yellow"
            />
          </div>

          {/* Water & Fiber */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Água</span>
              </div>
              <span className="text-sm font-bold text-blue-700">
                {totals.water || 0} / {plan.water || 2500}ml
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Fibra</span>
              </div>
              <span className="text-sm font-bold text-green-700">
                {totals.fiber || 0} / {plan.fiber || 25}g
              </span>
            </div>
          </div>
        </div>

        {/* Quick Log Meals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registar Refeições</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mealTypes.map(mealType => {
              const meal = meals.find(m => m.meal_type === mealType.id);
              const isLogged = !!meal;
              
              return (
                <div key={mealType.id} className="relative">
                  <button
                    onClick={() => !isLogged && handlePhotoLog(mealType.id)}
                    disabled={isLogged || logging}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      isLogged
                        ? 'border-green-500 bg-green-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mealType.icon}</div>
                    <p className="text-sm font-medium text-gray-900">{mealType.name}</p>
                    <p className="text-xs text-gray-500">{mealType.time}</p>
                    {isLogged && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </button>
                  
                  {!isLogged && (
                    <button
                      onClick={() => handleQuickLog(mealType.id)}
                      className="absolute -bottom-2 -right-2 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow"
                      title="Registo rápido"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Refeições de Hoje</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Ver histórico
            </button>
          </div>

          {meals.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Ainda não registaste nenhuma refeição hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map(meal => (
                <MealItem key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-500">Objetivo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{plan.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              Termina em {Math.ceil((new Date(plan.end_date) - new Date()) / (1000 * 60 * 60 * 24))} dias
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-500">Progresso</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.weightChange ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange}kg` : '---'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Desde o início</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-500">Check-in</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.nextCheckIn ? new Date(stats.nextCheckIn).toLocaleDateString('pt-PT') : '---'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Próximo check-in</p>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {showQuickLog && (
        <QuickLogModal
          mealType={selectedMealType}
          onClose={() => setShowQuickLog(false)}
          onSave={(mealData) => {
            logMeal(mealData);
            setShowQuickLog(false);
          }}
        />
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <MealPhotoUpload
          mealType={selectedMealType}
          onClose={() => setShowPhotoUpload(false)}
          onUpload={async (photo, description) => {
            await logMeal({
              meal_type: selectedMealType,
              description
            }, photo);
            setShowPhotoUpload(false);
          }}
        />
      )}
    </div>
  );
};

// Meal Item Component
const MealItem = ({ meal }) => {
  const getMealIcon = (type) => {
    const icons = {
      breakfast: '☕',
      lunch: '🍽️',
      snack: '🥜',
      dinner: '🍴'
    };
    return icons[type] || '🍴';
  };

  const getMealName = (type) => {
    const names = {
      breakfast: 'Pequeno-almoço',
      lunch: 'Almoço',
      snack: 'Lanche',
      dinner: 'Jantar'
    };
    return names[type] || type;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Aprovado
          </span>
        );
      case 'needs_review':
        return (
          <span className="flex items-center gap-1 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3" />
            Precisa revisão
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{getMealIcon(meal.meal_type)}</div>
        <div>
          <p className="font-medium text-gray-900">{getMealName(meal.meal_type)}</p>
          <p className="text-sm text-gray-600">
            {meal.time || '--:--'} • {meal.calories || 0} kcal
            {meal.photo_url && ' • 📷'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {getStatusBadge(meal.status)}
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default AthleteDashboard;