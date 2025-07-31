import React, { useState, useEffect } from 'react';
import {
  Calculator,
  User,
  Activity,
  Target,
  Info,
  Copy,
  Save,
  ChevronDown,
  Zap,
  TrendingUp,
  Brain,
  Scale,
  Ruler,
  Calendar,
  BarChart
} from 'lucide-react';

const MacroCalculatorView = () => {
  const [calculatorData, setCalculatorData] = useState({
    // Dados básicos
    weight: 84,
    age: 52,
    height: 172,
    gender: 'male',
    activityLevel: 1.55,
    
    // Objetivo
    goal: 'maintenance', // cutting, maintenance, bulking
    deficitPercentage: 20, // para cutting
    surplusPercentage: 10, // para bulking
    
    // Preferências de macros
    macroProfile: 'balanced', // balanced, highProtein, lowCarb, custom
    proteinGramsPerKg: 1.8,
    fatPercentage: 30,
    
    // Advanced
    adaptiveMode: false,
    refeeds: false,
    cyclingCarbs: false
  });

  const [results, setResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState('all'); // all, harris, mifflin, average

  // Activity Levels com descrições detalhadas
  const activityLevels = [
    { 
      value: 1.2, 
      label: 'Sedentário', 
      description: 'Pouco ou nenhum exercício',
      examples: 'Trabalho de escritório, caminhadas leves'
    },
    { 
      value: 1.375, 
      label: 'Pouco Activo', 
      description: 'Exercício leve 1-3 dias/semana',
      examples: 'Yoga, caminhadas rápidas, ginásio ocasional'
    },
    { 
      value: 1.55, 
      label: 'Moderadamente Activo', 
      description: 'Exercício moderado 3-5 dias/semana',
      examples: 'Musculação regular, corrida, desportos'
    },
    { 
      value: 1.725, 
      label: 'Muito Activo', 
      description: 'Exercício intenso 6-7 dias/semana',
      examples: 'Atleta, treinos intensos diários'
    },
    { 
      value: 1.9, 
      label: 'Extremamente Activo', 
      description: 'Exercício muito intenso, trabalho físico',
      examples: 'Atleta profissional, trabalho braçal pesado'
    }
  ];

  // Fórmulas de cálculo
  const calculateBMR = () => {
    const w = calculatorData.weight;
    const h = calculatorData.height;
    const a = calculatorData.age;
    const isMale = calculatorData.gender === 'male';

    const harris = isMale 
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);

    const mifflin = isMale
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const average = (harris + mifflin) / 2;

    return {
      harris: Math.round(harris),
      mifflin: Math.round(mifflin),
      average: Math.round(average)
    };
  };

  const calculateMacros = () => {
    const bmr = calculateBMR();
    const tdee = Math.round(bmr.average * calculatorData.activityLevel);
    
    // Calcular calorias alvo baseado no objetivo
    let targetCalories = tdee;
    if (calculatorData.goal === 'cutting') {
      targetCalories = Math.round(tdee * (1 - calculatorData.deficitPercentage / 100));
    } else if (calculatorData.goal === 'bulking') {
      targetCalories = Math.round(tdee * (1 + calculatorData.surplusPercentage / 100));
    }

    // Calcular macros
    const proteinGrams = Math.round(calculatorData.weight * calculatorData.proteinGramsPerKg);
    const proteinCalories = proteinGrams * 4;
    
    const fatCalories = Math.round(targetCalories * (calculatorData.fatPercentage / 100));
    const fatGrams = Math.round(fatCalories / 9);
    
    const carbsCalories = targetCalories - proteinCalories - fatCalories;
    const carbsGrams = Math.round(carbsCalories / 4);

    // Calcular percentagens reais
    const proteinPercentage = Math.round((proteinCalories / targetCalories) * 100);
    const carbsPercentage = Math.round((carbsCalories / targetCalories) * 100);
    const fatPercentage = Math.round((fatCalories / targetCalories) * 100);

    // Outros nutrientes
    const fiber = Math.round(targetCalories / 1000 * 14);
    const water = Math.round(calculatorData.weight * 35);

    setResults({
      bmr,
      tdee,
      targetCalories,
      deficit: tdee - targetCalories,
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams,
        fiber,
        water
      },
      calories: {
        protein: proteinCalories,
        carbs: carbsCalories,
        fat: fatCalories
      },
      percentages: {
        protein: proteinPercentage,
        carbs: carbsPercentage,
        fat: fatPercentage
      }
    });
  };

  useEffect(() => {
    calculateMacros();
  }, [calculatorData]);

  const updateData = (field, value) => {
    setCalculatorData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = () => {
    if (!results) return;
    
    const text = `
PLANO NUTRICIONAL
================
TMB: ${results.bmr.average} kcal
TDEE: ${results.tdee} kcal
Calorias Alvo: ${results.targetCalories} kcal
${results.deficit !== 0 ? `Défice/Superávit: ${results.deficit > 0 ? '-' : '+'}${Math.abs(results.deficit)} kcal` : ''}

MACROS
------
Proteína: ${results.macros.protein}g (${results.percentages.protein}%)
Carboidratos: ${results.macros.carbs}g (${results.percentages.carbs}%)
Gordura: ${results.macros.fat}g (${results.percentages.fat}%)
Fibra: ${results.macros.fiber}g
Água: ${results.macros.water}ml
    `;
    
    navigator.clipboard.writeText(text);
    // Mostrar toast de sucesso
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Básicos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Dados do Cliente
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calculatorData.weight}
                      onChange={(e) => updateData('weight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                    />
                    <Scale className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calculatorData.age}
                      onChange={(e) => updateData('age', parseInt(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calculatorData.height}
                      onChange={(e) => updateData('height', parseInt(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <Ruler className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateData('gender', 'male')}
                      className={`px-3 py-2 rounded-lg border-2 transition-all ${
                        calculatorData.gender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Homem
                    </button>
                    <button
                      onClick={() => updateData('gender', 'female')}
                      className={`px-3 py-2 rounded-lg border-2 transition-all ${
                        calculatorData.gender === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Mulher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actividade Física */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Nível de Actividade Física (AF)
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      calculatorData.activityLevel === level.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={calculatorData.activityLevel === level.value}
                        onChange={(e) => updateData('activityLevel', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{level.label}</p>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            x{level.value}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        <p className="text-xs text-gray-500 mt-1 italic">{level.examples}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Objetivo e Configuração de Macros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Objetivo e Macros
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Objetivo Principal
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => updateData('goal', 'cutting')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      calculatorData.goal === 'cutting'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-red-600 rotate-180" />
                    <p className="font-medium">Definição</p>
                    <p className="text-xs text-gray-600 mt-1">Perder gordura</p>
                  </button>
                  
                  <button
                    onClick={() => updateData('goal', 'maintenance')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      calculatorData.goal === 'maintenance'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BarChart className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Manutenção</p>
                    <p className="text-xs text-gray-600 mt-1">Manter peso</p>
                  </button>
                  
                  <button
                    onClick={() => updateData('goal', 'bulking')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      calculatorData.goal === 'bulking'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="font-medium">Volume</p>
                    <p className="text-xs text-gray-600 mt-1">Ganhar massa</p>
                  </button>
                </div>
              </div>

              {/* Défice/Superávit */}
              {calculatorData.goal !== 'maintenance' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {calculatorData.goal === 'cutting' ? 'Défice Calórico' : 'Superávit Calórico'} (%)
                  </label>
                  <input
                    type="range"
                    min={calculatorData.goal === 'cutting' ? '10' : '5'}
                    max={calculatorData.goal === 'cutting' ? '30' : '20'}
                    value={calculatorData.goal === 'cutting' ? calculatorData.deficitPercentage : calculatorData.surplusPercentage}
                    onChange={(e) => updateData(
                      calculatorData.goal === 'cutting' ? 'deficitPercentage' : 'surplusPercentage',
                      parseInt(e.target.value)
                    )}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{calculatorData.goal === 'cutting' ? 'Moderado' : 'Lento'}</span>
                    <span className="font-medium">
                      {calculatorData.goal === 'cutting' ? calculatorData.deficitPercentage : calculatorData.surplusPercentage}%
                    </span>
                    <span>{calculatorData.goal === 'cutting' ? 'Agressivo' : 'Rápido'}</span>
                  </div>
                </div>
              )}

              {/* Configuração de Macros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteína (g/kg peso)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1.6"
                    max="3.0"
                    step="0.1"
                    value={calculatorData.proteinGramsPerKg}
                    onChange={(e) => updateData('proteinGramsPerKg', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded min-w-[60px] text-center">
                    {calculatorData.proteinGramsPerKg}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gordura (% calorias)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="20"
                    max="40"
                    step="5"
                    value={calculatorData.fatPercentage}
                    onChange={(e) => updateData('fatPercentage', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded min-w-[60px] text-center">
                    {calculatorData.fatPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Resultados */}
        <div className="space-y-6">
          {/* Resultados TMB */}
          {results && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                    Cálculo de Macros
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* TMB Comparison */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Taxa Metabólica Basal (TMB)
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harris-Benedict:</span>
                        <span className="font-mono font-medium">{results.bmr.harris} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mifflin-St Jeor:</span>
                        <span className="font-mono font-medium">{results.bmr.mifflin} kcal</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Média:</span>
                        <span className="font-mono font-bold text-gray-900">{results.bmr.average} kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* TDEE e Target */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">TDEE:</span>
                        <span className="text-xl font-bold text-blue-700">{results.tdee} kcal</span>
                      </div>
                      {results.deficit !== 0 && (
                        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                          <span className="text-sm font-medium text-gray-700">
                            {results.deficit > 0 ? 'Défice:' : 'Superávit:'}
                          </span>
                          <span className={`font-bold ${results.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {results.deficit > 0 ? '-' : '+'}{Math.abs(results.deficit)} kcal
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                        <span className="text-sm font-medium text-gray-700">Calorias Alvo:</span>
                        <span className="text-2xl font-bold text-blue-900">{results.targetCalories} kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* Macros Distribution */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Distribuição de Macros</p>
                    
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">Proteína</span>
                        <span className="text-lg font-bold text-green-900">{results.macros.protein}g</span>
                      </div>
                      <div className="text-xs text-green-600 space-y-1">
                        <div className="flex justify-between">
                          <span>{results.percentages.protein}% das calorias</span>
                          <span>{results.calories.protein} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Por kg de peso:</span>
                          <span>{calculatorData.proteinGramsPerKg}g/kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-orange-700">Carboidratos</span>
                        <span className="text-lg font-bold text-orange-900">{results.macros.carbs}g</span>
                      </div>
                      <div className="text-xs text-orange-600">
                        <div className="flex justify-between">
                          <span>{results.percentages.carbs}% das calorias</span>
                          <span>{results.calories.carbs} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-yellow-700">Gordura</span>
                        <span className="text-lg font-bold text-yellow-900">{results.macros.fat}g</span>
                      </div>
                      <div className="text-xs text-yellow-600">
                        <div className="flex justify-between">
                          <span>{results.percentages.fat}% das calorias</span>
                          <span>{results.calories.fat} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-purple-600">Fibra</p>
                        <p className="text-lg font-bold text-purple-900">{results.macros.fiber}g</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600">Água</p>
                        <p className="text-lg font-bold text-blue-900">{results.macros.water}ml</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar
                    </button>
                    <button
                      onClick={() => console.log('Save to client')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Guardar
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips Box */}
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Dica Pro:</p>
                    <p>Para {calculatorData.goal === 'cutting' ? 'maximizar a perda de gordura' : 
                           calculatorData.goal === 'bulking' ? 'otimizar o ganho de massa' : 
                           'manter a composição corporal'}, 
                           considera fazer refeeds semanais e ajustar os carboidratos nos dias de treino.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCalculatorView;