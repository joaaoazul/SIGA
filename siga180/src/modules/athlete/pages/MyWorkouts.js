// src/modules/athlete/pages/MyWorkouts.js
import React, { useState } from 'react';
import Layout from '../../shared/components/layout/Layout';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Target,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MyWorkouts = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  const [currentPlan] = useState({
    name: 'Plano de Hipertrofia',
    duration: '12 semanas',
    week: 4,
    trainer: 'João Silva',
    goal: 'Ganho de massa muscular',
    startDate: '2024-06-15',
    endDate: '2024-09-15'
  });

  const [weeklySchedule] = useState([
    {
      day: 'Segunda',
      date: '29/07',
      workout: 'Peito e Tríceps',
      exercises: 8,
      duration: '60 min',
      status: 'completed',
      muscles: ['Peito', 'Tríceps']
    },
    {
      day: 'Terça',
      date: '30/07',
      workout: 'Costas e Bíceps',
      exercises: 7,
      duration: '55 min',
      status: 'completed',
      muscles: ['Costas', 'Bíceps']
    },
    {
      day: 'Quarta',
      date: '31/07',
      workout: 'Pernas',
      exercises: 9,
      duration: '70 min',
      status: 'upcoming',
      muscles: ['Quadríceps', 'Glúteos', 'Posteriores']
    },
    {
      day: 'Quinta',
      date: '01/08',
      workout: 'Ombros e Abs',
      exercises: 6,
      duration: '45 min',
      status: 'upcoming',
      muscles: ['Ombros', 'Core']
    },
    {
      day: 'Sexta',
      date: '02/08',
      workout: 'Full Body',
      exercises: 10,
      duration: '60 min',
      status: 'upcoming',
      muscles: ['Corpo todo']
    },
    {
      day: 'Sábado',
      date: '03/08',
      workout: 'Cardio HIIT',
      exercises: 5,
      duration: '30 min',
      status: 'upcoming',
      muscles: ['Cardio']
    },
    {
      day: 'Domingo',
      date: '04/08',
      workout: 'Descanso',
      exercises: 0,
      duration: '-',
      status: 'rest',
      muscles: []
    }
  ]);

  const [todayWorkout] = useState({
    name: 'Treino de Pernas',
    warmup: [
      { name: 'Bicicleta', duration: '5 min', intensity: 'Leve' },
      { name: 'Alongamento dinâmico', duration: '5 min', intensity: 'Moderado' }
    ],
    exercises: [
      { 
        name: 'Agachamento Livre', 
        sets: 4, 
        reps: '8-10', 
        rest: '2 min',
        weight: '80kg',
        notes: 'Manter costas retas, descer até paralelo'
      },
      { 
        name: 'Leg Press 45°', 
        sets: 3, 
        reps: '12-15', 
        rest: '90s',
        weight: '200kg',
        notes: 'Pés na largura dos ombros'
      },
      { 
        name: 'Cadeira Extensora', 
        sets: 3, 
        reps: '12-15', 
        rest: '60s',
        weight: '50kg',
        notes: 'Controlar a descida'
      },
      { 
        name: 'Mesa Flexora', 
        sets: 3, 
        reps: '12-15', 
        rest: '60s',
        weight: '40kg',
        notes: 'Não usar impulso'
      },
      { 
        name: 'Elevação Pélvica', 
        sets: 3, 
        reps: '15', 
        rest: '60s',
        weight: '60kg',
        notes: 'Apertar glúteos no topo'
      },
      { 
        name: 'Panturrilha em Pé', 
        sets: 4, 
        reps: '15-20', 
        rest: '45s',
        weight: '80kg',
        notes: 'Amplitude completa'
      }
    ],
    cooldown: [
      { name: 'Alongamento estático', duration: '10 min', focus: 'Pernas completas' }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'missed': return 'text-red-600 bg-red-50';
      case 'rest': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'upcoming': return Clock;
      case 'missed': return XCircle;
      case 'rest': return Calendar;
      default: return AlertCircle;
    }
  };

  return (
    
      <div className="p-6">
        {/* Header com Plano Atual */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentPlan.name}</h1>
              <p className="text-blue-100 mb-4">{currentPlan.goal}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-blue-200">Duração</p>
                  <p className="font-semibold">{currentPlan.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Semana Atual</p>
                  <p className="font-semibold">{currentPlan.week}/12</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Personal Trainer</p>
                  <p className="font-semibold">{currentPlan.trainer}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Progresso</p>
                  <p className="font-semibold">{Math.round((currentPlan.week / 12) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Treino de Hoje
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Histórico
          </button>
        </div>

        {/* Conteúdo baseado na tab */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Treino Detalhado */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{todayWorkout.name}</h2>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Iniciar Treino</span>
                  </button>
                </div>

                {/* Aquecimento */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Aquecimento</h3>
                  <div className="space-y-2">
                    {todayWorkout.warmup.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercícios */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Exercícios</h3>
                  <div className="space-y-3">
                    {todayWorkout.exercises.map((exercise, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                          <span className="text-sm font-medium text-blue-600">{exercise.weight}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{exercise.sets}</span> séries
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{exercise.reps}</span> reps
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{exercise.rest}</span>
                          </div>
                        </div>
                        {exercise.notes && (
                          <p className="text-xs text-gray-500 italic">💡 {exercise.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alongamento */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Alongamento</h3>
                  <div className="space-y-2">
                    {todayWorkout.cooldown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com dicas */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Dicas do Trainer</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Foca na técnica perfeita, especialmente no agachamento
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Se sentires dor no joelho, reduz a carga ou avisa-me
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Últimos Treinos</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Segunda - Peito</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Terça - Costas</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hoje - Pernas</span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'week' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklySchedule.map((day, idx) => {
              const StatusIcon = getStatusIcon(day.status);
              return (
                <div key={idx} className={`bg-white rounded-lg shadow-sm p-6 ${
                  day.status === 'rest' ? 'opacity-75' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{day.day}</h3>
                      <p className="text-sm text-gray-500">{day.date}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${getStatusColor(day.status)}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{day.workout}</h4>
                  
                  {day.status !== 'rest' && (
                    <>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Dumbbell className="w-4 h-4 mr-2" />
                        <span>{day.exercises} exercícios</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{day.duration}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {day.muscles.map((muscle, midx) => (
                          <span key={midx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {day.status === 'upcoming' && (
                    <button className="mt-4 w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <span>Ver detalhes</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    
  );
};

export default MyWorkouts;