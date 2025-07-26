import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Weight,
  Percent,
  Activity,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AthleteProgress = ({ athleteId, measurements = [], checkIns = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [timeRange, setTimeRange] = useState('3months');

  // Calculate progress data
  const getProgressData = () => {
    // In a real app, this would filter based on timeRange
    return measurements.slice(0, 10).reverse();
  };

  const progressData = getProgressData();

  // Calculate statistics
  const calculateStats = () => {
    if (measurements.length < 2) return null;

    const latest = measurements[0];
    const previous = measurements[measurements.length - 1];
    
    return {
      weight: {
        current: latest.weight,
        change: latest.weight - previous.weight,
        percentage: ((latest.weight - previous.weight) / previous.weight * 100).toFixed(1)
      },
      bodyFat: {
        current: latest.bodyFat,
        change: latest.bodyFat - previous.bodyFat,
        percentage: ((latest.bodyFat - previous.bodyFat) / previous.bodyFat * 100).toFixed(1)
      },
      muscleMass: {
        current: latest.muscleMass,
        change: latest.muscleMass - previous.muscleMass,
        percentage: ((latest.muscleMass - previous.muscleMass) / previous.muscleMass * 100).toFixed(1)
      }
    };
  };

  const stats = calculateStats();

  const metrics = [
    { id: 'weight', label: 'Weight', unit: 'kg', icon: Weight },
    { id: 'bodyFat', label: 'Body Fat', unit: '%', icon: Percent },
    { id: 'muscleMass', label: 'Muscle Mass', unit: 'kg', icon: Activity },
    { id: 'waist', label: 'Waist', unit: 'cm', icon: Target }
  ];

  const getMaxValue = (data, metric) => {
    return Math.max(...data.map(d => d[metric] || 0));
  };

  const getMinValue = (data, metric) => {
    return Math.min(...data.map(d => d[metric] || 0));
  };

  // Progress photos comparison
  const getProgressPhotos = () => {
    const photosData = measurements.filter(m => m.photos && Object.values(m.photos).some(p => p));
    if (photosData.length >= 2) {
      return {
        before: photosData[photosData.length - 1],
        after: photosData[0]
      };
    }
    return null;
  };

  const progressPhotos = getProgressPhotos();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Weight Progress</h4>
              <Weight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{stats.weight.current} kg</p>
            <div className="flex items-center mt-2">
              {stats.weight.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stats.weight.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.abs(stats.weight.change).toFixed(1)} kg ({stats.weight.percentage}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Body Fat Progress</h4>
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{stats.bodyFat.current}%</p>
            <div className="flex items-center mt-2">
              {stats.bodyFat.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stats.bodyFat.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.abs(stats.bodyFat.change).toFixed(1)}% ({stats.bodyFat.percentage}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Muscle Mass Progress</h4>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{stats.muscleMass.current} kg</p>
            <div className="flex items-center mt-2">
              {stats.muscleMass.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stats.muscleMass.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(stats.muscleMass.change).toFixed(1)} kg ({stats.muscleMass.percentage}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Progress Chart</h3>
          <div className="flex items-center space-x-4">
            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">1 Month</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {progressData.length > 0 ? (
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 60, 120, 180, 240].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Data line */}
              <path
                d={`M ${progressData.map((data, index) => {
                  const x = (index / (progressData.length - 1)) * 600;
                  const maxVal = getMaxValue(progressData, selectedMetric);
                  const minVal = getMinValue(progressData, selectedMetric);
                  const range = maxVal - minVal || 1;
                  const y = 240 - ((data[selectedMetric] - minVal) / range) * 240;
                  return `${x},${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {progressData.map((data, index) => {
                const x = (index / (progressData.length - 1)) * 600;
                const maxVal = getMaxValue(progressData, selectedMetric);
                const minVal = getMinValue(progressData, selectedMetric);
                const range = maxVal - minVal || 1;
                const y = 240 - ((data[selectedMetric] - minVal) / range) * 240;
                
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                    {/* Tooltip on hover */}
                    <title>
                      {new Date(data.date).toLocaleDateString()}: {data[selectedMetric]} {metrics.find(m => m.id === selectedMetric)?.unit}
                    </title>
                  </g>
                );
              })}
            </svg>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
              <span>{getMaxValue(progressData, selectedMetric)}</span>
              <span>{((getMaxValue(progressData, selectedMetric) + getMinValue(progressData, selectedMetric)) / 2).toFixed(1)}</span>
              <span>{getMinValue(progressData, selectedMetric)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No progress data available
          </div>
        )}

        {/* X-axis dates */}
        {progressData.length > 0 && (
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {progressData.map((data, index) => {
              if (index === 0 || index === progressData.length - 1 || index === Math.floor(progressData.length / 2)) {
                return (
                  <span key={index}>
                    {new Date(data.date).toLocaleDateString()}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* Progress Photos */}
      {progressPhotos && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Before - {new Date(progressPhotos.before.date).toLocaleDateString()}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {['front', 'side', 'back'].map(view => (
                  <div key={view} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {progressPhotos.before.photos?.[view] ? (
                      <img 
                        src={progressPhotos.before.photos[view]} 
                        alt={`Before ${view}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                After - {new Date(progressPhotos.after.date).toLocaleDateString()}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {['front', 'side', 'back'].map(view => (
                  <div key={view} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {progressPhotos.after.photos?.[view] ? (
                      <img 
                        src={progressPhotos.after.photos[view]} 
                        alt={`After ${view}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body Measurements Comparison */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Body Measurements Comparison</h3>
        {measurements.length >= 2 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Measurement</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">
                    {new Date(measurements[measurements.length - 1].date).toLocaleDateString()}
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">
                    {new Date(measurements[0].date).toLocaleDateString()}
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">Change</th>
                </tr>
              </thead>
              <tbody>
                {['neck', 'shoulders', 'chest', 'waist', 'hips', 'leftArm', 'rightArm', 'leftThigh', 'rightThigh'].map(measurement => {
                  const before = measurements[measurements.length - 1][measurement];
                  const after = measurements[0][measurement];
                  const change = after && before ? after - before : 0;
                  
                  return (
                    <tr key={measurement} className="border-b">
                      <td className="py-2 text-sm capitalize">{measurement.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="text-right py-2 text-sm">{before || '-'} cm</td>
                      <td className="text-right py-2 text-sm">{after || '-'} cm</td>
                      <td className="text-right py-2 text-sm">
                        {change !== 0 && (
                          <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)} cm
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Need at least 2 measurements to show comparison
          </p>
        )}
      </div>
    </div>
  );
};

export default AthleteProgress;