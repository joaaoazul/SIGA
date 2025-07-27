// src/modules/trainer/pages/Nutrition/components/calculators/CaloriesCalculator.js
import React, { useState } from 'react';
import {
  Calculator,
  User,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Info,
  Save,
  Copy,
  Share2,
  Zap,
  Heart,
  Brain,
  Scale
} from 'lucide-react';

const CaloriesCalculator = () => {
  const [activeMethod, setActiveMethod] = useState('harris'); // harris, mifflin, katch
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    bodyFat: '', // for Katch-McArdle
    activityLevel: 'moderate',
    goal: 'maintain',
    goalRate: 0.5 // kg per week
  });
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Validate form
  const isFormValid = () => {
    const { age, weight, height } = formData;
    const basicValid = age && weight && height;
    
    if (activeMethod === 'katch') {
      return basicValid && formData.bodyFat;
    }
    
    return basicValid;
  };

  // Calculate calories based on selected method
  const calculateCalories = () => {
    const { gender, age, weight, height, bodyFat, activityLevel, goal, goalRate } = formData;
    
    let bmr;
    
    // Calculate BMR based on method
    switch (activeMethod) {
      case 'harris':
        // Harris-Benedict Revised
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        break;
        
      case 'mifflin':
        // Mifflin-St Jeor
        if (gender === 'male') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        break;
        
      case 'katch':
        // Katch-McArdle (requires body fat %)
        const leanMass = weight * (1 - bodyFat / 100);
        bmr = 370 + (21.6 * leanMass);
        break;
        
      default:
        bmr = 0;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal adjustments (1kg = ~7700 kcal)
    let targetCalories = tdee;
    const weeklyDeficit = goalRate * 7700; // Total weekly calorie change needed
    const dailyAdjustment = weeklyDeficit / 7;

    if (goal === 'lose') {
      targetCalories = tdee - dailyAdjustment;
    } else if (goal === 'gain') {
      targetCalories = tdee + dailyAdjustment;
    }

    // Calculate macros based on goal
    const macros = calculateMacros(targetCalories, weight, goal);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      deficit: Math.round(targetCalories - tdee),
      ...macros,
      method: activeMethod
    });
  };

  // Calculate macros distribution
  const calculateMacros = (calories, weight, goal) => {
    let proteinGrams, fatGrams, carbGrams;
    
    switch (goal) {
      case 'lose':
        // Higher protein for muscle preservation
        proteinGrams = weight * 2.2; // 2.2g per kg
        fatGrams = calories * 0.25 / 9; // 25% from fat
        carbGrams = (calories - (proteinGrams * 4) - (fatGrams * 9)) / 4;
        break;
        
      case 'gain':
        // Moderate protein, higher carbs
        proteinGrams = weight * 1.8; // 1.8g per kg
        fatGrams = calories * 0.25 / 9; // 25% from fat
        carbGrams = (calories - (proteinGrams * 4) - (fatGrams * 9)) / 4;
        break;
        
      default: // maintain
        proteinGrams = weight * 2.0; // 2g per kg
        fatGrams = calories * 0.30 / 9; // 30% from fat
        carbGrams = (calories - (proteinGrams * 4) - (fatGrams * 9)) / 4;
    }

    return {
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      fiber: formData.gender === 'male' ? 38 : 25,
      water: Math.round(weight * 35) // 35ml per kg
    };
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Calculadora de Necessidades Calóricas
        </h3>
        <p className="text-gray-600">
          Calcule o TDEE e distribuição de macronutrientes
        </p>
      </div>

      {/* Calculation Method Selector */}
      <MethodSelector 
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-4">
          <BasicInfoForm 
            formData={formData}
            updateFormData={updateFormData}
            showBodyFat={activeMethod === 'katch'}
          />
          
          <ActivityGoalForm 
            formData={formData}
            updateFormData={updateFormData}
          />

          <button
            onClick={calculateCalories}
            disabled={!isFormValid()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Calculator className="h-5 w-5 inline mr-2" />
            Calcular Calorias
          </button>
        </div>

        {/* Results Section */}
        <div>
          {results ? (
            <ResultsDisplay 
              results={results}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
            />
          ) : (
            <EmptyResults />
          )}
        </div>
      </div>

      {/* Educational Info */}
      <EducationalInfo />
    </div>
  );
};

