import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Lock,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  User
} from 'lucide-react';

const AthleteFirstLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [athleteData, setAthleteData] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    // Mock API validation
    try {
      setAthleteData({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1'
      });
    } catch (error) {
      setTokenValid(false);
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect after success
      navigate('/login'); // ou /athlete/dashboard
    } catch (error) {
      setErrors({ general: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="p-6 text-center text-red-500">
        <AlertCircle className="mx-auto mb-2" />
        Invalid or expired token.
      </div>
    );
  }

  if (!athleteData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <img src={athleteData.avatar} alt="avatar" className="w-14 h-14 rounded-full" />
        <div>
          <h2 className="text-xl font-semibold">{athleteData.name}</h2>
          <p className="text-gray-500 text-sm">{athleteData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border p-2 rounded"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="button" className="absolute top-2 right-2" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full border p-2 rounded"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <button type="button" className="absolute top-2 right-2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {errors.general && <p className="text-red-500">{errors.general}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Setting Password...' : 'Set Password and Continue'}
        </button>
      </form>
    </div>
  );
};

export default AthleteFirstLogin;
