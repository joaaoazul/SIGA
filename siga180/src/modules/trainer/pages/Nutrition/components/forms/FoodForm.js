import React, { useState } from 'react';
import { 
  X, 
  Save,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Apple,
  Utensils,
  Tag,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

const FoodForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  // Form state
  const [foodData, setFoodData] = useState({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    category: initialData?.category || 'other',
    servingSize: initialData?.servingSize || 100,
    servingUnit: initialData?.servingUnit || 'g',
    calories: initialData?.calories || '',
    protein: initialData?.protein || '',
    carbs: initialData?.carbs || '',
    fat: initialData?.fat || '',
    fiber: initialData?.fiber || '',
    sugar: initialData?.sugar || '',
    sodium: initialData?.sodium || '',
    saturatedFat: initialData?.saturatedFat || '',
    transFat: initialData?.transFat || '',
    cholesterol: initialData?.cholesterol || '',
    tags: initialData?.tags || [],
    barcode: initialData?.barcode || '',
    isVerified: initialData?.isVerified || false,
    isCustom: initialData?.isCustom || true
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);

  // Food categories
  const categories = [
    { value: 'proteins', label: 'Proteins', icon: '🥩' },
    { value: 'carbs', label: 'Carbohydrates', icon: '🌾' },
    { value: 'fats', label: 'Fats & Oils', icon: '🥑' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { value: 'grains', label: 'Grains & Cereals', icon: '🌾' },
    { value: 'beverages', label: 'Beverages', icon: '🥤' },
    { value: 'snacks', label: 'Snacks', icon: '🍿' },
    { value: 'supplements', label: 'Supplements', icon: '💊' },
    { value: 'other', label: 'Other', icon: '🍽️' }
  ];

  // Serving units
  const servingUnits = [
    { value: 'g', label: 'grams (g)' },
    { value: 'ml', label: 'milliliters (ml)' },
    { value: 'cup', label: 'cup' },
    { value: 'tbsp', label: 'tablespoon' },
    { value: 'tsp', label: 'teaspoon' },
    { value: 'oz', label: 'ounce' },
    { value: 'unit', label: 'unit' },
    { value: 'slice', label: 'slice' },
    { value: 'piece', label: 'piece' }
  ];

  // Calculate percentages
  const calculateMacroPercentages = () => {
    const totalCalories = parseFloat(foodData.calories) || 0;
    if (totalCalories === 0) return { protein: 0, carbs: 0, fat: 0 };

    const proteinCal = (parseFloat(foodData.protein) || 0) * 4;
    const carbsCal = (parseFloat(foodData.carbs) || 0) * 4;
    const fatCal = (parseFloat(foodData.fat) || 0) * 9;

    return {
      protein: Math.round((proteinCal / totalCalories) * 100),
      carbs: Math.round((carbsCal / totalCalories) * 100),
      fat: Math.round((fatCal / totalCalories) * 100)
    };
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !foodData.tags.includes(newTag.trim())) {
      setFoodData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFoodData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!foodData.name.trim()) newErrors.name = 'Food name is required';
    if (!foodData.calories) newErrors.calories = 'Calories are required';
    if (!foodData.protein) newErrors.protein = 'Protein is required';
    if (!foodData.carbs) newErrors.carbs = 'Carbohydrates are required';
    if (!foodData.fat) newErrors.fat = 'Fat is required';
    
    // Validate macro calories match total calories (within 10% tolerance)
    const macroCalories = 
      (parseFloat(foodData.protein) || 0) * 4 +
      (parseFloat(foodData.carbs) || 0) * 4 +
      (parseFloat(foodData.fat) || 0) * 9;
    
    const totalCalories = parseFloat(foodData.calories) || 0;
    const difference = Math.abs(macroCalories - totalCalories);
    const tolerance = totalCalories * 0.1;
    
    if (difference > tolerance) {
      newErrors.calories = `Calories don't match macros (calculated: ${Math.round(macroCalories)} kcal)`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...foodData,
        // Convert string values to numbers
        servingSize: parseFloat(foodData.servingSize),
        calories: parseFloat(foodData.calories),
        protein: parseFloat(foodData.protein),
        carbs: parseFloat(foodData.carbs),
        fat: parseFloat(foodData.fat),
        fiber: parseFloat(foodData.fiber) || 0,
        sugar: parseFloat(foodData.sugar) || 0,
        sodium: parseFloat(foodData.sodium) || 0,
        saturatedFat: parseFloat(foodData.saturatedFat) || 0,
        transFat: parseFloat(foodData.transFat) || 0,
        cholesterol: parseFloat(foodData.cholesterol) || 0
      });
    }
  };

  const macroPercentages = calculateMacroPercentages();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Food' : 'Add New Food'}
          </h3>
          <p className="text-sm text-gray-500">
            Create a custom food entry for your database
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Basic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={foodData.name}
              onChange={(e) => setFoodData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Grilled Chicken Breast"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand (optional)
            </label>
            <input
              type="text"
              value={foodData.brand}
              onChange={(e) => setFoodData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Generic, Nestlé, etc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFoodData(prev => ({ ...prev, category: cat.value }))}
                className={`p-2 rounded-lg border-2 text-sm transition-all ${
                  foodData.category === cat.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <p className="text-xs mt-1">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.servingSize}
              onChange={(e) => setFoodData(prev => ({ ...prev, servingSize: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={foodData.servingUnit}
              onChange={(e) => setFoodData(prev => ({ ...prev, servingUnit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {servingUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Nutrition Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Nutrition Information</h4>
        
        {/* Main Macros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.calories}
              onChange={(e) => setFoodData(prev => ({ ...prev, calories: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.calories ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.calories && (
              <p className="text-xs text-red-600 mt-1">{errors.calories}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.protein}
              onChange={(e) => setFoodData(prev => ({ ...prev, protein: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.protein ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.carbs}
              onChange={(e) => setFoodData(prev => ({ ...prev, carbs: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.carbs ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.fat}
              onChange={(e) => setFoodData(prev => ({ ...prev, fat: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.fat ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </div>
        </div>

        {/* Macro Distribution */}
        {(foodData.calories && foodData.protein && foodData.carbs && foodData.fat) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Macro Distribution</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-16 text-sm text-gray-600">Protein:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${macroPercentages.protein}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{macroPercentages.protein}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 text-sm text-gray-600">Carbs:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${macroPercentages.carbs}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{macroPercentages.carbs}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 text-sm text-gray-600">Fat:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${macroPercentages.fat}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{macroPercentages.fat}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Nutrition */}
        <button
          type="button"
          onClick={() => setShowNutritionInfo(!showNutritionInfo)}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          {showNutritionInfo ? 'Hide' : 'Show'} Additional Nutrition Info
        </button>

        {showNutritionInfo && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Fiber (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={foodData.fiber}
                onChange={(e) => setFoodData(prev => ({ ...prev, fiber: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Sugar (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={foodData.sugar}
                onChange={(e) => setFoodData(prev => ({ ...prev, sugar: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Sodium (mg)
              </label>
              <input
                type="number"
                step="1"
                value={foodData.sodium}
                onChange={(e) => setFoodData(prev => ({ ...prev, sodium: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Saturated Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={foodData.saturatedFat}
                onChange={(e) => setFoodData(prev => ({ ...prev, saturatedFat: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Trans Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={foodData.transFat}
                onChange={(e) => setFoodData(prev => ({ ...prev, transFat: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cholesterol (mg)
              </label>
              <input
                type="number"
                step="1"
                value={foodData.cholesterol}
                onChange={(e) => setFoodData(prev => ({ ...prev, cholesterol: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tags & Attributes</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., gluten-free, high-protein, keto"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {foodData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {foodData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barcode (optional)
          </label>
          <input
            type="text"
            value={foodData.barcode}
            onChange={(e) => setFoodData(prev => ({ ...prev, barcode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter product barcode"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Per {foodData.servingSize} {foodData.servingUnit}</span>
        </div>
        
        <div className="flex items-center gap-3">
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
            {mode === 'edit' ? 'Update Food' : 'Add Food'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FoodForm;