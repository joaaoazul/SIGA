// src/modules/trainer/pages/Nutrition/components/calculators/MacrosCalculator.js
import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Calculator,
  Target,
  Info,
  Save,
  ChevronDown,
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  Check,
  Copy,
  Share2
} from 'lucide-react';

const MacrosCalculator = ({ onSave, athleteData }) => {
  // Form state
  const [formData, setFormData] = useState({
    calories: 2500,
    goal: 'maintenance',
    activityLevel: 'moderate',
    proteinPreference: 'moderate',
    dietType: 'balanced',
    weight: athleteData?.weight || 75,
    height: athleteData?.height || 175,
    age: athleteData?.age || 30,
    gender: athleteData?.gender || 'male',
    athleteName: athleteData?.name || ''
  });

  // Calculation results
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState('standard');

  // Diet protocols
  const protocols = {
    standard: {
      name: 'Padrão Equilibrado',
      description: 'Distribuição tradicional recomendada',
      macros: {
        maintenance: { protein: 25, carbs: 45, fat: 30 },
        cutting: { protein: 35, carbs: 35, fat: 30 },
        bulking: { protein: 25, carbs: 50, fat: 25 }
      }
    },
    keto: {
      name: 'Cetogénica',
      description: 'Alta gordura, muito baixo carboidrato',
      macros: {
        all: { protein: 20, carbs: 5, fat: 75 }
      }
    },
    highProtein: {
      name: 'Alta Proteína',
      description: 'Maximizar preservação muscular',
      macros: {
        maintenance: { protein: 35, carbs: 35, fat: 30 },
        cutting: { protein: 40, carbs: 30, fat: 30 },
        bulking: { protein: 30, carbs: 45, fat: 25 }
      }
    },
    zone: {
      name: 'Dieta Zone',
      description: '40-30-30 (Carbs-Proteína-Gordura)',
      macros: {
        all: { protein: 30, carbs: 40, fat: 30 }
      }
    },
    iifym: {
      name: 'IIFYM Flexível',
      description: 'If It Fits Your Macros - personalizado',
      macros: {
        custom: true
      }
    }
  };

  // Goal descriptions
  const goals = {
    cutting: {
      name: 'Perda de Gordura',
      description: 'Défice calórico com alta proteína',
      color: 'red',
      icon: TrendingUp,
      proteinMultiplier: 2.2
    },
    maintenance: {
      name: 'Manutenção',
      description: 'Manter peso e composição atual',
      color: 'blue',
      icon: Activity,
      proteinMultiplier: 2.0
    },
    bulking: {
      name: 'Ganho de Massa',
      description: 'Superávit para crescimento muscular',
      color: 'green',
      icon: Zap,
      proteinMultiplier: 1.8
    }
  };

  // Calculate macros
  const calculateMacros = () => {
    const { calories, goal, weight, dietType } = formData;
    
    // Get protocol
    const protocol = protocols[activeProtocol];
    let macroPercentages;
    
    if (protocol.macros.custom) {
      // Custom IIFYM calculation
      const proteinGrams = weight * goals[goal].proteinMultiplier;
      const proteinCalories = proteinGrams * 4;
      const proteinPercentage = (proteinCalories / calories) * 100;
      
      const fatPercentage = 25; // Default fat
      const carbsPercentage = 100 - proteinPercentage - fatPercentage;
      
      macroPercentages = {
        protein: Math.round(proteinPercentage),
        carbs: Math.round(carbsPercentage),
        fat: Math.round(fatPercentage)
      };
    } else {
      macroPercentages = protocol.macros[goal] || protocol.macros.all;
    }

    // Calculate grams
    const proteinCalories = (calories * macroPercentages.protein) / 100;
    const carbsCalories = (calories * macroPercentages.carbs) / 100;
    const fatCalories = (calories * macroPercentages.fat) / 100;

    const macros = {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percentage: macroPercentages.protein,
        perKg: (proteinCalories / 4 / weight).toFixed(1)
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: Math.round(carbsCalories),
        percentage: macroPercentages.carbs,
        perKg: (carbsCalories / 4 / weight).toFixed(1)
      },
      fat: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percentage: macroPercentages.fat,
        perKg: (fatCalories / 9 / weight).toFixed(1)
      },
      fiber: {
        grams: Math.round(calories / 1000 * 14), // 14g per 1000 kcal
        min: 25,
        max: 38
      }
    };

    // Meal distribution
    const mealDistribution = calculateMealDistribution(calories, macros);

    setResults({
      totalCalories: calories,
      macros,
      mealDistribution,
      protocol: protocol.name,
      goal: goals[goal].name
    });
  };

  // Calculate meal distribution
  const calculateMealDistribution = (totalCalories, macros) => {
    const distributions = {
      '3meals': [
        { name: 'Pequeno-Almoço', percentage: 30 },
        { name: 'Almoço', percentage: 40 },
        { name: 'Jantar', percentage: 30 }
      ],
      '4meals': [
        { name: 'Pequeno-Almoço', percentage: 25 },
        { name: 'Almoço', percentage: 35 },
        { name: 'Lanche', percentage: 15 },
        { name: 'Jantar', percentage: 25 }
      ],
      '5meals': [
        { name: 'Pequeno-Almoço', percentage: 20 },
        { name: 'Meio da Manhã', percentage: 15 },
        { name: 'Almoço', percentage: 30 },
        { name: 'Lanche', percentage: 15 },
        { name: 'Jantar', percentage: 20 }
      ],
      '6meals': [
        { name: 'Pequeno-Almoço', percentage: 18 },
        { name: 'Meio da Manhã', percentage: 12 },
        { name: 'Almoço', percentage: 25 },
        { name: 'Lanche', percentage: 12 },
        { name: 'Jantar', percentage: 23 },
        { name: 'Ceia', percentage: 10 }
      ]
    };

    const selectedDist = distributions['4meals']; // Default 4 meals
    
    return selectedDist.map(meal => ({
      ...meal,
      calories: Math.round((totalCalories * meal.percentage) / 100),
      protein: Math.round((macros.protein.grams * meal.percentage) / 100),
      carbs: Math.round((macros.carbs.grams * meal.percentage) / 100),
      fat: Math.round((macros.fat.grams * meal.percentage) / 100)
    }));
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save calculation
  const handleSave = () => {
    if (results && onSave) {
      onSave({
        ...formData,
        ...results,
        calculatedAt: new Date().toISOString()
      });
    }
  };

  // Auto-calculate on changes
  useEffect(() => {
    if (formData.calories && formData.weight) {
      calculateMacros();
    }
  }, [formData, activeProtocol]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Calculadora de Macronutrientes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Distribua os macronutrientes baseado nos objetivos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Copy className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Calories Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calorias Totais (kcal)
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => handleChange('calories', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use o valor do TDEE calculado anteriormente
            </p>
          </div>

          {/* Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(goals).map(([key, goal]) => {
                const Icon = goal.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleChange('goal', key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.goal === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-1 text-${goal.color}-600`} />
                    <p className="text-xs font-medium">{goal.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso Corporal (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Column - Protocol Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protocolo de Dieta
            </label>
            <div className="space-y-2">
              {Object.entries(protocols).map(([key, protocol]) => (
                <button
                  key={key}
                  onClick={() => setActiveProtocol(key)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    activeProtocol === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{protocol.name}</p>
                      <p className="text-xs text-gray-600">{protocol.description}</p>
                    </div>
                    {activeProtocol === key && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          {/* Macros Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Distribuição de Macronutrientes</h4>
            
            {/* Visual Chart */}
            <div className="mb-6">
              <MacrosChart macros={results.macros} />
            </div>

            {/* Detailed Values */}
            <div className="grid grid-cols-3 gap-4">
              <MacroCard
                name="Proteína"
                value={results.macros.protein}
                color="green"
                icon="🥩"
              />
              <MacroCard
                name="Carboidratos"
                value={results.macros.carbs}
                color="orange"
                icon="🌾"
              />
              <MacroCard
                name="Gordura"
                value={results.macros.fat}
                color="yellow"
                icon="🥑"
              />
            </div>

            {/* Fiber */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🥬</span>
                  <span className="font-medium text-blue-900">Fibra Recomendada</span>
                </div>
                <span className="text-lg font-semibold text-blue-700">
                  {results.macros.fiber.grams}g/dia
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Mínimo: {results.macros.fiber.min}g • Máximo: {results.macros.fiber.max}g
              </p>
            </div>
          </div>

          {/* Meal Distribution */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full"
            >
              <h4 className="font-semibold text-gray-900">Distribuição por Refeições</h4>
              <ChevronDown className={`h-5 w-5 text-gray-600 transform transition-transform ${
                showDetails ? 'rotate-180' : ''
              }`} />
            </button>

            {showDetails && (
              <div className="mt-4 space-y-3">
                {results.mealDistribution.map((meal, index) => (
                  <MealDistributionCard key={index} meal={meal} />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Protocolo: {results.protocol} • Objetivo: {results.goal}</span>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cálculo</span>
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <MacrosTips goal={formData.goal} />
    </div>
  );
};

// Macros Visual Chart Component
const MacrosChart = ({ macros }) => {
  const { protein, carbs, fat } = macros;
  const total = protein.percentage + carbs.percentage + fat.percentage;

  return (
    <div className="relative h-40">
      <div className="flex h-full rounded-lg overflow-hidden">
        <div 
          className="bg-green-500 flex items-center justify-center text-white font-semibold"
          style={{ width: `${(protein.percentage / total) * 100}%` }}
        >
          {protein.percentage}%
        </div>
        <div 
          className="bg-orange-500 flex items-center justify-center text-white font-semibold"
          style={{ width: `${(carbs.percentage / total) * 100}%` }}
        >
          {carbs.percentage}%
        </div>
        <div 
          className="bg-yellow-500 flex items-center justify-center text-white font-semibold"
          style={{ width: `${(fat.percentage / total) * 100}%` }}
        >
          {fat.percentage}%
        </div>
      </div>
    </div>
  );
};

// Macro Card Component
const MacroCard = ({ name, value, color, icon }) => {
  return (
    <div className={`bg-white rounded-lg p-4 border-2 border-${color}-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-semibold text-${color}-600`}>
          {value.percentage}%
        </span>
      </div>
      <h5 className="font-medium text-gray-900">{name}</h5>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value.grams}g</p>
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600">{value.calories} kcal</p>
        <p className="text-xs text-gray-600">{value.perKg}g/kg peso</p>
      </div>
    </div>
  );
};

// Meal Distribution Card Component
const MealDistributionCard = ({ meal }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-medium text-gray-900">{meal.name}</h5>
        <span className="text-sm font-semibold text-blue-600">
          {meal.calories} kcal ({meal.percentage}%)
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Proteína:</span>
          <span className="font-medium ml-1">{meal.protein}g</span>
        </div>
        <div>
          <span className="text-gray-600">Carbs:</span>
          <span className="font-medium ml-1">{meal.carbs}g</span>
        </div>
        <div>
          <span className="text-gray-600">Gordura:</span>
          <span className="font-medium ml-1">{meal.fat}g</span>
        </div>
      </div>
    </div>
  );
};

// Macros Tips Component
const MacrosTips = ({ goal }) => {
  const tips = {
    cutting: [
      'Priorize proteína para preservar massa muscular',
      'Distribua carboidratos em torno dos treinos',
      'Mantenha gorduras saudáveis para hormônios'
    ],
    maintenance: [
      'Mantenha consistência na distribuição diária',
      'Ajuste conforme níveis de atividade',
      'Monitorize peso semanalmente'
    ],
    bulking: [
      'Aumente carboidratos gradualmente',
      'Distribua proteína ao longo do dia',
      'Não negligencie micronutrientes'
    ]
  };

  const currentTips = tips[goal] || tips.maintenance;

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 mb-2">Dicas para {goals[goal]?.name || 'Manutenção'}</h4>
          <ul className="space-y-1">
            {currentTips.map((tip, index) => (
              <li key={index} className="text-sm text-blue-800">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Goals data for tips
const goals = {
  cutting: { name: 'Perda de Gordura' },
  maintenance: { name: 'Manutenção' },
  bulking: { name: 'Ganho de Massa' }
};

export default MacrosCalculator;  