// Method Selector Component
const MethodSelector = ({ activeMethod, setActiveMethod }) => {
  const methods = [
    {
      id: 'harris',
      name: 'Harris-Benedict',
      description: 'Método mais usado e equilibrado',
      accuracy: 'Alta precisão para a maioria'
    },
    {
      id: 'mifflin',
      name: 'Mifflin-St Jeor',
      description: 'Mais preciso para sedentários',
      accuracy: 'Recomendado pela ADA'
    },
    {
      id: 'katch',
      name: 'Katch-McArdle',
      description: 'Requer % gordura corporal',
      accuracy: 'Mais preciso para atletas'
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Método de Cálculo</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {methods.map(method => (
          <button
            key={method.id}
            onClick={() => setActiveMethod(method.id)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              activeMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <p className={`font-medium mb-1 ${
              activeMethod === method.id ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {method.name}
            </p>
            <p className="text-xs text-gray-600 mb-1">{method.description}</p>
            <p className="text-xs text-gray-500">{method.accuracy}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Basic Info Form Component
const BasicInfoForm = ({ formData, updateFormData, showBodyFat }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Informações Básicas</h4>
      
      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateFormData('gender', 'male')}
            className={`p-2 rounded-lg border-2 ${
              formData.gender === 'male'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200'
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => updateFormData('gender', 'female')}
            className={`p-2 rounded-lg border-2 ${
              formData.gender === 'female'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200'
            }`}
          >
            Feminino
          </button>
        </div>
      </div>

      {/* Age, Weight, Height */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData('age', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="25"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData('weight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="70"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="175"
          />
        </div>
      </div>

      {/* Body Fat (conditional) */}
      {showBodyFat && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gordura Corporal (%)
          </label>
          <input
            type="number"
            value={formData.bodyFat}
            onChange={(e) => updateFormData('bodyFat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="15"
          />
          <p className="text-xs text-gray-500 mt-1">
            Necessário para o método Katch-McArdle
          </p>
        </div>
      )}
    </div>
  );
};

// Activity and Goal Form Component
const ActivityGoalForm = ({ formData, updateFormData }) => {
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
    { value: 'light', label: 'Levemente Ativo', description: '1-3 dias/semana' },
    { value: 'moderate', label: 'Moderadamente Ativo', description: '3-5 dias/semana' },
    { value: 'active', label: 'Muito Ativo', description: '6-7 dias/semana' },
    { value: 'veryActive', label: 'Extremamente Ativo', description: 'Treino 2x/dia' }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Atividade e Objetivos</h4>
      
      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nível de Atividade
        </label>
        <select
          value={formData.activityLevel}
          onChange={(e) => updateFormData('activityLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {activityLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateFormData('goal', 'lose')}
            className={`p-2 rounded-lg border-2 text-center ${
              formData.goal === 'lose'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-600" />
            <p className="text-sm">Perder Peso</p>
          </button>
          
          <button
            onClick={() => updateFormData('goal', 'maintain')}
            className={`p-2 rounded-lg border-2 text-center ${
              formData.goal === 'maintain'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <Scale className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-sm">Manter</p>
          </button>
          
          <button
            onClick={() => updateFormData('goal', 'gain')}
            className={`p-2 rounded-lg border-2 text-center ${
              formData.goal === 'gain'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <p className="text-sm">Ganhar Peso</p>
          </button>
        </div>
      </div>

      {/* Goal Rate */}
      {formData.goal !== 'maintain' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de {formData.goal === 'lose' ? 'Perda' : 'Ganho'} (kg/semana)
          </label>
          <input
            type="range"
            min="0.25"
            max="1"
            step="0.25"
            value={formData.goalRate}
            onChange={(e) => updateFormData('goalRate', parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.25kg</span>
            <span className="font-medium text-gray-900">{formData.goalRate}kg</span>
            <span>1kg</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {formData.goal === 'lose' 
              ? 'Recomendado: 0.5-0.75kg/semana para perda sustentável'
              : 'Recomendado: 0.25-0.5kg/semana para ganho limpo'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Results Display Component
const ResultsDisplay = ({ results, showDetails, setShowDetails }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Resultados</h4>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Primary Results */}
      <div className="space-y-3">
        <ResultItem 
          label="Taxa Metabólica Basal (TMB)"
          value={`${results.bmr} kcal/dia`}
          icon={Heart}
          color="text-red-600"
        />
        
        <ResultItem 
          label="Gasto Calórico Total (TDEE)"
          value={`${results.tdee} kcal/dia`}
          icon={Activity}
          color="text-orange-600"
        />
        
        <div className="pt-3 border-t">
          <ResultItem 
            label="Calorias Recomendadas"
            value={`${results.target} kcal/dia`}
            icon={Target}
            color="text-blue-600"
            isHighlighted
          />
          {results.deficit !== 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {results.deficit < 0 ? 'Défice' : 'Superávit'}: {Math.abs(results.deficit)} kcal/dia
            </p>
          )}
        </div>
      </div>

      {/* Macros Distribution */}
      <div className="pt-4 border-t">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-left"
        >
          <p className="font-medium text-gray-900">Distribuição de Macros Sugerida</p>
          <Info className="h-4 w-4 text-gray-400" />
        </button>
        
        {showDetails && (
          <div className="mt-4 space-y-2">
            <MacroItem 
              label="Proteína"
              value={results.protein}
              unit="g"
              calories={results.protein * 4}
              percentage={Math.round((results.protein * 4 / results.target) * 100)}
              color="green"
            />
            <MacroItem 
              label="Carboidratos"
              value={results.carbs}
              unit="g"
              calories={results.carbs * 4}
              percentage={Math.round((results.carbs * 4 / results.target) * 100)}
              color="orange"
            />
            <MacroItem 
              label="Gordura"
              value={results.fat}
              unit="g"
              calories={results.fat * 9}
              percentage={Math.round((results.fat * 9 / results.target) * 100)}
              color="yellow"
            />
            
            <div className="pt-3 mt-3 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fibra recomendada:</span>
                <span className="font-medium">{results.fiber}g/dia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Água recomendada:</span>
                <span className="font-medium">{results.water}ml/dia</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Method Note */}
      <p className="text-xs text-gray-500 text-center">
        Calculado usando o método {results.method === 'harris' ? 'Harris-Benedict' : 
                                    results.method === 'mifflin' ? 'Mifflin-St Jeor' : 
                                    'Katch-McArdle'}
      </p>
    </div>
  );
};

// Result Item Component
const ResultItem = ({ label, value, icon: Icon, color, isHighlighted }) => (
  <div className={`flex items-center justify-between ${isHighlighted ? 'text-lg' : ''}`}>
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className={`${isHighlighted ? 'font-medium' : 'text-sm'} text-gray-700`}>
        {label}
      </span>
    </div>
    <span className={`font-bold ${isHighlighted ? 'text-2xl ' + color : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

// Macro Item Component
const MacroItem = ({ label, value, unit, calories, percentage, color }) => {
  const colorClasses = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {value}{unit} • {calories} kcal • {percentage}%
        </span>
      </div>
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Empty Results Component
const EmptyResults = () => (
  <div className="bg-gray-50 rounded-lg p-12 text-center">
    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h4 className="text-lg font-medium text-gray-900 mb-2">
      Preencha os dados para calcular
    </h4>
    <p className="text-gray-600">
      Insira as informações básicas e clique em calcular para ver os resultados
    </p>
  </div>
);

// Educational Info Component
const EducationalInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Como funciona o cálculo?</h4>
        </div>
        <span className="text-blue-600">{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">Taxa Metabólica Basal (TMB)</p>
            <p>Calorias que o corpo gasta em repouso para manter funções vitais.</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Gasto Calórico Total (TDEE)</p>
            <p>TMB × Fator de Atividade = Total de calorias gastas por dia.</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Défice/Superávit Calórico</p>
            <p>
              Para perder 0.5kg/semana: défice de ~500 kcal/dia<br />
              Para ganhar 0.5kg/semana: superávit de ~500 kcal/dia
            </p>
          </div>
          
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs">
              Nota: Estes são valores estimados. Ajuste conforme resultados reais e consulte um nutricionista para planos personalizados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaloriesCalculator;