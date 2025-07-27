// src/modules/trainer/pages/Nutrition/data/mockData.js

export const mockAthletes = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '+351 912 345 678',
    avatar: null,
    age: 28,
    weight: 75,
    height: 178,
    activityLevel: 'moderate',
    goal: 'Perder gordura',
    tags: ['Cutting', 'Gym 5x'],
    nutritionPlan: {
      id: 'plan-1',
      name: 'Plano de Cutting Progressivo',
      type: 'cutting',
      calories: 2400,
      protein: 180,
      carbs: 240,
      fat: 80,
      fiber: 35,
      water: 3000,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      lastUpdate: '2024-01-26',
      weeklyCheckIn: true,
      mealPlan: 'flexible',
      supplements: ['Whey', 'Creatina', 'Multivitamínico'],
      restrictions: ['Lactose'],
      progress: {
        weightChange: -2.5,
        bodyFatChange: -1.2,
        muscleMassChange: +0.3,
        measurements: {
          waist: -3,
          chest: -1,
          arms: 0
        }
      },
      compliance: {
        overall: 85,
        calories: 88,
        protein: 95,
        carbs: 82,
        fat: 78,
        water: 72
      },
      recentMeals: [
        { date: '2024-01-26', compliance: 92 },
        { date: '2024-01-25', compliance: 85 },
        { date: '2024-01-24', compliance: 88 },
        { date: '2024-01-23', compliance: 79 },
        { date: '2024-01-22', compliance: 91 }
      ]
    },
    notifications: {
      email: true,
      sms: false,
      app: true
    },
    lastActivity: '2 horas atrás',
    streak: 12
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '+351 913 456 789',
    avatar: null,
    age: 25,
    weight: 58,
    height: 165,
    activityLevel: 'high',
    goal: 'Ganhar massa muscular',
    tags: ['Bulking', 'Crossfit'],
    nutritionPlan: {
      id: 'plan-2',
      name: 'Plano de Bulking Limpo',
      type: 'bulking',
      calories: 2200,
      protein: 110,
      carbs: 280,
      fat: 70,
      fiber: 30,
      water: 2500,
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      lastUpdate: '2024-01-25',
      weeklyCheckIn: true,
      mealPlan: 'structured',
      supplements: ['Whey', 'Gainers'],
      restrictions: [],
      progress: {
        weightChange: +1.2,
        bodyFatChange: +0.5,
        muscleMassChange: +0.7,
        measurements: {
          waist: +1,
          chest: +2,
          arms: +1.5
        }
      },
      compliance: {
        overall: 92,
        calories: 94,
        protein: 98,
        carbs: 90,
        fat: 88,
        water: 85
      },
      recentMeals: [
        { date: '2024-01-25', compliance: 95 },
        { date: '2024-01-24', compliance: 92 },
        { date: '2024-01-23', compliance: 88 },
        { date: '2024-01-22', compliance: 94 },
        { date: '2024-01-21', compliance: 91 }
      ]
    },
    notifications: {
      email: true,
      sms: true,
      app: true
    },
    lastActivity: '1 dia atrás',
    streak: 21
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '+351 914 567 890',
    avatar: null,
    age: 35,
    weight: 82,
    height: 175,
    activityLevel: 'low',
    goal: 'Manter peso',
    tags: ['Manutenção', 'Iniciante'],
    nutritionPlan: null,
    notifications: {
      email: true,
      sms: false,
      app: false
    },
    lastActivity: '5 dias atrás',
    streak: 0
  },
  {
    id: 4,
    name: 'Ana Rodrigues',
    email: 'ana@email.com',
    phone: '+351 915 678 901',
    avatar: null,
    age: 30,
    weight: 65,
    height: 168,
    activityLevel: 'moderate',
    goal: 'Recomposição corporal',
    tags: ['Recomp', 'Yoga'],
    nutritionPlan: {
      id: 'plan-4',
      name: 'Recomposição Corporal',
      type: 'recomp',
      calories: 1800,
      protein: 130,
      carbs: 180,
      fat: 60,
      fiber: 28,
      water: 2200,
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      lastUpdate: '2024-01-26',
      weeklyCheckIn: true,
      mealPlan: 'structured',
      supplements: ['Whey', 'Ômega 3'],
      restrictions: ['Glúten'],
      progress: {
        weightChange: -0.5,
        bodyFatChange: -2.1,
        muscleMassChange: +1.6,
        measurements: {
          waist: -4,
          chest: +1,
          arms: +0.5
        }
      },
      compliance: {
        overall: 78,
        calories: 82,
        protein: 90,
        carbs: 75,
        fat: 70,
        water: 68
      },
      recentMeals: [
        { date: '2024-01-26', compliance: 78 },
        { date: '2024-01-25', compliance: 82 },
        { date: '2024-01-24', compliance: 75 },
        { date: '2024-01-23', compliance: 80 },
        { date: '2024-01-22', compliance: 76 }
      ]
    },
    notifications: {
      email: true,
      sms: true,
      app: true
    },
    lastActivity: '4 horas atrás',
    streak: 8
  }
];

