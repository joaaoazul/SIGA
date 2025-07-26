export const ProgressBar = ({ label, current, total, unit, showPercentage = true }) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {current}/{total} {unit}
          {showPercentage && ` (${Math.round(percentage)}%)`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;