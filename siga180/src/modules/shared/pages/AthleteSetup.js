import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Heart,
  Target,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera
} from 'lucide-react';

const AthleteSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    avatar: null,
    
    // Physical Info
    height: '',
    weight: '',
    activityLevel: '',
    
    // Goals & Preferences
    goals: [],
    preferredTrainingDays: [],
    preferredTrainingTime: '',
    
    // Medical Info
    medicalConditions: '',
    injuries: '',
    medications: '',
    allergies: '',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Account
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Validate token
    if (!token) {
      setTokenValid(false);
      return;
    }
    
    // In production, validate token with backend
    // For now, decode basic info from token
    try {
      const decoded = atob(token);
      const [email] = decoded.split('-');
      setProfileData(prev => ({ ...prev, email }));
    } catch (error) {
      setTokenValid(false);
    }
  }, [token]);

  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Physical Details', icon: Heart },
    { number: 3, title: 'Goals & Preferences', icon: Target },
    { number: 4, title: 'Medical Information', icon: AlertCircle },
    { number: 5, title: 'Create Account', icon: Check }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!profileData.name) newErrors.name = 'Name is required';
        if (!profileData.phone) newErrors.phone = 'Phone is required';
        if (!profileData.birthDate) newErrors.birthDate = 'Birth date is required';
        if (!profileData.gender) newErrors.gender = 'Gender is required';
        break;
      
      case 2:
        if (!profileData.height) newErrors.height = 'Height is required';
        if (!profileData.weight) newErrors.weight = 'Weight is required';
        if (!profileData.activityLevel) newErrors.activityLevel = 'Activity level is required';
        break;
      
      case 3:
        if (profileData.goals.length === 0) newErrors.goals = 'Please select at least one goal';
        if (profileData.preferredTrainingDays.length === 0) newErrors.preferredTrainingDays = 'Please select at least one training day';
        break;
      
      case 5:
        if (!profileData.password) newErrors.password = 'Password is required';
        if (profileData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (profileData.password !== profileData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!profileData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      // Submit profile data
      console.log('Submitting profile:', profileData);
      
      // In production, this would:
      // 1. Create user account
      // 2. Save profile data
      // 3. Mark invite as used
      // 4. Auto-login user
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to athlete dashboard
      navigate('/athlete-dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      setErrors({ submit: 'Failed to create profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-600 mb-6">
            This setup link is invalid or has expired. Please contact your trainer for a new invitation.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-1">Welcome! Let's set up your fitness profile.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep > step.number 
                  ? 'bg-green-600 text-white' 
                  : currentStep === step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {steps[currentStep - 1].title}
          </h2>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Date *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={profileData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.birthDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.gender ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.height ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={profileData.weight}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.weight ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'activityLevel', value: level }})}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        profileData.activityLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {errors.activityLevel && <p className="mt-1 text-sm text-red-600">{errors.activityLevel}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Goals & Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fitness Goals * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Weight Loss', 'Muscle Gain', 'Improve Endurance',
                    'Increase Strength', 'Better Health', 'Athletic Performance',
                    'Flexibility', 'Stress Relief', 'Body Recomposition'
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleArrayToggle('goals', goal)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        profileData.goals.includes(goal)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
                {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Training Days * (Select all that apply)
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleArrayToggle('preferredTrainingDays', day)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        profileData.preferredTrainingDays.includes(day)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.preferredTrainingDays && <p className="mt-1 text-sm text-red-600">{errors.preferredTrainingDays}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Training Time
                </label>
                <select
                  name="preferredTrainingTime"
                  value={profileData.preferredTrainingTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="early-morning">Early Morning (5-7 AM)</option>
                  <option value="morning">Morning (7-10 AM)</option>
                  <option value="midday">Midday (10 AM-2 PM)</option>
                  <option value="afternoon">Afternoon (2-5 PM)</option>
                  <option value="evening">Evening (5-8 PM)</option>
                  <option value="night">Night (8-10 PM)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Medical Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      This information helps ensure your safety during training. All medical information is kept strictly confidential.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  name="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., diabetes, hypertension, asthma..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Injuries
                </label>
                <textarea
                  name="injuries"
                  value={profileData.injuries}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., knee surgery, back pain..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    name="medications"
                    value={profileData.medications}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any medications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Food, environmental, etc."
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Relationship</label>
                    <input
                      type="text"
                      name="emergencyRelation"
                      value={profileData.emergencyRelation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E.g., Spouse, Parent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Create Account */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={profileData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">Terms and Conditions</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-sm text-red-600 ml-6">{errors.terms}</p>}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Profile Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Name:</dt>
                    <dd className="font-medium">{profileData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Email:</dt>
                    <dd className="font-medium">{profileData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Goals:</dt>
                    <dd className="font-medium">{profileData.goals.length} selected</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Training Days:</dt>
                    <dd className="font-medium">{profileData.preferredTrainingDays.length} days/week</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteSetup;