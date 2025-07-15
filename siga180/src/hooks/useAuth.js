import { useState, useEffect, useContext, createContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, [token]);

  const checkAuth = async () => {
    try {
      if (token) {
        // Verify token validity with API
        // For now, just check if token exists
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // API call simulation - replace with actual API
      const response = await mockLogin(email, password);
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // API call simulation - replace with actual API
      const response = await mockRegister(userData);
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    // Clear any other stored data
    localStorage.removeItem('athletes');
    localStorage.removeItem('workouts');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock functions - replace with actual API calls
const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@example.com' && password === 'password123') {
    return {
      success: true,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'demo@example.com',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'trainer',
        subscription: 'pro'
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
  };
};

const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (userData.email && userData.password && userData.name) {
    return {
      success: true,
      user: {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
        role: 'trainer',
        subscription: 'free'
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  }
  
  return {
    success: false,
    error: 'Please fill all required fields'
  };
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};