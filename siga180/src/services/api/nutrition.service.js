import axiosInstance from './axiosInstance';

class NutritionService {
  // Athletes
  async getAthletes(params = {}) {
    const response = await axiosInstance.get('/athletes', { params });
    return response.data;
  }

  async getAthlete(id) {
    const response = await axiosInstance.get(`/athletes/${id}`);
    return response.data;
  }

  async createAthlete(data) {
    const response = await axiosInstance.post('/athletes', data);
    return response.data;
  }

  async updateAthlete(id, data) {
    const response = await axiosInstance.put(`/athletes/${id}`, data);
    return response.data;
  }

  // Nutrition Plans
  async getPlans(params = {}) {
    const response = await axiosInstance.get('/nutrition/plans', { params });
    return response.data;
  }

  async getPlan(id) {
    const response = await axiosInstance.get(`/nutrition/plans/${id}`);
    return response.data;
  }

  async createPlan(data) {
    const response = await axiosInstance.post('/nutrition/plans', data);
    return response.data;
  }

  async updatePlan(id, data) {
    const response = await axiosInstance.put(`/nutrition/plans/${id}`, data);
    return response.data;
  }

  async deletePlan(id) {
    const response = await axiosInstance.delete(`/nutrition/plans/${id}`);
    return response.data;
  }

  // Meals
  async getMeals(params = {}) {
    const response = await axiosInstance.get('/nutrition/meals', { params });
    return response.data;
  }

  async createMeal(data) {
    const response = await axiosInstance.post('/nutrition/meals', data);
    return response.data;
  }

  async updateMeal(id, data) {
    const response = await axiosInstance.put(`/nutrition/meals/${id}`, data);
    return response.data;
  }

  // Meal Chat
  async getMealMessages(athleteId, mealId) {
    const response = await axiosInstance.get(`/nutrition/chat/${athleteId}/${mealId}`);
    return response.data;
  }

  async sendMealMessage(athleteId, mealId, message) {
    const response = await axiosInstance.post(`/nutrition/chat/${athleteId}/${mealId}`, message);
    return response.data;
  }

  async approveMeal(athleteId, mealId, approved) {
    const response = await axiosInstance.post(`/nutrition/meals/${mealId}/approve`, {
      athleteId,
      approved
    });
    return response.data;
  }

  // Food Database
  async searchFoods(query, params = {}) {
    const response = await axiosInstance.get('/nutrition/foods/search', {
      params: { q: query, ...params }
    });
    return response.data;
  }

  async getFood(id) {
    const response = await axiosInstance.get(`/nutrition/foods/${id}`);
    return response.data;
  }

  async createFood(data) {
    const response = await axiosInstance.post('/nutrition/foods', data);
    return response.data;
  }

  // Food Substitutions
  async getFoodSubstitutions(foodId, params = {}) {
    const response = await axiosInstance.get(`/nutrition/foods/${foodId}/substitutions`, { params });
    return response.data;
  }

  // Check-ins
  async getCheckIns(athleteId, params = {}) {
    const response = await axiosInstance.get(`/athletes/${athleteId}/checkins`, { params });
    return response.data;
  }

  async createCheckIn(athleteId, data) {
    const response = await axiosInstance.post(`/athletes/${athleteId}/checkins`, data);
    return response.data;
  }

  // Upload images
  async uploadMealPhoto(file, metadata) {
    const formData = new FormData();
    formData.append('photo', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await axiosInstance.post('/nutrition/meals/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Analytics
  async getAthleteAnalytics(athleteId, period = 'month') {
    const response = await axiosInstance.get(`/athletes/${athleteId}/analytics`, {
      params: { period }
    });
    return response.data;
  }

  async getNutritionStats(params = {}) {
    const response = await axiosInstance.get('/nutrition/stats', { params });
    return response.data;
  }
}

export default new NutritionService();
