import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ComplianceChart = ({ 
  data = [], 
  period = 'week',
  height = 200,
  showTrend = true,
  interactive = true 
}) => {
  // Calcular métricas
  const avgCompliance = data.length > 0 
    ? Math.round(data.reduce((acc, d) => acc + d.percentage, 0) / data.length)
    : 0;
  
  const previousAvg = 85; // Mock para comparação
  const trend = avgCompliance - previousAvg;
  
  // Obter valor máximo para escala
  const maxValue = Math.max(...data.map(d => d.percentage), 100);
  
  // Cores baseadas no compliance
  const getBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-emerald-500 hover:bg-emerald-600';
    if (percentage >= 70) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-red-500 hover:bg-red-600';
  };
  
  // Componente de Trend
  const TrendIndicator = () => {
    if (!showTrend) return null;
    
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
        <TrendIcon className="w-4 h-4" />
        <span>{trend > 0 ? '+' : ''}{trend}%</span>
        <span className="text-gray-500 font-normal">vs last {period}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
          <p className="text-sm text-gray-500">Average: {avgCompliance}%</p>
        </div>
        <TrendIndicator />
      </div>
      
      {/* Chart Container */}
      <div 
        className="relative" 
        style={{ height: `${height}px` }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((value) => (
            <div key={value} className="flex items-center">
              <span className="text-xs text-gray-400 w-8 text-right mr-2">{value}</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>
          ))}
        </div>
        
        {/* Bars */}
        <div className="relative h-full flex items-end justify-between gap-2 px-10">
          {data.map((day, index) => {
            const barHeight = (day.percentage / maxValue) * (height - 20);
            const isToday = index === data.length - 1;
            
            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center group"
              >
                {/* Percentage Label */}
                <span 
                  className={`text-xs font-medium mb-2 transition-opacity ${
                    interactive ? 'opacity-0 group-hover:opacity-100' : ''
                  } ${isToday ? 'text-emerald-600 !opacity-100' : 'text-gray-700'}`}
                >
                  {day.percentage}%
                </span>
                
                {/* Bar */}
                <div className="relative w-full flex flex-col items-center">
                  <div 
                    className={`
                      w-full rounded-t-md transition-all duration-300 
                      ${getBarColor(day.percentage)}
                      ${isToday ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                    `}
                    style={{ 
                      height: `${Math.max(barHeight, 4)}px`,
                      minHeight: '4px'
                    }}
                  >
                    {/* Tooltip on hover */}
                    {interactive && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          <div className="font-semibold">{day.label || `Day ${index + 1}`}</div>
                          <div>{day.compliantMeals || 0} / {day.totalMeals || 0} meals</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Day Label */}
                <span className={`text-xs mt-2 ${isToday ? 'font-semibold' : ''} text-gray-500`}>
                  {day.day}
                  {isToday && <span className="block text-xs text-emerald-600">Today</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded" />
          <span className="text-gray-600">Excellent (≥90%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span className="text-gray-600">Good (70-89%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600">Needs Work (70%)</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceChart;