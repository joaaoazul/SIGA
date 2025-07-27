// src/modules/trainer/pages/Nutrition/components/modals/CreatePlanModal.js
import React, { useState } from 'react';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Zap,
  TrendingUp,
  RefreshCw,
  Shield,
  Calendar,
  Target,
  Calculator,
  AlertCircle,
  User,
  Scale,
  Activity,
  Heart,
  Brain,
  Plus,
  Minus
} from 'lucide-react';

const CreatePlanModal = ({ onClose, selectedAthlete, athletes }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [planData, setPlanData] = useState({
    // Step 1 - Athlete Selection
    athleteId: selectedAthlete?.id || '',
    name: '',
    type: 'cutting',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    
    // Step 2 - Macros & Calories
    calculationMethod: 'auto', // auto or manual
    activityLevel: 'moderate',
    weeklyGoal: -0.5, // kg per week
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: 30,
    water: 2500,
    
    // Step 3 - Details & Preferences
    mealPlan: 'flexible',
    mealsPerDay: 4,
    trainingDays: ['Mon', 'Wed', 'Fri'],
    weeklyCheckIn: true,
    supplements: [],
    restrictions: [],
    notes: ''
  });

  // Get selected athlete data
  const athlete = athletes.find(a => a.id === parseInt(planData.athleteId));

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!planData.athleteId) newErrors.athleteId = 'Selecione um atleta';
        if (!planData.name) newErrors.name = 'Nome do plano é obrigatório';
        if (!planData.startDate) newErrors.startDate = 'Data de início é obrigatória';
        if (!planData.endDate) newErrors.endDate = 'Data de fim é obrigatória';
        if (planData.endDate && planData.startDate && new Date(planData.endDate) <= new Date(planData.startDate)) {
          newErrors.endDate = 'Data de fim deve ser posterior à data de início';
        }
        break;
      
      case 2:
        if (!planData.calories || planData.calories <= 0) newErrors.calories = 'Calorias são obrigatórias';
        if (!planData.protein || planData.protein <= 0) newErrors.protein = 'Proteína é obrigatória';
        if (!planData.carbs || planData.carbs < 0) newErrors.carbs = 'Carboidratos são obrigatórios';
        if (!planData.fat || planData.fat <= 0) newErrors.fat = 'Gordura é obrigatória';
        
        // Validate macros sum to approximately calories
        const totalCalories = (planData.protein * 4) + (planData.carbs * 4) + (planData.fat * 9);
        const difference = Math.abs(totalCalories - planData.calories);
        if (difference > 50) {
          newErrors.macros = `Total de macros (${Math.round(totalCalories)} kcal) não corresponde às calorias definidas`;
        }
        break;
        
      case 3:
        // Step 3 validations are optional
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate macros automatically
  const calculateMacros = () => {
    if (!athlete) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Basic TDEE calculation (Harris-Benedict)
      const { weight, height, age, activityLevel } = athlete;
      let bmr;
      
      // Assuming male for now (should come from athlete data)
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      
      // Activity multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        low: 1.375,
        moderate: 1.55,
        high: 1.725,
        veryHigh: 1.9
      };
      
      const tdee = bmr * (activityMultipliers[planData.activityLevel] || 1.55);
      
      // Adjust based on goal
      let targetCalories = tdee;
      if (planData.type === 'cutting') {
        targetCalories = tdee + (planData.weeklyGoal * 1100); // 1kg ≈ 7700 kcal / 7 days
      } else if (planData.type === 'bulking') {
        targetCalories = tdee + (Math.abs(planData.weeklyGoal) * 1100);
      }
      
      // Calculate macros based on plan type
      let proteinRatio, carbRatio, fatRatio;
      
      switch (planData.type) {
        case 'cutting':
          proteinRatio = 0.35; // 35% protein
          carbRatio = 0.35;    // 35% carbs
          fatRatio = 0.30;     // 30% fat
          break;
        case 'bulking':
          proteinRatio = 0.25; // 25% protein
          carbRatio = 0.50;    // 50% carbs
          fatRatio = 0.25;     // 25% fat
          break;
        case 'recomp':
          proteinRatio = 0.30; // 30% protein
          carbRatio = 0.40;    // 40% carbs
          fatRatio = 0.30;     // 30% fat
          break;
        default: // maintenance
          proteinRatio = 0.25;
          carbRatio = 0.45;
          fatRatio = 0.30;
      }
      
      const proteinCalories = targetCalories * proteinRatio;
      const carbCalories = targetCalories * carbRatio;
      const fatCalories = targetCalories * fatRatio;
      
      setPlanData(prev => ({
        ...prev,
        calories: Math.round(targetCalories),
        protein: Math.round(proteinCalories / 4), // 4 kcal per gram
        carbs: Math.round(carbCalories / 4),      // 4 kcal per gram
        fat: Math.round(fatCalories / 9),         // 9 kcal per gram
        water: Math.round(weight * 35)            // 35ml per kg
      }));
      
      setIsCalculating(false);
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(3)) {
      console.log('Creating plan:', planData);
      // Here you would call the API to create the plan
      onClose();
    }
  };

  // Navigate steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Criar Novo Plano Nutricional</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {currentStep === 1 && (
            <Step1AthleteSelection
              planData={planData}
              setPlanData={setPlanData}
              athletes={athletes}
              errors={errors}
            />
          )}
          
          {currentStep === 2 && (
            <Step2MacrosCalculation
              planData={planData}
              setPlanData={setPlanData}
              athlete={athlete}
              errors={errors}
              calculateMacros={calculateMacros}
              isCalculating={isCalculating}
            />
          )}
          
          {currentStep === 3 && (
            <Step3DetailsPreferences
              planData={planData}
              setPlanData={setPlanData}
              errors={errors}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Anterior
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Próximo
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="h-5 w-5 mr-2" />
                Criar Plano
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Indicator Component
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Atleta e Tipo' },
    { number: 2, label: 'Macros e Calorias' },
    { number: 3, label: 'Detalhes e Preferências' }
  ];

  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex-1">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.number 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}>
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{step.label}</p>
        </div>
      ))}
    </div>
  );
};

// Step 1: Athlete Selection Component
const Step1AthleteSelection = ({ planData, setPlanData, athletes, errors }) => {
  const updatePlanData = (field, value) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const planTypes = [
    { 
      value: 'cutting', 
      label: 'Cutting', 
      icon: Zap, 
      description: 'Perder gordura mantendo massa muscular',
      color: 'red' 
    },
    { 
      value: 'bulking', 
      label: 'Bulking', 
      icon: TrendingUp, 
      description: 'Ganhar massa muscular',
      color: 'blue' 
    },
    { 
      value: 'recomp', 
      label: 'Recomposição', 
      icon: RefreshCw, 
      description: 'Perder gordura e ganhar músculo',
      color: 'purple' 
    },
    { 
      value: 'maintenance', 
      label: 'Manutenção', 
      icon: Shield, 
      description: 'Manter peso e composição',
      color: 'green' 
    }
  ];

  // Auto-generate plan name based on type and athlete
  const generatePlanName = (type, athleteId) => {
    const athlete = athletes.find(a => a.id === parseInt(athleteId));
    if (!athlete) return '';
    
    const typeNames = {
      cutting: 'Cutting',
      bulking: 'Bulking',
      recomp: 'Recomposição',
      maintenance: 'Manutenção'
    };
    
    return `Plano de ${typeNames[type]} - ${athlete.name}`;
  };

  return (
    <div className="space-y-6">
      {/* Athlete Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Atleta *
        </label>
        <select
          value={planData.athleteId}
          onChange={(e) => {
            updatePlanData('athleteId', e.target.value);
            if (planData.type && e.target.value) {
              updatePlanData('name', generatePlanName(planData.type, e.target.value));
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.athleteId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Escolher atleta...</option>
          {athletes.map(athlete => (
            <option key={athlete.id} value={athlete.id}>
              {athlete.name} - {athlete.goal} ({athlete.weight}kg)
            </option>
          ))}
        </select>
        {errors.athleteId && (
          <p className="mt-1 text-sm text-red-600">{errors.athleteId}</p>
        )}
      </div>

      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Plano *
        </label>
        <input
          type="text"
          value={planData.name}
          onChange={(e) => updatePlanData('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ex: Plano de Cutting Progressivo"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Plan Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Plano *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {planTypes.map(type => {
            const Icon = type.icon;
            const isSelected = planData.type === type.value;
            
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  updatePlanData('type', type.value);
                  if (planData.athleteId) {
                    updatePlanData('name', generatePlanName(type.value, planData.athleteId));
                  }
                }}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className={`font-medium mb-1 ${
                  isSelected ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {type.label}
                </p>
                <p className="text-xs text-gray-600">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início *
          </label>
          <input
            type="date"
            value={planData.startDate}
            onChange={(e) => updatePlanData('startDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Fim *
          </label>
          <input
            type="date"
            value={planData.endDate}
            onChange={(e) => updatePlanData('endDate', e.target.value)}
            min={planData.startDate || new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Duration Info */}
      {planData.startDate && planData.endDate && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">
                Duração do plano: {Math.ceil((new Date(planData.endDate) - new Date(planData.startDate)) / (1000 * 60 * 60 * 24))} dias
              </p>
              <p className="text-blue-700 mt-1">
                Aproximadamente {Math.ceil((new Date(planData.endDate) - new Date(planData.startDate)) / (1000 * 60 * 60 * 24 * 7))} semanas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 2: Macros Calculation Component
const Step2MacrosCalculation = ({ 
  planData, 
  setPlanData, 
  athlete, 
  errors, 
  calculateMacros, 
  isCalculating 
}) => {
  const updatePlanData = (field, value) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Calculation Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Método de Cálculo
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updatePlanData('calculationMethod', 'auto')}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              planData.calculationMethod === 'auto'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Calculator className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="font-medium">Cálculo Automático</p>
            <p className="text-xs text-gray-600">Baseado nos dados do atleta</p>
          </button>
          
          <button
            type="button"
            onClick={() => updatePlanData('calculationMethod', 'manual')}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              planData.calculationMethod === 'manual'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Edit2 className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <p className="font-medium">Entrada Manual</p>
            <p className="text-xs text-gray-600">Definir valores manualmente</p>
          </button>
        </div>
      </div>

      {/* Auto Calculation Options */}
      {planData.calculationMethod === 'auto' && (
        <>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Cálculo baseado em:</p>
                <ul className="mt-1 text-blue-700 space-y-1">
                  <li>• Peso: {athlete?.weight}kg</li>
                  <li>• Altura: {athlete?.height}cm</li>
                  <li>• Idade: {athlete?.age} anos</li>
                  <li>• Objetivo: {planData.type}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Atividade
              </label>
              <select
                value={planData.activityLevel}
                onChange={(e) => updatePlanData('activityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                <option value="low">Levemente ativo (1-3 dias/semana)</option>
                <option value="moderate">Moderadamente ativo (3-5 dias/semana)</option>
                <option value="high">Muito ativo (6-7 dias/semana)</option>
                <option value="veryHigh">Extremamente ativo (2x por dia)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Semanal
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updatePlanData('weeklyGoal', Math.max(planData.weeklyGoal - 0.1, -1))}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={planData.weeklyGoal}
                  onChange={(e) => updatePlanData('weeklyGoal', parseFloat(e.target.value))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                  step="0.1"
                  min="-1"
                  max="0.5"
                />
                <button
                  type="button"
                  onClick={() => updatePlanData('weeklyGoal', Math.min(planData.weeklyGoal + 0.1, 0.5))}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">kg/semana</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {planData.weeklyGoal < 0 ? 'Perder' : 'Ganhar'} {Math.abs(planData.weeklyGoal)}kg por semana
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={calculateMacros}
              disabled={isCalculating || !athlete}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calcular Macros
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Macros Input */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Valores Nutricionais</h3>
        
        {/* Calories */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calorias Diárias *
          </label>
          <input
            type="number"
            value={planData.calories}
            onChange={(e) => updatePlanData('calories', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.calories ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="2400"
          />
          {errors.calories && (
            <p className="mt-1 text-sm text-red-600">{errors.calories}</p>
          )}
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proteína (g) *
            </label>
            <input
              type="number"
              value={planData.protein}
              onChange={(e) => updatePlanData('protein', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.protein ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="180"
            />
            {errors.protein && (
              <p className="mt-1 text-xs text-red-600">{errors.protein}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carboidratos (g) *
            </label>
            <input
              type="number"
              value={planData.carbs}
              onChange={(e) => updatePlanData('carbs', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.carbs ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="240"
            />
            {errors.carbs && (
              <p className="mt-1 text-xs text-red-600">{errors.carbs}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gordura (g) *
            </label>
            <input
              type="number"
              value={planData.fat}
              onChange={(e) => updatePlanData('fat', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fat ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="80"
            />
            {errors.fat && (
              <p className="mt-1 text-xs text-red-600">{errors.fat}</p>
            )}
          </div>
        </div>

        {/* Macros Validation */}
        {errors.macros && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{errors.macros}</p>
          </div>
        )}

        {/* Macros Summary */}
        {planData.calories && planData.protein && planData.carbs && planData.fat && (
          <MacrosSummary 
            calories={planData.calories}
            protein={planData.protein}
            carbs={planData.carbs}
            fat={planData.fat}
          />
        )}

        {/* Additional Nutrients */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fibra (g)
            </label>
            <input
              type="number"
              value={planData.fiber}
              onChange={(e) => updatePlanData('fiber', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Água (ml)
            </label>
            <input
              type="number"
              value={planData.water}
              onChange={(e) => updatePlanData('water', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2500"
              step="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Macros Summary Component
const MacrosSummary = ({ calories, protein, carbs, fat }) => {
  const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9);
  const proteinPercentage = Math.round((protein * 4 / totalCalories) * 100);
  const carbsPercentage = Math.round((carbs * 4 / totalCalories) * 100);
  const fatPercentage = Math.round((fat * 9 / totalCalories) * 100);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Distribuição de Macros</span>
        <span className="text-sm text-gray-600">
          Total: {Math.round(totalCalories)} kcal 
          {Math.abs(totalCalories - calories) > 50 && (
            <span className="text-red-600 ml-1">
              ({totalCalories > calories ? '+' : ''}{Math.round(totalCalories - calories)})
            </span>
          )}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Proteína: {protein}g ({proteinPercentage}%)</span>
          </div>
          <span className="text-gray-600">{protein * 4} kcal</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Carboidratos: {carbs}g ({carbsPercentage}%)</span>
          </div>
          <span className="text-gray-600">{carbs * 4} kcal</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Gordura: {fat}g ({fatPercentage}%)</span>
          </div>
          <span className="text-gray-600">{fat * 9} kcal</span>
        </div>
      </div>
    </div>
  );
};

// Step 3: Details and Preferences Component
const Step3DetailsPreferences = ({ planData, setPlanData, errors }) => {
  const updatePlanData = (field, value) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setPlanData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const supplementOptions = [
    'Whey Protein',
    'Creatina',
    'Multivitamínico',
    'Ômega 3',
    'Vitamina D',
    'BCAA',
    'Glutamina',
    'Pré-treino',
    'ZMA',
    'Colagénio'
  ];

  const restrictionOptions = [
    'Lactose',
    'Glúten',
    'Vegetariano',
    'Vegano',
    'Sem Açúcar',
    'Low Carb',
    'Keto',
    'Paleo',
    'Sem Frutos Secos',
    'Sem Marisco'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Meal Structure */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Estrutura das Refeições
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updatePlanData('mealPlan', 'flexible')}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              planData.mealPlan === 'flexible'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="font-medium">Flexível</p>
            <p className="text-xs text-gray-600">IIFYM</p>
          </button>
          
          <button
            type="button"
            onClick={() => updatePlanData('mealPlan', 'structured')}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              planData.mealPlan === 'structured'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <p className="font-medium">Estruturado</p>
            <p className="text-xs text-gray-600">Refeições definidas</p>
          </button>
          
          <button
            type="button"
            onClick={() => updatePlanData('mealPlan', 'intermittent')}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              planData.mealPlan === 'intermittent'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <p className="font-medium">Jejum Intermitente</p>
            <p className="text-xs text-gray-600">Janela alimentar</p>
          </button>
        </div>
      </div>

      {/* Meals per Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Refeições por Dia
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="3"
            max="6"
            value={planData.mealsPerDay}
            onChange={(e) => updatePlanData('mealsPerDay', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-center font-medium text-gray-900">
            {planData.mealsPerDay}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3 refeições</span>
          <span>6 refeições</span>
        </div>
      </div>

      {/* Training Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dias de Treino
        </label>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayValue = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index];
            const isSelected = planData.trainingDays.includes(dayValue);
            
            return (
              <button
                key={dayValue}
                type="button"
                onClick={() => toggleArrayItem('trainingDays', dayValue)}
                className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {planData.trainingDays.length} dias de treino selecionados
        </p>
      </div>

      {/* Supplements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Suplementos Recomendados
        </label>
        <div className="flex flex-wrap gap-2">
          {supplementOptions.map(supplement => (
            <button
              key={supplement}
              type="button"
              onClick={() => toggleArrayItem('supplements', supplement)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                planData.supplements.includes(supplement)
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } border`}
            >
              {supplement}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Restrições Alimentares
        </label>
        <div className="flex flex-wrap gap-2">
          {restrictionOptions.map(restriction => (
            <button
              key={restriction}
              type="button"
              onClick={() => toggleArrayItem('restrictions', restriction)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                planData.restrictions.includes(restriction)
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } border`}
            >
              {restriction}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Check-in */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={planData.weeklyCheckIn}
            onChange={(e) => updatePlanData('weeklyCheckIn', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <span className="font-medium text-gray-900">Check-in Semanal Obrigatório</span>
            <p className="text-xs text-gray-500">
              O atleta deve fazer check-in semanalmente para ajustes
            </p>
          </div>
        </label>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas Adicionais
        </label>
        <textarea
          value={planData.notes}
          onChange={(e) => updatePlanData('notes', e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Instruções especiais, observações sobre o plano..."
        />
      </div>

      {/* Plan Summary */}
      <PlanSummary planData={planData} />
    </div>
  );
};

// Plan Summary Component
const PlanSummary = ({ planData }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Resumo do Plano</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tipo:</span>
          <span className="font-medium capitalize">{planData.type}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Duração:</span>
          <span className="font-medium">
            {Math.ceil((new Date(planData.endDate) - new Date(planData.startDate)) / (1000 * 60 * 60 * 24))} dias
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Calorias:</span>
          <span className="font-medium">{planData.calories} kcal</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Macros:</span>
          <span className="font-medium">
            P: {planData.protein}g | C: {planData.carbs}g | G: {planData.fat}g
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Refeições/dia:</span>
          <span className="font-medium">{planData.mealsPerDay}</span>
        </div>
        
        {planData.supplements.length > 0 && (
          <div className="pt-2 border-t">
            <span className="text-gray-600">Suplementos:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {planData.supplements.map((supp, index) => (
                <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  {supp}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {planData.restrictions.length > 0 && (
          <div className="pt-2">
            <span className="text-gray-600">Restrições:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {planData.restrictions.map((rest, index) => (
                <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  {rest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlanModal;