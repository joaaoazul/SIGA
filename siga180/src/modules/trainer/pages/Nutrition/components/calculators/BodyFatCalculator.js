// src/modules/trainer/pages/Nutrition/components/calculators/BodyFatCalculator.js
import React, { useState, useEffect } from 'react';
import {
  Percent,
  Calculator,
  User,
  Ruler,
  Info,
  Save,
  BarChart3,
  Activity,
  Heart,
  Target,
  TrendingUp,
  Award,
  AlertCircle,
  ChevronDown,
  Camera,
  Zap
} from 'lucide-react';

const BodyFatCalculator = ({ onSave, athleteData }) => {
  // Form state
  const [formData, setFormData] = useState({
    method: 'navy', // navy, skinfold3, skinfold7, bioimpedance
    gender: athleteData?.gender || 'male',
    age: athleteData?.age || 30,
    weight: athleteData?.weight || 75,
    height: athleteData?.height || 175,
    athleteName: athleteData?.name || '',
    // Navy Method
    neck: '',
    waist: '',
    hip: '', // only for females
    // Skinfold measurements (in mm)
    chest: '',
    abdominal: '',
    thigh: '',
    triceps: '',
    subscapular: '',
    suprailiac: '',
    midaxillary: ''
  });

  // Results state
  const [results, setResults] = useState(null);
  const [showMethodDetails, setShowMethodDetails] = useState(false);

  // Body fat categories
  const getBodyFatCategories = (gender) => {
    if (gender === 'male') {
      return [
        { min: 0, max: 6, name: 'Essencial', color: 'red', description: 'Muito baixo - risco à saúde' },
        { min: 6, max: 13, name: 'Atleta', color: 'orange', description: 'Nível de competição' },
        { min: 13, max: 17, name: 'Fitness', color: 'yellow', description: 'Boa definição muscular' },
        { min: 17, max: 25, name: 'Aceitável', color: 'green', description: 'Saudável' },
        { min: 25, max: 100, name: 'Obesidade', color: 'red', description: 'Risco aumentado' }
      ];
    } else {
      return [
        { min: 0, max: 14, name: 'Essencial', color: 'red', description: 'Muito baixo - risco à saúde' },
        { min: 14, max: 20, name: 'Atleta', color: 'orange', description: 'Nível de competição' },
        { min: 20, max: 24, name: 'Fitness', color: 'yellow', description: 'Boa definição muscular' },
        { min: 24, max: 31, name: 'Aceitável', color: 'green', description: 'Saudável' },
        { min: 31, max: 100, name: 'Obesidade', color: 'red', description: 'Risco aumentado' }
      ];
    }
  };

  // Calculate body fat based on selected method
  const calculateBodyFat = () => {
    const { method, gender, weight, height } = formData;
    let bodyFatPercentage = 0;
    let leanMass = 0;
    let fatMass = 0;

    switch (method) {
      case 'navy':
        bodyFatPercentage = calculateNavyMethod();
        break;
      case 'skinfold3':
        bodyFatPercentage = calculateSkinfold3Method();
        break;
      case 'skinfold7':
        bodyFatPercentage = calculateSkinfold7Method();
        break;
      case 'bioimpedance':
        // Placeholder for bioimpedance
        bodyFatPercentage = 20; // Would come from device
        break;
    }

    if (bodyFatPercentage > 0) {
      fatMass = (weight * bodyFatPercentage) / 100;
      leanMass = weight - fatMass;

      const categories = getBodyFatCategories(gender);
      const category = categories.find(cat => bodyFatPercentage >= cat.min && bodyFatPercentage < cat.max);

      // Calculate ideal body fat range
      const idealRange = gender === 'male' ? { min: 10, max: 20 } : { min: 18, max: 28 };
      const targetBF = gender === 'male' ? 15 : 23;
      const targetWeight = leanMass / (1 - targetBF / 100);

      // Calculate FFMI (Fat-Free Mass Index)
      const heightInMeters = height / 100;
      const ffmi = leanMass / (heightInMeters * heightInMeters);
      const adjustedFFMI = ffmi + 6.1 * (1.8 - heightInMeters);

      setResults({
        bodyFatPercentage: bodyFatPercentage.toFixed(1),
        fatMass: fatMass.toFixed(1),
        leanMass: leanMass.toFixed(1),
        category,
        idealRange,
        targetBF,
        targetWeight: targetWeight.toFixed(1),
        ffmi: ffmi.toFixed(1),
        adjustedFFMI: adjustedFFMI.toFixed(1),
        method: getMethodName(method)
      });
    }
  };

  // Navy Method calculation
  const calculateNavyMethod = () => {
    const { gender, height, neck, waist, hip } = formData;
    
    if (!neck || !waist) return 0;
    
    let bodyFat;
    
    if (gender === 'male') {
      // Men: %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // Women: %BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      if (!hip) return 0;
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    
    return Math.max(0, Math.min(50, bodyFat)); // Clamp between 0-50%
  };

  // 3-Site Skinfold Method (Jackson-Pollock)
  const calculateSkinfold3Method = () => {
    const { gender, age, chest, abdominal, thigh, triceps, suprailiac } = formData;
    
    let sumOfSkinfolds;
    let bodyDensity;
    
    if (gender === 'male') {
      if (!chest || !abdominal || !thigh) return 0;
      sumOfSkinfolds = parseFloat(chest) + parseFloat(abdominal) + parseFloat(thigh);
      bodyDensity = 1.10938 - (0.0008267 * sumOfSkinfolds) + (0.0000016 * sumOfSkinfolds * sumOfSkinfolds) - (0.0002574 * age);
    } else {
      if (!triceps || !suprailiac || !thigh) return 0;
      sumOfSkinfolds = parseFloat(triceps) + parseFloat(suprailiac) + parseFloat(thigh);
      bodyDensity = 1.0994921 - (0.0009929 * sumOfSkinfolds) + (0.0000023 * sumOfSkinfolds * sumOfSkinfolds) - (0.0001392 * age);
    }
    
    // Siri equation: %BF = (495 / Body Density) - 450
    const bodyFat = (495 / bodyDensity) - 450;
    
    return Math.max(0, Math.min(50, bodyFat));
  };

  // 7-Site Skinfold Method
  const calculateSkinfold7Method = () => {
    const { gender, age, chest, abdominal, thigh, triceps, subscapular, suprailiac, midaxillary } = formData;
    
    if (!chest || !abdominal || !thigh || !triceps || !subscapular || !suprailiac || !midaxillary) return 0;
    
    const sumOfSkinfolds = parseFloat(chest) + parseFloat(abdominal) + parseFloat(thigh) + 
                          parseFloat(triceps) + parseFloat(subscapular) + parseFloat(suprailiac) + 
                          parseFloat(midaxillary);
    
    let bodyDensity;
    
    if (gender === 'male') {
      bodyDensity = 1.112 - (0.00043499 * sumOfSkinfolds) + (0.00000055 * sumOfSkinfolds * sumOfSkinfolds) - (0.00028826 * age);
    } else {
      bodyDensity = 1.097 - (0.00046971 * sumOfSkinfolds) + (0.00000056 * sumOfSkinfolds * sumOfSkinfolds) - (0.00012828 * age);
    }
    
    const bodyFat = (495 / bodyDensity) - 450;
    
    return Math.max(0, Math.min(50, bodyFat));
  };

  // Get method name
  const getMethodName = (method) => {
    const methods = {
      navy: 'Método da Marinha (Navy)',
      skinfold3: 'Dobras Cutâneas (3 pontos)',
      skinfold7: 'Dobras Cutâneas (7 pontos)',
      bioimpedance: 'Bioimpedância'
    };
    return methods[method] || method;
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
      calculateBodyFat();
    }
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Calculadora de Percentual de Gordura Corporal
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Estime a composição corporal usando diferentes métodos
        </p>
      </div>

      {/* Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Método de Avaliação
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MethodButton
            method="navy"
            active={formData.method === 'navy'}
            onClick={() => handleChange('method', 'navy')}
            icon={Ruler}
            name="Navy"
            description="Circunferências"
          />
          <MethodButton
            method="skinfold3"
            active={formData.method === 'skinfold3'}
            onClick={() => handleChange('method', 'skinfold3')}
            icon={BarChart3}
            name="3 Dobras"
            description="Jackson-Pollock"
          />
          <MethodButton
            method="skinfold7"
            active={formData.method === 'skinfold7'}
            onClick={() => handleChange('method', 'skinfold7')}
            icon={Activity}
            name="7 Dobras"
            description="Mais preciso"
          />
          <MethodButton
            method="bioimpedance"
            active={formData.method === 'bioimpedance'}
            onClick={() => handleChange('method', 'bioimpedance')}
            icon={Zap}
            name="Bioimpedância"
            description="Balança especial"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Informações Básicas</h4>
          
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
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

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Method-specific measurements */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {formData.method === 'navy' && 'Circunferências (cm)'}
            {formData.method.includes('skinfold') && 'Dobras Cutâneas (mm)'}
            {formData.method === 'bioimpedance' && 'Dados da Bioimpedância'}
          </h4>

          {/* Navy Method Fields */}
          {formData.method === 'navy' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pescoço
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.neck}
                  onChange={(e) => handleChange('neck', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Abaixo da laringe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => handleChange('waist', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Altura do umbigo"
                />
              </div>
              {formData.gender === 'female' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quadril
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hip}
                    onChange={(e) => handleChange('hip', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Parte mais larga"
                  />
                </div>
              )}
            </>
          )}

          {/* 3-Site Skinfold Fields */}
          {formData.method === 'skinfold3' && (
            <>
              {formData.gender === 'male' ? (
                <>
                  <SkinfoldInput
                    label="Peitoral"
                    value={formData.chest}
                    onChange={(value) => handleChange('chest', value)}
                    info="Diagonal, meio entre mamilo e axila"
                  />
                  <SkinfoldInput
                    label="Abdominal"
                    value={formData.abdominal}
                    onChange={(value) => handleChange('abdominal', value)}
                    info="Vertical, 2cm lateral ao umbigo"
                  />
                  <SkinfoldInput
                    label="Coxa"
                    value={formData.thigh}
                    onChange={(value) => handleChange('thigh', value)}
                    info="Vertical, meio da coxa"
                  />
                </>
              ) : (
                <>
                  <SkinfoldInput
                    label="Tríceps"
                    value={formData.triceps}
                    onChange={(value) => handleChange('triceps', value)}
                    info="Vertical, meio do braço"
                  />
                  <SkinfoldInput
                    label="Suprailíaca"
                    value={formData.suprailiac}
                    onChange={(value) => handleChange('suprailiac', value)}
                    info="Diagonal, acima da crista ilíaca"
                  />
                  <SkinfoldInput
                    label="Coxa"
                    value={formData.thigh}
                    onChange={(value) => handleChange('thigh', value)}
                    info="Vertical, meio da coxa"
                  />
                </>
              )}
            </>
          )}

          {/* 7-Site Skinfold Fields */}
          {formData.method === 'skinfold7' && (
            <>
              <div className="text-sm text-gray-600 mb-2">
                Meça todas as dobras do lado direito do corpo
              </div>
              <SkinfoldInput
                label="Peitoral"
                value={formData.chest}
                onChange={(value) => handleChange('chest', value)}
              />
              <SkinfoldInput
                label="Axilar Média"
                value={formData.midaxillary}
                onChange={(value) => handleChange('midaxillary', value)}
              />
              <SkinfoldInput
                label="Tríceps"
                value={formData.triceps}
                onChange={(value) => handleChange('triceps', value)}
              />
              <SkinfoldInput
                label="Subescapular"
                value={formData.subscapular}
                onChange={(value) => handleChange('subscapular', value)}
              />
              <SkinfoldInput
                label="Abdominal"
                value={formData.abdominal}
                onChange={(value) => handleChange('abdominal', value)}
              />
              <SkinfoldInput
                label="Suprailíaca"
                value={formData.suprailiac}
                onChange={(value) => handleChange('suprailiac', value)}
              />
              <SkinfoldInput
                label="Coxa"
                value={formData.thigh}
                onChange={(value) => handleChange('thigh', value)}
              />
            </>
          )}

          {/* Bioimpedance */}
          {formData.method === 'bioimpedance' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="mb-2">
                    Insira o valor mostrado na sua balança de bioimpedância.
                  </p>
                  <p className="text-xs">
                    Para melhores resultados: jejum de 4h, bexiga vazia, sem exercício nas últimas 12h.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Main Results Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Resultados da Avaliação</h4>
              <span className="text-sm text-gray-600">{results.method}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Body Fat Percentage */}
              <div className="text-center">
                <Percent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-gray-900">{results.bodyFatPercentage}%</p>
                <p className={`text-sm font-medium text-${results.category.color}-700`}>
                  {results.category.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {results.category.description}
                </p>
              </div>

              {/* Fat Mass */}
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 text-2xl">🧈</div>
                <p className="text-2xl font-bold text-gray-900">{results.fatMass} kg</p>
                <p className="text-sm text-gray-600">Massa Gorda</p>
              </div>

              {/* Lean Mass */}
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 text-2xl">💪</div>
                <p className="text-2xl font-bold text-gray-900">{results.leanMass} kg</p>
                <p className="text-sm text-gray-600">Massa Magra</p>
              </div>

              {/* FFMI */}
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-gray-900">{results.ffmi}</p>
                <p className="text-sm text-gray-600">FFMI</p>
                <p className="text-xs text-gray-500">Ajustado: {results.adjustedFFMI}</p>
              </div>
            </div>

            {/* Visual Scale */}
            <div className="mt-6">
              <BodyFatScale
                value={parseFloat(results.bodyFatPercentage)}
                gender={formData.gender}
                categories={getBodyFatCategories(formData.gender)}
              />
            </div>
          </div>

          {/* Goals and Recommendations */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Objetivos e Recomendações</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Faixa Ideal</p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-lg font-semibold text-green-900">
                    {results.idealRange.min}% - {results.idealRange.max}%
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Objetivo: {results.targetBF}% • Peso alvo: {results.targetWeight} kg
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">FFMI Analysis</p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-900">
                    {parseFloat(results.adjustedFFMI) < 18 && 'Massa muscular baixa'}
                    {parseFloat(results.adjustedFFMI) >= 18 && parseFloat(results.adjustedFFMI) < 22 && 'Massa muscular normal'}
                    {parseFloat(results.adjustedFFMI) >= 22 && parseFloat(results.adjustedFFMI) < 25 && 'Massa muscular acima da média'}
                    {parseFloat(results.adjustedFFMI) >= 25 && 'Massa muscular excepcional'}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Limite natural teórico: ~25
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Method Accuracy Info */}
          <button
            onClick={() => setShowMethodDetails(!showMethodDetails)}
            className="w-full bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Precisão do Método</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-600 transform transition-transform ${
                showMethodDetails ? 'rotate-180' : ''
              }`} />
            </div>
          </button>

          {showMethodDetails && (
            <MethodAccuracyInfo method={formData.method} />
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4">
            <BodyFatTips percentage={parseFloat(results.bodyFatPercentage)} gender={formData.gender} />
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
    </div>
  );
};

// Method Button Component
const MethodButton = ({ method, active, onClick, icon: Icon, name, description }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 text-center transition-all ${
        active
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <Icon className={`h-6 w-6 mx-auto mb-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} />
      <p className="font-medium text-sm text-gray-900">{name}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </button>
  );
};

// Skinfold Input Component
const SkinfoldInput = ({ label, value, onChange, info }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="mm"
      />
      {info && (
        <p className="text-xs text-gray-500 mt-1">{info}</p>
      )}
    </div>
  );
};

