// src/modules/trainer/pages/Nutrition/components/cards/FoodCard.js
import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  Star,
  Copy,
  Edit2,
  Eye,
  Plus,
  Info,
  TrendingUp,
  Droplets,
  Wheat,
  Fish,
  Apple,
  Milk,
  Salad,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const FoodCard = ({ food, onEdit, onCopy, onAddToMeal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedServing, setSelectedServing] = useState(food.serving);

  // Get category icon and color
  const getCategoryInfo = (category) => {
    const categoryMap = {
      proteins: { icon: Fish, color: 'red', label: 'Proteínas' },
      carbs: { icon: Wheat, color: 'orange', label: 'Carboidratos' },
      fats: { icon: Droplets, color: 'yellow', label: 'Gorduras' },
      dairy: { icon: Milk, color: 'blue', label: 'Lacticínios' },
      fruits: { icon: Apple, color: 'green', label: 'Frutas' },
      vegetables: { icon: Salad, color: 'emerald', label: 'Vegetais' }
    };
    return categoryMap[category] || { icon: Package, color: 'gray', label: 'Outro' };
  };

  const categoryInfo = getCategoryInfo(food.category);
  const CategoryIcon = categoryInfo.icon;

  // Calculate nutrition for selected serving
  const calculateNutrition = (baseValue, baseServing, selectedServing) => {
    // Extract numeric value from serving strings
    const getNumericValue = (serving) => {
      const match = serving.match(/(\d+)/);
      return match ? parseInt(match[1]) : 100;
    };

    const baseAmount = getNumericValue(baseServing);
    const selectedAmount = getNumericValue(selectedServing);
    
    return Math.round((baseValue * selectedAmount) / baseAmount);
  };

  const currentNutrition = {
    calories: calculateNutrition(food.calories, food.serving, selectedServing),
    protein: calculateNutrition(food.protein, food.serving, selectedServing),
    carbs: calculateNutrition(food.carbs, food.serving, selectedServing),
    fat: calculateNutrition(food.fat, food.serving, selectedServing),
    fiber: calculateNutrition(food.fiber, food.serving, selectedServing),
    sugar: calculateNutrition(food.sugar, food.serving, selectedServing),
    sodium: calculateNutrition(food.sodium, food.serving, selectedServing)
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{food.name}</h4>
              {food.verified && (
                <CheckCircle className="h-4 w-4 text-green-500" title="Verificado" />
              )}
            </div>
            <p className="text-sm text-gray-600">{food.brand}</p>
            {food.barcode && (
              <p className="text-xs text-gray-500 mt-1">
                <Package className="h-3 w-3 inline mr-1" />
                {food.barcode}
              </p>
            )}
          </div>
          
          {/* Category Badge */}
          <div className={`p-2 rounded-lg bg-${categoryInfo.color}-100`}>
            <CategoryIcon className={`h-5 w-5 text-${categoryInfo.color}-600`} />
          </div>
        </div>

        {/* Serving Selector */}
        {food.servingOptions && food.servingOptions.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Porção:
            </label>
            <select
              value={selectedServing}
              onChange={(e) => setSelectedServing(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {food.servingOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Main Nutrition Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <p className="text-3xl font-bold text-blue-600">{currentNutrition.calories}</p>
            <p className="text-sm text-gray-600">calorias</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">{currentNutrition.protein}g</p>
              <p className="text-xs text-gray-600">Proteína</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-orange-600">{currentNutrition.carbs}g</p>
              <p className="text-xs text-gray-600">Carbs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-yellow-600">{currentNutrition.fat}g</p>
              <p className="text-xs text-gray-600">Gordura</p>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Mais informações
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            {/* Additional Nutrition */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <p className="font-medium text-purple-600">{currentNutrition.fiber}g</p>
                <p className="text-xs text-gray-600">Fibra</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-pink-600">{currentNutrition.sugar}g</p>
                <p className="text-xs text-gray-600">Açúcar</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-indigo-600">{currentNutrition.sodium}mg</p>
                <p className="text-xs text-gray-600">Sódio</p>
              </div>
            </div>

            {/* Popularity and Usage */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{food.popularity}</span>
                <span className="text-xs text-gray-500">({food.usageCount} usos)</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>Popular</span>
              </div>
            </div>

            {/* Macros Distribution */}
            <MacrosDistribution nutrition={currentNutrition} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit?.(food)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onCopy?.(food)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Duplicar"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => onAddToMeal?.(food, selectedServing)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

// Macros Distribution Component
const MacrosDistribution = ({ nutrition }) => {
  const totalCalories = nutrition.calories;
  const proteinCalories = nutrition.protein * 4;
  const carbsCalories = nutrition.carbs * 4;
  const fatCalories = nutrition.fat * 9;

  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100) || 0;
  const carbsPercentage = Math.round((carbsCalories / totalCalories) * 100) || 0;
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100) || 0;

  return (
    <div className="bg-white rounded-lg p-3 border">
      <p className="text-xs font-medium text-gray-700 mb-2">Distribuição Calórica</p>
      
      {/* Stacked Bar */}
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex mb-2">
        <div
          className="bg-green-500 h-full"
          style={{ width: `${proteinPercentage}%` }}
          title={`Proteína: ${proteinPercentage}%`}
        />
        <div
          className="bg-orange-500 h-full"
          style={{ width: `${carbsPercentage}%` }}
          title={`Carboidratos: ${carbsPercentage}%`}
        />
        <div
          className="bg-yellow-500 h-full"
          style={{ width: `${fatPercentage}%` }}
          title={`Gordura: ${fatPercentage}%`}
        />
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>{proteinPercentage}% P</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
          <span>{carbsPercentage}% C</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>{fatPercentage}% G</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;