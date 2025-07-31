import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Weight, 
  Ruler, 
  Activity,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

const ProgressChart = ({ 
  data = [],
  clientName = '',
  startDate = '',
  metrics = ['weight', 'bodyFat', 'muscleMass'],
  timeframe = 'month' // 'week', 'month', '3months', '6months', 'year'
}) => {
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [showPhotos, setShowPhotos] = useState(false);
  
  // Mock data se não houver dados
  const defaultData = data.length > 0 ? data : [
    { date: '2024-12-01', weight: 75.2, bodyFat: 18.5, muscleMass: 38.2, waist: 84, chest: 102, arm: 35 },
    { date: '2024-12-15', weight: 74.8, bodyFat: 17.8, muscleMass: 38.5, waist: 83, chest: 102, arm: 35.5 },
    { date: '2025-01-01', weight: 74.3, bodyFat: 17.2, muscleMass: 38.8, waist: 82, chest: 103, arm: 36 },
    { date: '2025-01-15', weight: 73.9, bodyFat: 16.8, muscleMass: 39.0, waist: 81.5, chest: 103, arm: 36 },
    { date: '2025-02-01', weight: 73.5, bodyFat: 16.2, muscleMass: 39.3, waist: 81, chest: 104, arm: 36.5 }
  ];
  
  // Configuração de métricas
  const metricConfig = {
    weight: {
      label: 'Weight',
      unit: 'kg',
      icon: Weight,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      format: (v) => v.toFixed(1)
    },
    bodyFat: {
      label: 'Body Fat',
      unit: '%',
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600',
      format: (v) => v.toFixed(1)
    },
    muscleMass: {
      label: 'Muscle Mass',
      unit: 'kg',
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      format: (v) => v.toFixed(1)
    },
    measurements: {
      label: 'Measurements',
      unit: 'cm',
      icon: Ruler,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      format: (v) => v.toFixed(0)
    }
  };
  
  // Calcular mudanças
  const calculateChange = (metric) => {
    if (defaultData.length < 2) return { value: 0, percentage: 0 };
    
    const first = defaultData[0][metric];
    const last = defaultData[defaultData.length - 1][metric];
    const change = last - first;
    const percentage = ((change / first) * 100).toFixed(1);
    
    return { value: change, percentage };
  };
  
  // Obter valores min/max para escala
  const getMinMax = (metric) => {
    const values = defaultData.map(d => d[metric]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    
    return {
      min: min - padding,
      max: max + padding
    };
  };
  
  // Componente de gráfico de linha
  const LineChart = ({ metric }) => {
    const { min, max } = getMinMax(metric);
    const config = metricConfig[metric];
    const chartHeight = 200;
    const chartWidth = 600;
    
    // Calcular pontos
    const points = defaultData.map((item, index) => {
      const x = (index / (defaultData.length - 1)) * chartWidth;
      const y = chartHeight - ((item[metric] - min) / (max - min)) * chartHeight;
      return { x, y, value: item[metric], date: item.date };
    });
    
    // Criar path
    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
    
    return (
      <div className="relative">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-48"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percentage) => (
            <line
              key={percentage}
              x1="0"
              y1={chartHeight * (percentage / 100)}
              x2={chartWidth}
              y2={chartHeight * (percentage / 100)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Area under line */}
          <path
            d={`${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill={`url(#gradient-${metric})`}
            opacity="0.1"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={config.textColor}
          />
          
          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
                className={`${config.textColor} cursor-pointer hover:r-6 transition-all`}
              />
              {/* Tooltip */}
              <g className="opacity-0 hover:opacity-100 transition-opacity">
                <rect
                  x={point.x - 40}
                  y={point.y - 35}
                  width="80"
                  height="25"
                  fill="#1f2937"
                  rx="4"
                />
                <text
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {config.format(point.value)} {config.unit}
                </text>
              </g>
            </g>
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" className={config.textColor} />
              <stop offset="100%" stopColor="currentColor" className={config.textColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {defaultData.map((item, index) => {
            if (index % Math.ceil(defaultData.length / 5) === 0 || index === defaultData.length - 1) {
              return (
                <span key={index}>
                  {new Date(item.date).toLocaleDateString('pt-PT', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
          {clientName && (
            <p className="text-sm text-gray-500">{clientName} • Started {startDate}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPhotos(!showPhotos)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${showPhotos 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Camera className="w-4 h-4 inline-block mr-1" />
            Photos
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Metric Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(metricConfig).map(([key, config]) => {
          const change = calculateChange(key);
          const Icon = config.icon;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`
                flex-shrink-0 p-3 rounded-lg border transition-all
                ${selectedMetric === key 
                  ? `${config.lightBg} border-current ${config.textColor}` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <p className="font-medium text-sm">{config.label}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {key in defaultData[0] && (
                      <>
                        <span className={change.value < 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {change.value > 0 ? '+' : ''}{config.format(change.value)} {config.unit}
                        </span>
                        <span className="text-gray-500">({change.percentage}%)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Chart Area */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {selectedMetric === 'measurements' ? (
          // Measurements Table
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Body Measurements</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">Date</th>
                    <th className="text-center py-2 font-medium text-gray-700">Waist</th>
                    <th className="text-center py-2 font-medium text-gray-700">Chest</th>
                    <th className="text-center py-2 font-medium text-gray-700">Arm</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">
                        {new Date(item.date).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="text-center py-2">{item.waist} cm</td>
                      <td className="text-center py-2">{item.chest} cm</td>
                      <td className="text-center py-2">{item.arm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <LineChart metric={selectedMetric} />
        )}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Starting</p>
          <p className="text-lg font-bold text-gray-900">
            {metricConfig[selectedMetric].format(defaultData[0][selectedMetric])} 
            <span className="text-sm font-normal text-gray-500 ml-1">
              {metricConfig[selectedMetric].unit}
            </span>
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Current</p>
          <p className="text-lg font-bold text-gray-900">
            {metricConfig[selectedMetric].format(defaultData[defaultData.length - 1][selectedMetric])} 
            <span className="text-sm font-normal text-gray-500 ml-1">
              {metricConfig[selectedMetric].unit}
            </span>
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Change</p>
          <p className={`text-lg font-bold ${
            calculateChange(selectedMetric).value < 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {calculateChange(selectedMetric).value > 0 ? '+' : ''}
            {metricConfig[selectedMetric].format(calculateChange(selectedMetric).value)} 
            <span className="text-sm font-normal ml-1">
              {metricConfig[selectedMetric].unit}
            </span>
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Progress</p>
          <p className="text-lg font-bold text-gray-900">
            {calculateChange(selectedMetric).percentage}%
            {calculateChange(selectedMetric).value < 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-600 inline-block ml-1" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-600 inline-block ml-1" />
            )}
          </p>
        </div>
      </div>
      
      {/* Progress Photos Section */}
      {showPhotos && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Progress Photos</h4>
            <div className="flex gap-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Placeholder for photos */}
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;