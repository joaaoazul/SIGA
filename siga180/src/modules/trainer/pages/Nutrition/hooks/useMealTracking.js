import { useState, useCallback, useMemo } from 'react';

const useMealTracking = (clientId, planTargets = null) => {
  // State for meals
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default plan targets if not provided
  const defaultTargets = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    fiber: 25,
    water: 2500 // ml
  };

  const targets = planTargets || defaultTargets;

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const dayMeals = meals.filter(meal => meal.date === selectedDate);
    
    return dayMeals.reduce((totals, meal) => {
      return {
        calories: totals.calories + (meal.totals?.calories || 0),
        protein: totals.protein + (meal.totals?.protein || 0),
        carbs: totals.carbs + (meal.totals?.carbs || 0),
        fat: totals.fat + (meal.totals?.fat || 0),
        fiber: totals.fiber + (meal.totals?.fiber || 0),
        water: totals.water + (meal.water || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 });
  }, [meals, selectedDate]);

  // Calculate remaining macros
  const remaining = useMemo(() => {
    return {
      calories: targets.calories - dailyTotals.calories,
      protein: targets.protein - dailyTotals.protein,
      carbs: targets.carbs - dailyTotals.carbs,
      fat: targets.fat - dailyTotals.fat,
      fiber: targets.fiber - dailyTotals.fiber,
      water: targets.water - dailyTotals.water
    };
  }, [targets, dailyTotals]);

  // Calculate percentages
  const percentages = useMemo(() => {
    return {
      calories: Math.round((dailyTotals.calories / targets.calories) * 100),
      protein: Math.round((dailyTotals.protein / targets.protein) * 100),
      carbs: Math.round((dailyTotals.carbs / targets.carbs) * 100),
      fat: Math.round((dailyTotals.fat / targets.fat) * 100),
      fiber: Math.round((dailyTotals.fiber / targets.fiber) * 100),
      water: Math.round((dailyTotals.water / targets.water) * 100)
    };
  }, [dailyTotals, targets]);

  // Get meals by type
  const getMealsByType = useCallback((mealType) => {
    return meals.filter(meal => 
      meal.date === selectedDate && 
      meal.mealType === mealType
    );
  }, [meals, selectedDate]);

  // Add meal
  const addMeal = useCallback(async (mealData) => {
    setLoading(true);
    try {
      const newMeal = {
        id: Date.now(),
        clientId,
        ...mealData,
        createdAt: new Date().toISOString()
      };
      
      setMeals(prev => [...prev, newMeal]);
      return newMeal;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Update meal
  const updateMeal = useCallback(async (mealId, updates) => {
    setLoading(true);
    try {
      setMeals(prev => prev.map(meal => 
        meal.id === mealId 
          ? { ...meal, ...updates, updatedAt: new Date().toISOString() }
          : meal
      ));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete meal
  const deleteMeal = useCallback(async (mealId) => {
    setLoading(true);
    try {
      setMeals(prev => prev.filter(meal => meal.id !== mealId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Copy meal
  const copyMeal = useCallback(async (mealId, targetDate = null) => {
    const mealToCopy = meals.find(m => m.id === mealId);
    if (!mealToCopy) {
      throw new Error('Meal not found');
    }

    const newMeal = {
      ...mealToCopy,
      id: Date.now(),
      date: targetDate || selectedDate,
      createdAt: new Date().toISOString()
    };

    setMeals(prev => [...prev, newMeal]);
    return newMeal;
  }, [meals, selectedDate]);

  // Quick add common foods
  const quickAddFood = useCallback(async (mealType, food) => {
    const existingMeal = getMealsByType(mealType)[0];
    
    if (existingMeal) {
      // Add to existing meal
      const updatedFoods = [...existingMeal.foods, food];
      const updatedTotals = calculateMealTotals(updatedFoods);
      
      return updateMeal(existingMeal.id, {
        foods: updatedFoods,
        totals: updatedTotals
      });
    } else {
      // Create new meal
      return addMeal({
        date: selectedDate,
        mealType,
        foods: [food],
        totals: calculateMealTotals([food])
      });
    }
  }, [getMealsByType, updateMeal, addMeal, selectedDate]);

  // Calculate meal totals from foods
  const calculateMealTotals = (foods) => {
    return foods.reduce((totals, food) => {
      const multiplier = food.quantity / (food.per || 100);
      return {
        calories: totals.calories + (food.calories * multiplier),
        protein: totals.protein + (food.protein * multiplier),
        carbs: totals.carbs + (food.carbs * multiplier),
        fat: totals.fat + (food.fat * multiplier),
        fiber: totals.fiber + ((food.fiber || 0) * multiplier)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  // Get meal suggestions based on remaining macros
  const getMealSuggestions = useCallback(() => {
    const suggestions = [];
    
    // If low on protein
    if (percentages.protein < 80) {
      suggestions.push({
        type: 'protein',
        message: `You need ${remaining.protein}g more protein today`,
        foods: ['Chicken breast', 'Greek yogurt', 'Protein shake']
      });
    }
    
    // If low on fiber
    if (percentages.fiber < 80) {
      suggestions.push({
        type: 'fiber',
        message: `Add ${remaining.fiber}g more fiber for digestive health`,
        foods: ['Vegetables', 'Whole grains', 'Fruits']
      });
    }
    
    // If close to calorie limit
    if (percentages.calories > 90) {
      suggestions.push({
        type: 'calories',
        message: 'You\'re close to your calorie target',
        foods: ['Low-calorie vegetables', 'Water', 'Tea']
      });
    }
    
    return suggestions;
  }, [percentages, remaining]);

  // Get weekly summary
  const getWeeklySummary = useCallback(() => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(m => m.date === dateStr);
      const dayTotals = dayMeals.reduce((totals, meal) => ({
        calories: totals.calories + (meal.totals?.calories || 0),
        protein: totals.protein + (meal.totals?.protein || 0),
        carbs: totals.carbs + (meal.totals?.carbs || 0),
        fat: totals.fat + (meal.totals?.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      weekDays.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        totals: dayTotals,
        compliance: dayTotals.calories > 0 
          ? Math.round((Math.min(dayTotals.calories, targets.calories) / targets.calories) * 100)
          : 0
      });
    }
    
    return weekDays;
  }, [meals, selectedDate, targets]);

  // Check meal timing
  const checkMealTiming = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayMeals = getMealsByType('all');
    
    const recommendations = [];
    
    // Breakfast (6-10)
    if (currentHour >= 6 && currentHour <= 10) {
      const breakfast = todayMeals.find(m => m.mealType === 'breakfast');
      if (!breakfast) {
        recommendations.push({
          type: 'breakfast',
          message: 'Time for breakfast! Start your day with a balanced meal.'
        });
      }
    }
    
    // Lunch (12-14)
    if (currentHour >= 12 && currentHour <= 14) {
      const lunch = todayMeals.find(m => m.mealType === 'lunch');
      if (!lunch) {
        recommendations.push({
          type: 'lunch',
          message: 'Lunch time! Keep your energy up with a nutritious meal.'
        });
      }
    }
    
    // Dinner (18-20)
    if (currentHour >= 18 && currentHour <= 20) {
      const dinner = todayMeals.find(m => m.mealType === 'dinner');
      if (!dinner) {
        recommendations.push({
          type: 'dinner',
          message: 'Dinner time! Complete your daily nutrition goals.'
        });
      }
    }
    
    return recommendations;
  }, [getMealsByType]);

  // Get streaks
  const getStreaks = useCallback(() => {
    const dates = [...new Set(meals.map(m => m.date))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let streakDays = [];
    
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    // Check current streak
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayMeals = meals.filter(m => m.date === dateStr);
      
      if (dayMeals.length > 0) {
        currentStreak++;
        streakDays.push(dateStr);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let tempStreak = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || 
          new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime() === 86400000) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    return {
      current: currentStreak,
      longest: longestStreak,
      days: streakDays
    };
  }, [meals]);

  return {
    // State
    meals,
    selectedDate,
    loading,
    error,
    
    // Calculated values
    dailyTotals,
    remaining,
    percentages,
    targets,
    
    // Functions
    setSelectedDate,
    addMeal,
    updateMeal,
    deleteMeal,
    copyMeal,
    quickAddFood,
    getMealsByType,
    getMealSuggestions,
    getWeeklySummary,
    checkMealTiming,
    getStreaks,
    
    // Utilities
    calculateMealTotals
  };
};

export default useMealTracking;