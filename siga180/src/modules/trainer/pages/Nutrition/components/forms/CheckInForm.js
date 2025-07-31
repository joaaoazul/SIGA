import React, { useState } from 'react';
import { 
  X, 
  Camera,
  Weight,
  Ruler,
  Activity,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Upload
} from 'lucide-react';

const CheckInForm = ({ 
  onSubmit, 
  onCancel, 
  clientData,
  lastCheckIn = null,
  planTargets = null 
}) => {
  // Form state
  const [checkInData, setCheckInData] = useState({
    clientId: clientData?.id || '',
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arm: '',
      thigh: ''
    },
    photos: {
      front: null,
      side: null,
      back: null
    },
    compliance: {
      meals: 90,
      training: 85,
      hydration: 95,
      sleep: 80
    },
    energy: 4,
    hunger: 3,
    notes: '',
    nextCheckInDate: ''
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('metrics');
  const [showComparison, setShowComparison] = useState(true);

  // Energy and hunger scales
  const energyLevels = [
    { value: 1, label: 'Very Low', emoji: '😴' },
    { value: 2, label: 'Low', emoji: '😔' },
    { value: 3, label: 'Moderate', emoji: '😐' },
    { value: 4, label: 'Good', emoji: '😊' },
    { value: 5, label: 'Excellent', emoji: '🚀' }
  ];

  const hungerLevels = [
    { value: 1, label: 'None', emoji: '😌' },
    { value: 2, label: 'Mild', emoji: '🙂' },
    { value: 3, label: 'Moderate', emoji: '😐' },
    { value: 4, label: 'Strong', emoji: '😣' },
    { value: 5, label: 'Extreme', emoji: '🤤' }
  ];

  // Calculate changes from last check-in
  const calculateChange = (current, previous) => {
    if (!previous || !current) return null;
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { value: change, percentage };
  };

  // Handle photo upload
  const handlePhotoUpload = (position, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCheckInData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [position]: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!checkInData.weight) newErrors.weight = 'Weight is required';
    if (checkInData.weight && (checkInData.weight < 30 || checkInData.weight > 300)) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(checkInData);
    }
  };

  // Metric input component
  const MetricInput = ({ label, value, onChange, unit, icon: Icon, lastValue, required }) => {
    const change = lastValue ? calculateChange(parseFloat(value), lastValue) : null;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors[label.toLowerCase()] ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {unit}
          </span>
        </div>
        
        {/* Comparison with last check-in */}
        {showComparison && lastValue && value && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-gray-500">Last: {lastValue} {unit}</span>
            {change && (
              <span className={`flex items-center gap-0.5 font-medium ${
                change.value < 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change.value < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {change.value > 0 ? '+' : ''}{change.value.toFixed(1)} ({change.percentage}%)
              </span>
            )}
          </div>
        )}
        
        {errors[label.toLowerCase()] && (
          <p className="text-xs text-red-600 mt-1">{errors[label.toLowerCase()]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            New Check-in for {clientData?.name}
          </h3>
          <p className="text-sm text-gray-500">
            Track progress and update measurements
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Check-in Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={checkInData.date}
            onChange={(e) => setCheckInData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          {[
            { id: 'metrics', label: 'Body Metrics' },
            { id: 'measurements', label: 'Measurements' },
            { id: 'photos', label: 'Progress Photos' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'feedback', label: 'Feedback' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Body Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricInput
              label="Weight"
              value={checkInData.weight}
              onChange={(value) => setCheckInData(prev => ({ ...prev, weight: value }))}
              unit="kg"
              icon={Weight}
              lastValue={lastCheckIn?.weight}
              required
            />
            <MetricInput
              label="Body Fat"
              value={checkInData.bodyFat}
              onChange={(value) => setCheckInData(prev => ({ ...prev, bodyFat: value }))}
              unit="%"
              icon={Activity}
              lastValue={lastCheckIn?.bodyFat}
            />
            <MetricInput
              label="Muscle Mass"
              value={checkInData.muscleMass}
              onChange={(value) => setCheckInData(prev => ({ ...prev, muscleMass: value }))}
              unit="kg"
              icon={Activity}
              lastValue={lastCheckIn?.muscleMass}
            />
            
            {/* Quick Stats */}
            {lastCheckIn && checkInData.weight && (
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Progress Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Weight Change</p>
                    <p className={`text-lg font-bold ${
                      parseFloat(checkInData.weight) < lastCheckIn.weight 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {calculateChange(parseFloat(checkInData.weight), lastCheckIn.weight)?.value.toFixed(1) || '0'} kg
                    </p>
                  </div>
                  {checkInData.bodyFat && lastCheckIn.bodyFat && (
                    <div>
                      <p className="text-xs text-gray-500">Body Fat Change</p>
                      <p className={`text-lg font-bold ${
                        parseFloat(checkInData.bodyFat) < lastCheckIn.bodyFat 
                          ? 'text-emerald-600' 
                          : 'text-red-600'
                      }`}>
                        {calculateChange(parseFloat(checkInData.bodyFat), lastCheckIn.bodyFat)?.value.toFixed(1) || '0'}%
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Days Since Last</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.floor((new Date(checkInData.date) - new Date(lastCheckIn.date)) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Measurements Tab */}
        {activeTab === 'measurements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricInput
                label="Chest"
                value={checkInData.measurements.chest}
                onChange={(value) => setCheckInData(prev => ({
                  ...prev,
                  measurements: { ...prev.measurements, chest: value }
                }))}
                unit="cm"
                icon={Ruler}
                lastValue={lastCheckIn?.measurements?.chest}
              />
              <MetricInput
                label="Waist"
                value={checkInData.measurements.waist}
                onChange={(value) => setCheckInData(prev => ({
                  ...prev,
                  measurements: { ...prev.measurements, waist: value }
                }))}
                unit="cm"
                icon={Ruler}
                lastValue={lastCheckIn?.measurements?.waist}
              />
              <MetricInput
                label="Hips"
                value={checkInData.measurements.hips}
                onChange={(value) => setCheckInData(prev => ({
                  ...prev,
                  measurements: { ...prev.measurements, hips: value }
                }))}
                unit="cm"
                icon={Ruler}
                lastValue={lastCheckIn?.measurements?.hips}
              />
              <MetricInput
                label="Arm"
                value={checkInData.measurements.arm}
                onChange={(value) => setCheckInData(prev => ({
                  ...prev,
                  measurements: { ...prev.measurements, arm: value }
                }))}
                unit="cm"
                icon={Ruler}
                lastValue={lastCheckIn?.measurements?.arm}
              />
              <MetricInput
                label="Thigh"
                value={checkInData.measurements.thigh}
                onChange={(value) => setCheckInData(prev => ({
                  ...prev,
                  measurements: { ...prev.measurements, thigh: value }
                }))}
                unit="cm"
                icon={Ruler}
                lastValue={lastCheckIn?.measurements?.thigh}
              />
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                Tip: Take measurements at the same time of day and in the same conditions for consistency.
              </p>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['front', 'side', 'back'].map(position => (
                <div key={position}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {position} View
                  </label>
                  <div className="relative">
                    {checkInData.photos[position] ? (
                      <div className="relative">
                        <img
                          src={checkInData.photos[position]}
                          alt={`${position} view`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setCheckInData(prev => ({
                            ...prev,
                            photos: { ...prev.photos, [position]: null }
                          }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(position, e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Photo Guidelines:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Same lighting and location each time</li>
                <li>• Minimal clothing for accurate comparison</li>
                <li>• Same time of day (preferably morning)</li>
                <li>• Relaxed pose, arms at sides</li>
              </ul>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            {Object.entries(checkInData.compliance).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key} Compliance
                  </label>
                  <span className="text-sm font-semibold text-gray-900">{value}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckInData(prev => ({
                      ...prev,
                      compliance: {
                        ...prev.compliance,
                        [key]: Math.max(0, value - 5)
                      }
                    }))}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        value >= 90 ? 'bg-emerald-500' :
                        value >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckInData(prev => ({
                      ...prev,
                      compliance: {
                        ...prev.compliance,
                        [key]: Math.min(100, value + 5)
                      }
                    }))}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Overall Compliance</p>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">
                  {Math.round(
                    Object.values(checkInData.compliance).reduce((a, b) => a + b, 0) / 
                    Object.keys(checkInData.compliance).length
                  )}%
                </p>
                <p className="text-sm text-gray-500">Average across all areas</p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level
              </label>
              <div className="flex gap-2">
                {energyLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setCheckInData(prev => ({ ...prev, energy: level.value }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      checkInData.energy === level.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{level.emoji}</span>
                    <p className="text-xs">{level.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hunger Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hunger Level
              </label>
              <div className="flex gap-2">
                {hungerLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setCheckInData(prev => ({ ...prev, hunger: level.value }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      checkInData.hunger === level.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{level.emoji}</span>
                    <p className="text-xs">{level.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={checkInData.notes}
                onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="How are you feeling? Any challenges? Victories to celebrate?"
              />
            </div>

            {/* Next Check-in */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Next Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={checkInData.nextCheckInDate}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, nextCheckInDate: e.target.value }))}
                  min={checkInData.date}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showComparison}
            onChange={(e) => setShowComparison(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          Show comparisons with last check-in
        </label>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Check-in
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckInForm;