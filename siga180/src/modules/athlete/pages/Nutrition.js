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
  Coffee,
  Sun,
  Moon,
  Cookie,
  Info,
  Utensils,
  Flame,
  Droplets,
  Activity,
  RefreshCw,
  Scale,
  Clock,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Camera,
  FileText,
  ArrowUp,
  ArrowDown,
  Minus,
  Award,
  Zap
} from 'lucide-react';

// Componente Principal - Nutrição para Atleta
const NutritionPageAthlete = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('diary');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddFood, setShowAddFood] = useState(false);
  const [showFoodSwap, setShowFoodSwap] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [waterIntake, setWaterIntake] = useState(750);
  const [showCreateFood, setShowCreateFood] = useState(false);
  
  // Dados do plano atual (vem do PT)
  const [nutritionPlan] = useState({
    name: 'Plano de Manutenção',
    type: 'maintenance',
    startDate: '2024-01-15',
    duration: 'mensal',
    createdBy: 'Dr. Rúben Ramos',
    targets: {
      calories: 2877,
      protein: 144,
      carbs: 360,
      fat: 96,
      fiber: 38,
      water: 3000
    },
    macroDistribution: {
      protein: 20, // 20% das calorias
      carbs: 50,   // 50% das calorias
      fat: 30      // 30% das calorias
    },
    mealDistribution: [
      { name: 'Pequeno-Almoço', percentage: 20, time: '08:00' },
      { name: 'Almoço', percentage: 35, time: '13:00' },
      { name: 'Lanche', percentage: 15, time: '16:00' },
      { name: 'Jantar', percentage: 25, time: '20:00' },
      { name: 'Ceia', percentage: 5, time: '22:00' }
    ]
  });

  // Dados do atleta (incluindo peso do módulo de pesagem)
  const [athleteData] = useState({
    name: 'João Silva',
    currentWeight: 83, // kg - vem do módulo de pesagem
    height: 181,
    age: 22,
    bmr: 1856
  });

  // Refeições do dia
  const [todayMeals, setTodayMeals] = useState([
    {
      id: 1,
      name: 'Pequeno-Almoço',
      time: '08:00',
      icon: Coffee,
      targetCalories: Math.round(nutritionPlan.targets.calories * 0.20),
      foods: [
        { 
          id: 1, 
          name: 'Ovos mexidos', 
          amount: 2, 
          unit: 'unidades',
          calories: 234,
          protein: 14.4,
          carbs: 0.9,
          fat: 19.2,
          fiber: 0,
          sourceINSA: true
        }
      ]
    },
    {
      id: 2,
      name: 'Almoço',
      time: '13:00',
      icon: Sun,
      targetCalories: Math.round(nutritionPlan.targets.calories * 0.35),
      foods: []
    },
    {
      id: 3,
      name: 'Lanche',
      time: '16:00',
      icon: Cookie,
      targetCalories: Math.round(nutritionPlan.targets.calories * 0.15),
      foods: []
    },
    {
      id: 4,
      name: 'Jantar',
      time: '20:00',
      icon: Moon,
      targetCalories: Math.round(nutritionPlan.targets.calories * 0.25),
      foods: []
    },
    {
      id: 5,
      name: 'Ceia',
      time: '22:00',
      icon: Moon,
      targetCalories: Math.round(nutritionPlan.targets.calories * 0.05),
      foods: []
    }
  ]);

  // Calcular totais consumidos
  const calculateTotals = () => {
    return todayMeals.reduce((acc, meal) => {
      const mealTotals = meal.foods.reduce((mealAcc, food) => ({
        calories: mealAcc.calories + food.calories,
        protein: mealAcc.protein + food.protein,
        carbs: mealAcc.carbs + food.carbs,
        fat: mealAcc.fat + food.fat,
        fiber: mealAcc.fiber + (food.fiber || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
      
      return {
        calories: acc.calories + mealTotals.calories,
        protein: acc.protein + mealTotals.protein,
        carbs: acc.carbs + mealTotals.carbs,
        fat: acc.fat + mealTotals.fat,
        fiber: acc.fiber + mealTotals.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const totals = calculateTotals();

  // Navegação de data
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header com informação do plano */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{nutritionPlan.name}</h2>
            <p className="text-sm text-gray-500">Criado por {nutritionPlan.createdBy}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium">{athleteData.currentWeight}kg</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('diary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'diary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'plan'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Meu Plano
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Progresso
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'recipes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Receitas
            </button>
          </nav>
        </div>
      </div>

        {/* Tab: Diário */}
        {activeTab === 'diary' && (
          <div className="space-y-6">
            {/* Date Navigation */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">
                    {isToday() ? 'Hoje' : selectedDate.toLocaleDateString('pt-PT', { weekday: 'long' })}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <button
                  onClick={() => changeDate(1)}
                  disabled={isToday()}
                  className={`p-2 rounded-lg transition-colors ${
                    isToday() 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumo do Dia</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Scale className="h-4 w-4" />
                  <span>{athleteData.currentWeight}kg</span>
                </div>
              </div>
              
              {/* Macros Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Calories */}
                <div className="relative">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Calorias</span>
                      <Flame className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {totals.calories}
                    </p>
                    <p className="text-sm text-gray-600">
                      de {nutritionPlan.targets.calories} kcal
                    </p>
                    <div className="mt-2 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (totals.calories / nutritionPlan.targets.calories) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Protein */}
                <div className="relative">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Proteína</span>
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {totals.protein.toFixed(1)}g
                    </p>
                    <p className="text-sm text-gray-600">
                      de {nutritionPlan.targets.protein}g
                    </p>
                    <div className="mt-2 bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (totals.protein / nutritionPlan.targets.protein) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Carbs */}
                <div className="relative">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Carboidratos</span>
                      <Cookie className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {totals.carbs.toFixed(1)}g
                    </p>
                    <p className="text-sm text-gray-600">
                      de {nutritionPlan.targets.carbs}g
                    </p>
                    <div className="mt-2 bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (totals.carbs / nutritionPlan.targets.carbs) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Fat */}
                <div className="relative">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Gordura</span>
                      <Droplets className="h-4 w-4 text-yellow-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {totals.fat.toFixed(1)}g
                    </p>
                    <p className="text-sm text-gray-600">
                      de {nutritionPlan.targets.fat}g
                    </p>
                    <div className="mt-2 bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (totals.fat / nutritionPlan.targets.fat) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiber and Water */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fibra</span>
                    <span className="text-sm font-medium">
                      {totals.fiber.toFixed(1)}g / {nutritionPlan.targets.fiber}g
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-gray-600 h-1 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (totals.fiber / nutritionPlan.targets.fiber) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Água</span>
                    <span className="text-sm font-medium">
                      {waterIntake}ml / {nutritionPlan.targets.water}ml
                    </span>
                  </div>
                  <div className="mt-1 bg-blue-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (waterIntake / nutritionPlan.targets.water) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-4">
              {todayMeals.map((meal) => {
                const MealIcon = meal.icon;
                const mealTotals = meal.foods.reduce((acc, food) => ({
                  calories: acc.calories + food.calories,
                  protein: acc.protein + food.protein,
                  carbs: acc.carbs + food.carbs,
                  fat: acc.fat + food.fat
                }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

                return (
                  <div key={meal.id} className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MealIcon className="h-6 w-6 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{meal.name}</h4>
                            <p className="text-sm text-gray-500">{meal.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {mealTotals.calories} / {meal.targetCalories} kcal
                            </p>
                            <p className="text-xs text-gray-500">
                              P: {mealTotals.protein.toFixed(1)}g • 
                              C: {mealTotals.carbs.toFixed(1)}g • 
                              G: {mealTotals.fat.toFixed(1)}g
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedMeal(meal);
                              setShowAddFood(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {meal.foods.length > 0 ? (
                      <div className="p-4">
                        <div className="space-y-3">
                          {meal.foods.map((food) => (
                            <div key={food.id} className="flex items-center justify-between group">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-gray-900">{food.name}</p>
                                  {food.sourceINSA && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                      INSA
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {food.amount} {food.unit} • {food.calories} kcal • 
                                  P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setSelectedFood(food);
                                    setShowFoodSwap(true);
                                  }}
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                                  title="Trocar alimento"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                                  title="Editar quantidade"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 mb-2">Sem alimentos registados</p>
                        <button
                          onClick={() => {
                            setSelectedMeal(meal);
                            setShowAddFood(true);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Adicionar alimentos
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Water Tracking - Melhorado */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Hidratação</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Ver histórico
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-3xl font-bold text-blue-600">{(waterIntake / 1000).toFixed(1)}L</p>
                  <p className="text-sm text-gray-500">de {nutritionPlan.targets.water / 1000}L</p>
                </div>
                
                <div className="bg-blue-100 rounded-full h-6 mb-4">
                  <div 
                    className="bg-blue-600 h-6 rounded-full transition-all flex items-center justify-center"
                    style={{ width: `${Math.min(100, (waterIntake / nutritionPlan.targets.water) * 100)}%` }}
                  >
                    {waterIntake > 0 && (
                      <span className="text-xs text-white font-medium">
                        {((waterIntake / nutritionPlan.targets.water) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Quick Add Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 750, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setWaterIntake(waterIntake + amount)}
                      className="py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      +{amount}ml
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Water Tips */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Dica: Beba pelo menos 35ml por kg de peso corporal. 
                  Para ti: {Math.round(athleteData.currentWeight * 35)}ml/dia
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Meu Plano */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Plan Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{nutritionPlan.name}</h3>
                  <p className="text-sm text-gray-500">Criado por {nutritionPlan.createdBy}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Ativo
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium capitalize">{nutritionPlan.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="font-medium capitalize">{nutritionPlan.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Início</p>
                  <p className="font-medium">
                    {new Date(nutritionPlan.startDate).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dias no plano</p>
                  <p className="font-medium">
                    {Math.floor((new Date() - new Date(nutritionPlan.startDate)) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>

              {/* Daily Targets */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Objetivos Diários</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Calorias</span>
                      <Flame className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.calories}</p>
                    <p className="text-sm text-gray-600">kcal/dia</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Proteína</span>
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.protein}g</p>
                    <p className="text-sm text-gray-600">{(nutritionPlan.targets.protein / athleteData.currentWeight).toFixed(1)}g/kg</p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Carboidratos</span>
                      <Cookie className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.carbs}g</p>
                    <p className="text-sm text-gray-600">50% calorias</p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Gordura</span>
                      <Droplets className="h-4 w-4 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.fat}g</p>
                    <p className="text-sm text-gray-600">{nutritionPlan.macroDistribution.fat}% calorias</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fibra</span>
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.fiber}g</p>
                    <p className="text-sm text-gray-600">por dia</p>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Água</span>
                      <Droplets className="h-4 w-4 text-cyan-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{nutritionPlan.targets.water / 1000}L</p>
                    <p className="text-sm text-gray-600">por dia</p>
                  </div>
                </div>
              </div>

              {/* Distribuição de Macros */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Distribuição de Macronutrientes</h4>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#e5e7eb"
                        strokeWidth="32"
                        fill="none"
                      />
                      {/* Proteína */}
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#10b981"
                        strokeWidth="32"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80 * nutritionPlan.macroDistribution.protein / 100} ${2 * Math.PI * 80}`}
                        strokeDashoffset="0"
                      />
                      {/* Carboidratos */}
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#f97316"
                        strokeWidth="32"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80 * nutritionPlan.macroDistribution.carbs / 100} ${2 * Math.PI * 80}`}
                        strokeDashoffset={`-${2 * Math.PI * 80 * nutritionPlan.macroDistribution.protein / 100}`}
                      />
                      {/* Gordura */}
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#eab308"
                        strokeWidth="32"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80 * nutritionPlan.macroDistribution.fat / 100} ${2 * Math.PI * 80}`}
                        strokeDashoffset={`-${2 * Math.PI * 80 * (nutritionPlan.macroDistribution.protein + nutritionPlan.macroDistribution.carbs) / 100}`}
                      />
                    </svg>
                  </div>
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                      <span className="text-sm">Proteína: {nutritionPlan.macroDistribution.protein}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2" />
                      <span className="text-sm">Carboidratos: {nutritionPlan.macroDistribution.carbs}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
                      <span className="text-sm">Gordura: {nutritionPlan.macroDistribution.fat}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">Distribuição de Refeições</h4>
              <div className="space-y-3">
                {nutritionPlan.mealDistribution.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{meal.percentage}%</p>
                      <p className="text-sm text-gray-500">
                        ~{Math.round(nutritionPlan.targets.calories * meal.percentage / 100)} kcal
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Foods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">Sugestões de Alimentos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Proteínas</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Peito de frango grelhado (150g)
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Atum em água (1 lata)
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Ovos cozidos (2-3 unidades)
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Iogurte grego natural (200g)
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Carboidratos</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      Arroz integral cozido (100g)
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      Batata doce (150g)
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      Aveia em flocos (60g)
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      Frutas variadas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Progresso */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Weekly Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Semanal</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Média de Calorias</p>
                  <p className="text-2xl font-bold text-gray-900">2,450</p>
                  <p className="text-sm text-green-600">
                    <ArrowUp className="h-3 w-3 inline" />
                    95% do objetivo
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Dias Completos</p>
                  <p className="text-2xl font-bold text-gray-900">5/7</p>
                  <p className="text-sm text-gray-600">Esta semana</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Melhor Dia</p>
                  <p className="text-2xl font-bold text-gray-900">Terça</p>
                  <p className="text-sm text-gray-600">100% macros</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Peso Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{athleteData.currentWeight}kg</p>
                  <p className="text-sm text-blue-600">Mantido</p>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Calorias por Dia</h4>
                <div className="flex items-end justify-between space-x-2 h-32">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
                    const percentage = Math.random() * 30 + 70; // Mock data
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t" style={{ height: `${percentage}%` }}>
                          <div className="w-full bg-blue-600 rounded-t h-full" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conquistas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">7 Dias</p>
                  <p className="text-xs text-gray-600">Consecutivos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Macros Perfeitos</p>
                  <p className="text-xs text-gray-600">3 dias seguidos</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Hidratado</p>
                  <p className="text-xs text-gray-600">Meta semanal</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Consistente</p>
                  <p className="text-xs text-gray-600">30 dias no plano</p>
                </div>
              </div>
            </div>
        {/* Tab: Receitas */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas Sugeridas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Bowl de Frango Proteico',
                    calories: 485,
                    protein: 42,
                    carbs: 35,
                    fat: 18,
                    time: '25 min',
                    difficulty: 'Fácil',
                    ingredients: ['Peito de frango', 'Quinoa', 'Brócolos', 'Abacate']
                  },
                  {
                    name: 'Overnight Oats',
                    calories: 380,
                    protein: 18,
                    carbs: 52,
                    fat: 12,
                    time: '5 min + repouso',
                    difficulty: 'Muito Fácil',
                    ingredients: ['Aveia', 'Iogurte grego', 'Frutos vermelhos', 'Mel']
                  }
                ].map((recipe, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {recipe.difficulty}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.time}
                      </p>
                      <p>{recipe.calories} kcal • P: {recipe.protein}g • C: {recipe.carbs}g • G: {recipe.fat}g</p>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {recipe.ingredients.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div> )}

      {/* Modals */},
      {showAddFood && (
        <AddFoodModal
          meal={selectedMeal}
          onClose={() => {
            setShowAddFood(false);
            setSelectedMeal(null);
          }}
          onAdd={(food) => {
            // Adicionar alimento à refeição
            console.log('Adding food:', food);
            setShowAddFood(false);
          }}
          onCreateNew={() => {
            setShowAddFood(false);
            setShowCreateFood(true);
          }}
        />
      )}

      {showCreateFood && (
        <CreateFoodModal
          onClose={() => setShowCreateFood(false)}
          onCreate={(food) => {
            console.log('Creating food:', food);
            setShowCreateFood(false);
          }}
        />
      )}

      {showFoodSwap && selectedFood && (
        <FoodSwapModal
          food={selectedFood}
          onClose={() => {
            setShowFoodSwap(false);
            setSelectedFood(null);
          }}
          onSwap={(newFood) => {
            // Trocar alimento
            console.log('Swapping food:', newFood);
            setShowFoodSwap(false);
          }}
        />
      )}
    </div>
  );
};

// Modal: Add Food
const AddFoodModal = ({ meal, onClose, onAdd, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('100');
  const [activeCategory, setActiveCategory] = useState('all');

  // Categorias de alimentos
  const categories = [
    { id: 'all', name: 'Todos', icon: Utensils },
    { id: 'protein', name: 'Proteínas', icon: Activity },
    { id: 'carbs', name: 'Carboidratos', icon: Cookie },
    { id: 'fats', name: 'Gorduras', icon: Droplets },
    { id: 'fruits', name: 'Frutas', icon: Apple },
    { id: 'vegetables', name: 'Vegetais', icon: Apple }
  ];

  // Base de dados INSA + alimentos personalizados
  const foodDatabase = [
    {
      id: 1,
      name: 'Peito de frango grelhado',
      brand: 'Genérico',
      category: 'protein',
      per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      sourceINSA: true
    },
    {
      id: 2,
      name: 'Arroz integral cozido',
      brand: 'Genérico',
      category: 'carbs',
      per100g: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
      sourceINSA: true
    },
    {
      id: 3,
      name: 'Banana',
      brand: 'Genérico',
      category: 'fruits',
      per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
      sourceINSA: true
    },
    {
      id: 4,
      name: 'Ovos cozidos',
      brand: 'Genérico',
      category: 'protein',
      per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
      sourceINSA: true
    },
    {
      id: 5,
      name: 'Abacate',
      brand: 'Genérico',
      category: 'fats',
      per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
      sourceINSA: true
    },
    {
      id: 6,
      name: 'Meu Shake Proteico',
      brand: 'Personalizado',
      category: 'protein',
      per100g: { calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },
      sourceINSA: false,
      isCustom: true
    }
  ];

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateNutrition = (food) => {
    const multiplier = parseFloat(amount) / 100;
    return {
      calories: Math.round(food.per100g.calories * multiplier),
      protein: parseFloat((food.per100g.protein * multiplier).toFixed(1)),
      carbs: parseFloat((food.per100g.carbs * multiplier).toFixed(1)),
      fat: parseFloat((food.per100g.fat * multiplier).toFixed(1)),
      fiber: parseFloat((food.per100g.fiber * multiplier).toFixed(1))
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Adicionar Alimento</h3>
              <p className="text-sm text-gray-500">{meal?.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar alimentos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CategoryIcon className="h-4 w-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Food List */}
          <div className="space-y-2 mb-4">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedFood?.id === food.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-500">{food.brand}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {food.sourceINSA && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        INSA
                      </span>
                    )}
                    {food.isCustom && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Pessoal
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Por 100g: {food.per100g.calories} kcal • 
                  P: {food.per100g.protein}g • 
                  C: {food.per100g.carbs}g • 
                  G: {food.per100g.fat}g
                </p>
              </button>
            ))}
          </div>

          {/* Create Custom Food Button */}
          <button
            onClick={onCreateNew}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600 hover:text-gray-700 transition-colors"
          >
            <Plus className="h-5 w-5 mx-auto mb-1" />
            <p className="text-sm font-medium">Criar Alimento Personalizado</p>
            <p className="text-xs text-gray-500 mt-1">Adicione alimentos que não estão na base de dados</p>
          </button>

          {/* Amount Input */}
          {selectedFood && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600">gramas</span>
              </div>
              
              {/* Nutrition Preview */}
              <div className="mt-4 p-3 bg-white rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Valores Nutricionais</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Calorias:</span>
                    <span className="font-medium ml-1">{calculateNutrition(selectedFood).calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Proteína:</span>
                    <span className="font-medium ml-1">{calculateNutrition(selectedFood).protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carboidratos:</span>
                    <span className="font-medium ml-1">{calculateNutrition(selectedFood).carbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Gordura:</span>
                    <span className="font-medium ml-1">{calculateNutrition(selectedFood).fat}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fibra:</span>
                    <span className="font-medium ml-1">{calculateNutrition(selectedFood).fiber}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (selectedFood) {
                  const nutrition = calculateNutrition(selectedFood);
                  onAdd({
                    ...selectedFood,
                    amount: parseFloat(amount),
                    unit: 'g',
                    ...nutrition
                  });
                }
              }}
              disabled={!selectedFood}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                selectedFood
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal: Food Swap
const FoodSwapModal = ({ food, onClose, onSwap }) => {
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  // Encontrar alternativas equivalentes
  const findAlternatives = () => {
    // Simulação - em produção isso viria da API
    return [
      {
        id: 1,
        name: 'Claras de ovo cozidas',
        amount: 120,
        unit: 'g',
        calories: 230,
        protein: 14.8,
        carbs: 1.2,
        fat: 18.5,
        similarity: 95
      },
      {
        id: 2,
        name: 'Omelete simples',
        amount: 100,
        unit: 'g',
        calories: 240,
        protein: 13.5,
        carbs: 1.8,
        fat: 19.8,
        similarity: 92
      },
      {
        id: 3,
        name: 'Ovos escalfados',
        amount: 2,
        unit: 'unidades',
        calories: 225,
        protein: 14.2,
        carbs: 0.8,
        fat: 18.0,
        similarity: 90
      }
    ];
  };

  const alternatives = findAlternatives();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Trocar Alimento</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Food */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Alimento atual</p>
            <p className="font-medium text-gray-900">{food.name}</p>
            <p className="text-sm text-gray-600">
              {food.amount} {food.unit} • {food.calories} kcal
            </p>
          </div>

          {/* Alternatives */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Alternativas equivalentes</p>
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => setSelectedAlternative(alt)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAlternative?.id === alt.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alt.name}</p>
                    <p className="text-sm text-gray-600">
                      {alt.amount} {alt.unit} • {alt.calories} kcal
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      P: {alt.protein}g • C: {alt.carbs}g • G: {alt.fat}g
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {alt.similarity}% similar
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (selectedAlternative) {
                  onSwap(selectedAlternative);
                }
              }}
              disabled={!selectedAlternative}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                selectedAlternative
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Trocar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal: Create Custom Food
const CreateFoodModal = ({ onClose, onCreate }) => {
  const [foodData, setFoodData] = useState({
    name: '',
    brand: '',
    category: 'protein',
    serving: '100',
    unit: 'g',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!foodData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!foodData.calories) newErrors.calories = 'Calorias são obrigatórias';
    if (!foodData.protein) newErrors.protein = 'Proteína é obrigatória';
    if (!foodData.carbs) newErrors.carbs = 'Carboidratos são obrigatórios';
    if (!foodData.fat) newErrors.fat = 'Gordura é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreate({
        ...foodData,
        per100g: {
          calories: parseFloat(foodData.calories),
          protein: parseFloat(foodData.protein),
          carbs: parseFloat(foodData.carbs),
          fat: parseFloat(foodData.fat),
          fiber: parseFloat(foodData.fiber) || 0,
          sugar: parseFloat(foodData.sugar) || 0,
          sodium: parseFloat(foodData.sodium) || 0
        },
        sourceINSA: false,
        isCustom: true
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Criar Alimento Personalizado</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Alimento *
                </label>
                <input
                  type="text"
                  value={foodData.name}
                  onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Barra de Proteína Caseira"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca/Origem
                </label>
                <input
                  type="text"
                  value={foodData.brand}
                  onChange={(e) => setFoodData({ ...foodData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Caseiro, Marca X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={foodData.category}
                  onChange={(e) => setFoodData({ ...foodData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="protein">Proteínas</option>
                  <option value="carbs">Carboidratos</option>
                  <option value="fats">Gorduras</option>
                  <option value="fruits">Frutas</option>
                  <option value="vegetables">Vegetais</option>
                  <option value="dairy">Laticínios</option>
                  <option value="other">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porção de Referência
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={foodData.serving}
                    onChange={(e) => setFoodData({ ...foodData, serving: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={foodData.unit}
                    onChange={(e) => setFoodData({ ...foodData, unit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="unidade">unidade</option>
                    <option value="colher">colher</option>
                    <option value="chávena">chávena</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Informação Nutricional (por 100g)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calorias (kcal) *
                  </label>
                  <input
                    type="number"
                    value={foodData.calories}
                    onChange={(e) => setFoodData({ ...foodData, calories: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.calories ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.calories && <p className="text-xs text-red-500 mt-1">{errors.calories}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proteína (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodData.protein}
                    onChange={(e) => setFoodData({ ...foodData, protein: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.protein ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.protein && <p className="text-xs text-red-500 mt-1">{errors.protein}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carboidratos (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodData.carbs}
                    onChange={(e) => setFoodData({ ...foodData, carbs: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.carbs ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.carbs && <p className="text-xs text-red-500 mt-1">{errors.carbs}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gordura (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodData.fat}
                    onChange={(e) => setFoodData({ ...foodData, fat: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fat ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fat && <p className="text-xs text-red-500 mt-1">{errors.fat}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fibra (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodData.fiber}
                    onChange={(e) => setFoodData({ ...foodData, fiber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açúcar (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodData.sugar}
                    onChange={(e) => setFoodData({ ...foodData, sugar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sódio (mg)
                  </label>
                  <input
                    type="number"
                    value={foodData.sodium}
                    onChange={(e) => setFoodData({ ...foodData, sodium: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Dica:</p>
                  <p>Os valores nutricionais podem ser encontrados no rótulo do produto ou calculados 
                  com base nos ingredientes utilizados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Criar Alimento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPageAthlete;