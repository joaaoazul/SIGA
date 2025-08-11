// src/modules/trainer/pages/Workouts/data/mockTemplates.js

/**
 * Dados mock para templates de treino
 * Estes dados simulam o que virá da base de dados
 * 
 * Estrutura baseada nas imagens que partilhaste
 */
export const mockTemplates = [
  {
    id: 1,
    name: 'Ombros',
    description: 'Treino completo de ombros com foco em desenvolvimento dos deltoides',
    exercises: [
      {
        id: 1,
        exerciseId: 1,
        name: 'Shoulder Press (Machine)',
        bodyPart: 'Shoulders',
        sets: 3,
        reps: '12',
        rest: '2:00',
        notes: '',
        previousWeight: 25,
        previousReps: 12
      },
      {
        id: 2,
        exerciseId: 2,
        name: 'Front Raise (Dumbbell)',
        bodyPart: 'Shoulders',
        sets: 2,
        reps: '20',
        rest: '2:00',
        notes: 'Manter movimento controlado',
        previousWeight: 7,
        previousReps: 20
      },
      {
        id: 3,
        exerciseId: 3,
        name: 'Arnold Press (Dumbbell)',
        bodyPart: 'Shoulders',
        sets: 3,
        reps: '12',
        rest: '2:00',
        notes: '',
        previousWeight: 10,
        previousReps: 12
      },
      {
        id: 4,
        exerciseId: 4,
        name: 'Overhead Press (Dumbbell)',
        bodyPart: 'Shoulders',
        sets: 3,
        reps: '12',
        rest: '2:00',
        notes: '',
        previousWeight: 12,
        previousReps: 12
      },
      {
        id: 5,
        exerciseId: 5,
        name: 'Reverse Fly (Dumbbell)',
        bodyPart: 'Shoulders',
        sets: 4,
        reps: '15',
        rest: '1:30',
        notes: 'Foco no posterior deltoid',
        previousWeight: 5,
        previousReps: 15
      }
    ],
    tags: ['Upper Body', 'Push', 'Shoulders'],
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2023-10-22T14:30:00Z',
    lastUsed: '2023-10-22T14:30:00Z',
    timesUsed: 8,
    estimatedDuration: 45, // minutos
    difficulty: 'intermediate'
  },
  {
    id: 2,
    name: 'Pernas',
    description: 'Treino de pernas completo - quadríceps, glúteos e posteriores',
    exercises: [
      {
        id: 1,
        exerciseId: 8,
        name: 'Squat (Barbell)',
        bodyPart: 'Legs',
        sets: 4,
        reps: '10-12',
        rest: '3:00',
        notes: 'Aquecimento importante',
        previousWeight: 60,
        previousReps: 12
      },
      {
        id: 2,
        exerciseId: 9,
        name: 'Leg Press',
        bodyPart: 'Legs',
        sets: 3,
        reps: '15',
        rest: '2:30',
        notes: '',
        previousWeight: 120,
        previousReps: 15
      },
      {
        id: 3,
        exerciseId: 10,
        name: 'Lunge (Bodyweight)',
        bodyPart: 'Legs',
        sets: 3,
        reps: '12 cada',
        rest: '2:00',
        notes: 'Alternado',
        previousWeight: 0,
        previousReps: 12
      },
      {
        id: 4,
        exerciseId: 11,
        name: 'Seated Leg Curl (Machine)',
        bodyPart: 'Legs',
        sets: 3,
        reps: '15',
        rest: '2:00',
        notes: 'Contração no topo',
        previousWeight: 40,
        previousReps: 15
      },
      {
        id: 5,
        exerciseId: 13,
        name: 'Leg Extension (Machine)',
        bodyPart: 'Legs',
        sets: 3,
        reps: '15',
        rest: '2:00',
        notes: 'Último exercício - dar tudo',
        previousWeight: 35,
        previousReps: 15
      }
    ],
    tags: ['Lower Body', 'Legs', 'Strength'],
    createdAt: '2023-10-10T09:00:00Z',
    updatedAt: '2023-10-20T16:00:00Z',
    lastUsed: '2023-10-20T16:00:00Z',
    timesUsed: 12,
    estimatedDuration: 60,
    difficulty: 'advanced'
  },
  // Adicionar mais templates conforme necessário...
];

/**
 * Função auxiliar para obter template por ID
 */
export const getTemplateById = (id) => {
  return mockTemplates.find(template => template.id === id);
};

/**
 * Função auxiliar para clonar um template
 */
export const cloneTemplate = (template) => {
  return {
    ...template,
    id: Date.now(), // Novo ID
    name: `${template.name} (Cópia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUsed: null,
    timesUsed: 0
  };
};