// Body Fat Scale Visual Component
const BodyFatScale = ({ value, gender, categories }) => {
  const minValue = gender === 'male' ? 5 : 10;
  const maxValue = gender === 'male' ? 35 : 40;
  const position = ((value - minValue) / (maxValue - minValue)) * 100;

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
          {value}%
        </div>
      </div>

      {/* Labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>{minValue}%</span>
        <span>{gender === 'male' ? '13%' : '20%'}</span>
        <span>{gender === 'male' ? '17%' : '24%'}</span>
        <span>{gender === 'male' ? '25%' : '31%'}</span>
        <span>{maxValue}%</span>
      </div>
    </div>
  );
};

// Method Accuracy Info Component
const MethodAccuracyInfo = ({ method }) => {
  const accuracyData = {
    navy: {
      accuracy: '±3-4%',
      pros: ['Rápido e fácil', 'Não requer equipamento especial', 'Boa correlação com DEXA'],
      cons: ['Menos preciso em extremos', 'Depende da distribuição de gordura']
    },
    skinfold3: {
      accuracy: '±3%',
      pros: ['Método validado', 'Boa precisão', 'Específico por sexo'],
      cons: ['Requer adipômetro', 'Depende da habilidade do avaliador']
    },
    skinfold7: {
      accuracy: '±2-3%',
      pros: ['Mais preciso', 'Considera mais pontos', 'Menor margem de erro'],
      cons: ['Mais demorado', 'Requer experiência', 'Equipamento profissional']
    },
    bioimpedance: {
      accuracy: '±3-5%',
      pros: ['Muito rápido', 'Fácil de usar', 'Reprodutível'],
      cons: ['Afetado por hidratação', 'Varia entre aparelhos', 'Menos preciso em atletas']
    }
  };

  const data = accuracyData[method];
  if (!data) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div>
        <span className="text-sm font-medium text-gray-700">Margem de erro: </span>
        <span className="text-sm font-semibold text-gray-900">{data.accuracy}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-green-700 mb-1">Vantagens</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {data.pros.map((pro, i) => (
              <li key={i}>• {pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-orange-700 mb-1">Limitações</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {data.cons.map((con, i) => (
              <li key={i}>• {con}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Body Fat Tips Component
const BodyFatTips = ({ percentage, gender }) => {
  let tip = '';
  
  if (percentage < (gender === 'male' ? 6 : 14)) {
    tip = 'Gordura muito baixa pode afetar hormônios e saúde';
  } else if (percentage < (gender === 'male' ? 15 : 23)) {
    tip = 'Nível atlético - mantenha nutrição adequada';
  } else if (percentage < (gender === 'male' ? 25 : 31)) {
    tip = 'Faixa saudável - foque em manutenção';
  } else {
    tip = 'Considere um défice calórico moderado';
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <AlertCircle className="h-4 w-4" />
      <span>{tip}</span>
    </div>
  );
};

export default BodyFatCalculator;