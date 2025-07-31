// src/modules/trainer/pages/Nutrition/components/ToolsView.js
import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  PieChart,
  Scale,
  Percent,
  Droplets,
  Heart,
  Timer,
  Zap,
  Brain,
  Activity,
  Target,
  Info,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  Book,
  FileText,
  Download,
  Share2,
  Printer,
  Check
} from 'lucide-react';
import CaloriesCalculator from '../components/calculators/CaloriesCalculator';
import MacrosCalculator from '../components/calculators/MacrosCalculator';
import BMICalculator from '../components/calculators/BMICalculator';
import BodyFatCalculator from '../components/calculators/BodyFatCalculator';
import WaterCalculator from '../components/calculators/WaterCalculator';
import SupplementsGuide from '../components/calculators/SupplementsGuide';

const ToolsView = () => {
  const [activeCalculator, setActiveCalculator] = useState('calories');
  const [savedCalculations, setSavedCalculations] = useState([]);

  // Tools/Calculators data
  const tools = [
    {
      id: 'calories',
      name: 'Calculadora de Calorias',
      icon: Flame,
      description: 'Calcula as necessidades calóricas diárias (TDEE)',
      color: 'red',
      features: ['TMB', 'TDEE', 'Défice/Superávit', 'Distribuição de Macros']
    },
    {
      id: 'macros',
      name: 'Calculadora de Macros',
      icon: PieChart,
      description: 'Distribui macronutrientes baseado nos objetivos',
      color: 'blue',
      features: ['Proteína', 'Carboidratos', 'Gordura', 'Fibra']
    },
    {
      id: 'bmi',
      name: 'Calculadora de IMC',
      icon: Scale,
      description: 'Índice de Massa Corporal e peso ideal',
      color: 'green',
      features: ['IMC', 'Classificação', 'Peso Ideal', 'Faixa Saudável']
    },
    {
      id: 'bodyfat',
      name: 'Percentual de Gordura',
      icon: Percent,
      description: 'Estima o percentual de gordura corporal',
      color: 'purple',
      features: ['% Gordura', 'Massa Magra', 'Classificação', 'Objetivo']
    },
    {
      id: 'water',
      name: 'Calculadora de Hidratação',
      icon: Droplets,
      description: 'Calcula necessidades diárias de água',
      color: 'cyan',
      features: ['Água Base', 'Ajuste Exercício', 'Clima', 'Lembretes']
    },
    {
      id: 'supplements',
      name: 'Guia de Suplementação',
      icon: Heart,
      description: 'Recomendações personalizadas de suplementos',
      color: 'pink',
      features: ['Timing', 'Dosagem', 'Combinações', 'Protocolos']
    }
  ];

  // Educational resources
  const resources = [
    {
      title: 'Guia Completo de Nutrição',
      type: 'PDF',
      icon: Book,
      size: '2.4 MB',
      downloads: 234
    },
    {
      title: 'Tabela de Equivalências',
      type: 'Excel',
      icon: FileText,
      size: '450 KB',
      downloads: 189
    },
    {
      title: 'Protocolos de Suplementação',
      type: 'PDF',
      icon: Heart,
      size: '1.8 MB',
      downloads: 156
    },
    {
      title: 'Manual de Jejum Intermitente',
      type: 'PDF',
      icon: Timer,
      size: '980 KB',
      downloads: 201
    }
  ];

  // Save calculation
  const saveCalculation = (type, data) => {
    const newCalculation = {
      id: Date.now(),
      type,
      data,
      date: new Date().toISOString(),
      athleteName: data.athleteName || 'Cálculo Manual'
    };
    setSavedCalculations(prev => [newCalculation, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ToolsHeader activeCalculator={activeCalculator} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calculator Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Ferramentas</h3>
            <div className="space-y-2">
              {tools.map(tool => (
                <ToolButton
                  key={tool.id}
                  tool={tool}
                  isActive={activeCalculator === tool.id}
                  onClick={() => setActiveCalculator(tool.id)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Main Calculator Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {/* Render Active Calculator */}
              {activeCalculator === 'calories' && (
                <CaloriesCalculator onSave={(data) => saveCalculation('calories', data)} />
              )}
              {activeCalculator === 'macros' && (
                <MacrosCalculator onSave={(data) => saveCalculation('macros', data)} />
              )}
              {activeCalculator === 'bmi' && (
                <BMICalculator onSave={(data) => saveCalculation('bmi', data)} />
              )}
              {activeCalculator === 'bodyfat' && (
                <BodyFatCalculator onSave={(data) => saveCalculation('bodyfat', data)} />
              )}
              {activeCalculator === 'water' && (
                <WaterCalculator onSave={(data) => saveCalculation('water', data)} />
              )}
              {activeCalculator === 'supplements' && (
                <SupplementsGuide onSave={(data) => saveCalculation('supplements', data)} />
              )}
            </div>
          </div>

          {/* Recent Calculations */}
          {savedCalculations.length > 0 && (
            <RecentCalculations calculations={savedCalculations} />
          )}
        </div>
      </div>

      {/* Educational Resources */}
      <EducationalResources resources={resources} />

      {/* Tips Section */}
      <TipsSection />
    </div>
  );
};

// Tools Header Component
const ToolsHeader = ({ activeCalculator }) => {
  const toolName = {
    calories: 'Calculadora de Calorias',
    macros: 'Calculadora de Macros',
    bmi: 'Calculadora de IMC',
    bodyfat: 'Percentual de Gordura',
    water: 'Calculadora de Hidratação',
    supplements: 'Guia de Suplementação'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ferramentas de Nutrição
          </h2>
          <p className="text-gray-600 mt-1">
            {toolName[activeCalculator]} e calculadoras profissionais
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Printer className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ tool, isActive, onClick }) => {
  const Icon = tool.icon;
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    cyan: 'text-cyan-600 bg-cyan-100',
    pink: 'text-pink-600 bg-pink-100'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all ${
        isActive
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'hover:bg-gray-50 border-2 border-transparent'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          isActive ? 'bg-blue-100' : colorClasses[tool.color]
        }`}>
          <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${
            isActive ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {tool.name}
          </h4>
          <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tool.features.map((feature, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        {isActive && (
          <ChevronRight className="h-5 w-5 text-blue-600 mt-3" />
        )}
      </div>
    </button>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { icon: Target, label: 'Definir Objetivo', color: 'blue' },
    { icon: Award, label: 'Ver Progressos', color: 'green' },
    { icon: Brain, label: 'Dicas Personalizadas', color: 'purple' },
    { icon: Activity, label: 'Análise Completa', color: 'orange' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
            >
              <Icon className={`h-6 w-6 mx-auto mb-1 text-${action.color}-600`} />
              <span className="text-xs text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Recent Calculations Component
const RecentCalculations = ({ calculations }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="font-semibold text-gray-900 mb-4">Cálculos Recentes</h3>
      <div className="space-y-3">
        {calculations.slice(0, 5).map(calc => (
          <div
            key={calc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {calc.athleteName}
                </p>
                <p className="text-xs text-gray-500">
                  {calc.type === 'calories' && `TDEE: ${calc.data.tdee} kcal`}
                  {calc.type === 'bmi' && `IMC: ${calc.data.bmi}`}
                  {calc.type === 'water' && `Água: ${calc.data.totalWater}L`}
                  {calc.type === 'bodyfat' && `%Gordura: ${calc.data.bodyFatPercentage}%`}
                  {calc.type === 'macros' && `Macros calculados`}
                  {calc.type === 'supplements' && `Protocolo criado`}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(calc.date).toLocaleDateString('pt-PT')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Educational Resources Component
const EducationalResources = ({ resources }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recursos Educacionais</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Ver todos
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {resource.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {resource.type} • {resource.size}
                    </span>
                    <span className="text-xs text-gray-500">
                      {resource.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Visualizar
                </button>
                <button className="text-xs text-gray-600 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tips Section Component
const TipsSection = () => {
  const tips = [
    {
      icon: Zap,
      title: 'Dica do Dia',
      description: 'A proteína deve ser distribuída ao longo do dia em porções de 20-40g para otimizar a síntese proteica.',
      color: 'yellow'
    },
    {
      icon: Activity,
      title: 'Hidratação Pré-Treino',
      description: 'Recomenda-se consumir 500-600ml de água 2-3 horas antes do treino para garantir hidratação adequada.',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'Timing de Carboidratos',
      description: 'Consumir carboidratos complexos 2-3 horas antes do treino fornece energia sustentada durante o exercício.',
      color: 'purple'
    },
    {
      icon: Heart,
      title: 'Recuperação Pós-Treino',
      description: 'A janela anabólica de 30-60 minutos pós-treino é ideal para consumir proteína e carboidratos.',
      color: 'red'
    }
  ];

  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const tip = tips[currentTip];
  const Icon = tip.icon;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Dicas de Nutrição
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm">
            {currentTip + 1} / {tips.length}
          </span>
          <button
            onClick={nextTip}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2">{tip.title}</h4>
          <p className="text-sm opacity-90">{tip.description}</p>
        </div>
      </div>

      {/* Indicadores de dicas */}
      <div className="flex justify-center space-x-2 mt-4">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentTip
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Integration Helper Component
const IntegrationHelper = ({ athlete, calculation }) => {
  const [showIntegration, setShowIntegration] = useState(false);

  const handleIntegrateWithPlan = () => {
    // Lógica para integrar cálculo com plano do atleta
    console.log('Integrando cálculo com plano do atleta:', athlete, calculation);
    setShowIntegration(true);
    
    // Simular salvamento
    setTimeout(() => {
      setShowIntegration(false);
    }, 2000);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Integrar com Plano Nutricional
          </span>
        </div>
        <button
          onClick={handleIntegrateWithPlan}
          disabled={showIntegration}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showIntegration
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showIntegration ? (
            <>
              <Check className="h-4 w-4 inline mr-1" />
              Integrado!
            </>
          ) : (
            'Aplicar ao Plano'
          )}
        </button>
      </div>
      
      {showIntegration && (
        <div className="mt-3 text-sm text-green-700">
          Cálculo integrado com sucesso ao plano nutricional!
        </div>
      )}
    </div>
  );
};

// Export Helper Component
const ExportHelper = ({ data, type }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format) => {
    console.log(`Exportando ${type} em formato ${format}:`, data);
    // Implementar lógica de exportação
    setShowExportMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Download className="h-5 w-5" />
      </button>
      
      {showExportMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Exportar como PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Exportar como Excel
          </button>
          <button
            onClick={() => handleExport('print')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

// Comparison Tool Component
const ComparisonTool = ({ calculations }) => {
  const [comparing, setComparing] = useState(false);
  const [selectedCalculations, setSelectedCalculations] = useState([]);

  if (!calculations || calculations.length < 2) return null;

  const toggleComparison = (calc) => {
    setSelectedCalculations(prev => {
      const exists = prev.find(c => c.id === calc.id);
      if (exists) {
        return prev.filter(c => c.id !== calc.id);
      }
      return [...prev, calc].slice(-3); // Máximo 3 comparações
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setComparing(!comparing)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-medium">
          {comparing ? 'Fechar Comparação' : 'Comparar Cálculos'}
        </span>
      </button>

      {comparing && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calculations.slice(0, 6).map(calc => (
              <label
                key={calc.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedCalculations.find(c => c.id === calc.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selectedCalculations.find(c => c.id === calc.id)}
                  onChange={() => toggleComparison(calc)}
                  className="mr-2"
                />
                <span className="text-sm">
                  {calc.athleteName} - {new Date(calc.date).toLocaleDateString('pt-PT')}
                </span>
              </label>
            ))}
          </div>

          {selectedCalculations.length >= 2 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Comparação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCalculations.map(calc => (
                  <div key={calc.id} className="bg-white rounded p-3">
                    <h5 className="font-medium text-sm mb-2">{calc.athleteName}</h5>
                    {calc.type === 'calories' && (
                      <>
                        <p className="text-xs text-gray-600">TDEE: {calc.data.tdee} kcal</p>
                        <p className="text-xs text-gray-600">Objetivo: {calc.data.goal}</p>
                      </>
                    )}
                    {calc.type === 'macros' && (
                      <>
                        <p className="text-xs text-gray-600">Proteína: {calc.data.macros?.protein?.grams}g</p>
                        <p className="text-xs text-gray-600">Carbs: {calc.data.macros?.carbs?.grams}g</p>
                      </>
                    )}
                    {calc.type === 'bodyfat' && (
                      <>
                        <p className="text-xs text-gray-600">%Gordura: {calc.data.bodyFatPercentage}%</p>
                        <p className="text-xs text-gray-600">Massa Magra: {calc.data.leanMass}kg</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Analytics Summary Component
const AnalyticsSummary = ({ calculations }) => {
  if (!calculations || calculations.length === 0) return null;

  // Calcular estatísticas
  const stats = {
    totalCalculations: calculations.length,
    uniqueAthletes: new Set(calculations.map(c => c.athleteName)).size,
    mostUsedTool: calculations.reduce((acc, calc) => {
      acc[calc.type] = (acc[calc.type] || 0) + 1;
      return acc;
    }, {}),
    lastWeekCalculations: calculations.filter(calc => {
      const date = new Date(calc.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length
  };

  const mostUsed = Object.entries(stats.mostUsedTool)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mt-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2" />
        Resumo de Utilização
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalCalculations}</p>
          <p className="text-sm text-gray-600">Total de Cálculos</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.uniqueAthletes}</p>
          <p className="text-sm text-gray-600">Atletas Únicos</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{stats.lastWeekCalculations}</p>
          <p className="text-sm text-gray-600">Última Semana</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{mostUsed?.[0] || '-'}</p>
          <p className="text-sm text-gray-600">Mais Utilizada</p>
        </div>
      </div>
    </div>
  );
};

export default ToolsView;
