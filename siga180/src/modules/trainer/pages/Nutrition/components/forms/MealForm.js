import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Minus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Utensils,
  Info
} from 'lucide-react';

const MealForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  clientId = null,
  planId = null 
}) => {
  // Form state
  const [mealData, setMealData] = useState({
    clientId: clientId || initialData?.clientId || '',
    planId: planId || initialData?.planId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    mealType: initialData?.mealType || 'breakfast',
    foods: initialData?.foods || [],
    notes: initialData?.notes || '',
    compliance: initialData?.compliance || 100,
    time: initialData?.time || ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [errors, setErrors] = useState({});

  // Mock food database for search
  const mockFoods = [
    { id: 1, name: 'Chicken Breast (grilled)', unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, per: 100 },
    { id: 2, name: 'Brown Rice (cooked)', unit: 'g', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, per: 100 },
    { id: 3, name: 'Broccoli (steamed)', unit: 'g', calories: 35, protein: 2.8, carbs: 7.2, fat: 0.4, per: 100 },
    { id: 4, name: 'Banana', unit: 'unit', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, per: 1 },
    { id: 5, name: 'Whole Eggs', unit: 'unit', calories: 70, protein: 6, carbs: 0.6, fat: 5, per: 1 },
    { id: 6, name: 'Oatmeal (dry)', unit: 'g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, per: 100 },
    { id: 7, name: 'Greek Yogurt', unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, per: 100 },
    { id: 8, name: 'Almonds', unit: 'g', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, per: 100 }
  ];

  // Meal types
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🥜' },
    { value: 'pre-workout', label: 'Pre-workout', icon: '💪' },
    { value: 'post-workout', label: 'Post-workout', icon: '🏃' }
  ];

  // Calculate totals
  const calculateTotals = () => {
    return mealData.foods.reduce((totals, food) => {
      const multiplier = food.quantity / food.per;
      return {
        calories: totals.calories + (food.calories * multiplier),
        protein: totals.protein + (food.protein * multiplier),
        carbs: totals.carbs + (food.carbs * multiplier),
        fat: totals.fat + (food.fat * multiplier)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Add food to meal
  const addFood = () => {
    if (!selectedFood) return;

    const foodToAdd = {
      ...selectedFood,
      quantity: quantity,
      id: Date.now() // temporary ID
    };

    setMealData(prev => ({
      ...prev,
      foods: [...prev.foods, foodToAdd]
    }));

    // Reset
    setSelectedFood(null);
    setQuantity(100);
    setShowFoodSearch(false);
    setSearchTerm('');
  };

  // Remove food from meal
  const removeFood = (foodId) => {
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.filter(f => f.id !== foodId)
    }));
  };

  // Update food quantity
  const updateFoodQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.map(f => 
        f.id === foodId ? { ...f, quantity: newQuantity } : f
      )
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!mealData.clientId) newErrors.clientId = 'Client is required';
    if (mealData.foods.length === 0) newErrors.foods = 'Add at least one food item';
    if (!mealData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const totals = calculateTotals();
      onSubmit({
        ...mealData,
        totals
      });
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? 'Edit Meal' : 'Log New Meal'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={mealData.date}
              onChange={(e) => setMealData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.date && (
            <p className="text-xs text-red-600 mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time (optional)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={mealData.time}
              onChange={(e) => setMealData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Meal Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mealTypes.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setMealData(prev => ({ ...prev, mealType: type.value }))}
              className={`p-3 rounded-lg border-2 transition-all ${
                mealData.mealType === type.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{type.icon}</span>
              <p className="text-sm font-medium">{type.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Foods Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Foods
          </label>
          <button
            type="button"
            onClick={() => setShowFoodSearch(true)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Food
          </button>
        </div>

        {errors.foods && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-600">{errors.foods}</p>
          </div>
        )}

        {/* Food List */}
        <div className="space-y-2">
          {mealData.foods.map(food => {
            const multiplier = food.quantity / food.per;
            return (
              <div key={food.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{food.name}</h4>
                  <button
                    type="button"
                    onClick={() => removeFood(food.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateFoodQuantity(food.id, food.quantity - 10)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={food.quantity}
                      onChange={(e) => updateFoodQuantity(food.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">{food.unit}</span>
                    <button
                      type="button"
                      onClick={() => updateFoodQuantity(food.id, food.quantity + 10)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {Math.round(food.calories * multiplier)} kcal | 
                    P: {Math.round(food.protein * multiplier)}g | 
                    C: {Math.round(food.carbs * multiplier)}g | 
                    F: {Math.round(food.fat * multiplier)}g
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        {mealData.foods.length > 0 && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-medium text-emerald-900 mb-2">Meal Totals</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-900">{Math.round(totals.calories)}</p>
                <p className="text-xs text-emerald-700">Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">{Math.round(totals.protein)}</p>
                <p className="text-xs text-emerald-700">Protein (g)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">{Math.round(totals.carbs)}</p>
                <p className="text-xs text-emerald-700">Carbs (g)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">{Math.round(totals.fat)}</p>
                <p className="text-xs text-emerald-700">Fat (g)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={mealData.notes}
          onChange={(e) => setMealData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Any additional notes about this meal..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {initialData ? 'Update Meal' : 'Log Meal'}
        </button>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Food</h3>
                <button
                  type="button"
                  onClick={() => setShowFoodSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search foods..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {mockFoods
                  .filter(food => 
                    food.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(food => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => setSelectedFood(food)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedFood?.id === food.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600">
                            per {food.per} {food.unit}: {food.calories} kcal
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          <p>P: {food.protein}g</p>
                          <p>C: {food.carbs}g</p>
                          <p>F: {food.fat}g</p>
                        </div>
                      </div>
                    </button>
                  ))
                }
              </div>
            </div>
            
            {selectedFood && (
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{selectedFood.name}</p>
                    <p className="text-sm text-gray-600">Selected</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(10, quantity - 10))}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">{selectedFood.unit}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 10)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addFood}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add to Meal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default MealForm;