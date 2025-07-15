import React from 'react';
import { ChevronRight, TrendingUp, Users, Activity } from 'lucide-react';

const OverviewCard = ({ stats, onViewMore }) => {
  const defaultStats = {
    totalClients: 20,
    activePlans: 12,
    monthlyGrowth: 15,
    completionRate: 92,
    avgSessionTime: 55,
    weeklyRevenue: 3250
  };
  
  const data = { ...defaultStats, ...stats };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <button
          onClick={onViewMore}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-gray-900">{data.totalClients}</div>
            <div className="text-sm text-gray-600">Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{data.activePlans}</div>
            <div className="text-sm text-gray-600">Active Plans</div>
          </div>
        </div>
        
        {/* Growth Indicator */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Monthly Growth</span>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">+{data.monthlyGrowth}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.monthlyGrowth * 4, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="text-sm font-semibold">{data.completionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg. Session Time</span>
            <span className="text-sm font-semibold">{data.avgSessionTime} min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Weekly Revenue</span>
            <span className="text-sm font-semibold">€{data.weeklyRevenue}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
            <Users className="h-4 w-4" />
            <span>View Clients</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
            <Activity className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;