// src/modules/trainer/pages/Nutrition/components/calculators/WaterCalculator.js
import React, { useState, useEffect } from 'react';
import {
  Droplets,
  User,
  Activity,
  Sun,
  Thermometer,
  Clock,
  Coffee,
  Wine,
  Info,
  Save,
  AlertCircle,
  Plus,
  Minus,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  CloudRain,
  Timer
} from 'lucide-react';

const WaterCalculator = ({ onSave, athleteData }) => {
  // Form state
  const [formData, setFormData] = useState({
    weight: athleteData?.weight || 70,
    age: athleteData?.age || 30,
    gender: athleteData?.gender || 'male',
    activityLevel: 'moderate',
    exerciseDuration: 60,
    exerciseIntensity: 'moderate',
    climate: 'temperate',
    temperature: 22,
    alcoholConsumption: 0,
    caffeineConsumption: 2,
    athleteName: athleteData?.name || '',
    customFactors: {
      pregnancy: false,
      breastfeeding: false,
      illness: false,
      highAltitude: false
    }
  });

  // Results state
  const [results, setResults] = useState(null);
  const [showDistribution, setShowDistribution] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // Activity levels
  const activityLevels = {
    sedentary: {
      name: 'Sedentário',
      description: 'Pouco ou nenhum exercício',
      multiplier: 1.0,
      icon: Coffee,
      color: 'gray'
    },
    light: {
      name: 'Leve',
      description: '1-3 dias/semana',
      multiplier: 1.1,
      icon: Activity,
      color: 'blue'
    },
    moderate: {
      name: 'Moderado',
      description: '3-5 dias/semana',
      multiplier: 1.2,
      icon: TrendingUp,
      color: 'green'
    },
    active: {
      name: 'Ativo',
      description: '6-7 dias/semana',
      multiplier: 1.3,
      icon: Zap,
      color: 'orange'
    },
    veryActive: {
      name: 'Muito Ativo',
      description: '2x dia ou trabalho físico',
      multiplier: 1.4,
      icon: Target,
      color: 'red'
    }
  };

  // Calculate water needs
  const calculateWaterNeeds = () => {
    const { weight, age, gender, activityLevel, exerciseDuration, exerciseIntensity, 
            climate, temperature, alcoholConsumption, caffeineConsumption, customFactors } = formData;

    // Base water calculation (35ml per kg for adults)
    let baseWater = weight * 35; // ml

    // Age adjustment
    if (age < 30) {
      baseWater *= 1.1;
    } else if (age > 65) {
      baseWater *= 0.9;
    }

    // Gender adjustment
    if (gender === 'female') {
      baseWater *= 0.9; // Women typically need slightly less
    }

    // Activity level adjustment
    const activityMultiplier = activityLevels[activityLevel].multiplier;
    baseWater *= activityMultiplier;

    // Exercise water loss (Sawka et al. formula)
    let exerciseWater = 0;
    if (exerciseDuration > 0) {
      const intensityMultipliers = {
        light: 0.4,
        moderate: 0.6,
        intense: 0.8,
        extreme: 1.0
      };
      
      // ml per minute of exercise
      const sweatRate = 12 * intensityMultipliers[exerciseIntensity];
      exerciseWater = exerciseDuration * sweatRate;
    }

    // Climate adjustments
    let climateAdjustment = 0;
    if (climate === 'hot' || temperature > 30) {
      climateAdjustment = baseWater * 0.2; // +20% for hot climate
    } else if (climate === 'cold' || temperature < 10) {
      climateAdjustment = baseWater * 0.1; // +10% for cold climate
    } else if (climate === 'humid') {
      climateAdjustment = baseWater * 0.15; // +15% for humid climate
    }

    // Diuretic adjustments
    const alcoholWater = alcoholConsumption * 100; // 100ml extra per drink
    const caffeineWater = caffeineConsumption * 50; // 50ml extra per caffeinated drink

    // Special conditions
    let specialAdjustment = 0;
    if (customFactors.pregnancy) specialAdjustment += 300;
    if (customFactors.breastfeeding) specialAdjustment += 700;
    if (customFactors.illness) specialAdjustment += 500;
    if (customFactors.highAltitude) specialAdjustment += 400;

    // Total water needs
    const totalWater = baseWater + exerciseWater + climateAdjustment + 
                      alcoholWater + caffeineWater + specialAdjustment;

    // Convert to liters
    const totalLiters = totalWater / 1000;

    // Calculate distribution throughout the day
    const distribution = calculateDailyDistribution(totalLiters);

    // Water sources breakdown
    const sources = {
      drinks: totalLiters * 0.8, // 80% from beverages
      food: totalLiters * 0.2,    // 20% from food
      pureWater: totalLiters * 0.6 // Recommended pure water
    };

    // Hydration reminders
    const reminders = generateHydrationReminders(totalLiters);

    setResults({
      totalWater: totalLiters.toFixed(1),
      totalMl: Math.round(totalWater),
      baseWater: (baseWater / 1000).toFixed(1),
      exerciseWater: (exerciseWater / 1000).toFixed(1),
      climateAdjustment: (climateAdjustment / 1000).toFixed(1),
      diureticAdjustment: ((alcoholWater + caffeineWater) / 1000).toFixed(1),
      specialAdjustment: (specialAdjustment / 1000).toFixed(1),
      distribution,
      sources,
      reminders,
      glassesPerDay: Math.ceil(totalLiters / 0.25), // 250ml glasses
      bottlesPerDay: Math.ceil(totalLiters / 0.5)   // 500ml bottles
    });
  };

  // Calculate daily distribution
  const calculateDailyDistribution = (totalLiters) => {
    return [
      { time: '07:00', name: 'Ao acordar', amount: (totalLiters * 0.15).toFixed(1), icon: Sun },
      { time: '09:00', name: 'Meio da manhã', amount: (totalLiters * 0.15).toFixed(1), icon: Coffee },
      { time: '12:00', name: 'Almoço', amount: (totalLiters * 0.20).toFixed(1), icon: Clock },
      { time: '15:00', name: 'Tarde', amount: (totalLiters * 0.15).toFixed(1), icon: Activity },
      { time: '18:00', name: 'Pré-jantar', amount: (totalLiters * 0.15).toFixed(1), icon: Droplets },
      { time: '21:00', name: 'Noite', amount: (totalLiters * 0.20).toFixed(1), icon: Timer }
    ];
  };

  // Generate hydration reminders
  const generateHydrationReminders = (totalLiters) => {
    const reminders = [];
    const interval = 16 / Math.ceil(totalLiters / 0.25); // Waking hours / glasses
    
    for (let i = 0; i < Math.ceil(totalLiters / 0.25); i++) {
      const hour = 7 + (i * interval);
      const time = `${Math.floor(hour).toString().padStart(2, '0')}:${Math.round((hour % 1) * 60).toString().padStart(2, '0')}`;
      reminders.push({
        time,
        amount: '250ml',
        message: getHydrationMessage(i)
      });
    }
    
    return reminders;
  };

  // Get hydration message
  const getHydrationMessage = (index) => {
    const messages = [
      'Comece o dia hidratado! 💧',
      'Hora de reabastecer',
      'Mantenha o ritmo',
      'Hidratação é performance',
      'Quase lá! Continue',
      'Último copo do dia'
    ];
    return messages[index % messages.length];
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle custom factors
  const handleCustomFactor = (factor) => {
    setFormData(prev => ({
      ...prev,
      customFactors: {
        ...prev.customFactors,
        [factor]: !prev.customFactors[factor]
      }
    }));
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
    if (formData.weight) {
      calculateWaterNeeds();
    }
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Calculadora de Hidratação
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Calcule as necessidades diárias de água baseado em múltiplos fatores
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Informações Básicas</h4>
          
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idade
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sexo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('gender', 'male')}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  formData.gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Masculino
              </button>
              <button
                onClick={() => handleChange('gender', 'female')}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  formData.gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Feminino
              </button>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Atividade
            </label>
            <div className="space-y-2">
              {Object.entries(activityLevels).map(([key, level]) => {
                const Icon = level.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleChange('activityLevel', key)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      formData.activityLevel === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 text-${level.color}-600`} />
                        <div>
                          <p className="font-medium text-gray-900">{level.name}</p>
                          <p className="text-xs text-gray-600">{level.description}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Environmental & Exercise Factors */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Fatores Ambientais e Exercício</h4>
          
          {/* Exercise Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração do Exercício (min/dia)
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleChange('exerciseDuration', Math.max(0, formData.exerciseDuration - 15))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={formData.exerciseDuration}
                onChange={(e) => handleChange('exerciseDuration', parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
              />
              <button
                onClick={() => handleChange('exerciseDuration', formData.exerciseDuration + 15)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Exercise Intensity */}
          {formData.exerciseDuration > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensidade do Exercício
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['light', 'moderate', 'intense', 'extreme'].map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => handleChange('exerciseIntensity', intensity)}
                    className={`py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                      formData.exerciseIntensity === intensity
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {intensity === 'light' && 'Leve'}
                    {intensity === 'moderate' && 'Moderado'}
                    {intensity === 'intense' && 'Intenso'}
                    {intensity === 'extreme' && 'Extremo'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Climate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clima/Ambiente
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('climate', 'temperate')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.climate === 'temperate'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CloudRain className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs">Temperado</p>
              </button>
              <button
                onClick={() => handleChange('climate', 'hot')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.climate === 'hot'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <p className="text-xs">Quente</p>
              </button>
              <button
                onClick={() => handleChange('climate', 'cold')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.climate === 'cold'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Thermometer className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs">Frio</p>
              </button>
              <button
                onClick={() => handleChange('climate', 'humid')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.climate === 'humid'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Droplets className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
                <p className="text-xs">Húmido</p>
              </button>
            </div>
          </div>

          {/* Diuretics */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Consumo de Diuréticos</h5>
            
            {/* Alcohol */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wine className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-700">Bebidas alcoólicas/dia</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleChange('alcoholConsumption', Math.max(0, formData.alcoholConsumption - 1))}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center">{formData.alcoholConsumption}</span>
                <button
                  onClick={() => handleChange('alcoholConsumption', formData.alcoholConsumption + 1)}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Caffeine */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coffee className="h-4 w-4 text-brown-600" />
                <span className="text-sm text-gray-700">Bebidas com cafeína/dia</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleChange('caffeineConsumption', Math.max(0, formData.caffeineConsumption - 1))}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center">{formData.caffeineConsumption}</span>
                <button
                  onClick={() => handleChange('caffeineConsumption', formData.caffeineConsumption + 1)}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Special Conditions */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Condições Especiais</h5>
            <div className="space-y-2">
              {formData.gender === 'female' && (
                <>
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.customFactors.pregnancy}
                      onChange={() => handleCustomFactor('pregnancy')}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Gravidez</span>
                  </label>
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.customFactors.breastfeeding}
                      onChange={() => handleCustomFactor('breastfeeding')}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Amamentação</span>
                  </label>
                </>
              )}
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.customFactors.illness}
                  onChange={() => handleCustomFactor('illness')}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Febre/Doença</span>
              </label>
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.customFactors.highAltitude}
                  onChange={() => handleCustomFactor('highAltitude')}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Altitude elevada</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Main Results Card */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Necessidades de Hidratação</h4>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Total Water */}
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{results.totalWater}L</p>
                <p className="text-sm text-gray-600 mt-1">Total diário</p>
                <p className="text-xs text-gray-500">{results.totalMl} ml</p>
              </div>

              {/* Glasses */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl">🥤</span>
                  <p className="text-3xl font-bold text-gray-900">{results.glassesPerDay}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">Copos de 250ml</p>
              </div>

              {/* Bottles */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl">🍶</span>
                  <p className="text-3xl font-bold text-gray-900">{results.bottlesPerDay}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">Garrafas de 500ml</p>
              </div>

              {/* Per kg */}
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(results.totalMl / formData.weight)}
                </p>
                <p className="text-sm text-gray-600 mt-1">ml/kg peso</p>
                <p className="text-xs text-gray-500">Recomendado: 35ml/kg</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Composição do Cálculo</h5>
              <div className="space-y-2">
                <WaterBreakdownItem
                  label="Necessidade base"
                  value={results.baseWater}
                  color="blue"
                />
                {parseFloat(results.exerciseWater) > 0 && (
                  <WaterBreakdownItem
                    label="Perda por exercício"
                    value={results.exerciseWater}
                    color="orange"
                  />
                )}
                {parseFloat(results.climateAdjustment) > 0 && (
                  <WaterBreakdownItem
                    label="Ajuste climático"
                    value={results.climateAdjustment}
                    color="yellow"
                  />
                )}
                {parseFloat(results.diureticAdjustment) > 0 && (
                  <WaterBreakdownItem
                    label="Compensação diuréticos"
                    value={results.diureticAdjustment}
                    color="purple"
                  />
                )}
                {parseFloat(results.specialAdjustment) > 0 && (
                  <WaterBreakdownItem
                    label="Condições especiais"
                    value={results.specialAdjustment}
                    color="pink"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Daily Distribution */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="flex items-center justify-between w-full"
            >
              <h4 className="font-semibold text-gray-900">Distribuição ao Longo do Dia</h4>
              <Calendar className={`h-5 w-5 text-gray-600 transform transition-transform ${
                showDistribution ? 'rotate-180' : ''
              }`} />
            </button>

            {showDistribution && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.distribution.map((period, index) => {
                  const Icon = period.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">{period.time}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{period.name}</p>
                      <p className="text-lg font-bold text-blue-600">{period.amount}L</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hydration Tips */}
          {showTips && (
            <HydrationTips 
              totalWater={parseFloat(results.totalWater)}
              activityLevel={formData.activityLevel}
              climate={formData.climate}
            />
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Valores baseados nas diretrizes EFSA e IOM</span>
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
    </div>
  );
};

// Water Breakdown Item Component
const WaterBreakdownItem = ({ label, value, color }) => {
  const percentage = (parseFloat(value) / 3) * 100; // Assuming 3L average

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-900">+{value}L</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${color}-500 rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Hydration Tips Component
const HydrationTips = ({ totalWater, activityLevel, climate }) => {
  const tips = [
    'Beba água ao acordar para reidratar após o jejum noturno',
    'Use uma garrafa com marcações para acompanhar o consumo',
    'Defina lembretes no telemóvel para beber água regularmente',
    'Água com sabor natural (limão, pepino) pode ajudar no consumo',
    'Monitore a cor da urina - amarelo claro indica boa hidratação'
  ];

  if (activityLevel === 'active' || activityLevel === 'veryActive') {
    tips.push('Pese-se antes e depois do exercício - cada kg perdido = 1L de água');
    tips.push('Beba 500-600ml 2-3h antes do exercício');
  }

  if (climate === 'hot') {
    tips.push('Em clima quente, beba antes de sentir sede');
    tips.push('Adicione uma pitada de sal à água para melhor retenção');
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        Dicas de Hidratação
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.slice(0, 6).map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <p className="text-sm text-blue-800">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterCalculator;