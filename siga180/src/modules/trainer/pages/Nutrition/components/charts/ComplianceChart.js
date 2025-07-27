// src/modules/trainer/pages/Nutrition/components/charts/ComplianceChart.js
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ComplianceChart = ({ athletes }) => {
  // Preparar dados de compliance
  const complianceData = athletes
    .filter(a => a.nutritionPlan)
    .map(a => ({
      name: a.name.split(' ')[0],
      compliance: a.nutritionPlan.compliance.overall,
      protein: a.nutritionPlan.compliance.protein,
      carbs: a.nutritionPlan.compliance.carbs,
      fat: a.nutritionPlan.compliance.fat,
      water: a.nutritionPlan.compliance.water,
      trend: calculateTrend(a.nutritionPlan.recentMeals)
    }))
    .sort((a, b) => b.compliance - a.compliance);

  // Calcular tendência baseada nas últimas refeições
  function calculateTrend(recentMeals) {
    if (!recentMeals || recentMeals.length < 2) return 'stable';
    
    const recent = recentMeals.slice(0, 3);
    const older = recentMeals.slice(3);
    
    const recentAvg = recent.reduce((acc, m) => acc + m.compliance, 0) / recent.length;
    const olderAvg = older.reduce((acc, m) => acc + m.compliance, 0) / older.length || recentAvg;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Aderência por Atleta</h3>
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>≥90%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>80-89%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>80%</span>
          </div>
        </div>
      </div>

      {complianceData.length > 0 ? (
        <div className="space-y-4">
          {complianceData.map((data, index) => (
            <ComplianceBar key={index} data={data} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Summary Stats */}
      {complianceData.length > 0 && (
        <ComplianceSummary data={complianceData} />
      )}
    </div>
  );
};

// Individual Compliance Bar Component
const ComplianceBar = ({ data }) => {
  const getComplianceColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="space-y-2">
      {/* Main Bar */}
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-sm font-medium text-gray-700 w-20">{data.name}</span>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div 
                className={`h-6 rounded-full transition-all duration-500 ${getComplianceColor(data.compliance)}`}
                style={{ width: `${data.compliance}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
                {data.compliance}%
              </span>
            </div>
          </div>
        </div>
        <div className="ml-3">{getTrendIcon()}</div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pl-24 space-y-1 animate-fadeIn">
          <MacroBar label="Proteína" value={data.protein} color="bg-green-400" />
          <MacroBar label="Carbs" value={data.carbs} color="bg-orange-400" />
          <MacroBar label="Gordura" value={data.fat} color="bg-yellow-400" />
          <MacroBar label="Água" value={data.water} color="bg-blue-400" />
        </div>
      )}
    </div>
  );
};

// Macro Bar Component
const MacroBar = ({ label, value, color }) => (
  <div className="flex items-center space-x-2">
    <span className="text-xs text-gray-600 w-16">{label}</span>
    <div className="flex-1 bg-gray-100 rounded-full h-3">
      <div 
        className={`h-3 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-700 w-10 text-right">{value}%</span>
  </div>
);

// Compliance Summary Component
const ComplianceSummary = ({ data }) => {
  const avgCompliance = Math.round(
    data.reduce((acc, d) => acc + d.compliance, 0) / data.length
  );

  const highPerformers = data.filter(d => d.compliance >= 90).length;
  const needsAttention = data.filter(d => d.compliance < 80).length;
  const improving = data.filter(d => d.trend === 'up').length;

  return (
    <div className="mt-6 pt-6 border-t grid grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold text-gray-900">{avgCompliance}%</p>
        <p className="text-xs text-gray-600">Média Geral</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-green-600">{highPerformers}</p>
        <p className="text-xs text-gray-600">Alta Aderência</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-red-600">{needsAttention}</p>
        <p className="text-xs text-gray-600">Precisam Atenção</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-blue-600">{improving}</p>
        <p className="text-xs text-gray-600">A Melhorar</p>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-8">
    <div className="text-gray-400 mb-2">
      <BarChart3 className="h-12 w-12 mx-auto" />
    </div>
    <p className="text-gray-500">Sem dados de aderência</p>
    <p className="text-sm text-gray-400 mt-1">
      Os dados aparecerão quando os atletas registarem refeições
    </p>
  </div>
);

export default ComplianceChart;