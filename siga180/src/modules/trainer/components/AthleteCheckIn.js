import React, { useState } from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  Battery, 
  Moon, 
  Heart,
  Brain,
  Activity,
  MessageSquare,
  Save
} from 'lucide-react';

const AthleteCheckIn = ({ athleteId, onSubmit, isTrainer = false, checkInData = null }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: checkInData?.mood || 3,
    energy: checkInData?.energy || 3,
    sleep: checkInData?.sleep || 3,
    stress: checkInData?.stress || 3,
    soreness: checkInData?.soreness || 3,
    motivation: checkInData?.motivation || 3,
    sleepHours: checkInData?.sleepHours || '',
    weight: checkInData?.weight || '',
    notes: checkInData?.notes || '',
    ...checkInData
  });

  const [loading, setLoading] = useState(false);

  const getMoodIcon = (value) => {
    if (value <= 2) return <Frown className="h-6 w-6" />;
    if (value === 3) return <Meh className="h-6 w-6" />;
    return <Smile className="h-6 w-6" />;
  };

  const getColorClass = (value) => {
    if (value <= 2) return 'text-red-500';
    if (value === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        athleteId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isTrainer && checkInData) {
    // Read-only view for trainers
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Daily Check-in</h3>
          <span className="text-sm text-gray-500">
            {new Date(checkInData.date).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics Display */}
          {[
            { name: 'Mood', value: checkInData.mood, icon: getMoodIcon(checkInData.mood) },
            { name: 'Energy', value: checkInData.energy, icon: <Battery className="h-6 w-6" /> },
            { name: 'Sleep Quality', value: checkInData.sleep, icon: <Moon className="h-6 w-6" /> },
            { name: 'Stress Level', value: checkInData.stress, icon: <Brain className="h-6 w-6" /> },
            { name: 'Soreness', value: checkInData.soreness, icon: <Activity className="h-6 w-6" /> },
            { name: 'Motivation', value: checkInData.motivation, icon: <Heart className="h-6 w-6" /> },
          ].map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={getColorClass(metric.value)}>{metric.icon}</div>
                <span className="font-medium">{metric.name}</span>
              </div>
              <span className="text-lg font-bold">{metric.value}/5</span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Sleep Hours</p>
            <p className="text-lg font-semibold">{checkInData.sleepHours || 'N/A'} hours</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-lg font-semibold">{checkInData.weight || 'N/A'} kg</p>
          </div>
        </div>

        {checkInData.notes && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{checkInData.notes}</p>
          </div>
        )}
      </div>
    );
  }

  // Editable form for athletes
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Daily Check-in</h3>

      <div className="space-y-6">
        {/* Mood */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className={getColorClass(formData.mood)}>{getMoodIcon(formData.mood)}</span>
              <span className="ml-2">How's your mood today?</span>
            </label>
            <span className="text-sm font-bold">{formData.mood}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.mood}
            onChange={(e) => handleSliderChange('mood', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Battery className={`h-5 w-5 mr-2 ${getColorClass(formData.energy)}`} />
              Energy Level
            </label>
            <span className="text-sm font-bold">{formData.energy}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.energy}
            onChange={(e) => handleSliderChange('energy', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sleep Quality */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Moon className={`h-5 w-5 mr-2 ${getColorClass(formData.sleep)}`} />
              Sleep Quality
            </label>
            <span className="text-sm font-bold">{formData.sleep}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.sleep}
            onChange={(e) => handleSliderChange('sleep', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Stress Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Brain className={`h-5 w-5 mr-2 ${getColorClass(5 - formData.stress + 1)}`} />
              Stress Level
            </label>
            <span className="text-sm font-bold">{formData.stress}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.stress}
            onChange={(e) => handleSliderChange('stress', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Muscle Soreness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Activity className={`h-5 w-5 mr-2 ${getColorClass(5 - formData.soreness + 1)}`} />
              Muscle Soreness
            </label>
            <span className="text-sm font-bold">{formData.soreness}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.soreness}
            onChange={(e) => handleSliderChange('soreness', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>None</span>
            <span>Very Sore</span>
          </div>
        </div>

        {/* Motivation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Heart className={`h-5 w-5 mr-2 ${getColorClass(formData.motivation)}`} />
              Motivation
            </label>
            <span className="text-sm font-bold">{formData.motivation}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.motivation}
            onChange={(e) => handleSliderChange('motivation', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.sleepHours}
              onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="7.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="70.5"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How are you feeling? Any concerns or achievements to share?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Saving...
            </span>
          ) : (
            <>
              <Save className="h-5 w-5 inline mr-2" />
              Submit Check-in
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AthleteCheckIn;