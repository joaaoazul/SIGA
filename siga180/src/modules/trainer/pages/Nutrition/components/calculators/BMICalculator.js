// src/modules/trainer/pages/Nutrition/components/calculators/BMICalculator.js
import React, { useState, useEffect } from 'react';
import {
  Scale,
  Calculator,
  User,
  Ruler,
  Info,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Target,
  Award,
  Heart,
  Activity
} from 'lucide-react';

const BMICalculator = ({ onSave, athleteData }) => {
  // Form state
  const [formData, setFormData] = useState({
    weight: athleteData?.weight || 70,
    height: athleteData?.height || 170,
    age: athleteData?.age || 30,
    gender: athleteData?.gender || 'male',
    athleteName: athleteData?.name || '',
    waist: '',
    hip: '',
    neck: ''
  });

  // Results state
  const [results, setResults] = useState(null);
  const [showHealthRisks, setShowHealthRisks] = useState(false);

  // BMI Categories
  const bmiCategories = [
    { min: 0, max: 16, name: 'Magreza Grave', color: 'red', level: 3 },
    { min: 16, max: 17, name: 'Magreza Moderada', color: 'orange', level: 2 },
    { min: 17, max: 18.5, name: 'Magreza Leve', color: 'yellow', level: 1 },
    { min: 18.5, max: 25, name: 'Peso Normal', color: 'green', level: 0 },
    { min: 25, max: 30, name: 'Sobrepeso', color: 'yellow', level: 1 },
    { min: 30, max: 35, name: 'Obesidade Grau I', color: 'orange', level: 2 },
    { min: 35, max: 40, name: 'Obesidade Grau II', color: 'red', level: 3 },
    { min: 40, max: 100, name: 'Obesidade Grau III', color: 'purple', level: 4 }
  ];

  // Calculate BMI and related metrics
  const calculateBMI = () => {
    const { weight, height, age, gender, waist, hip } = formData;
    const heightInMeters = height / 100;
    
    // BMI Calculation
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Find category
    const category = bmiCategories.find(cat => bmi >= cat.min && bmi < cat.max) || bmiCategories[0];
    
    // Calculate ideal weight range (BMI 18.5-25)
    const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxIdealWeight = 25 * (heightInMeters * heightInMeters);
    const targetWeight = 22 * (heightInMeters * heightInMeters); // BMI 22 as target
    
    // Weight to gain/lose
    const weightDifference = weight - targetWeight;
    const weightToIdeal = Math.abs(weightDifference);
    
    // Body Surface Area (BSA) - Mosteller formula
    const bsa = Math.sqrt((height * weight) / 3600);
    
    // Ponderal Index
    const ponderalIndex = weight / Math.pow(heightInMeters, 3);
    
    // Waist-to-Hip Ratio (if provided)
    let whr = null;
    let whrRisk = null;
    if (waist && hip) {
      whr = waist / hip;
      whrRisk = getWHRRisk(whr, gender);
    }
    
    // Waist-to-Height Ratio
    let whtr = null;
    let whtrRisk = null;
    if (waist) {
      whtr = waist / height;
      whtrRisk = whtr > 0.5 ? 'Alto' : 'Normal';
    }
    
    // BMI Prime
    const bmiPrime = bmi / 25;
    
    // Calculate health metrics
    const healthMetrics = calculateHealthMetrics(bmi, category, age, gender);
    
    setResults({
      bmi: bmi.toFixed(1),
      category,
      idealWeight: {
        min: minIdealWeight.toFixed(1),
        max: maxIdealWeight.toFixed(1),
        target: targetWeight.toFixed(1)
      },
      weightDifference: {
        value: weightDifference.toFixed(1),
        toIdeal: weightToIdeal.toFixed(1),
        type: weightDifference > 0 ? 'lose' : weightDifference < 0 ? 'gain' : 'maintain'
      },
      bsa: bsa.toFixed(2),
      ponderalIndex: ponderalIndex.toFixed(1),
      bmiPrime: bmiPrime.toFixed(2),
      whr,
      whrRisk,
      whtr,
      whtrRisk,
      healthMetrics
    });
  };

  // Calculate health metrics based on BMI
  const calculateHealthMetrics = (bmi, category, age, gender) => {
    const risks = {
      diabetes: 'Baixo',
      cardiovascular: 'Baixo',
      hypertension: 'Baixo',
      metabolicSyndrome: 'Baixo'
    };
    
    // Risk assessment based on BMI
    if (bmi >= 25 && bmi < 30) {
      risks.diabetes = 'Moderado';
      risks.cardiovascular = 'Moderado';
      risks.hypertension = 'Moderado';
    } else if (bmi >= 30) {
      risks.diabetes = 'Alto';
      risks.cardiovascular = 'Alto';
      risks.hypertension = 'Alto';
      risks.metabolicSyndrome = 'Alto';
    }
    
    // Age adjustments
    if (age > 40) {
      Object.keys(risks).forEach(key => {
        if (risks[key] === 'Baixo') risks[key] = 'Moderado';
        else if (risks[key] === 'Moderado') risks[key] = 'Alto';
      });
    }
    
    return risks;
  };

  // Get WHR risk level
  const getWHRRisk = (whr, gender) => {
    if (gender === 'male') {
      if (whr < 0.90) return 'Baixo';
      if (whr < 1.0) return 'Moderado';
      return 'Alto';
    } else {
      if (whr < 0.80) return 'Baixo';
      if (whr < 0.85) return 'Moderado';
      return 'Alto';
    }
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
    if (formData.weight && formData.height) {
      calculateBMI();
    }
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Calculadora de IMC e Composição Corporal
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Avalie o estado nutricional e riscos à saúde
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Measurements */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Medidas Básicas</h4>
          
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="h-4 w-4 inline mr-1" />
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

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="h-4 w-4 inline mr-1" />
              Altura (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
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
        </div>

        {/* Additional Measurements */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Medidas Adicionais (Opcional)</h4>
          
          {/* Waist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Circunferência da Cintura (cm)
            </label>
            <input
              type="number"
              value={formData.waist}
              onChange={(e) => handleChange('waist', parseFloat(e.target.value))}
              placeholder="Opcional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Medida na altura do umbigo
            </p>
          </div>

          {/* Hip */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Circunferência do Quadril (cm)
            </label>
            <input
              type="number"
              value={formData.hip}
              onChange={(e) => handleChange('hip', parseFloat(e.target.value))}
              placeholder="Opcional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Medida na parte mais larga
            </p>
          </div>

          {/* Neck */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Circunferência do Pescoço (cm)
            </label>
            <input
              type="number"
              value={formData.neck}
              onChange={(e) => handleChange('neck', parseFloat(e.target.value))}
              placeholder="Opcional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Abaixo da laringe
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* BMI Result Card */}
          <div className={`bg-gradient-to-r from-${results.category.color}-50 to-${results.category.color}-100 rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Resultado do IMC</h4>
              <BMIIndicator value={results.bmi} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* BMI Value */}
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{results.bmi}</p>
                <p className={`text-lg font-medium text-${results.category.color}-700`}>
                  {results.category.name}
                </p>
              </div>

              {/* Ideal Weight */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Peso Ideal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.idealWeight.min} - {results.idealWeight.max} kg
                </p>
                <p className="text-sm text-gray-600">
                  Alvo: {results.idealWeight.target} kg
                </p>
              </div>

              {/* Weight Difference */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  {results.weightDifference.type === 'lose' ? 'Perder' : 
                   results.weightDifference.type === 'gain' ? 'Ganhar' : 'Manter'}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  {results.weightDifference.type === 'lose' ? (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  ) : results.weightDifference.type === 'gain' ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <Minus className="h-6 w-6 text-blue-600" />
                  )}
                  <p className="text-2xl font-bold text-gray-900">
                    {results.weightDifference.toIdeal} kg
                  </p>
                </div>
              </div>
            </div>

            {/* BMI Scale Visual */}
            <div className="mt-6">
              <BMIScale value={results.bmi} categories={bmiCategories} />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* BMI Prime */}
            <MetricCard
              title="IMC Prime"
              value={results.bmiPrime}
              info="Relação com IMC 25"
              icon={Calculator}
              color="blue"
            />

            {/* BSA */}
            <MetricCard
              title="Área Corporal"
              value={`${results.bsa} m²`}
              info="Superfície corporal"
              icon={Activity}
              color="purple"
            />

            {/* Ponderal Index */}
            <MetricCard
              title="Índice Ponderal"
              value={results.ponderalIndex}
              info="Corpulência"
              icon={Scale}
              color="green"
            />

            {/* WHR */}
            {results.whr && (
              <MetricCard
                title="RCQ"
                value={results.whr.toFixed(2)}
                info={`Risco: ${results.whrRisk}`}
                icon={Heart}
                color={results.whrRisk === 'Alto' ? 'red' : 'green'}
              />
            )}
          </div>

          {/* Health Risks */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <button
              onClick={() => setShowHealthRisks(!showHealthRisks)}
              className="flex items-center justify-between w-full"
            >
              <h4 className="font-semibold text-gray-900">Avaliação de Riscos à Saúde</h4>
              <AlertCircle className={`h-5 w-5 text-gray-600 transform transition-transform ${
                showHealthRisks ? 'rotate-180' : ''
              }`} />
            </button>

            {showHealthRisks && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.healthMetrics).map(([key, risk]) => (
                  <HealthRiskCard key={key} type={key} risk={risk} />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Valores de referência da OMS</span>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Avaliação</span>
            </button>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <BMIEducation />
    </div>
  );
};

// BMI Indicator Component
const BMIIndicator = ({ value }) => {
  return (
    <div className="flex items-center space-x-2">
      <Award className="h-6 w-6 text-blue-600" />
      <span className="text-sm font-medium text-gray-600">IMC</span>
    </div>
  );
};

// BMI Scale Visual Component
const BMIScale = ({ value, categories }) => {
  const position = ((value - 15) / (45 - 15)) * 100; // Scale from 15 to 45

  return (
    <div className="relative">
      <div className="h-8 rounded-full overflow-hidden flex">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`bg-${cat.color}-500 flex-1`}
            style={{ opacity: 0.7 }}
          />
        ))}
      </div>
      
      {/* Indicator */}
      <div
        className="absolute top-0 h-8 w-1 bg-gray-900"
        style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
          {value}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>35</span>
        <span>40</span>
        <span>45</span>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, info, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <span className={`text-xs font-medium text-${color}-600`}>{info}</span>
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Health Risk Card Component
const HealthRiskCard = ({ type, risk }) => {
  const riskColors = {
    'Baixo': 'green',
    'Moderado': 'yellow',
    'Alto': 'red'
  };

  const riskNames = {
    diabetes: 'Diabetes Tipo 2',
    cardiovascular: 'Doença Cardiovascular',
    hypertension: 'Hipertensão',
    metabolicSyndrome: 'Síndrome Metabólica'
  };

  return (
    <div className={`border-l-4 border-${riskColors[risk]}-500 bg-gray-50 p-4 rounded-r-lg`}>
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-900">{riskNames[type]}</p>
        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${riskColors[risk]}-100 text-${riskColors[risk]}-800`}>
          Risco {risk}
        </span>
      </div>
    </div>
  );
};

// BMI Education Component
const BMIEducation = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h4 className="font-semibold text-blue-900 mb-3">Sobre o IMC</h4>
      <div className="space-y-3 text-sm text-blue-800">
        <p>
          • O IMC é uma medida simples mas não diferencia massa muscular de gordura
        </p>
        <p>
          • Atletas com muita massa muscular podem ter IMC elevado sem excesso de gordura
        </p>
        <p>
          • A distribuição de gordura (cintura/quadril) é tão importante quanto o IMC total
        </p>
        <p>
          • Para avaliação completa, combine IMC com outras medidas e exames
        </p>
      </div>
    </div>
  );
};

export default BMICalculator;