import React from 'react';

const StatsCard = ({ icon: Icon, value, label, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      {trend && (
        <div className="mt-2 text-xs text-green-600 font-medium">
          {trend > 0 ? '+' : ''}{trend}% from last week
        </div>
      )}
    </div>
  );
};

export default StatsCard;