export const mockFoods = [
  { 
    id: 1, 
    name: 'Peito de Frango Grelhado', 
    category: 'proteins', 
    brand: 'Genérico', 
    barcode: null, 
    calories: 165, 
    protein: 31, 
    carbs: 0, 
    fat: 3.6, 
    fiber: 0, 
    serving: '100g',
    micronutrients: {
      sodium: 74,
      potassium: 256,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 15,
      iron: 1
    }
  },
  { 
    id: 2, 
    name: 'Arroz Branco Cozido', 
    category: 'carbs', 
    brand: 'Genérico', 
    barcode: null, 
    calories: 130, 
    protein: 2.7, 
    carbs: 28.2, 
    fat: 0.3, 
    fiber: 0.4, 
    serving: '100g',
    micronutrients: {
      sodium: 1,
      potassium: 35,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 10,
      iron: 0.2
    }
  },
  { 
    id: 3, 
    name: 'Abacate', 
    category: 'fats', 
    brand: 'Genérico', 
    barcode: null, 
    calories: 160, 
    protein: 2, 
    carbs: 8.5, 
    fat: 14.7, 
    fiber: 6.7, 
    serving: '100g',
    micronutrients: {
      sodium: 7,
      potassium: 485,
      vitaminA: 7,
      vitaminC: 10,
      calcium: 12,
      iron: 0.6
    }
  },
  { 
    id: 4, 
    name: 'Whey Protein Gold Standard', 
    category: 'proteins', 
    brand: 'Optimum Nutrition', 
    barcode: '748927024081', 
    calories: 120, 
    protein: 24, 
    carbs: 3, 
    fat: 1.5, 
    fiber: 0, 
    serving: '30g',
    micronutrients: {
      sodium: 130,
      potassium: 140,
      calcium: 140,
      iron: 0
    }
  },
  { 
    id: 5, 
    name: 'Leite Magro', 
    category: 'dairy', 
    brand: 'Mimosa', 
    barcode: '5601234567890', 
    calories: 35, 
    protein: 3.4, 
    carbs: 5, 
    fat: 0.1, 
    fiber: 0, 
    serving: '100ml',
    micronutrients: {
      sodium: 40,
      potassium: 150,
      vitaminA: 50,
      vitaminC: 0,
      calcium: 120,
      iron: 0
    }
  }
];

export const mockMeals = [
  {
    id: 1,
    athleteName: 'João Silva',
    athleteId: 1,
    date: '2024-01-26',
    meals: [
      {
        type: 'breakfast',
        time: '08:00',
        foods: [
          { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
          { name: 'Banana', quantity: 1, unit: 'unidade', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
          { name: 'Whey Protein', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1.5 }
        ],
        totals: { calories: 614, protein: 42.2, carbs: 96.3, fat: 8.8 },
        notes: 'Pré-treino',
        photo: null
      },
      {
        type: 'lunch',
        time: '13:00',
        foods: [
          { name: 'Peito de Frango', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: 'Arroz Integral', quantity: 150, unit: 'g', calories: 165, protein: 3.5, carbs: 34.5, fat: 1.2 },
          { name: 'Brócolos', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
        ],
        totals: { calories: 529, protein: 68.3, carbs: 41.5, fat: 8.8 },
        notes: 'Refeição pós-treino',
        photo: null
      },
      {
        type: 'snack',
        time: '16:00',
        foods: [
          { name: 'Iogurte Grego', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0 },
          { name: 'Amêndoas', quantity: 30, unit: 'g', calories: 174, protein: 6.4, carbs: 6.1, fat: 15 }
        ],
        totals: { calories: 274, protein: 23.4, carbs: 12.1, fat: 15 },
        notes: '',
        photo: null
      },
      {
        type: 'dinner',
        time: '20:00',
        foods: [
          { name: 'Salmão', quantity: 150, unit: 'g', calories: 312, protein: 33.6, carbs: 0, fat: 18.6 },
          { name: 'Batata Doce', quantity: 200, unit: 'g', calories: 172, protein: 3.2, carbs: 40.2, fat: 0.2 },
          { name: 'Salada Mista', quantity: 150, unit: 'g', calories: 30, protein: 1.5, carbs: 6, fat: 0.3 }
        ],
        totals: { calories: 514, protein: 38.3, carbs: 46.2, fat: 19.1 },
        notes: '',
        photo: null
      }
    ],
    dailyTotals: { calories: 1931, protein: 172.2, carbs: 196.1, fat: 51.7 },
    compliance: 92,
    water: 2.8,
    notes: 'Dia de treino de pernas. Sentiu-se com boa energia.'
  }
];

export const categories = [
  { id: 'all', name: 'Todos', count: 2847 },
  { id: 'proteins', name: 'Proteínas', count: 487 },
  { id: 'carbs', name: 'Carboidratos', count: 892 },
  { id: 'fats', name: 'Gorduras', count: 234 },
  { id: 'dairy', name: 'Lacticínios', count: 345 },
  { id: 'fruits', name: 'Frutas', count: 456 },
  { id: 'vegetables', name: 'Vegetais', count: 433 }
];

export const planTemplates = [
  {
    id: 'cutting-aggressive',
    name: 'Cutting Agressivo',
    type: 'cutting',
    description: 'Perda rápida de gordura mantendo massa muscular',
    deficit: 500,
    macroSplit: { protein: 40, carbs: 30, fat: 30 },
    mealTiming: 'flexible',
    duration: 8 // weeks
  },
  {
    id: 'bulking-clean',
    name: 'Bulking Limpo',
    type: 'bulking',
    description: 'Ganho de massa muscular minimizando gordura',
    surplus: 300,
    macroSplit: { protein: 30, carbs: 45, fat: 25 },
    mealTiming: 'structured',
    duration: 12
  },
  {
    id: 'recomp',
    name: 'Recomposição',
    type: 'recomp',
    description: 'Perder gordura e ganhar músculo simultaneamente',
    calories: 'maintenance',
    macroSplit: { protein: 35, carbs: 35, fat: 30 },
    mealTiming: 'flexible',
    duration: 16
  },
  {
    id: 'maintenance',
    name: 'Manutenção',
    type: 'maintenance',
    description: 'Manter peso e composição corporal',
    calories: 'maintenance',
    macroSplit: { protein: 30, carbs: 40, fat: 30 },
    mealTiming: 'flexible',
    duration: 'ongoing'
  }
];