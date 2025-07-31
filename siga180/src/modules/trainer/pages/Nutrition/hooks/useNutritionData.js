import { useState, useEffect, useCallback } from 'react';

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const useNutritionData = (clientId = null) => {
  // State management
  const [data, setData] = useState({
    clients: [],
    plans: [],
    meals: [],
    checkIns: [],
    foods: [],
    reports: []
  });
  
  const [loading, setLoading] = useState({
    clients: false,
    plans: false,
    meals: false,
    checkIns: false,
    foods: false,
    reports: false
  });
  
  const [error, setError] = useState(null);
  
  // Statistics
  const [stats, setStats] = useState({
    totalClients: 0,
    activePlans: 0,
    avgCompliance: 0,
    monthlyGrowth: 0,
    weeklyCheckIns: 0,
    totalFoods: 0
  });

  // Fetch clients
  const fetchClients = useCallback(async () => {
    setLoading(prev => ({ ...prev, clients: true }));
    try {
      await delay(500); // Simulate API call
      
      // Mock data
      const clients = [
        {
          id: 1,
          name: 'João Azul',
          email: 'joao@example.com',
          phone: '+351 912 345 678',
          age: 22,
          goal: 'Muscle Gain',
          activePlan: true,
          compliance: 92,
          lastCheckIn: '2025-01-25',
          joinedDate: '2024-07-16'
        },
        {
          id: 2,
          name: 'Maria Silva',
          email: 'maria@example.com',
          phone: '+351 923 456 789',
          age: 28,
          goal: 'Fat Loss',
          activePlan: true,
          compliance: 88,
          lastCheckIn: '2025-01-24',
          joinedDate: '2024-09-10'
        },
        {
          id: 3,
          name: 'Pedro Santos',
          email: 'pedro@example.com',
          phone: '+351 934 567 890',
          age: 35,
          goal: 'Maintenance',
          activePlan: true,
          compliance: 95,
          lastCheckIn: '2025-01-26',
          joinedDate: '2024-06-01'
        }
      ];
      
      setData(prev => ({ ...prev, clients }));
      updateStats(clients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, clients: false }));
    }
  }, []);

  // Fetch nutrition plans
  const fetchPlans = useCallback(async (clientIdFilter = null) => {
    setLoading(prev => ({ ...prev, plans: true }));
    try {
      await delay(300);
      
      let plans = [
        {
          id: 1,
          clientId: 1,
          clientName: 'João Azul',
          name: 'Muscle Building Plan',
          type: 'bulking',
          calories: 2800,
          protein: 180,
          carbs: 350,
          fat: 90,
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          status: 'active',
          compliance: 92
        },
        {
          id: 2,
          clientId: 2,
          clientName: 'Maria Silva',
          name: 'Fat Loss Program',
          type: 'cutting',
          calories: 1600,
          protein: 120,
          carbs: 150,
          fat: 60,
          startDate: '2025-01-15',
          endDate: '2025-04-15',
          status: 'active',
          compliance: 88
        },
        {
          id: 3,
          clientId: 3,
          clientName: 'Pedro Santos',
          name: 'Maintenance Plan',
          type: 'maintenance',
          calories: 2200,
          protein: 140,
          carbs: 250,
          fat: 75,
          startDate: '2024-12-01',
          endDate: '2025-02-28',
          status: 'active',
          compliance: 95
        }
      ];
      
      if (clientIdFilter) {
        plans = plans.filter(plan => plan.clientId === clientIdFilter);
      }
      
      setData(prev => ({ ...prev, plans }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  }, []);

  // Fetch meals
  const fetchMeals = useCallback(async (filters = {}) => {
    setLoading(prev => ({ ...prev, meals: true }));
    try {
      await delay(400);
      
      let meals = [
        {
          id: 1,
          clientId: 1,
          planId: 1,
          date: '2025-01-27',
          mealType: 'breakfast',
          foods: [
            { name: 'Oatmeal', quantity: 80, unit: 'g', calories: 311, protein: 13.5, carbs: 53, fat: 5.5 },
            { name: 'Banana', quantity: 1, unit: 'unit', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
            { name: 'Whey Protein', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1 }
          ],
          totals: { calories: 536, protein: 38.8, carbs: 83, fat: 6.9 },
          compliance: 100,
          notes: 'Pre-workout meal'
        },
        {
          id: 2,
          clientId: 1,
          planId: 1,
          date: '2025-01-27',
          mealType: 'lunch',
          foods: [
            { name: 'Chicken Breast', quantity: 150, unit: 'g', calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
            { name: 'Brown Rice', quantity: 100, unit: 'g', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
            { name: 'Broccoli', quantity: 150, unit: 'g', calories: 53, protein: 4.2, carbs: 10.8, fat: 0.6 }
          ],
          totals: { calories: 413, protein: 53.3, carbs: 34.3, fat: 6.9 },
          compliance: 95
        }
      ];
      
      // Apply filters
      if (filters.clientId) {
        meals = meals.filter(meal => meal.clientId === filters.clientId);
      }
      if (filters.date) {
        meals = meals.filter(meal => meal.date === filters.date);
      }
      if (filters.dateRange) {
        meals = meals.filter(meal => 
          meal.date >= filters.dateRange.start && 
          meal.date <= filters.dateRange.end
        );
      }
      
      setData(prev => ({ ...prev, meals }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, meals: false }));
    }
  }, []);

  // Fetch check-ins
  const fetchCheckIns = useCallback(async (clientIdFilter = null) => {
    setLoading(prev => ({ ...prev, checkIns: true }));
    try {
      await delay(300);
      
      let checkIns = [
        {
          id: 1,
          clientId: 1,
          date: '2025-01-25',
          weight: 73.5,
          bodyFat: 16.2,
          muscleMass: 39.3,
          measurements: { chest: 104, waist: 81, arm: 36.5 },
          compliance: { meals: 92, training: 90, hydration: 95, sleep: 85 },
          energy: 4,
          hunger: 3,
          notes: 'Feeling strong, recovery is good'
        },
        {
          id: 2,
          clientId: 2,
          date: '2025-01-24',
          weight: 58.2,
          bodyFat: 22.1,
          muscleMass: 24.5,
          measurements: { chest: 88, waist: 68, hips: 94 },
          compliance: { meals: 88, training: 85, hydration: 90, sleep: 80 },
          energy: 3,
          hunger: 4,
          notes: 'Some cravings this week'
        }
      ];
      
      if (clientIdFilter) {
        checkIns = checkIns.filter(checkIn => checkIn.clientId === clientIdFilter);
      }
      
      setData(prev => ({ ...prev, checkIns }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, checkIns: false }));
    }
  }, []);

  // Fetch foods database
  const fetchFoods = useCallback(async (search = '') => {
    setLoading(prev => ({ ...prev, foods: true }));
    try {
      await delay(200);
      
      let foods = [
        { id: 1, name: 'Chicken Breast (grilled)', category: 'proteins', calories: 165, protein: 31, carbs: 0, fat: 3.6, per: 100, unit: 'g' },
        { id: 2, name: 'Brown Rice (cooked)', category: 'carbs', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, per: 100, unit: 'g' },
        { id: 3, name: 'Broccoli (steamed)', category: 'vegetables', calories: 35, protein: 2.8, carbs: 7.2, fat: 0.4, per: 100, unit: 'g' },
        { id: 4, name: 'Banana', category: 'fruits', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, per: 1, unit: 'unit' },
        { id: 5, name: 'Whole Eggs', category: 'proteins', calories: 70, protein: 6, carbs: 0.6, fat: 5, per: 1, unit: 'unit' },
        { id: 6, name: 'Oatmeal (dry)', category: 'carbs', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, per: 100, unit: 'g' },
        { id: 7, name: 'Greek Yogurt', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, per: 100, unit: 'g' },
        { id: 8, name: 'Almonds', category: 'fats', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, per: 100, unit: 'g' },
        { id: 9, name: 'Sweet Potato', category: 'carbs', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, per: 100, unit: 'g' },
        { id: 10, name: 'Salmon (grilled)', category: 'proteins', calories: 206, protein: 22.1, carbs: 0, fat: 12.4, per: 100, unit: 'g' }
      ];
      
      if (search) {
        foods = foods.filter(food => 
          food.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setData(prev => ({ ...prev, foods }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, foods: false }));
    }
  }, []);

  // Create new plan
  const createPlan = useCallback(async (planData) => {
    try {
      await delay(500);
      
      const newPlan = {
        id: Date.now(),
        ...planData,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        plans: [...prev.plans, newPlan]
      }));
      
      return newPlan;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update plan
  const updatePlan = useCallback(async (planId, updates) => {
    try {
      await delay(300);
      
      setData(prev => ({
        ...prev,
        plans: prev.plans.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        )
      }));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete plan
  const deletePlan = useCallback(async (planId) => {
    try {
      await delay(300);
      
      setData(prev => ({
        ...prev,
        plans: prev.plans.filter(plan => plan.id !== planId)
      }));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Log meal
  const logMeal = useCallback(async (mealData) => {
    try {
      await delay(300);
      
      const newMeal = {
        id: Date.now(),
        ...mealData,
        loggedAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        meals: [...prev.meals, newMeal]
      }));
      
      return newMeal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create check-in
  const createCheckIn = useCallback(async (checkInData) => {
    try {
      await delay(400);
      
      const newCheckIn = {
        id: Date.now(),
        ...checkInData,
        createdAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        checkIns: [...prev.checkIns, newCheckIn]
      }));
      
      return newCheckIn;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Add custom food
  const addFood = useCallback(async (foodData) => {
    try {
      await delay(300);
      
      const newFood = {
        id: Date.now(),
        ...foodData,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        foods: [...prev.foods, newFood]
      }));
      
      return newFood;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update statistics
  const updateStats = (clients) => {
    const activePlans = clients.filter(c => c.activePlan).length;
    const avgCompliance = clients.reduce((sum, c) => sum + c.compliance, 0) / clients.length;
    
    setStats({
      totalClients: clients.length,
      activePlans,
      avgCompliance: Math.round(avgCompliance),
      monthlyGrowth: 12, // Mock value
      weeklyCheckIns: 48, // Mock value
      totalFoods: 2847 // Mock value
    });
  };

  // Initial data fetch
  useEffect(() => {
    if (clientId) {
      // Fetch data for specific client
      fetchPlans(clientId);
      fetchMeals({ clientId });
      fetchCheckIns(clientId);
    } else {
      // Fetch all data
      fetchClients();
      fetchPlans();
      fetchFoods();
    }
  }, [clientId, fetchClients, fetchPlans, fetchMeals, fetchCheckIns, fetchFoods]);

  // Get client-specific data
  const getClientData = (id) => {
    return {
      client: data.clients.find(c => c.id === id),
      plan: data.plans.find(p => p.clientId === id && p.status === 'active'),
      meals: data.meals.filter(m => m.clientId === id),
      checkIns: data.checkIns.filter(c => c.clientId === id),
      lastCheckIn: data.checkIns
        .filter(c => c.clientId === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    };
  };

  // Calculate compliance for date range
  const calculateCompliance = (clientId, startDate, endDate) => {
    const meals = data.meals.filter(m => 
      m.clientId === clientId &&
      m.date >= startDate &&
      m.date <= endDate
    );
    
    if (meals.length === 0) return 0;
    
    const totalCompliance = meals.reduce((sum, meal) => sum + meal.compliance, 0);
    return Math.round(totalCompliance / meals.length);
  };

  return {
    // Data
    data,
    stats,
    loading,
    error,
    
    // Fetch functions
    fetchClients,
    fetchPlans,
    fetchMeals,
    fetchCheckIns,
    fetchFoods,
    
    // CRUD operations
    createPlan,
    updatePlan,
    deletePlan,
    logMeal,
    createCheckIn,
    addFood,
    
    // Utility functions
    getClientData,
    calculateCompliance,
    
    // Refresh all data
    refresh: () => {
      fetchClients();
      fetchPlans();
      fetchMeals();
      fetchCheckIns();
      fetchFoods();
    }
  };
};

export default useNutritionData;