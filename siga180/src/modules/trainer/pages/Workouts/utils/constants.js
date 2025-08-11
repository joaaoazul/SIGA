// src/modules/trainer/pages/Workouts/utils/constants.js

/**
 * Constantes usadas em todo o módulo de Workouts
 * Centralizar estas definições facilita manutenção e consistência
 */

// Tipos de séries disponíveis
export const SET_TYPES = {
  NORMAL: 'normal',
  WARMUP: 'warmup',
  DROPSET: 'dropset',
  FAILURE: 'failure'
};

// Configuração visual para cada tipo de série
export const SET_TYPE_CONFIG = {
  [SET_TYPES.NORMAL]: {
    label: 'Normal',
    color: 'gray',
    icon: null,
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700'
  },
  [SET_TYPES.WARMUP]: {
    label: 'Warm up',
    color: 'orange',
    icon: 'W',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-700'
  },
  [SET_TYPES.DROPSET]: {
    label: 'Drop set',
    color: 'purple',
    icon: 'D',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-700'
  },
  [SET_TYPES.FAILURE]: {
    label: 'Failure',
    color: 'red',
    icon: 'F',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700'
  }
};

// Tempos de descanso padrão (em segundos)
export const DEFAULT_REST_TIMES = {
  SHORT: 60,      // 1:00
  MEDIUM: 120,    // 2:00
  LONG: 180,      // 3:00
  VERY_LONG: 240  // 4:00
};

// Categorias de exercícios
export const EXERCISE_CATEGORIES = [
  'Any Category',
  'Machine',
  'Free Weight',
  'Bodyweight',
  'Cable',
  'Cardio',
  'Equipment'
];

// Grupos musculares
export const BODY_PARTS = [
  'Any Body Part',
  'Shoulders',
  'Chest',
  'Back',
  'Arms',
  'Legs',
  'Core',
  'Full Body'
];

// Configurações de navegação
export const BOTTOM_NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: 'User' },
  { id: 'history', label: 'History', icon: 'Clock' },
  { id: 'start', label: 'Start Workout', icon: 'Plus', primary: true },
  { id: 'exercises', label: 'Exercises', icon: 'Dumbbell' },
  { id: 'store', label: 'Store', icon: 'ShoppingBag' }
];