import React, { useState, useEffect } from 'react';
import { 
  Calculator,
  Info,
  User,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const MacroCalculator = ({ initialData = null, onCalculate }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    age: initialData?.age || '',
    gender: initialData?.gender || 'male',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    
    // Activity Level
    activityLevel: initialData?.activityLevel || 'moderate',
    exerciseDays: initialData?.exerciseDays || 3,
    exerciseIntensity: initialData?.exerciseIntensity || 'moderate',
    
    // Goal
    goal: initialData?.goal || 'maintain',
    targetRate: initialData?.targetRate || 0.5, // kg per week
    
    // Advanced Settings
    proteinRatio: initialData?.proteinRatio || 2.2, // g per kg body weight
    fiberTarget: initialData?.fiberTarget || 'auto',
    customFiber: initialData?.customFiber || 30,
    waterMultiplier: initialData?.waterMultiplier || 35 // ml per kg
  });

  const [results, setResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  // Activity level multipliers for TDEE calculation
  const activityMultipliers = {
    sedentary: 1.2,        // Little to no exercise
    light: 1.375,          // Light exercise 1-3 days/week
    moderate: 1.55,        // Moderate exercise 3-5 days/week
    active: 1.725,         // Heavy exercise 6-7 days/week
    veryActive: 1.9        // Very heavy physical job/training
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const { age, gender, height, weight } = formData;
    
    if (!age || !height || !weight) return 0;
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);
    
    if (gender === 'male') {
      return (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      return (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    return Math.round(bmr * activityMultipliers[formData.activityLevel]);
  };

  // Calculate target calories based on goal
  const calculateTargetCalories = (tdee) => {
    const { goal, targetRate } = formData;
    const weeklyDeficit = targetRate * 7700; // 1kg fat = ~7700 kcal
    const dailyDeficit = weeklyDeficit / 7;
    
    switch (goal) {
      case 'lose':
        return Math.round(tdee - dailyDeficit);
      case 'gain':
        return Math.round(tdee + (dailyDeficit * 0.5)); // Slower for muscle gain
      case 'maintain':
      default:
        return tdee;
    }
  };

  // Calculate macronutrient distribution
  const calculateMacros = (targetCalories) => {
    const { weight, proteinRatio, goal } = formData;
    const weightNum = parseFloat(weight);
    
    // Protein calculation
    const proteinGrams = Math.round(weightNum * proteinRatio);
    const proteinCalories = proteinGrams * 4;
    
    // Fat calculation (25-35% of total calories)
    const fatPercentage = goal === 'lose' ? 0.25 : 0.30;
    const fatCalories = Math.round(targetCalories * fatPercentage);
    const fatGrams = Math.round(fatCalories / 9);
    
    // Carbs calculation (remaining calories)
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    
    // Fiber calculation
    let fiberGrams;
    if (formData.fiberTarget === 'auto') {
      fiberGrams = Math.round(targetCalories / 1000 * 14); // 14g per 1000 kcal
    } else {
      fiberGrams = formData.customFiber;
    }
    
    // Water calculation
    const waterMl = Math.round(weightNum * formData.waterMultiplier);
    
    return {
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      fiber: fiberGrams,
      water: waterMl,
      // Percentages
      proteinPercent: Math.round((proteinCalories / targetCalories) * 100),
      carbsPercent: Math.round((carbCalories / targetCalories) * 100),
      fatPercent: Math.round((fatCalories / targetCalories) * 100)
    };
  };

  // Handle calculation
  const handleCalculate = () => {
    // Validate inputs
    const newErrors = {};
    if (!formData.age) newErrors.age = 'Idade é obrigatória';
    if (!formData.height) newErrors.height = 'Altura é obrigatória';
    if (!formData.weight) newErrors.weight = 'Peso é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // Calculate results
    const bmr = calculateBMR();
    const tdee = calculateTDEE();
    const targetCalories = calculateTargetCalories(tdee);
    const macros = calculateMacros(targetCalories);
    
    const calculationResults = {
      bmr,
      tdee,
      targetCalories,
      deficit: tdee - targetCalories,
      macros,
      summary: {
        weeklyChange: formData.goal === 'maintain' ? 0 : formData.targetRate,
        monthlyChange: formData.goal === 'maintain' ? 0 : formData.targetRate * 4,
        timeToGoal: null // Can be calculated if target weight is provided
      }
    };
    
    setResults(calculationResults);
    
    // Pass results to parent
    if (onCalculate) {
      onCalculate(calculationResults);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Calculadora de Macronutrientes</h2>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.age ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 28"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.height ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 175"
                />
                {errors.height && (
                  <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.weight ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 78.5"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Nível de Atividade
            </h3>
            <div className="space-y-3">
              <select
                value={formData.activityLevel}
                onChange={(e) => updateField('activityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                <option value="light">Levemente ativo (1-3 dias/semana)</option>
                <option value="moderate">Moderadamente ativo (3-5 dias/semana)</option>
                <option value="active">Muito ativo (6-7 dias/semana)</option>
                <option value="veryActive">Extremamente ativo (atleta/trabalho físico)</option>
              </select>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Inclua todas as atividades: exercício, trabalho, deslocações e atividades diárias.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Objetivo
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateField('goal', 'lose')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.goal === 'lose'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <TrendingDown className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Perder Peso</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('goal', 'maintain')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.goal === 'maintain'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Minus className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Manter</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('goal', 'gain')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.goal === 'gain'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Ganhar Peso</span>
                </button>
              </div>

              {formData.goal !== 'maintain' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de mudança semanal (kg)
                  </label>
                  <select
                    value={formData.targetRate}
                    onChange={(e) => updateField('targetRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0.25">0.25 kg/semana (Lento)</option>
                    <option value="0.5">0.5 kg/semana (Moderado)</option>
                    <option value="0.75">0.75 kg/semana (Rápido)</option>
                    <option value="1">1 kg/semana (Muito Rápido)</option>
                  </select>
                  {formData.goal === 'lose' && formData.targetRate > 0.5 && (
                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Perdas superiores a 0.5kg/semana podem resultar em perda de massa muscular
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              {showAdvanced ? 'Ocultar' : 'Mostrar'} Configurações Avançadas
              <Info className="h-4 w-4 ml-1" />
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proteína (g/kg peso corporal)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.proteinRatio}
                    onChange={(e) => updateField('proteinRatio', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Recomendado: 1.6-2.2g/kg para ganho muscular, 2.0-2.4g/kg para perda de gordura
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fibra
                  </label>
                  <div className="space-y-2">
                    <select
                      value={formData.fiberTarget}
                      onChange={(e) => updateField('fiberTarget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">Automático (14g por 1000kcal)</option>
                      <option value="custom">Personalizado</option>
                    </select>
                    
                    {formData.fiberTarget === 'custom' && (
                      <input
                        type="number"
                        value={formData.customFiber}
                        onChange={(e) => updateField('customFiber', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Gramas de fibra por dia"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Água (ml/kg peso corporal)
                  </label>
                  <input
                    type="number"
                    value={formData.waterMultiplier}
                    onChange={(e) => updateField('waterMultiplier', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Recomendado: 35-40ml/kg, aumentar com exercício intenso
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calcular Macros
          </button>

          {/* Results */}
          {results && (
            <div className="mt-6 space-y-4">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Resultados do Cálculo
                </h3>

                {/* Energy Balance */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Balanço Energético</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa Metabólica Basal (BMR)</span>
                      <span className="font-medium">{results.bmr} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gasto Energético Total (TDEE)</span>
                      <span className="font-medium">{results.tdee} kcal</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium text-gray-700">Calorias Alvo</span>
                      <span className="text-lg font-bold text-blue-600">{results.targetCalories} kcal</span>
                    </div>
                    {results.deficit !== 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {results.deficit > 0 ? 'Déficit' : 'Superávit'} Diário
                        </span>
                        <span className={`font-medium ${results.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.abs(results.deficit)} kcal
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Macronutrients */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição de Macronutrientes</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Proteína</span>
                        <span className="font-medium">{results.macros.protein}g ({results.macros.proteinPercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${results.macros.proteinPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Carboidratos</span>
                        <span className="font-medium">{results.macros.carbs}g ({results.macros.carbsPercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${results.macros.carbsPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Gordura</span>
                        <span className="font-medium">{results.macros.fat}g ({results.macros.fatPercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${results.macros.fatPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Fibra</span>
                      <span className="font-medium">{results.macros.fiber}g/dia</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Água</span>
                      <span className="font-medium">{results.macros.water}ml/dia</span>
                    </div>
                  </div>
                </div>

                {/* Progress Estimates */}
                {formData.goal !== 'maintain' && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Estimativa de Progresso</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mudança Semanal</span>
                        <span className="font-medium">
                          {formData.goal === 'lose' ? '-' : '+'}{results.summary.weeklyChange}kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mudança Mensal</span>
                        <span className="font-medium">
                          {formData.goal === 'lose' ? '-' : '+'}{results.summary.monthlyChange}kg
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {onCalculate && (
                  <div className="mt-4">
                    <button
                      onClick={() => onCalculate(results)}
                      className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Usar Estes Valores
                    </button>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Clique para avançar para o próximo passo
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;