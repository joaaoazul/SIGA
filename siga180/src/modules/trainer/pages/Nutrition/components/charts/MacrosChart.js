import React, { useState } from 'react';
import { Info, Target, TrendingUp } from 'lucide-react';

const MacrosChart = ({ 
  current = { protein: 0, carbs: 0, fat: 0 },
  target = { protein: 150, carbs: 200, fat: 65 },
  calories = { current: 0, target: 2000 },
  view = 'grams', // 'grams', 'percentage', 'calories'
  showDetails = true 
}) => {
  const [selectedMacro, setSelectedMacro] = useState(null);
  
  // Calcular totais e percentagens
  const calculatePercentage = (current, target) => {
    return Math.round((current / target) * 100);
  };
  
  const calculateCalories = (macro, value) => {
    const caloriesPerGram = {
      protein: 4,
      carbs: 4,
      fat: 9
    };
    return value * caloriesPerGram[macro];
  };
  
  // Dados dos macros
  const macros = [
    {
      name: 'Protein',
      key: 'protein',
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      current: current.protein,
      target: target.protein,
      percentage: calculatePercentage(current.protein, target.protein),
      calories: calculateCalories('protein', current.protein)
    },
    {
      name: 'Carbs',
      key: 'carbs',
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600',
      current: current.carbs,
      target: target.carbs,
      percentage: calculatePercentage(current.carbs, target.carbs),
      calories: calculateCalories('carbs', current.carbs)
    },
    {
      name: 'Fat',
      key: 'fat',
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      lightBg: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      current: current.fat,
      target: target.fat,
      percentage: calculatePercentage(current.fat, target.fat),
      calories: calculateCalories('fat', current.fat)
    }
  ];
  
  // Calcular distribuição percentual dos targets
  const totalTargetCalories = 
    target.protein * 4 + 
    target.carbs * 4 + 
    target.fat * 9;
    
  const targetDistribution = {
    protein: Math.round((target.protein * 4 / totalTargetCalories) * 100),
    carbs: Math.round((target.carbs * 4 / totalTargetCalories) * 100),
    fat: Math.round((target.fat * 9 / totalTargetCalories) * 100)
  };
  
  // Componente de Donut Chart
  const DonutChart = () => {
    const radius = 80;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#f3f4f6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Macro segments */}
          {macros.map((macro, index) => {
            const percentage = targetDistribution[macro.key];
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -(cumulativePercentage / 100) * circumference;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={macro.key}
                className={`${macro.bgColor} transition-all duration-300 cursor-pointer hover:opacity-80`}
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                onClick={() => setSelectedMacro(macro.key)}
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-900">{calories.current}</p>
          <p className="text-xs text-gray-500">of {calories.target} kcal</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Macronutrients</h3>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Main Chart Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex justify-center">
          <DonutChart />
        </div>
        
        {/* Progress Bars */}
        <div className="space-y-4">
          {macros.map((macro) => (
            <div 
              key={macro.key}
              className={`
                p-3 rounded-lg border transition-all cursor-pointer
                ${selectedMacro === macro.key 
                  ? `${macro.lightBg} border-current ${macro.textColor}` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => setSelectedMacro(macro.key)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{macro.name}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">
                    {view === 'grams' && `${macro.current}g / ${macro.target}g`}
                    {view === 'percentage' && `${macro.percentage}%`}
                    {view === 'calories' && `${macro.calories} kcal`}
                  </span>
                  {macro.percentage > 100 && (
                    <span className="text-xs text-red-600 font-medium">
                      +{macro.current - macro.target}g
                    </span>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`
                    absolute left-0 top-0 h-full rounded-full transition-all duration-500
                    ${macro.bgColor}
                  `}
                  style={{ width: `${Math.min(macro.percentage, 100)}%` }}
                />
                {macro.percentage > 100 && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
                    style={{ 
                      width: `${macro.percentage - 100}%`,
                      marginLeft: '100%'
                    }}
                  />
                )}
              </div>
              
              {/* Target indicator */}
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{targetDistribution[macro.key]}% of daily calories</span>
                {macro.percentage < 80 && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <Target className="w-3 h-3" />
                    {80 - macro.percentage}% to go
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Details Section */}
      {showDetails && selectedMacro && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-900 mb-2">
            {macros.find(m => m.key === selectedMacro)?.name} Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Recommended Range</p>
              <p className="font-medium">
                {selectedMacro === 'protein' && '1.6-2.2g per kg body weight'}
                {selectedMacro === 'carbs' && '3-5g per kg for moderate activity'}
                {selectedMacro === 'fat' && '20-35% of total calories'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Best Sources</p>
              <p className="font-medium">
                {selectedMacro === 'protein' && 'Chicken, Fish, Eggs, Legumes'}
                {selectedMacro === 'carbs' && 'Rice, Oats, Fruits, Vegetables'}
                {selectedMacro === 'fat' && 'Nuts, Avocado, Olive Oil, Seeds'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Total Consumed</p>
          <p className="text-lg font-bold text-gray-900">{calories.current} kcal</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-lg font-bold text-emerald-600">
            {Math.max(calories.target - calories.current, 0)} kcal
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Daily Goal</p>
          <p className="text-lg font-bold text-gray-900">{calories.target} kcal</p>
        </div>
      </div>
    </div>
  );
};

export default MacrosChart;