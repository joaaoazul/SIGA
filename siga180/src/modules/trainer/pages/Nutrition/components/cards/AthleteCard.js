// src/modules/trainer/pages/Nutrition/components/cards/AthleteCard.js
import React from 'react';
import {
  User,
  MoreVertical,
  Flame,
  Shield,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';

const AthleteCard = ({ athlete, onSelect, onCreatePlan }) => {
  const hasPlan = !!athlete.nutritionPlan;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all">
      <div className="p-6">
        {/* Header */}
        <CardHeader athlete={athlete} />

        {/* Tags */}
        <TagsSection athlete={athlete} />

        {/* Content based on plan status */}
        {hasPlan ? (
          <PlanContent 
            athlete={athlete} 
            onSelect={onSelect} 
          />
        ) : (
          <NoPlanContent onCreatePlan={onCreatePlan} />
        )}

        {/* Footer */}
        <CardFooter athlete={athlete} />
      </div>
    </div>
  );
};

// Header Section
const CardHeader = ({ athlete }) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center space-x-3">
      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
        {athlete.avatar ? (
          <img 
            src={athlete.avatar} 
            alt={athlete.name} 
            className="h-12 w-12 rounded-full" 
          />
        ) : (
          <User className="h-6 w-6 text-gray-600" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
        <p className="text-sm text-gray-500">{athlete.goal}</p>
      </div>
    </div>
    <button className="text-gray-400 hover:text-gray-600">
      <MoreVertical className="h-5 w-5" />
    </button>
  </div>
);

// Tags Section
const TagsSection = ({ athlete }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {athlete.tags.map((tag, index) => (
      <span 
        key={index} 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
      >
        {tag}
      </span>
    ))}
    {athlete.streak > 7 && (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        <Flame className="h-3 w-3 mr-1" />
        {athlete.streak} dias
      </span>
    )}
  </div>
);

// Plan Content
const PlanContent = ({ athlete, onSelect }) => {
  const { nutritionPlan } = athlete;

  return (
    <div className="space-y-4">
      {/* Plan Info */}
      <PlanInfo plan={nutritionPlan} />
      
      {/* Progress Summary */}
      <ProgressSummary progress={nutritionPlan.progress} />
      
      {/* Compliance Details */}
      <ComplianceDetails compliance={nutritionPlan.compliance} />
      
      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={onSelect}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Ver Detalhes
        </button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
          Mensagem
        </button>
      </div>
    </div>
  );
};

// Plan Info Component
const PlanInfo = ({ plan }) => {
  const getComplianceColor = (compliance) => {
    if (compliance >= 90) return 'bg-green-100 text-green-800';
    if (compliance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">{plan.name}</p>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          getComplianceColor(plan.compliance.overall)
        }`}>
          {plan.compliance.overall}%
        </span>
      </div>
      
      {/* Macros Grid */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <MacroItem label="Cal" value={plan.calories} />
        <MacroItem label="P" value={`${plan.protein}g`} />
        <MacroItem label="C" value={`${plan.carbs}g`} />
        <MacroItem label="G" value={`${plan.fat}g`} />
      </div>
    </div>
  );
};

// Macro Item
const MacroItem = ({ label, value }) => (
  <div className="text-center">
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

// Progress Summary
const ProgressSummary = ({ progress }) => (
  <div className="grid grid-cols-3 gap-2 text-center">
    <ProgressItem 
      label="Peso" 
      value={progress.weightChange} 
      unit="kg"
      isPositive={progress.weightChange < 0}
    />
    <ProgressItem 
      label="Gordura" 
      value={progress.bodyFatChange} 
      unit="%"
      isPositive={progress.bodyFatChange < 0}
    />
    <ProgressItem 
      label="Músculo" 
      value={progress.muscleMassChange} 
      unit="kg"
      isPositive={progress.muscleMassChange > 0}
    />
  </div>
);

// Progress Item
const ProgressItem = ({ label, value, unit, isPositive }) => {
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const displayValue = `${value > 0 ? '+' : ''}${value}${unit}`;

  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${colorClass}`}>
        {displayValue}
      </p>
    </div>
  );
};

// Compliance Details
const ComplianceDetails = ({ compliance }) => {
  const macros = [
    { name: 'Proteína', value: compliance.protein, color: 'bg-green-500' },
    { name: 'Carboidratos', value: compliance.carbs, color: 'bg-orange-500' },
    { name: 'Gordura', value: compliance.fat, color: 'bg-yellow-500' },
    { name: 'Água', value: compliance.water, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-1">
      {macros.map((macro, index) => (
        <ComplianceBar 
          key={index}
          name={macro.name}
          value={macro.value}
          color={macro.color}
        />
      ))}
    </div>
  );
};

// Compliance Bar
const ComplianceBar = ({ name, value, color }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-gray-600">{name}</span>
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
        <div 
          className={`h-1.5 rounded-full ${color}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
      <span className="font-medium">{value}%</span>
    </div>
  </div>
);

// No Plan Content
const NoPlanContent = ({ onCreatePlan }) => (
  <div className="text-center py-6">
    <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
    <p className="text-sm text-gray-500 mb-3">Sem plano nutricional</p>
    <button
      onClick={onCreatePlan}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
    >
      Criar Plano
    </button>
  </div>
);

// Card Footer
const CardFooter = ({ athlete }) => (
  <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
    <span>Última atividade: {athlete.lastActivity}</span>
    <NotificationIcons notifications={athlete.notifications} />
  </div>
);

// Notification Icons
const NotificationIcons = ({ notifications }) => (
  <div className="flex items-center space-x-2">
    {notifications.app && <Smartphone className="h-3 w-3" />}
    {notifications.email && <Mail className="h-3 w-3" />}
    {notifications.sms && <MessageSquare className="h-3 w-3" />}
  </div>
);

export default AthleteCard;