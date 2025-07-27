// src/modules/trainer/pages/Nutrition/components/MealsView.js
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Eye,
  MessageSquare,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Utensils,
  Droplets,
  Flame,
  TrendingUp,
  TrendingDown,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  Search,
  User
} from 'lucide-react';
import MealCard from './cards/MealCard';

const MealsView = ({ athletes }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAthlete, setSelectedAthlete] = useState('all');
  const [mealFilter, setMealFilter] = useState('all');
  const [showCreateMeal, setShowCreateMeal] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // timeline or grid

  // Filtrar atletas com plano nutricional
  const athletesWithPlans = athletes.filter(a => a.nutritionPlan);

  // Mock data de refeições para a data selecionada
  const getMealsForDate = (date) => {
    // Aqui viria da API/Context
    return [
      {
        id: 1,
        athleteName: 'João Silva',
        athleteId: 1,
        date: date.toISOString().split('T')[0],
        planCalories: 2400,
        planProtein: 180,
        planCarbs: 240,
        planFat: 80,
        meals: [
          {
            type: 'breakfast',
            time: '08:00',
            foods: [
              { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
              { name: 'Banana', quantity: 1, unit: 'unidade', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
              { name: 'Whey Protein', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1.5 }
            ],
            totals: { calories: 614, protein: 42.2, carbs: 96.3, fat: 8.8 },
            notes: 'Pré-treino',
            photo: null,
            logged: true
          },
          {
            type: 'lunch',
            time: '13:00',
            foods: [
              { name: 'Peito de Frango', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7.2 },
              { name: 'Arroz Integral', quantity: 150, unit: 'g', calories: 165, protein: 3.5, carbs: 34.5, fat: 1.2 },
              { name: 'Brócolos', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
            ],
            totals: { calories: 529, protein: 68.3, carbs: 41.5, fat: 8.8 },
            notes: 'Refeição pós-treino',
            photo: null,
            logged: true
          },
          {
            type: 'snack',
            time: '16:00',
            foods: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            notes: '',
            photo: null,
            logged: false
          },
          {
            type: 'dinner',
            time: '20:00',
            foods: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            notes: '',
            photo: null,
            logged: false
          }
        ],
        dailyTotals: { calories: 1143, protein: 110.5, carbs: 137.8, fat: 17.6 },
        compliance: 75,
        water: 1.8,
        notes: 'Dia de treino de pernas.',
        weight: 74.8,
        photos: []
      },
      {
        id: 2,
        athleteName: 'Maria Santos',
        athleteId: 2,
        date: date.toISOString().split('T')[0],
        planCalories: 2200,
        planProtein: 110,
        planCarbs: 280,
        planFat: 70,
        meals: [
          {
            type: 'breakfast',
            time: '07:30',
            foods: [
              { name: 'Pão Integral', quantity: 60, unit: 'g', calories: 150, protein: 6, carbs: 28, fat: 2 },
              { name: 'Ovos', quantity: 2, unit: 'unidades', calories: 140, protein: 12, carbs: 2, fat: 10 },
              { name: 'Abacate', quantity: 50, unit: 'g', calories: 80, protein: 1, carbs: 4.3, fat: 7.4 }
            ],
            totals: { calories: 370, protein: 19, carbs: 34.3, fat: 19.4 },
            notes: '',
            photo: null,
            logged: true
          }
        ],
        dailyTotals: { calories: 370, protein: 19, carbs: 34.3, fat: 19.4 },
        compliance: 92,
        water: 2.5,
        notes: '',
        weight: 58.2,
        photos: []
      }
    ];
  };

  const mealsData = getMealsForDate(selectedDate);

  // Filtrar refeições
  const filteredMeals = mealsData.filter(athleteMeals => {
    if (selectedAthlete !== 'all' && athleteMeals.athleteId.toString() !== selectedAthlete) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <MealsHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        athletesWithPlans={athletesWithPlans}
        selectedAthlete={selectedAthlete}
        setSelectedAthlete={setSelectedAthlete}
        mealFilter={mealFilter}
        setMealFilter={setMealFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateMeal={() => setShowCreateMeal(true)}
      />

      {/* Daily Summary Stats */}
      <DailySummary meals={filteredMeals} />

      {/* Meals Display */}
      {viewMode === 'timeline' ? (
        <MealsTimeline meals={filteredMeals} />
      ) : (
        <MealsGrid meals={filteredMeals} />
      )}

      {/* Empty State */}
      {filteredMeals.length === 0 && (
        <EmptyState selectedDate={selectedDate} />
      )}
    </div>
  );
};

// Header Component
const MealsHeader = ({
  selectedDate,
  setSelectedDate,
  athletesWithPlans,
  selectedAthlete,
  setSelectedAthlete,
  mealFilter,
  setMealFilter,
  viewMode,
  setViewMode,
  onCreateMeal
}) => {
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-900">Diários Alimentares</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigateDate(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isToday 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {selectedDate.toLocaleDateString('pt-PT', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </button>
            <button 
              onClick={() => navigateDate(1)}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isToday}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Athlete Filter */}
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todos os atletas</option>
            {athletesWithPlans.map(athlete => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.name}
              </option>
            ))}
          </select>

          {/* Meal Filter */}
          <select
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todas as refeições</option>
            <option value="breakfast">Pequeno-almoço</option>
            <option value="lunch">Almoço</option>
            <option value="snack">Lanche</option>
            <option value="dinner">Jantar</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'timeline' 
                  ? 'bg-white shadow' 
                  : ''
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'grid' 
                  ? 'bg-white shadow' 
                  : ''
              }`}
            >
              Grid
            </button>
          </div>

          {/* Actions */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onCreateMeal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Registar Refeição
          </button>
        </div>
      </div>
    </div>
  );
};

// Daily Summary Component
const DailySummary = ({ meals }) => {
  const totalStats = meals.reduce((acc, athlete) => {
    return {
      totalAthletes: acc.totalAthletes + 1,
      avgCompliance: acc.avgCompliance + athlete.compliance,
      totalLogged: acc.totalLogged + athlete.meals.filter(m => m.logged).length,
      totalMissing: acc.totalMissing + athlete.meals.filter(m => !m.logged).length,
      avgWater: acc.avgWater + athlete.water
    };
  }, { totalAthletes: 0, avgCompliance: 0, totalLogged: 0, totalMissing: 0, avgWater: 0 });

  if (meals.length > 0) {
    totalStats.avgCompliance = Math.round(totalStats.avgCompliance / meals.length);
    totalStats.avgWater = (totalStats.avgWater / meals.length).toFixed(1);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{totalStats.totalAthletes}</p>
        <p className="text-sm text-gray-600">Atletas ativos</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{totalStats.avgCompliance}%</p>
        <p className="text-sm text-gray-600">Aderência média</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Utensils className="h-8 w-8 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{totalStats.totalLogged}</p>
        <p className="text-sm text-gray-600">Refeições registadas</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{totalStats.totalMissing}</p>
        <p className="text-sm text-gray-600">Por registar</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{totalStats.avgWater}L</p>
        <p className="text-sm text-gray-600">Água média</p>
      </div>
    </div>
  );
};

// Meals Timeline View
const MealsTimeline = ({ meals }) => {
  return (
    <div className="space-y-6">
      {meals.map(athleteMeals => (
        <AthleteMealsCard key={athleteMeals.id} athleteMeals={athleteMeals} />
      ))}
    </div>
  );
};

// Athlete Meals Card Component
const AthleteMealsCard = ({ athleteMeals }) => {
  const complianceColor = athleteMeals.compliance >= 90 ? 'text-green-600' :
                         athleteMeals.compliance >= 80 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{athleteMeals.athleteName}</h4>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>Consumido: {athleteMeals.dailyTotals.calories} kcal</span>
              <span className={complianceColor}>Aderência: {athleteMeals.compliance}%</span>
              <span>Água: {athleteMeals.water}L</span>
              {athleteMeals.weight && <span>Peso: {athleteMeals.weight}kg</span>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Eye className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Daily Macros Summary vs Plan */}
        <MacrosComparison 
          actual={athleteMeals.dailyTotals}
          plan={{
            calories: athleteMeals.planCalories,
            protein: athleteMeals.planProtein,
            carbs: athleteMeals.planCarbs,
            fat: athleteMeals.planFat
          }}
        />

        {/* Meals List */}
        <div className="space-y-4 mt-6">
          {athleteMeals.meals.map((meal, mealIndex) => (
            <MealItem key={mealIndex} meal={meal} />
          ))}
        </div>

        {/* Notes */}
        {athleteMeals.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Notas:</strong> {athleteMeals.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Macros Comparison Component
const MacrosComparison = ({ actual, plan }) => {
  const macros = [
    {
      name: 'Calorias',
      actual: actual.calories,
      plan: plan.calories,
      unit: '',
      color: 'blue'
    },
    {
      name: 'Proteína',
      actual: actual.protein,
      plan: plan.protein,
      unit: 'g',
      color: 'green'
    },
    {
      name: 'Carboidratos',
      actual: actual.carbs,
      plan: plan.carbs,
      unit: 'g',
      color: 'orange'
    },
    {
      name: 'Gordura',
      actual: actual.fat,
      plan: plan.fat,
      unit: 'g',
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {macros.map((macro, index) => {
        const percentage = Math.round((macro.actual / macro.plan) * 100) || 0;
        const diff = macro.actual - macro.plan;
        const isOver = diff > 0;

        return (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-600">{macro.name}</p>
            <p className={`text-2xl font-bold text-${macro.color}-600`}>
              {macro.actual}{macro.unit}
            </p>
            <p className="text-xs text-gray-500">de {macro.plan}{macro.unit}</p>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${macro.color}-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${isOver ? 'text-red-600' : 'text-gray-600'}`}>
                {isOver ? '+' : ''}{diff}{macro.unit} ({percentage}%)
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Meal Item Component
const MealItem = ({ meal }) => {
  const getMealIcon = (type) => {
    switch (type) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'snack': return Cookie;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  const getMealName = (type) => {
    switch (type) {
      case 'breakfast': return 'Pequeno-almoço';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche';
      case 'dinner': return 'Jantar';
      default: return 'Refeição';
    }
  };

  const Icon = getMealIcon(meal.type);

  return (
    <div className={`border rounded-lg p-4 ${meal.logged ? 'bg-white' : 'bg-gray-50 border-dashed'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            meal.logged ? 'bg-blue-100' : 'bg-gray-200'
          }`}>
            <Icon className={`h-5 w-5 ${
              meal.logged ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <p className="font-medium">{getMealName(meal.type)}</p>
            <p className="text-sm text-gray-500">{meal.time}</p>
          </div>
        </div>
        
        {meal.logged ? (
          <div className="text-sm text-gray-600">
            {meal.totals.calories} kcal
          </div>
        ) : (
          <span className="text-sm text-gray-500">Não registado</span>
        )}
      </div>
      
      {meal.logged && (
        <>
          {/* Foods List */}
          <div className="space-y-2">
            {meal.foods.map((food, foodIndex) => (
              <div key={foodIndex} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{food.name}</span>
                  <span className="text-gray-500">({food.quantity}{food.unit})</span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <span>{food.calories} kcal</span>
                  <span className="text-green-600">P: {food.protein}g</span>
                  <span className="text-orange-600">C: {food.carbs}g</span>
                  <span className="text-yellow-600">G: {food.fat}g</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Meal Notes */}
          {meal.notes && (
            <p className="mt-2 text-sm text-gray-600 italic">{meal.notes}</p>
          )}
          
          {/* Meal Photo */}
          {meal.photo && (
            <div className="mt-2">
              <Camera className="h-4 w-4 text-gray-400 inline mr-1" />
              <span className="text-xs text-gray-500">Foto anexada</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Meals Grid View (alternative view)
const MealsGrid = ({ meals }) => {
  const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {mealTypes.map(type => (
        <div key={type} className="space-y-4">
          <h3 className="font-semibold text-gray-900 capitalize">
            {type === 'breakfast' ? 'Pequeno-almoço' :
             type === 'lunch' ? 'Almoço' :
             type === 'snack' ? 'Lanche' : 'Jantar'}
          </h3>
          {meals.map(athleteMeals => {
            const meal = athleteMeals.meals.find(m => m.type === type);
            if (!meal) return null;
            
            return (
              <div key={athleteMeals.id} className="bg-white rounded-lg shadow p-4">
                <h5 className="font-medium text-gray-900 mb-2">{athleteMeals.athleteName}</h5>
                <MealItem meal={meal} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ selectedDate }) => {
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date();

  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isFuture ? 'Data futura' : 'Sem registos para este dia'}
      </h3>
      <p className="text-gray-500 mb-6">
        {isFuture 
          ? 'Não é possível registar refeições para datas futuras'
          : isToday
          ? 'Ainda não foram registadas refeições para hoje'
          : 'Não existem registos de refeições para esta data'
        }
      </p>
      {isToday && (
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Registar Primeira Refeição
        </button>
      )}
    </div>
  );
};

export default MealsView;