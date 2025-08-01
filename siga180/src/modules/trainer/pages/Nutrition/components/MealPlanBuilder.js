import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Apple,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Calculator,
  X,
  RefreshCw,
  Info,
  Check,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Target,
  Filter
} from 'lucide-react';

// FoodSubstitutionModal Component
const FoodSubstitutionModal = ({ 
  isOpen, 
  onClose, 
  originalFood, 
  onSelectSubstitute,
  athletePreferences = {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [substitutes] = useState([
    {
      id: 1,
      name: 'Peito de Peru',
      similarity: 95,
      reason: 'Proteína magra similar',
      per: 100,
      unit: 'g',
      macros: { calories: 135, protein: 29, carbs: 0.5, fat: 1 },
      tags: ['alta proteína', 'baixa gordura'],
      recommended: true,
      priceComparison: 'similar'
    },
    {
      id: 2,
      name: 'Claras de Ovo',
      similarity: 88,
      reason: 'Proteína pura, sem gordura',
      per: 100,
      unit: 'g',
      macros: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
      tags: ['alta proteína', 'versátil'],
      recommended: true,
      priceComparison: 'cheaper'
    },
    {
      id: 3,
      name: 'Pescada',
      similarity: 82,
      reason: 'Proteína magra, omega-3',
      per: 100,
      unit: 'g',
      macros: { calories: 82, protein: 18, carbs: 0, fat: 0.7 },
      tags: ['peixe', 'omega-3'],
      priceComparison: 'expensive'
    }
  ]);

  const filteredSubstitutes = substitutes.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'exact' && sub.similarity >= 90) ||
      (filterType === 'similar' && sub.similarity >= 70);
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Substituir Alimento
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                A substituir: <span className="font-medium">{originalFood?.name}</span> 
                {' '}({originalFood?.quantity}{originalFood?.unit})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Original Food Macros */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Macros atuais:</p>
            <div className="flex gap-4 text-sm">
              <span><strong>{originalFood?.calories}</strong> kcal</span>
              <span>P: <strong>{originalFood?.protein}g</strong></span>
              <span>C: <strong>{originalFood?.carbs}g</strong></span>
              <span>G: <strong>{originalFood?.fat}g</strong></span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar alimentos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="exact">Macros Exatos (90%+)</option>
              <option value="similar">Macros Similares (70%+)</option>
            </select>
          </div>
        </div>

        {/* Substitutes List */}
        <div className="overflow-y-auto max-h-[50vh] p-4">
          <div className="space-y-3">
            {filteredSubstitutes.map(substitute => (
              <div
                key={substitute.id}
                className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => onSelectSubstitute(substitute)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{substitute.name}</h4>
                      {substitute.recommended && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Recomendado
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{substitute.reason}</p>
                    
                    <div className="flex gap-4 text-sm mb-2">
                      <span>{substitute.macros.calories} kcal</span>
                      <span>P: {substitute.macros.protein}g</span>
                      <span>C: {substitute.macros.carbs}g</span>
                      <span>G: {substitute.macros.fat}g</span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {substitute.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-blue-600">{substitute.similarity}%</div>
                    <p className="text-xs text-gray-500">similaridade</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Info className="h-4 w-4 mr-1" />
              Baseado nas preferências e restrições do atleta
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main MealPlanBuilder Component
const MealPlanBuilder = ({ 
  targetMacros = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 80,
    fiber: 30,
    water: 3000
  }, 
  initialMeals = [], 
  onSave,
  athletePreferences = null 
}) => {
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Pequeno-almoço',
      time: '08:00',
      icon: Coffee,
      targetPercentage: 20,
      foods: [
        {
          id: 1,
          name: 'Aveia',
          quantity: 80,
          unit: 'g',
          calories: 311,
          protein: 13.5,
          carbs: 53,
          fat: 5.5
        },
        {
          id: 2,
          name: 'Banana',
          quantity: 120,
          unit: 'g',
          calories: 107,
          protein: 1.3,
          carbs: 27,
          fat: 0.4
        }
      ]
    },
    {
      id: 2,
      name: 'Almoço',
      time: '13:00',
      icon: Sun,
      targetPercentage: 35,
      foods: [
        {
          id: 3,
          name: 'Peito de Frango',
          quantity: 150,
          unit: 'g',
          calories: 248,
          protein: 46.5,
          carbs: 0,
          fat: 5.4
        }
      ]
    },
    {
      id: 3,
      name: 'Lanche',
      time: '16:00',
      icon: Apple,
      targetPercentage: 15,
      foods: []
    },
    {
      id: 4,
      name: 'Jantar',
      time: '20:00',
      icon: Moon,
      targetPercentage: 25,
      foods: []
    },
    {
      id: 5,
      name: 'Ceia',
      time: '22:00',
      icon: Cookie,
      targetPercentage: 5,
      foods: []
    }
  ]);

  const [expandedMeals, setExpandedMeals] = useState([1, 2, 3, 4, 5]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [selectedFoodForSubstitution, setSelectedFoodForSubstitution] = useState(null);

  // Calculate totals
  const calculateMealTotals = (meal) => {
    return meal.foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const calculateTotalMacros = () => {
    return meals.reduce((totals, meal) => {
      const mealTotals = calculateMealTotals(meal);
      return {
        calories: totals.calories + mealTotals.calories,
        protein: totals.protein + mealTotals.protein,
        carbs: totals.carbs + mealTotals.carbs,
        fat: totals.fat + mealTotals.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotalMacros();

  // Handlers
  const toggleMealExpansion = (mealId) => {
    setExpandedMeals(prev =>
      prev.includes(mealId)
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const handleSubstituteFood = (mealId, food) => {
    setSelectedMealId(mealId);
    setSelectedFoodForSubstitution(food);
    setShowSubstitutionModal(true);
  };

  const handleSelectSubstitute = (substitute) => {
    if (selectedMealId && selectedFoodForSubstitution) {
      setMeals(prevMeals => prevMeals.map(meal => {
        if (meal.id === selectedMealId) {
          return {
            ...meal,
            foods: meal.foods.map(food => {
              if (food.id === selectedFoodForSubstitution.id) {
                // Calculate quantity to match calories
                const calorieRatio = selectedFoodForSubstitution.calories / substitute.macros.calories;
                const newQuantity = Math.round(substitute.per * calorieRatio);
                
                return {
                  ...food,
                  name: substitute.name,
                  quantity: newQuantity,
                  unit: substitute.unit,
                  calories: Math.round(substitute.macros.calories * calorieRatio),
                  protein: Math.round(substitute.macros.protein * calorieRatio * 10) / 10,
                  carbs: Math.round(substitute.macros.carbs * calorieRatio * 10) / 10,
                  fat: Math.round(substitute.macros.fat * calorieRatio * 10) / 10
                };
              }
              return food;
            })
          };
        }
        return meal;
      }));
    }
    setShowSubstitutionModal(false);
  };

  const removeFood = (mealId, foodId) => {
    setMeals(prevMeals => prevMeals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: meal.foods.filter(food => food.id !== foodId)
        };
      }
      return meal;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Macros Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Resumo de Macros</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Calorias</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totals.calories)}</p>
            <p className="text-sm text-gray-500">/ {targetMacros.calories}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (totals.calories / targetMacros.calories) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Proteína</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totals.protein)}g</p>
            <p className="text-sm text-gray-500">/ {targetMacros.protein}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (totals.protein / targetMacros.protein) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Carboidratos</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totals.carbs)}g</p>
            <p className="text-sm text-gray-500">/ {targetMacros.carbs}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (totals.carbs / targetMacros.carbs) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Gordura</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totals.fat)}g</p>
            <p className="text-sm text-gray-500">/ {targetMacros.fat}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (totals.fat / targetMacros.fat) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {meals.map((meal) => {
          const MealIcon = meal.icon;
          const mealTotals = calculateMealTotals(meal);
          const isExpanded = expandedMeals.includes(meal.id);

          return (
            <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Meal Header */}
              <div
                className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMealExpansion(meal.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MealIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{Math.round(mealTotals.calories)} kcal</p>
                      <p className="text-xs text-gray-500">
                        P: {Math.round(mealTotals.protein)}g | 
                        C: {Math.round(mealTotals.carbs)}g | 
                        G: {Math.round(mealTotals.fat)}g
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Meal Foods */}
              {isExpanded && (
                <div className="p-4">
                  {meal.foods.length === 0 ? (
                    <div className="text-center py-8">
                      <Apple className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Sem alimentos adicionados</p>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        <Plus className="h-4 w-4 inline mr-1" />
                        Adicionar Alimento
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {meal.foods.map((food) => (
                        <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{food.name}</p>
                            <p className="text-sm text-gray-600">
                              {food.quantity}{food.unit} • {food.calories} kcal • 
                              P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubstituteFood(meal.id, food);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Substituir alimento"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFood(meal.id, food.id);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                        <Plus className="h-4 w-4 inline mr-1" />
                        Adicionar Alimento
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Cancelar
        </button>
        <button 
          onClick={() => onSave && onSave({ meals, totals })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="h-4 w-4 inline mr-2" />
          Guardar Plano
        </button>
      </div>

      {/* Food Substitution Modal */}
      <FoodSubstitutionModal
        isOpen={showSubstitutionModal}
        onClose={() => setShowSubstitutionModal(false)}
        originalFood={selectedFoodForSubstitution}
        onSelectSubstitute={handleSelectSubstitute}
        athletePreferences={athletePreferences}
      />
    </div>
  );
};

export default MealPlanBuilder;