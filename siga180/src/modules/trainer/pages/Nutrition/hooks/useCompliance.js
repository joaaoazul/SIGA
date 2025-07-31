import { useState, useCallback, useMemo, useEffect } from 'react';

const useCompliance = (clientId, dateRange = 'week') => {
  // State
  const [complianceData, setComplianceData] = useState({
    meals: [],
    checkIns: [],
    workouts: [],
    hydration: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Date range calculations
  const getDateRange = useCallback(() => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }, [dateRange]);

  // Calculate overall compliance
  const overallCompliance = useMemo(() => {
    const { start, end } = getDateRange();
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    
    let totalCompliance = 0;
    let daysWithData = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompliance = calculateDayCompliance(dateStr);
      if (dayCompliance > 0) {
        totalCompliance += dayCompliance;
        daysWithData++;
      }
    }
    
    return daysWithData > 0 ? Math.round(totalCompliance / daysWithData) : 0;
  }, [complianceData, getDateRange]);

  // Calculate compliance by category
  const complianceByCategory = useMemo(() => {
    const { start, end } = getDateRange();
    
    return {
      nutrition: calculateCategoryCompliance('meals', start, end),
      training: calculateCategoryCompliance('workouts', start, end),
      hydration: calculateCategoryCompliance('hydration', start, end),
      checkIns: calculateCategoryCompliance('checkIns', start, end)
    };
  }, [complianceData, getDateRange]);

  // Weekly compliance data for charts
  const weeklyCompliance = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompliance = calculateDayCompliance(dateStr);
      const dayMeals = complianceData.meals.filter(m => m.date === dateStr);
      
      weekData.push({
        date: dateStr,
        day: days[date.getDay()],
        percentage: dayCompliance,
        compliantMeals: dayMeals.filter(m => m.compliance >= 90).length,
        totalMeals: dayMeals.length,
        label: i === 0 ? 'Today' : days[date.getDay()]
      });
    }
    
    return weekData;
  }, [complianceData]);

  // Calculate day compliance
  const calculateDayCompliance = useCallback((dateStr) => {
    const dayData = {
      meals: complianceData.meals.filter(m => m.date === dateStr),
      workouts: complianceData.workouts.filter(w => w.date === dateStr),
      hydration: complianceData.hydration.filter(h => h.date === dateStr)
    };
    
    let totalCompliance = 0;
    let categories = 0;
    
    // Meal compliance
    if (dayData.meals.length > 0) {
      const mealCompliance = dayData.meals.reduce((sum, m) => sum + (m.compliance || 0), 0) / dayData.meals.length;
      totalCompliance += mealCompliance;
      categories++;
    }
    
    // Workout compliance
    if (dayData.workouts.length > 0) {
      const workoutCompliance = dayData.workouts[0].completed ? 100 : 0;
      totalCompliance += workoutCompliance;
      categories++;
    }
    
    // Hydration compliance
    if (dayData.hydration.length > 0) {
      const hydrationCompliance = Math.min((dayData.hydration[0].amount / dayData.hydration[0].target) * 100, 100);
      totalCompliance += hydrationCompliance;
      categories++;
    }
    
    return categories > 0 ? Math.round(totalCompliance / categories) : 0;
  }, [complianceData]);

  // Calculate category compliance
  const calculateCategoryCompliance = useCallback((category, startDate, endDate) => {
    const categoryData = complianceData[category].filter(item => 
      item.date >= startDate && item.date <= endDate
    );
    
    if (categoryData.length === 0) return 0;
    
    switch (category) {
      case 'meals':
        return Math.round(
          categoryData.reduce((sum, m) => sum + (m.compliance || 0), 0) / categoryData.length
        );
      
      case 'workouts':
        const completedWorkouts = categoryData.filter(w => w.completed).length;
        return Math.round((completedWorkouts / categoryData.length) * 100);
      
      case 'hydration':
        const avgHydration = categoryData.reduce((sum, h) => 
          sum + Math.min((h.amount / h.target) * 100, 100), 0
        ) / categoryData.length;
        return Math.round(avgHydration);
      
      case 'checkIns':
        const completedCheckIns = categoryData.filter(c => c.completed).length;
        const scheduledCheckIns = categoryData.length;
        return scheduledCheckIns > 0 
          ? Math.round((completedCheckIns / scheduledCheckIns) * 100)
          : 100;
      
      default:
        return 0;
    }
  }, [complianceData]);

  // Get compliance trends
  const getComplianceTrends = useCallback(() => {
    const { start } = getDateRange();
    const weeks = [];
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekCompliance = calculatePeriodCompliance(
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
      
      weeks.push({
        week: i + 1,
        compliance: weekCompliance,
        label: `Week ${i + 1}`
      });
    }
    
    // Calculate trend
    const firstWeek = weeks[0].compliance;
    const lastWeek = weeks[weeks.length - 1].compliance;
    const trend = lastWeek - firstWeek;
    
    return {
      weeks,
      trend,
      improving: trend > 0,
      percentage: firstWeek > 0 ? Math.round((trend / firstWeek) * 100) : 0
    };
  }, [getDateRange]);

  // Calculate period compliance
  const calculatePeriodCompliance = useCallback((startDate, endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    let totalCompliance = 0;
    let daysWithData = 0;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompliance = calculateDayCompliance(dateStr);
      if (dayCompliance > 0) {
        totalCompliance += dayCompliance;
        daysWithData++;
      }
    }
    
    return daysWithData > 0 ? Math.round(totalCompliance / daysWithData) : 0;
  }, [calculateDayCompliance]);

  // Get compliance insights
  const getInsights = useCallback(() => {
    const insights = [];
    const { nutrition, training, hydration } = complianceByCategory;
    
    // Nutrition insights
    if (nutrition < 80) {
      insights.push({
        type: 'warning',
        category: 'nutrition',
        message: 'Nutrition compliance is below target. Consider meal planning.',
        value: nutrition
      });
    } else if (nutrition >= 95) {
      insights.push({
        type: 'success',
        category: 'nutrition',
        message: 'Excellent nutrition compliance! Keep it up!',
        value: nutrition
      });
    }
    
    // Training insights
    if (training < 75) {
      insights.push({
        type: 'warning',
        category: 'training',
        message: 'Training compliance needs improvement.',
        value: training
      });
    }
    
    // Hydration insights
    if (hydration < 70) {
      insights.push({
        type: 'alert',
        category: 'hydration',
        message: 'Hydration levels are low. Set reminders to drink water.',
        value: hydration
      });
    }
    
    // Trend insights
    const trends = getComplianceTrends();
    if (trends.improving && trends.percentage > 10) {
      insights.push({
        type: 'success',
        category: 'trend',
        message: `Great progress! Compliance improved ${trends.percentage}% over the period.`,
        value: trends.percentage
      });
    } else if (!trends.improving && trends.percentage < -10) {
      insights.push({
        type: 'warning',
        category: 'trend',
        message: `Compliance decreased ${Math.abs(trends.percentage)}%. Let's get back on track!`,
        value: trends.percentage
      });
    }
    
    return insights;
  }, [complianceByCategory, getComplianceTrends]);

  // Get streaks
  const getStreaks = useCallback(() => {
    const sortedDates = [...new Set([
      ...complianceData.meals.map(m => m.date),
      ...complianceData.workouts.map(w => w.date),
      ...complianceData.hydration.map(h => h.date)
    ])].sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check current streak
    let checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const compliance = calculateDayCompliance(dateStr);
      
      if (compliance >= 80) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let tempStreak = 0;
    sortedDates.forEach((date, index) => {
      const compliance = calculateDayCompliance(date);
      
      if (compliance >= 80) {
        if (index === 0 || 
            new Date(date).getTime() - new Date(sortedDates[index - 1]).getTime() === 86400000) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 0;
      }
    });
    
    return {
      current: currentStreak,
      longest: longestStreak,
      goalDays: 30, // 30-day streak goal
      percentToGoal: Math.round((currentStreak / 30) * 100)
    };
  }, [complianceData, calculateDayCompliance]);

  // Add compliance data
  const addComplianceData = useCallback(async (type, data) => {
    setLoading(true);
    try {
      const newData = {
        id: Date.now(),
        clientId,
        ...data,
        createdAt: new Date().toISOString()
      };
      
      setComplianceData(prev => ({
        ...prev,
        [type]: [...prev[type], newData]
      }));
      
      return newData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Update compliance data
  const updateComplianceData = useCallback(async (type, id, updates) => {
    setLoading(true);
    try {
      setComplianceData(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      }));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get achievement badges
  const getAchievements = useCallback(() => {
    const achievements = [];
    const streaks = getStreaks();
    
    // Streak achievements
    if (streaks.current >= 7) {
      achievements.push({
        id: 'week-streak',
        name: 'Week Warrior',
        description: '7-day compliance streak',
        icon: '🔥',
        unlocked: true
      });
    }
    
    if (streaks.current >= 30) {
      achievements.push({
        id: 'month-streak',
        name: 'Monthly Master',
        description: '30-day compliance streak',
        icon: '🏆',
        unlocked: true
      });
    }
    
    // Compliance achievements
    if (overallCompliance >= 90) {
      achievements.push({
        id: 'excellence',
        name: 'Excellence',
        description: '90%+ overall compliance',
        icon: '⭐',
        unlocked: true
      });
    }
    
    if (complianceByCategory.nutrition >= 95) {
      achievements.push({
        id: 'nutrition-pro',
        name: 'Nutrition Pro',
        description: '95%+ nutrition compliance',
        icon: '🥗',
        unlocked: true
      });
    }
    
    return achievements;
  }, [getStreaks, overallCompliance, complianceByCategory]);

  // Initialize with mock data
  useEffect(() => {
    // Mock data for demonstration
    setComplianceData({
      meals: [
        { id: 1, date: new Date().toISOString().split('T')[0], compliance: 95 },
        { id: 2, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], compliance: 88 },
        { id: 3, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], compliance: 92 }
      ],
      workouts: [
        { id: 1, date: new Date().toISOString().split('T')[0], completed: true },
        { id: 2, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], completed: true }
      ],
      hydration: [
        { id: 1, date: new Date().toISOString().split('T')[0], amount: 2300, target: 2500 },
        { id: 2, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 2600, target: 2500 }
      ],
      checkIns: []
    });
  }, [clientId]);

  return {
    // State
    complianceData,
    loading,
    error,
    
    // Calculated values
    overallCompliance,
    complianceByCategory,
    weeklyCompliance,
    
    // Functions
    calculateDayCompliance,
    calculateCategoryCompliance,
    getComplianceTrends,
    getInsights,
    getStreaks,
    getAchievements,
    addComplianceData,
    updateComplianceData,
    
    // Utilities
    getDateRange
  };
};

export default useCompliance;