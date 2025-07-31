import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Calculator, Apple, AlertCircle, Check } from 'lucide-react';
import MacroCalculator from '../components/MacroCalculator';
import MealPlanBuilder from '../components/MealPlanBuilder';

const CreatePlanView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [planData, setPlanData] = useState({
    name: '',
    athleteId: null,
    athlete: null,
    targetMacros: null,
    meals: []
  });

  // Mock athletes - substituir com API
  const athletes = [
    { id: 1, name: 'João Silva', age: 28, weight: 78.5, height: 175 },
    { id: 2, name: 'Maria Santos', age: 25, weight: 62.3, height: 165 },
    { id: 3, name: 'Pedro Costa', age: 32, weight: 85.0, height: 180 },
    { id: 4, name: 'Ana Ferreira', age: 27, weight: 58.2, height: 162 }
  ];

  const handleSelectAthlete = (athlete) => {
    setPlanData(prev => ({
      ...prev,
      athleteId: athlete.id,
      athlete: athlete
    }));
  };

  const handleCalculateMacros = (macros) => {
    setPlanData(prev => ({
      ...prev,
      targetMacros: {
        calories: macros.targetCalories,
        protein: macros.macros.protein,
        carbs: macros.macros.carbs,
        fat: macros.macros.fat,
        fiber: macros.macros.fiber,
        water: macros.macros.water
      }
    }));
  };

  const handleSavePlan = async (mealData) => {
    const finalPlan = {
      ...planData,
      meals: mealData.meals,
      totals: mealData.totals,
      createdAt: new Date().toISOString()
    };

    console.log('Plano a guardar:', finalPlan);
    
    // TODO: API call para guardar o plano
    // await nutritionAPI.createPlan(finalPlan);
    
    // Redirecionar
    navigate('/nutrition/plans');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <User size={20} />
        </div>
        <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <Calculator size={20} />
        </div>
        <div className={`w-20 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <Apple size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/nutrition/plans')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Plano Nutricional</h1>
            <p className="text-gray-600">
              {step === 1 && 'Selecione o atleta'}
              {step === 2 && 'Calcule os macronutrientes'}
              {step === 3 && 'Monte o plano alimentar'}
            </p>
          </div>
        </div>
      </div>

      {renderStepIndicator()}

      {/* Step 1: Select Athlete */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Atleta</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Plano
              </label>
              <input
                type="text"
                value={planData.name}
                onChange={(e) => setPlanData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Plano de Cutting - João Silva"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              {athletes.map((athlete) => (
                <button
                  key={athlete.id}
                  onClick={() => handleSelectAthlete(athlete)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    planData.athleteId === athlete.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{athlete.name}</p>
                  <p className="text-sm text-gray-600">
                    {athlete.age} anos • {athlete.weight}kg • {athlete.height}cm
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!planData.athleteId || !planData.name}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Calculate Macros */}
      {step === 2 && planData.athlete && (
        <div className="max-w-4xl mx-auto">
          <MacroCalculator
            initialData={{
              weight: planData.athlete.weight,
              age: planData.athlete.age,
              height: planData.athlete.height
            }}
            onCalculate={handleCalculateMacros}
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!planData.targetMacros}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Build Meal Plan */}
      {step === 3 && planData.targetMacros && (
        <div>
          <MealPlanBuilder
            targetMacros={planData.targetMacros}
            onSave={handleSavePlan}
          />

          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlanView;