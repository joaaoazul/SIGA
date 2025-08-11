// src/modules/trainer/pages/Workouts/data/exerciseDatabase.js

/**
 * Base de dados local de exercícios
 * No futuro, isto virá da API/Supabase
 * Cada exercício tem um ID único e informações detalhadas
 */

export const exerciseDatabase = [
  // ====== SHOULDERS ======
  {
    id: 1,
    name: 'Shoulder Press (Machine)',
    bodyPart: 'Shoulders',
    category: 'Machine',
    equipment: 'Shoulder Press Machine',
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    instructions: 'Sente-se na máquina com as costas apoiadas. Agarre as pegas e empurre para cima.',
    videoId: null, // YouTube video ID quando disponível
    imageUrl: '/images/exercises/shoulder-press-machine.png'
  },
  {
    id: 2,
    name: 'Front Raise (Dumbbell)',
    bodyPart: 'Shoulders',
    category: 'Free Weight',
    equipment: 'Dumbbell',
    primaryMuscles: ['Anterior Deltoid'],
    secondaryMuscles: ['Lateral Deltoid', 'Upper Chest'],
    instructions: 'Segure os halteres à frente das coxas. Levante-os até a altura dos ombros.',
    videoId: null,
    imageUrl: '/images/exercises/front-raise-dumbbell.png'
  },
  {
    id: 3,
    name: 'Arnold Press (Dumbbell)',
    bodyPart: 'Shoulders',
    category: 'Free Weight',
    equipment: 'Dumbbell',
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Posterior Deltoid', 'Triceps'],
    instructions: 'Comece com os halteres à frente do peito, palmas viradas para si. Rode e empurre para cima.',
    videoId: null,
    imageUrl: '/images/exercises/arnold-press.png'
  },
  
  // ====== LEGS ======
  {
    id: 8,
    name: 'Squat (Barbell)',
    bodyPart: 'Legs',
    category: 'Free Weight',
    equipment: 'Barbell',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core', 'Lower Back'],
    instructions: 'Posicione a barra nas costas. Desça controladamente até as coxas paralelas ao chão.',
    videoId: null,
    imageUrl: '/images/exercises/barbell-squat.png'
  },
  {
    id: 9,
    name: 'Leg Press',
    bodyPart: 'Legs',
    category: 'Machine',
    equipment: 'Leg Press Machine',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves'],
    instructions: 'Sente-se na máquina com os pés na plataforma. Empurre a plataforma estendendo as pernas.',
    videoId: null,
    imageUrl: '/images/exercises/leg-press.png'
  },
  
  // ... Adicionar mais exercícios conforme necessário
];

/**
 * Função auxiliar para procurar exercícios
 */
export const searchExercises = (query, filters = {}) => {
  let results = [...exerciseDatabase];
  
  // Filtrar por texto de pesquisa
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.bodyPart.toLowerCase().includes(searchTerm) ||
      exercise.equipment.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtrar por body part
  if (filters.bodyPart && filters.bodyPart !== 'Any Body Part') {
    results = results.filter(exercise => exercise.bodyPart === filters.bodyPart);
  }
  
  // Filtrar por categoria
  if (filters.category && filters.category !== 'Any Category') {
    results = results.filter(exercise => exercise.category === filters.category);
  }
  
  return results;
};

/**
 * Obter exercício por ID
 */
export const getExerciseById = (id) => {
  return exerciseDatabase.find(exercise => exercise.id === id);
};