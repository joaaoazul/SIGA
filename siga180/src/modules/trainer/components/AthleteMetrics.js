import React, { useState } from 'react';
import { 
  Ruler, 
  Weight, 
  Camera, 
  Calendar,
  TrendingDown,
  TrendingUp,
  Save,
  Plus,
  X
} from 'lucide-react';

const AthleteMetrics = ({ athleteId, measurements = [], onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    neck: '',
    shoulders: '',
    chest: '',
    leftArm: '',
    rightArm: '',
    waist: '',
    hips: '',
    leftThigh: '',
    rightThigh: '',
    leftCalf: '',
    rightCalf: '',
    notes: '',
    photos: {
      front: null,
      side: null,
      back: null
    }
  });

  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({
    front: null,
    side: null,
    back: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (position, file) => {
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [position]: url
      }));

      // Store file in formData
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [position]: file
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd upload photos to a server here
      await onSubmit({
        ...formData,
        athleteId,
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        muscleMass: '',
        neck: '',
        shoulders: '',
        chest: '',
        leftArm: '',
        rightArm: '',
        waist: '',
        hips: '',
        leftThigh: '',
        rightThigh: '',
        leftCalf: '',
        rightCalf: '',
        notes: '',
        photos: { front: null, side: null, back: null }
      });
      setPreviewUrls({ front: null, side: null, back: null });
    } catch (error) {
      console.error('Error submitting measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChange = (current, previous, metric) => {
    if (!previous || !previous[metric]) return null;
    const diff = parseFloat(current) - parseFloat(previous[metric]);
    if (diff === 0) return null;
    
    return (
      <span className={`text-xs ${diff < 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {diff < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {Math.abs(diff).toFixed(1)}
      </span>
    );
  };

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Measurements & Progress</h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Measurement
            </button>
          )}
        </div>

        {/* Latest Measurements Summary */}
        {latestMeasurement && !showForm && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-2xl font-bold">{latestMeasurement.weight} kg</p>
                </div>
                {previousMeasurement && getChange(latestMeasurement.weight, previousMeasurement, 'weight')}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Body Fat</p>
                  <p className="text-2xl font-bold">{latestMeasurement.bodyFat}%</p>
                </div>
                {previousMeasurement && getChange(latestMeasurement.bodyFat, previousMeasurement, 'bodyFat')}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Muscle Mass</p>
                  <p className="text-2xl font-bold">{latestMeasurement.muscleMass} kg</p>
                </div>
                {previousMeasurement && getChange(latestMeasurement.muscleMass, previousMeasurement, 'muscleMass')}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Last Measurement</p>
              <p className="text-lg font-semibold">
                {new Date(latestMeasurement.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Measurement Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Measurement Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Body Composition */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Body Composition</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="bodyFat"
                    value={formData.bodyFat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Muscle Mass (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="muscleMass"
                    value={formData.muscleMass}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="55.0"
                  />
                </div>
              </div>
            </div>

            {/* Body Measurements */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Body Measurements (cm)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Neck</label>
                  <input
                    type="number"
                    step="0.1"
                    name="neck"
                    value={formData.neck}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Shoulders</label>
                  <input
                    type="number"
                    step="0.1"
                    name="shoulders"
                    value={formData.shoulders}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Chest</label>
                  <input
                    type="number"
                    step="0.1"
                    name="chest"
                    value={formData.chest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Waist</label>
                  <input
                    type="number"
                    step="0.1"
                    name="waist"
                    value={formData.waist}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hips</label>
                  <input
                    type="number"
                    step="0.1"
                    name="hips"
                    value={formData.hips}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Left Arm</label>
                  <input
                    type="number"
                    step="0.1"
                    name="leftArm"
                    value={formData.leftArm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Right Arm</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rightArm"
                    value={formData.rightArm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Left Thigh</label>
                  <input
                    type="number"
                    step="0.1"
                    name="leftThigh"
                    value={formData.leftThigh}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Right Thigh</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rightThigh"
                    value={formData.rightThigh}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Left Calf</label>
                  <input
                    type="number"
                    step="0.1"
                    name="leftCalf"
                    value={formData.leftCalf}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Right Calf</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rightCalf"
                    value={formData.rightCalf}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Progress Photos */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Progress Photos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['front', 'side', 'back'].map((position) => (
                  <div key={position}>
                    <label className="block text-sm text-gray-600 mb-2 capitalize">{position} View</label>
                    <div className="relative">
                      {previewUrls[position] ? (
                        <div className="relative">
                          <img
                            src={previewUrls[position]}
                            alt={`${position} view`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrls(prev => ({ ...prev, [position]: null }));
                              setFormData(prev => ({
                                ...prev,
                                photos: { ...prev.photos, [position]: null }
                              }));
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                          <Camera className="h-8 w-8 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(position, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any observations or notes about this measurement..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-5 w-5 inline mr-2" />
                    Save Measurement
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Measurement History */}
      {!showForm && measurements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Measurement History</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Body Fat</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Muscle Mass</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Waist</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {measurements.map((measurement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">
                      {new Date(measurement.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">{measurement.weight} kg</td>
                    <td className="px-4 py-2 text-sm">{measurement.bodyFat}%</td>
                    <td className="px-4 py-2 text-sm">{measurement.muscleMass} kg</td>
                    <td className="px-4 py-2 text-sm">{measurement.waist} cm</td>
                    <td className="px-4 py-2 text-sm">
                      {measurement.photos && Object.values(measurement.photos).some(p => p) ? (
                        <Camera className="h-4 w-4 text-blue-600" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteMetrics;