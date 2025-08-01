import { supabase } from './supabaseClient';

class NutritionService {
  // Athletes (for trainers)
  async getAthletes(trainerId) {
    const { data, error } = await supabase
      .from('athletes')
      .select(`
        *,
        profile:profiles(*),
        active_plan:nutrition_plans(*)
      `)
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createAthlete(athleteData) {
    const { data, error } = await supabase
      .from('athletes')
      .insert(athleteData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Nutrition Plans
  async getPlans(filters = {}) {
    let query = supabase
      .from('nutrition_plans')
      .select(`
        *,
        athlete:athletes(
          profile:profiles(*)
        )
      `);

    if (filters.trainer_id) {
      query = query.eq('trainer_id', filters.trainer_id);
    }

    if (filters.athlete_id) {
      query = query.eq('athlete_id', filters.athlete_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createPlan(planData) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .insert(planData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Meals
  async getMeals(athleteId, date) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('date', date)
      .order('meal_type');

    if (error) throw error;
    return data;
  }

  async createMeal(mealData) {
    const { data, error } = await supabase
      .from('meals')
      .insert(mealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMeal(mealId, updates) {
    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', mealId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Food Database
  async searchFoods(searchTerm) {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(20);

    if (error) throw error;
    return data;
  }

  async getFoodSubstitutes(foodId, athletePreferences) {
    // Custom RPC function no Supabase para calcular substitutos
    const { data, error } = await supabase
      .rpc('get_food_substitutes', {
        food_id: foodId,
        preferences: athletePreferences
      });

    if (error) throw error;
    return data;
  }
}

export default new NutritionService();