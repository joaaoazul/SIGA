import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  Activity,
  Download,
  Filter,
  ChevronDown,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Scale,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const NutritionAnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter, year
  const [selectedAthlete, setSelectedAthlete] = useState('all');
  const [activeMetric, setActiveMetric] = useState('compliance');

  // Mock data for charts
  const complianceData = [
    { day: 'Seg', compliance: 92, target: 90 },
    { day: 'Ter', compliance: 88, target: 90 },
    { day: 'Qua', compliance: 95, target: 90 },
    { day: 'Qui', compliance: 91, target: 90 },
    { day: 'Sex', compliance: 87, target: 90 },
    { day: 'Sáb', compliance: 93, target: 90 },
    { day: 'Dom', compliance: 89, target: 90 }
  ];

  const athleteProgress = [
    { 
      name: 'João Silva', 
      compliance: 92, 
      weightChange: -1.2, 
      goal: 'cutting',
      streak: 15,
      trend: 'up'
    },
    { 
      name: 'Maria Santos', 
      compliance: 88, 
      weightChange: -0.8, 
      goal: 'cutting',
      streak: 8,
      trend: 'stable'
    },
    { 
      name: 'Pedro Costa', 
      compliance: 95, 
      weightChange: 0.0, 
      goal: 'maintenance',
      streak: 22,
      trend: 'up'
    }
  ];

  const macroDistribution = [
    { name: 'Proteína', value: 35, target: 30, color: 'bg-red-500' },
    { name: 'Carboidratos', value: 45, target: 50, color: 'bg-green-500' },
    { name: 'Gordura', value: 20, target: 20, color: 'bg-yellow-500' }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? ArrowUp : change < 0 ? ArrowDown : Minus;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`p-2 bg-${color}-100 rounded-lg`}>
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                isPositive ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span>{isPositive && '+'}{change}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ComplianceChart = ({ data }) => {
    const maxValue = 100;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Compliance Semanal
        </h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-48 relative">
                <div className="absolute bottom-0 w-full">
                  <div 
                    className="bg-blue-500 rounded-t mx-auto"
                    style={{ 
                      height: `${(item.compliance / maxValue) * 100}%`,
                      width: '60%'
                    }}
                  />
                </div>
                <span className="absolute top-0 text-sm font-medium">
                  {item.compliance}%
                </span>
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span>Compliance Real</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded mr-2" />
            <span>Meta (90%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análises Nutricionais</h1>
            <p className="text-gray-600 mt-1">Acompanhe o progresso dos seus atletas</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Ano</option>
            </select>

            {/* Athlete Filter */}
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Atletas</option>
              <option value="1">João Silva</option>
              <option value="2">Maria Santos</option>
              <option value="3">Pedro Costa</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Compliance Média"
          value="91.3%"
          change={3.2}
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Atletas Ativos"
          value="12"
          change={0}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Check-ins Esta Semana"
          value="10/12"
          change={-16.7}
          icon={CheckCircle}
          color="purple"
        />
        <MetricCard
          title="Taxa de Sucesso"
          value="83%"
          change={5.5}
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compliance Chart */}
        <ComplianceChart data={complianceData} />

        {/* Macro Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição de Macros (Média)
          </h3>
          <div className="space-y-4">
            {macroDistribution.map((macro, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                  <span className="text-sm text-gray-600">
                    {macro.value}% (alvo: {macro.target}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className={`${macro.color} h-3 rounded-full`}
                    style={{ width: `${macro.value}%` }}
                  />
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-600"
                    style={{ left: `${macro.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Insight:</strong> A média de proteína está 5% acima do alvo. 
              Considere ajustar os planos para melhor distribuição.
            </p>
          </div>
        </div>
      </div>

      {/* Athlete Progress Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Progresso Individual
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atleta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso (Δ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objetivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {athleteProgress.map((athlete, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {athlete.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        athlete.compliance >= 90 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {athlete.compliance}%
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            athlete.compliance >= 90 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${athlete.compliance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      athlete.weightChange < 0 ? 'text-red-600' : 
                      athlete.weightChange > 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {athlete.weightChange > 0 && '+'}{athlete.weightChange}kg
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      athlete.goal === 'cutting' ? 'bg-red-100 text-red-800' :
                      athlete.goal === 'bulking' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {athlete.goal}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{athlete.streak} dias</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${
                      athlete.trend === 'up' ? 'text-green-600' :
                      athlete.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {athlete.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                       athlete.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                       <Minus className="h-4 w-4" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-green-900">Destaques Positivos</h4>
          </div>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Pedro Costa: 22 dias consecutivos de compliance</li>
            <li>• Compliance média subiu 3.2% esta semana</li>
            <li>• 83% dos atletas atingiram os objetivos</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="font-medium text-yellow-900">Atenção Necessária</h4>
          </div>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 2 atletas sem check-in esta semana</li>
            <li>• Maria Santos: compliance abaixo de 90%</li>
            <li>• Distribuição de proteína acima do alvo</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">Ações Recomendadas</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Contactar atletas sem check-in</li>
            <li>• Revisar plano de Maria Santos</li>
            <li>• Ajustar macros nos próximos planos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NutritionAnalyticsView;