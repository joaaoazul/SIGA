import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Save,
  Download,
  Upload,
  Search,
  Filter,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Apple,
  Dumbbell,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Edit3,
  Pill,
  Calculator
} from 'lucide-react';

const MealPlannerView = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [targetMacros, setTargetMacros] = useState({
    calories: 2100,
    protein: 159,
    carbs: 200,
    fat: 72
  });

  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Refeição 1',
      time: '08:00',
      icon: Coffee,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    },
    {
      id: 2,
      name: 'Refeição 2',
      time: '10:30',
      icon: Apple,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    },
    {
      id: 3,
      name: 'Refeição 3',
      time: '13:00',
      icon: Sun,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    },
    {
      id: 4,
      name: 'Pré-Treino',
      time: '16:00',
      icon: Dumbbell,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    },
    {
      id: 5,
      name: 'Pós-Treino',
      time: '18:30',
      icon: Dumbbell,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    },
    {
      id: 6,
      name: 'Refeição 6',
      time: '20:30',
      icon: Sunset,
      foods: [],
      supplements: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }
  ]);

  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('foods'); // foods, supplements

  // Mock food database
  const foodDatabase = {
    foods: [
      { id: 1, name: 'Aveia', unit: 'g', serving: 100, protein: 13, carbs: 67, fat: 7, calories: 379, category: 'carbs' },
      { id: 2, name: 'Claras', unit: 'g', serving: 100, protein: 10, carbs: 0.3, fat: 0, calories: 42, category: 'protein' },
      { id: 3, name: 'Manteiga Amendoim', unit: 'g', serving: 100, protein: 30, carbs: 12, fat: 46, calories: 578, category: 'fat' },
      { id: 4, name: 'Banana', unit: 'g', serving: 100, protein: 0, carbs: 21, fat: 0, calories: 86, category: 'carbs' },
      { id: 5, name: 'Frango', unit: 'g', serving: 100, protein: 28, carbs: 0, fat: 3.5, calories: 144, category: 'protein' },
      { id: 6, name: 'Arroz Basmati', unit: 'g', serving: 100, protein: 2.7, carbs: 23, fat: 0.3, calories: 106, category: 'carbs' },
      { id: 7, name: 'Brócolis', unit: 'g', serving: 100, protein: 2.4, carbs: 7.2, fat: 0.4, calories: 35, category: 'vegetables' }
    ],
    supplements: [
      { id: 101, name: 'ISO FUJI', unit: 'g', serving: 30, protein: 26, carbs: 0.4, fat: 0.1, calories: 106, category: 'protein' },
      { id: 102, name: 'Glycobol', unit: 'g', serving: 100, protein: 0, carbs: 97, fat: 0, calories: 388, category: 'carbs' },
      { id: 103, name: 'Creatina', unit: 'g', serving: 5, protein: 0, carbs: 0, fat: 0, calories: 0, category: 'performance' },
      { id: 104, name: 'Multivitamínico', unit: 'caps', serving: 1, protein: 0, carbs: 0, fat: 0, calories: 0, category: 'vitamin' },
      { id: 105, name: 'Omega 3', unit: 'caps', serving: 2, protein: 0, carbs: 0, fat: 2, calories: 18, category: 'fat' }
    ]
  };

  const calculateDayTotals = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    meals.forEach(meal => {
      [...meal.foods, ...meal.supplements].forEach(item => {
        const multiplier = item.quantity / item.serving;
        totals.calories += item.calories * multiplier;
        totals.protein += item.protein * multiplier;
        totals.carbs += item.carbs * multiplier;
        totals.fat += item.fat * multiplier;
      });
    });

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat)
    };
  };

  const dayTotals = calculateDayTotals();
  const remaining = {
    calories: targetMacros.calories - dayTotals.calories,
    protein: targetMacros.protein - dayTotals.protein,
    carbs: targetMacros.carbs - dayTotals.carbs,
    fat: targetMacros.fat - dayTotals.fat
  };

  const addItemToMeal = (mealId, item, isSuplement = false) => {
    setMeals(prevMeals => 
      prevMeals.map(meal => {
        if (meal.id === mealId) {
          const newItem = {
            ...item,
            id: Date.now(),
            quantity: item.serving,
            isSuplement
          };
          
          return {
            ...meal,
            [isSuplement ? 'supplements' : 'foods']: [...meal[isSuplement ? 'supplements' : 'foods'], newItem]
          };
        }
        return meal;
      })
    );
    setShowFoodSearch(false);
  };

  const updateItemQuantity = (mealId, itemId, newQuantity) => {
    setMeals(prevMeals =>
      prevMeals.map(meal => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foods: meal.foods.map(food =>
              food.id === itemId ? { ...food, quantity: parseFloat(newQuantity) || 0 } : food
            ),
            supplements: meal.supplements.map(supp =>
              supp.id === itemId ? { ...supp, quantity: parseFloat(newQuantity) || 0 } : supp
            )
          };
        }
        return meal;
      })
    );
  };

  const removeItem = (mealId, itemId) => {
    setMeals(prevMeals =>
      prevMeals.map(meal => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foods: meal.foods.filter(food => food.id !== itemId),
            supplements: meal.supplements.filter(supp => supp.id !== itemId)
          };
        }
        return meal;
      })
    );
  };

  const filteredItems = currentTab === 'supplements' 
    ? foodDatabase.supplements.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : foodDatabase.foods.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Plano Alimentar</h2>
            <p className="text-gray-600 mt-1">Criar e editar planos nutricionais detalhados</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Plano
            </button>
          </div>
        </div>

        {/* Macros Overview - Estilo Excel */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Objetivo</p>
            <p className="text-2xl font-bold text-gray-900">{targetMacros.calories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Atual</p>
            <p className={`text-2xl font-bold ${
              Math.abs(dayTotals.calories - targetMacros.calories) < 50 
                ? 'text-green-600' 
                : 'text-gray-900'
            }`}>{dayTotals.calories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>

          <div className={`rounded-lg p-4 ${remaining.calories < 0 ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <p className="text-sm text-gray-600 mb-1">Em Falta</p>
            <p className={`text-2xl font-bold ${remaining.calories < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              {remaining.calories > 0 ? remaining.calories : Math.abs(remaining.calories)}
            </p>
            <p className="text-xs text-gray-500">{remaining.calories < 0 ? 'excesso' : 'kcal'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Macros a Utilizar</p>
            <div className="grid grid-cols-3 gap-1 text-xs mt-1">
              <div>
                <span className="font-bold text-green-600">{remaining.protein > 0 ? remaining.protein : 0}</span>
                <span className="text-gray-500">P</span>
              </div>
              <div>
                <span className="font-bold text-orange-600">{remaining.carbs > 0 ? remaining.carbs : 0}</span>
                <span className="text-gray-500">C</span>
              </div>
              <div>
                <span className="font-bold text-yellow-600">{remaining.fat > 0 ? remaining.fat : 0}</span>
                <span className="text-gray-500">G</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Distribuição</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(dayTotals.protein * 4 / dayTotals.calories) * 100}%` }}
                  />
                  <div 
                    className="bg-orange-500" 
                    style={{ width: `${(dayTotals.carbs * 4 / dayTotals.calories) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${(dayTotals.fat * 9 / dayTotals.calories) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs mt-2">
              <span className="text-green-600">{Math.round((dayTotals.protein * 4 / dayTotals.calories) * 100)}%</span>
              <span className="text-orange-600">{Math.round((dayTotals.carbs * 4 / dayTotals.calories) * 100)}%</span>
              <span className="text-yellow-600">{Math.round((dayTotals.fat * 9 / dayTotals.calories) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Detailed Macros Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700"></th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Proteína (g)</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Carboidratos (g)</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Gordura (g)</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Calorias</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium">Objetivo</td>
                <td className="text-center py-2 px-3">{targetMacros.protein}</td>
                <td className="text-center py-2 px-3">{targetMacros.carbs}</td>
                <td className="text-center py-2 px-3">{targetMacros.fat}</td>
                <td className="text-center py-2 px-3">{targetMacros.calories}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-blue-50">
                <td className="py-2 px-3 font-medium">Total Atual</td>
                <td className="text-center py-2 px-3 font-bold text-green-600">{dayTotals.protein}</td>
                <td className="text-center py-2 px-3 font-bold text-orange-600">{dayTotals.carbs}</td>
                <td className="text-center py-2 px-3 font-bold text-yellow-600">{dayTotals.fat}</td>
                <td className="text-center py-2 px-3 font-bold">{dayTotals.calories}</td>
              </tr>
              <tr className={remaining.calories < 0 ? 'bg-red-50' : 'bg-yellow-50'}>
                <td className="py-2 px-3 font-medium">Em Falta</td>
                <td className="text-center py-2 px-3 font-bold">{remaining.protein}</td>
                <td className="text-center py-2 px-3 font-bold">{remaining.carbs}</td>
                <td className="text-center py-2 px-3 font-bold">{remaining.fat}</td>
                <td className="text-center py-2 px-3 font-bold">{remaining.calories}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-4">
        {meals.map((meal) => {
          const Icon = meal.icon;
          const mealTotals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          };

          // Calculate meal totals
          [...meal.foods, ...meal.supplements].forEach(item => {
            const multiplier = item.quantity / item.serving;
            mealTotals.calories += item.calories * multiplier;
            mealTotals.protein += item.protein * multiplier;
            mealTotals.carbs += item.carbs * multiplier;
            mealTotals.fat += item.fat * multiplier;
          });

          return (
            <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-green-600">{Math.round(mealTotals.protein)}g</p>
                      <p className="text-xs text-gray-500">Proteína</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-orange-600">{Math.round(mealTotals.carbs)}g</p>
                      <p className="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-yellow-600">{Math.round(mealTotals.fat)}g</p>
                      <p className="text-xs text-gray-500">Gordura</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{Math.round(mealTotals.calories)}</p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Foods Table */}
                {(meal.foods.length > 0 || meal.supplements.length > 0) && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Alimento</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-600">Quantidade</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-600">P</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-600">C</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-600">G</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-600">Kcal</th>
                          <th className="text-center py-2 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {meal.foods.map((food) => {
                          const multiplier = food.quantity / food.serving;
                          return (
                            <tr key={food.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-2 font-medium text-gray-900">{food.name}</td>
                              <td className="text-center py-2 px-2 text-yellow-600 font-medium">
                                {Math.round(food.fat * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2 font-bold">
                                {Math.round(food.calories * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2">
                                <button
                                  onClick={() => removeItem(meal.id, food.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        
                        {/* Supplements */}
                        {meal.supplements.map((supp) => {
                          const multiplier = supp.quantity / supp.serving;
                          return (
                            <tr key={supp.id} className="border-b border-gray-100 hover:bg-blue-50 bg-blue-50/30">
                              <td className="py-2 px-2 font-medium text-gray-900 flex items-center gap-2">
                                <Pill className="h-3 w-3 text-blue-600" />
                                {supp.name}
                              </td>
                              <td className="text-center py-2 px-2">
                                <input
                                  type="number"
                                  value={supp.quantity}
                                  onChange={(e) => updateItemQuantity(meal.id, supp.id, e.target.value)}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                  step={supp.unit === 'caps' ? '1' : '5'}
                                />
                                <span className="ml-1 text-gray-500">{supp.unit}</span>
                              </td>
                              <td className="text-center py-2 px-2 text-green-600 font-medium">
                                {Math.round(supp.protein * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2 text-orange-600 font-medium">
                                {Math.round(supp.carbs * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2 text-yellow-600 font-medium">
                                {Math.round(supp.fat * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2 font-bold">
                                {Math.round(supp.calories * multiplier)}
                              </td>
                              <td className="text-center py-2 px-2">
                                <button
                                  onClick={() => removeItem(meal.id, supp.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedMealId(meal.id);
                      setCurrentTab('foods');
                      setShowFoodSearch(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Alimento
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMealId(meal.id);
                      setCurrentTab('supplements');
                      setShowFoodSearch(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Pill className="h-4 w-4" />
                    Adicionar Suplemento
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex justify-center gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Refeição
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Duplicar Dia
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Limpar Tudo
        </button>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Adicionar {currentTab === 'supplements' ? 'Suplemento' : 'Alimento'}
                </h3>
                <button
                  onClick={() => setShowFoodSearch(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCurrentTab('foods')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentTab === 'foods'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Alimentos
                </button>
                <button
                  onClick={() => setCurrentTab('supplements')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentTab === 'supplements'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Suplementos
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Pesquisar ${currentTab === 'supplements' ? 'suplementos' : 'alimentos'}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItemToMeal(selectedMealId, item, currentTab === 'supplements')}
                    className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Por {item.serving}{item.unit}: 
                          {' '}P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g | {item.calories} kcal
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-medium">{item.protein}g</span>
                        <span className="text-orange-600 font-medium">{item.carbs}g</span>
                        <span className="text-yellow-600 font-medium">{item.fat}g</span>
                        <span className="font-bold">{item.calories}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add Custom */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Alimento Personalizado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlannerView;