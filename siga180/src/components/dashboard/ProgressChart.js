import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ProgressChart = ({ data = [], title = "Progress", metric = "Weekly Stats" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { day: 'S', value: 8 },
    { day: 'M', value: 15 },
    { day: 'T', value: 12 },
    { day: 'W', value: 25 },
    { day: 'T', value: 38 },
    { day: 'F', value: 22 },
    { day: 'S', value: 30 }
  ];
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  
  // Calculate trend
  const firstValue = chartData[0].value;
  const lastValue = chartData[chartData.length - 1].value;
  const trend = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{metric}</span>
          {trend > 0 ? (
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{trend}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">{trend}%</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative">
        <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>
        
        <div className="ml-8">
          <svg 
            className="w-full h-40" 
            viewBox="0 0 300 160" 
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Grid lines */}
            {[0, 40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="300"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}
            
            {/* Area under the line */}
            <path
              d={`
                M ${chartData.map((item, index) => {
                  const x = (index / (chartData.length - 1)) * 300;
                  const y = 160 - ((item.value - minValue) / (maxValue - minValue)) * 160;
                  return `${x},${y}`;
                }).join(' L ')}
                L 300,160 L 0,160 Z
              `}
              fill="url(#gradient)"
              opacity="0.1"
            />
            
            {/* Progress line */}
            <path
              d={`M ${chartData.map((item, index) => {
                const x = (index / (chartData.length - 1)) * 300;
                const y = 160 - ((item.value - minValue) / (maxValue - minValue)) * 160;
                return `${x},${y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Progress dots and hover areas */}
            {chartData.map((item, index) => {
              const x = (index / (chartData.length - 1)) * 300;
              const y = 160 - ((item.value - minValue) / (maxValue - minValue)) * 160;
              
              return (
                <g key={index}>
                  {/* Invisible hover area */}
                  <rect
                    x={x - 20}
                    y={0}
                    width={40}
                    height={160}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(index)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredIndex === index ? 6 : 4}
                    fill="#10b981"
                    className="transition-all duration-200"
                  />
                  
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <g>
                      <rect
                        x={x - 20}
                        y={y - 35}
                        width={40}
                        height={25}
                        rx={4}
                        fill="#1f2937"
                      />
                      <text
                        x={x}
                        y={y - 18}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="600"
                      >
                        {item.value}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Week days */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {chartData.map((item, i) => (
              <span 
                key={i} 
                className={`w-8 text-center ${hoveredIndex === i ? 'font-semibold text-gray-700' : ''}`}
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;