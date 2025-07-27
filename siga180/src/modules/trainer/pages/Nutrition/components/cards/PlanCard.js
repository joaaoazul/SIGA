// src/modules/trainer/pages/Nutrition/components/cards/PlanCard.js
import React from 'react';
import {
  Clock,
  Edit2,
  Copy,
  Share2,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User,
  Target,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';

const PlanCard = ({ plan, onEdit, onDuplicate, onShare }) => {
  // Calcular dias restantes
  const daysRemaining = Math.ceil(
    (new Date(plan.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  
  const isExpiring = daysRemaining <= 7 && daysRemaining > 0;
  const hasExpired = daysRemaining < 0;

  // Obter ícone e cor do tipo de plano
  const getPlanTypeInfo = (type) => {
    switch (type) {
      case 'cutting':
        return { icon: Zap, color: 'red', label: 'Cutting' };
      case 'bulking':
        return { icon: TrendingUp, color: 'blue', label: 'Bulking' };
      case 'recomp':
        return { icon: RefreshCw, color: 'purple', label: 'Recomposição' };
      case 'maintenance':
        return { icon: Shield, color: 'green', label: 'Manutenção' };
      default:
        return { icon: Target, color: 'gray', label: 'Personalizado' };
    }
  };

  const planTypeInfo = getPlanTypeInfo(plan.type);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{plan.name}</h4>
              <PlanTypeBadge typeInfo={planTypeInfo} />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{plan.athleteName}</span>
              <span className="text-gray-400">•</span>
              <Target className="h-4 w-4" />
              <span>{plan.athleteGoal}</span>
            </div>
          </div>
          <StatusIndicator 
            isExpiring={isExpiring}
            hasExpired={hasExpired}
            daysRemaining={daysRemaining}
          />
        </div>

        {/* Plan Duration */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {new Date(plan.startDate).toLocaleDateString('pt-PT')} - 
              {new Date(plan.endDate).toLocaleDateString('pt-PT')}
            </span>
          </div>
          <span className={`font-medium ${
            hasExpired ? 'text-red-600' :
            isExpiring ? 'text-orange-600' :
            'text-gray-600'
          }`}>
            {hasExpired ? 'Expirado' :
             isExpiring ? `${daysRemaining} dias restantes` :
             `${daysRemaining} dias`}
          </span>
        </div>

        {/* Macros Summary */}
        <MacrosSummary plan={plan} />

        {/* Additional Info */}
        <AdditionalInfo plan={plan} />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <LastUpdateInfo lastUpdate={plan.lastUpdate} />
          <ActionButtons 
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onShare={onShare}
          />
        </div>
      </div>
    </div>
  );
};

// Plan Type Badge Component
const PlanTypeBadge = ({ typeInfo }) => {
  const Icon = typeInfo.icon;
  const colorClasses = {
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      colorClasses[typeInfo.color]
    }`}>
      <Icon className="h-3 w-3 mr-1" />
      {typeInfo.label}
    </span>
  );
};

// Status Indicator Component
const StatusIndicator = ({ isExpiring, hasExpired, daysRemaining }) => {
  if (hasExpired) {
    return (
      <div className="flex items-center text-red-600">
        <AlertCircle className="h-5 w-5" />
      </div>
    );
  }

  if (isExpiring) {
    return (
      <div className="flex items-center text-orange-600">
        <Clock className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-600">
      <CheckCircle className="h-5 w-5" />
    </div>
  );
};

// Macros Summary Component
const MacrosSummary = ({ plan }) => {
  const macros = [
    { label: 'Calorias', value: plan.calories, unit: '', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Proteína', value: plan.protein, unit: 'g', color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Carbs', value: plan.carbs, unit: 'g', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: 'Gordura', value: plan.fat, unit: 'g', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {macros.map((macro, index) => (
        <div key={index} className={`${macro.bgColor} rounded-lg p-3 text-center`}>
          <p className="text-xs text-gray-600">{macro.label}</p>
          <p className={`text-lg font-bold ${macro.color}`}>
            {macro.value}{macro.unit}
          </p>
        </div>
      ))}
    </div>
  );
};

// Additional Info Component
const AdditionalInfo = ({ plan }) => {
  const hasSupplements = plan.supplements && plan.supplements.length > 0;
  const hasRestrictions = plan.restrictions && plan.restrictions.length > 0;

  if (!hasSupplements && !hasRestrictions) return null;

  return (
    <div className="space-y-2 mb-4">
      {hasSupplements && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Suplementos:</p>
          <div className="flex flex-wrap gap-1">
            {plan.supplements.map((supp, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700"
              >
                {supp}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {hasRestrictions && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Restrições:</p>
          <div className="flex flex-wrap gap-1">
            {plan.restrictions.map((rest, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700"
              >
                {rest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Last Update Info Component
const LastUpdateInfo = ({ lastUpdate }) => (
  <div className="flex items-center space-x-2 text-xs text-gray-500">
    <Clock className="h-3 w-3" />
    <span>Atualizado {new Date(lastUpdate).toLocaleDateString('pt-PT')}</span>
  </div>
);

// Action Buttons Component
const ActionButtons = ({ onEdit, onDuplicate, onShare }) => (
  <div className="flex items-center space-x-2">
    <button 
      onClick={onEdit}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      title="Editar plano"
    >
      <Edit2 className="h-4 w-4" />
    </button>
    <button 
      onClick={onDuplicate}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      title="Duplicar plano"
    >
      <Copy className="h-4 w-4" />
    </button>
    <button 
      onClick={onShare}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      title="Partilhar plano"
    >
      <Share2 className="h-4 w-4" />
    </button>
  </div>
);

export default PlanCard;