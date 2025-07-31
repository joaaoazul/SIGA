import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Trash2,
  Edit2,
  Save,
  Copy,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Apple,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Target,
  Calculator,
  X,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const MealPlanBuilder = ({ 
  targetMacros, 
  initialMeals = [], 
  onSave,
  athletePreferences = null 
}) => {
  // State management
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Pequeno-almoço',
      time: '08:00',
      icon: Coffee,
      targetPercentage: 20,
      foods: []
    },
    {
      id: 2,
      name: 'Almoço',
      time: '13:00',
      icon: Sun,
      targetPercentage: 35,
      foods: []
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

  const [foodDatabase, setFoodDatabase] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [expandedMeals, setExpandedMeals] = useState([1, 2, 3, 4, 5]);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize with initial meals if provided
  useEffect(() => {
    if (initialMeals.length > 0) {
      setMeals(initialMeals);
    }
    fetchFoodDatabase();
  }, [initialMeals]);

  // Fetch food database
  const fetchFoodDatabase = async () => {
    // TODO: Replace with actual API call
    const mockFoods = [
      // Proteins
      { id: 1, name: 'Peito de Frango (grelhado)', category: 'proteins', calories: 165, protein: 31, carbs: 0, fat: 3.6, per: 100, unit: 'g' },
      { id: 2, name: 'Atum em água', category: 'proteins', calories: 116, protein: 25.5, carbs: 0, fat: 0.8, per: 100, unit: 'g' },
      { id: 3, name: 'Ovos (cozidos)', category: 'proteins', calories: 155, protein: 13, carbs: 1.1, fat: 11, per: 100, unit: 'g' },
      { id: 4, name: 'Salmão', category: 'proteins', calories: 208, protein: 20, carbs: 0, fat: 13, per: 100, unit: 'g' },
      { id: 5, name: 'Whey Protein', category: 'proteins', calories: 120, protein: 24, carbs: 3, fat: 1.5, per: 30, unit: 'g' },
      
      // Carbs
      { id: 6, name: 'Arroz Integral (cozido)', category: 'carbs', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, per: 100, unit: 'g' },
      { id: 7, name: 'Batata Doce (cozida)', category: 'carbs', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, per: 100, unit: 'g' },
      { id: 8, name: 'Aveia', category: 'carbs', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, per: 100, unit: 'g' },
      { id: 9, name: 'Massa Integral (cozida)', category: 'carbs', calories: 124, protein: 5.3, carbs: 25.1, fat: 0.5, per: 100, unit: 'g' },
      { id: 10, name: 'Pão Integral', category: 'carbs', calories: 247, protein: 13, carbs: 41, fat: 4.2, per: 100, unit: 'g' },
      
      // Fats
      { id: 11, name: 'Azeite', category: 'fats', calories: 884, protein: 0, carbs: 0, fat: 100, per: 100, unit: 'ml' },
      { id: 12, name: 'Abacate', category: 'fats', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, per: 100, unit: 'g' },
      { id: 13, name: 'Amêndoas', category: 'fats', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, per: 100, unit: 'g' },
      { id: 14, name: 'Manteiga de Amendoim', category: 'fats', calories: 588, protein: 25, carbs: 20, fat: 50, per: 100, unit: 'g' },
      
      // Vegetables
      { id: 15, name: 'Brócolos (cozidos)', category: 'vegetables', calories: 35, protein: 2.8, carbs: 7.2, fat: 0.4, per: 100, unit: 'g' },
      { id: 16, name: 'Espinafres (crus)', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, per: 100, unit: 'g' },
      { id: 17, name: 'Tomate', category: 'vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, per: 100, unit: 'g' },
      
      // Fruits
      { id: 18, name: 'Banana', category: 'fruits', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, per: 100, unit: 'g' },
      { id: 19, name: 'Maçã', category: 'fruits', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, per: 100, unit: 'g' },
      { id: 20, name: 'Mirtilos', category: 'fruits', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, per: 100, unit: 'g' }
    ];
    
    setFoodDatabase(mockFoods);
  };

  // Calculate totals for a meal
  const calculateMealTotals = (meal) => {
    return meal.foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Calculate total macros
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

  // Add food to meal
  const addFoodToMeal = (mealId, food, quantity = 100) => {
    const multiplier = quantity / food.per;
    const foodItem = {
      id: Date.now(),
      foodId: food.id,
      name: food.name,
      quantity: quantity,
      unit: food.unit,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10
    };

    setMeals(prevMeals => prevMeals.map(meal => 
      meal.id === mealId 
        ? { ...meal, foods: [...meal.foods, foodItem] }
        : meal
    ));
    
    setShowAddFood(false);
    setSelectedMealId(null);
  };

  // Remove food from meal
  const removeFoodFromMeal = (mealId, foodId) => {
    setMeals(prevMeals => prevMeals.map(meal => 
      meal.id === mealId 
        ? { ...meal, foods: meal.foods.filter(f => f.id !== foodId) }
        : meal
    ));
  };

  // Update food quantity
  const updateFoodQuantity = (mealId, foodId, newQuantity) => {
    const meal = meals.find(m => m.id === mealId);
    const food = meal.foods.find(f => f.id === foodId);
    const originalFood = foodDatabase.find(f => f.id === food.foodId);
    
    if (!originalFood) return;
    
    const multiplier = newQuantity / originalFood.per;
    
    setMeals(prevMeals => prevMeals.map(meal => 
      meal.id === mealId 
        ? {
            ...meal,
            foods: meal.foods.map(f => 
              f.id === foodId
                ? {
                    ...f,
                    quantity: newQuantity,
                    calories: Math.round(originalFood.calories * multiplier),
                    protein: Math.round(originalFood.protein * multiplier * 10) / 10,
                    carbs: Math.round(originalFood.carbs * multiplier * 10) / 10,
                    fat: Math.round(originalFood.fat * multiplier * 10) / 10
                  }
                : f
            )
          }
        : meal
    ));
  };

  // Copy meal to another day
  const copyMeal = (meal) => {
    const copiedFoods = meal.foods.map(food => ({
      ...food,
      id: Date.now() + Math.random() // Generate new ID
    }));
    
    // Store in clipboard-like state for future paste
    localStorage.setItem('copiedMeal', JSON.stringify({
      name: meal.name,
      foods: copiedFoods
    }));
    
    // Show success message (could use a toast notification)
    alert(`${meal.name} copiado! Pode colar noutro dia/refeição.`);
  };

  // Import/Export functions
  const exportPlan = () => {
    const exportData = {
      meals,
      totals: calculateTotalMacros(),
      targetMacros,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-nutricional-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importPlan = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.meals) {
          setMeals(importedData.meals);
        }
      } catch (error) {
        console.error('Erro ao importar plano:', error);
        alert('Erro ao importar ficheiro. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  };

  // Toggle meal expansion
  const toggleMealExpansion = (mealId) => {
    setExpandedMeals(prev => 
      prev.includes(mealId)
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  // Validate plan
  const validatePlan = () => {
    const errors = {};
    const totals = calculateTotalMacros();
    
    // Check if total calories are within 5% of target
    const calorieDeviation = Math.abs(totals.calories - targetMacros.calories) / targetMacros.calories;
    if (calorieDeviation > 0.05) {
      errors.calories = `Calorias totais (${totals.calories}) desviam mais de 5% do alvo (${targetMacros.calories})`;
    }
    
    // Check if each meal has at least one food
    meals.forEach(meal => {
      if (meal.foods.length === 0) {
        errors[`meal_${meal.id}`] = `${meal.name} não tem alimentos`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save plan
  const handleSave = () => {
    if (!validatePlan()) {
      return;
    }
    
    const planData = {
      meals: meals,
      totals: calculateTotalMacros(),
      targetMacros: targetMacros,
      createdAt: new Date().toISOString()
    };
    
    onSave(planData);
  };

  // Filter foods based on search and category
  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totals = calculateTotalMacros();
  const Icon = meals.find(m => m.id === selectedMealId)?.icon || Apple;

  return (
    <div className="space-y-6">
      {/* Header with Totals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Construtor de Plano Nutricional</h2>
          <div className="flex space-x-2">
            <button
              onClick={exportPlan}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            <label className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={importPlan}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                const pasteMeal = localStorage.getItem('copiedMeal');
                if (pasteMeal) {
                  alert('Selecione uma refeição para colar os alimentos copiados');
                } else {
                  alert('Nenhuma refeição copiada');
                }
              }}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Copy className="h-4 w-4 mr-2" />
              Colar
            </button>
            <button
              onClick={handleSave}
              disabled={Object.keys(validationErrors).length > 0 || !onSave}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                Object.keys(validationErrors).length > 0 || !onSave
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Plano
            </button>
          </div>
        </div>

        {/* Macro Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Calorias</span>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xl font-bold">{totals.calories}</p>
            <p className="text-sm text-gray-600">/ {targetMacros.calories} kcal</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  Math.abs(totals.calories - targetMacros.calories) / targetMacros.calories > 0.05
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((totals.calories / targetMacros.calories) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Proteína</span>
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <p className="text-xl font-bold">{totals.protein}g</p>
            <p className="text-sm text-gray-600">/ {targetMacros.protein}g</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Carboidratos</span>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <p className="text-xl font-bold">{totals.carbs}g</p>
            <p className="text-sm text-gray-600">/ {targetMacros.carbs}g</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Gordura</span>
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            </div>
            <p className="text-xl font-bold">{totals.fat}g</p>
            <p className="text-sm text-gray-600">/ {targetMacros.fat}g</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fibra</span>
              <Apple className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold">
              {Math.round(totals.carbs * 0.1)}g
            </p>
            <p className="text-sm text-gray-600">/ {targetMacros.fiber}g</p>
          </div>
        </div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Erros de validação:</span>
            </div>
            <ul className="mt-1 list-disc list-inside text-sm text-red-700">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {meals.map((meal) => {
          const MealIcon = meal.icon;
          const mealTotals = calculateMealTotals(meal);
          const targetCalories = Math.round(targetMacros.calories * (meal.targetPercentage / 100));
          const isExpanded = expandedMeals.includes(meal.id);

          return (
            <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Meal Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleMealExpansion(meal.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MealIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-600">{meal.time} • {meal.targetPercentage}% do total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyMeal(meal);
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Copiar Refeição"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const pasteMeal = localStorage.getItem('copiedMeal');
                          if (pasteMeal) {
                            const parsed = JSON.parse(pasteMeal);
                            setMeals(prevMeals => prevMeals.map(m => 
                              m.id === meal.id 
                                ? { ...m, foods: [...m.foods, ...parsed.foods] }
                                : m
                            ));
                            localStorage.removeItem('copiedMeal');
                          }
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Colar Alimentos"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {mealTotals.calories} / {targetCalories} kcal
                      </p>
                      <p className="text-xs text-gray-600">
                        P: {mealTotals.protein}g | C: {mealTotals.carbs}g | G: {mealTotals.fat}g
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
                <div className="border-t border-gray-200">
                  {meal.foods.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="mb-2">Sem alimentos adicionados</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      {meal.foods.map((food) => (
                        <div key={food.id} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{food.name}</p>
                            <p className="text-xs text-gray-600">
                              {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={food.quantity}
                              onChange={(e) => updateFoodQuantity(meal.id, food.id, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">{food.unit}</span>
                            <button
                              onClick={() => removeFoodFromMeal(meal.id, food.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Food Button */}
                  <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedMealId(meal.id);
                        setShowAddFood(true);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center mr-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Alimento
                    </button>
                    
                    <button
                      onClick={() => {
                        // Clear meal foods
                        setMeals(prevMeals => prevMeals.map(m => 
                          m.id === meal.id ? { ...m, foods: [] } : m
                        ));
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                      title="Limpar Refeição"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Icon className="h-5 w-5 mr-2" />
                  Adicionar Alimento a {meals.find(m => m.id === selectedMealId)?.name}
                </h3>
                <button
                  onClick={() => {
                    setShowAddFood(false);
                    setSelectedMealId(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Search and Filter */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar alimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSelectedCategory('proteins')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedCategory === 'proteins'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Proteínas
                  </button>
                  <button
                    onClick={() => setSelectedCategory('carbs')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedCategory === 'carbs'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Carboidratos
                  </button>
                  <button
                    onClick={() => setSelectedCategory('fats')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedCategory === 'fats'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Gorduras
                  </button>
                </div>
              </div>

              {/* Food List */}
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addFoodToMeal(selectedMealId, food)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600">
                            Por {food.per}{food.unit}: {food.calories} kcal | 
                            P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                          </p>
                        </div>
                        <Plus className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanBuilder;