// src/modules/athlete/pages/Progress.js
import React, { useState } from 'react';
import Layout from '../../shared/components/layout/Layout';
import { 
  TrendingUp, 
  Calendar, 
  Scale, 
  Activity,
  Award,
  Target,
  BarChart3,
  Camera,
  Download,
  Filter,
  ChevronDown,
  Zap,
  Heart,
  Percent
} from 'lucide-react';

// Componente de Gráfico Simples (mock - substituir por Recharts em produção)
const SimpleChart = ({ data, color = 'blue' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-48 flex items-end space-x-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center">
          <div className="relative w-full">
            <div 
              className={`w-full bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
              style={{ height: `${(item.value / maxValue) * 160}px` }}
            />
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
              {item.value}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Componente de Métrica
const MetricCard = ({ icon: Icon, title, value, change, unit, color = 'blue' }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium flex items-center ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{change}%
            <TrendingUp className={`w-3 h-3 ml-1 ${!isPositive && 'rotate-180'}`} />
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

// Componente de Conquista
const AchievementBadge = ({ icon: Icon, title, description, date, unlocked = true }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      unlocked 
        ? 'border-yellow-400 bg-yellow-50' 
        : 'border-gray-200 bg-gray-50 opacity-50'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${
          unlocked ? 'bg-yellow-400' : 'bg-gray-300'
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {unlocked && date && (
            <p className="text-xs text-gray-500 mt-2">Conquistado em {date}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Progress = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Dados mockados
  const [weightData] = useState([
    { label: 'Sem 1', value: 76.5 },
    { label: 'Sem 2', value: 76.2 },
    { label: 'Sem 3', value: 75.8 },
    { label: 'Sem 4', value: 75.3 },
    { label: 'Sem 5', value: 75.0 },
    { label: 'Sem 6', value: 74.8 }
  ]);

  const [strengthData] = useState([
    { exercise: 'Supino', previous: 60, current: 70, unit: 'kg' },
    { exercise: 'Agachamento', previous: 80, current: 95, unit: 'kg' },
    { exercise: 'Peso Morto', previous: 90, current: 110, unit: 'kg' },
    { exercise: 'Desenvolvimento', previous: 40, current: 45, unit: 'kg' }
  ]);

  const [bodyMeasurements] = useState({
    chest: { previous: 102, current: 104, unit: 'cm' },
    waist: { previous: 84, current: 82, unit: 'cm' },
    arms: { previous: 38, current: 39.5, unit: 'cm' },
    thighs: { previous: 58, current: 60, unit: 'cm' }
  });

  const [achievements] = useState([
    {
      icon: Award,
      title: '30 Dias Consistente',
      description: 'Treinou por 30 dias consecutivos',
      date: '15 Jul 2024',
      unlocked: true
    },
    {
      icon: Zap,
      title: 'PR Destroyer',
      description: 'Bateu 5 recordes pessoais num mês',
      date: '20 Jul 2024',
      unlocked: true
    },
    {
      icon: Target,
      title: 'Meta de Peso',
      description: 'Alcançou o peso objetivo',
      date: null,
      unlocked: false
    },
    {
      icon: Activity,
      title: 'Cardio King',
      description: 'Completou 100km de corrida',
      date: null,
      unlocked: false
    }
  ]);

  const calculateChange = (previous, current) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">O Meu Progresso</h1>
            <p className="text-gray-600 mt-1">Acompanha a tua evolução ao longo do tempo</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="3months">Últimos 3 Meses</option>
              <option value="6months">Últimos 6 Meses</option>
              <option value="year">Último Ano</option>
            </select>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'measurements'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Medidas
          </button>
          <button
            onClick={() => setActiveTab('strength')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'strength'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Força
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Conquistas
          </button>
        </div>

        {/* Conteúdo baseado na tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={Scale}
                title="Peso Atual"
                value="74.8"
                unit="kg"
                change={-2.2}
                color="blue"
              />
              <MetricCard
                icon={Percent}
                title="Gordura Corporal"
                value="15.2"
                unit="%"
                change={-1.8}
                color="green"
              />
              <MetricCard
                icon={Activity}
                title="Treinos Completos"
                value="24"
                unit="este mês"
                change={20}
                color="purple"
              />
              <MetricCard
                icon={Heart}
                title="FC em Repouso"
                value="62"
                unit="bpm"
                change={-3.1}
                color="red"
              />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
                <SimpleChart data={weightData} color="blue" />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição Corporal</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Massa Muscular</span>
                      <span className="font-medium">63.5 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Massa Gorda</span>
                      <span className="font-medium">11.3 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">Excelente!</span> A tua composição corporal está ótima para os teus objetivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo de Atividades */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Atividades</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Total de Treinos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">312h</p>
                  <p className="text-sm text-gray-600">Tempo Total</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">45,230</p>
                  <p className="text-sm text-gray-600">Calorias Queimadas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medidas Corporais */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medidas Corporais</h3>
              <div className="space-y-4">
                {Object.entries(bodyMeasurements).map(([key, data]) => {
                  const change = calculateChange(data.previous, data.current);
                  const isPositive = data.current > data.previous;
                  
                  return (
                    <div key={key} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">{data.previous} {data.unit}</span>
                          <span>→</span>
                          <span className="font-semibold">{data.current} {data.unit}</span>
                          <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            key === 'waist' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(data.current / (data.current + 20)) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fotos de Progresso */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fotos de Progresso</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">1 Jun 2024</p>
                    <p className="text-xs text-gray-400">Início</p>
                  </div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">26 Jul 2024</p>
                    <p className="text-xs text-gray-400">Atual</p>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Camera className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Adicionar Nova Foto</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'strength' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Evolução de Força</h3>
            <div className="space-y-6">
              {strengthData.map((exercise, idx) => {
                const change = calculateChange(exercise.previous, exercise.current);
                const improvement = exercise.current - exercise.previous;
                
                return (
                  <div key={idx} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{exercise.exercise}</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500">
                          {exercise.previous} {exercise.unit}
                        </span>
                        <span className="text-xl">→</span>
                        <span className="text-xl font-bold text-gray-900">
                          {exercise.current} {exercise.unit}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          +{improvement} {exercise.unit} ({change}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(exercise.current / (exercise.current + 50)) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Análise:</span> Excelente progresso! 
                  Aumentaste a força em todos os exercícios principais. O agachamento teve 
                  o maior ganho com +18.8%.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {achievements.map((achievement, idx) => (
                <AchievementBadge key={idx} {...achievement} />
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Conquistas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium">100kg no Supino</p>
                      <p className="text-sm text-gray-600">Faltam 30kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">70%</p>
                    <p className="text-xs text-gray-500">completo</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium">Peso Objetivo: 73kg</p>
                      <p className="text-sm text-gray-600">Faltam 1.8kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">88%</p>
                    <p className="text-xs text-gray-500">completo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default Progress;