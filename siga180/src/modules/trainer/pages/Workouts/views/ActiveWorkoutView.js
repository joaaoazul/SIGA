import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  Check,
  Plus,
  Minus,
  Clock,
  Dumbbell,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Edit2,
  RotateCcw,
  Flag
} from 'lucide-react';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { useAuth } from '../../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const ActiveWorkout = ({ template, athleteId, onEndWorkout }) => {
  const { user } = useAuth();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [workoutData, setWorkoutData] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [exerciseNotes, setExerciseNotes] = useState('');
  const [sessionId, setSessionId] = useState(null);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  // Inicializar dados do treino
  useEffect(() => {
    if (template) {
      initializeWorkout();
    } else {
      // Treino livre
      initializeFreeWorkout();
    }

    // Iniciar timer geral
    setIsTimerRunning(true);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [template]);

  // Timer do treino
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning]);

  // Timer de descanso
  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            playSound('rest-end');
            return 0;
          }
          if (prev === 10) playSound('countdown');
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }
    
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [isResting, restTimer]);

  const initializeWorkout = async () => {
    // Criar sessão no banco
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          workout_template_id: template.id,
          athlete_id: athleteId || user.id,
          scheduled_date: new Date().toISOString().split('T')[0],
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(session.id);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }

    // Estruturar dados do treino
    const workoutStructure = template.exercises.map(exercise => ({
      ...exercise,
      completedSets: exercise.sets.map(set => ({
        ...set,
        completed: false,
        actualReps: set.reps,
        actualWeight: set.weight,
        rpe: null
      }))
    }));
    
    setWorkoutData(workoutStructure);
  };

  const initializeFreeWorkout = () => {
    // Estrutura básica para treino livre
    setWorkoutData([]);
    // Permitir adicionar exercícios on-the-fly
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    
    // Implementar sons diferentes
    const audio = new Audio();
    switch(type) {
      case 'rest-end':
        audio.src = '/sounds/bell.mp3';
        break;
      case 'countdown':
        audio.src = '/sounds/beep.mp3';
        break;
      case 'complete':
        audio.src = '/sounds/success.mp3';
        break;
      default:
        return;
    }
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const currentExercise = workoutData[currentExerciseIndex];
  const currentSet = currentExercise?.completedSets[currentSetIndex];
  const totalExercises = workoutData.length;
  const completedExercises = workoutData.filter(ex => 
    ex.completedSets.every(set => set.completed)
  ).length;

  const handleCompleteSet = async () => {
    if (!currentExercise || !currentSet) return;

    // Marcar set como completo
    const updatedWorkoutData = [...workoutData];
    updatedWorkoutData[currentExerciseIndex].completedSets[currentSetIndex].completed = true;
    setWorkoutData(updatedWorkoutData);

    // Guardar no banco
    if (sessionId) {
      try {
        await supabase
          .from('performed_sets')
          .insert({
            session_exercise_id: currentExercise.id,
            set_number: currentSetIndex + 1,
            reps: currentSet.actualReps,
            weight: currentSet.actualWeight,
            rpe: currentSet.rpe,
            completed: true,
            completed_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Erro ao guardar set:', error);
      }
    }

    // Iniciar descanso
    if (currentSet.rest) {
      setRestTimer(currentSet.rest);
      setIsResting(true);
    }

    // Avançar para próximo set ou exercício
    if (currentSetIndex < currentExercise.completedSets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < workoutData.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      toast.success('Exercício completo! 💪');
    } else {
      // Treino completo
      handleFinishWorkout();
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSetIndex(0);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutData.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    }
  };

  const updateSetValue = (field, value) => {
    const updatedWorkoutData = [...workoutData];
    updatedWorkoutData[currentExerciseIndex].completedSets[currentSetIndex][field] = value;
    setWorkoutData(updatedWorkoutData);
  };

  const handleFinishWorkout = async () => {
    setIsTimerRunning(false);
    
    // Calcular estatísticas
    const totalVolume = workoutData.reduce((total, exercise) => {
      return total + exercise.completedSets.reduce((exTotal, set) => {
        if (set.completed && set.actualWeight && set.actualReps) {
          return exTotal + (set.actualWeight * set.actualReps);
        }
        return exTotal;
      }, 0);
    }, 0);

    const totalSets = workoutData.reduce((total, exercise) => {
      return total + exercise.completedSets.filter(set => set.completed).length;
    }, 0);

    // Atualizar sessão no banco
    if (sessionId) {
      try {
        await supabase
          .from('workout_sessions')
          .update({
            completed_at: new Date().toISOString(),
            status: 'completed',
            total_volume_load: totalVolume,
            notes: exerciseNotes
          })
          .eq('id', sessionId);
      } catch (error) {
        console.error('Erro ao finalizar sessão:', error);
      }
    }

    playSound('complete');
    toast.success('Treino completo! Excelente trabalho! 🎉');
    
    // Mostrar resumo
    if (onEndWorkout) {
      onEndWorkout({
        duration: timer,
        totalVolume,
        totalSets,
        exercises: completedExercises
      });
    }
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum exercício disponível</p>
          <button
            onClick={onEndWorkout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Fixo */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja sair do treino?')) {
                    onEndWorkout();
                  }
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm text-gray-400">Tempo Total</p>
                <p className="text-xl font-bold font-mono">{formatTime(timer)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isTimerRunning ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer de Descanso (Overlay) */}
      {isResting && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-2xl mb-4">Descanso</p>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * ((currentSet?.rest - restTimer) / currentSet?.rest))}
                  className="text-blue-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold font-mono">{restTimer}</span>
              </div>
            </div>
            <button
              onClick={handleSkipRest}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Pular Descanso
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Info do Exercício */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Exercício {currentExerciseIndex + 1} de {totalExercises}
              </p>
              <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
              {currentExercise.primary_muscle && (
                <p className="text-sm text-gray-400 mt-1">
                  {currentExercise.primary_muscle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousExercise}
                disabled={currentExerciseIndex === 0}
                className="p-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextExercise}
                disabled={currentExerciseIndex === workoutData.length - 1}
                className="p-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sets Progress */}
          <div className="flex gap-2 mb-6">
            {currentExercise.completedSets.map((set, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all ${
                  set.completed 
                    ? 'bg-green-500' 
                    : index === currentSetIndex 
                      ? 'bg-blue-500' 
                      : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Set Atual */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400 mb-2">
              Set {currentSetIndex + 1} de {currentExercise.completedSets.length}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Repetições */}
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">Repetições</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => updateSetValue('actualReps', Math.max(1, (currentSet?.actualReps || 0) - 1))}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-4xl font-bold w-16 text-center">
                    {currentSet?.actualReps || 0}
                  </span>
                  <button
                    onClick={() => updateSetValue('actualReps', (currentSet?.actualReps || 0) + 1)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentSet?.reps && (
                  <p className="text-xs text-gray-500 mt-2">
                    Objetivo: {currentSet.reps}
                  </p>
                )}
              </div>

              {/* Peso */}
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">Peso (kg)</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => updateSetValue('actualWeight', Math.max(0, (currentSet?.actualWeight || 0) - 2.5))}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-4xl font-bold w-20 text-center">
                    {currentSet?.actualWeight || 0}
                  </span>
                  <button
                    onClick={() => updateSetValue('actualWeight', (currentSet?.actualWeight || 0) + 2.5)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentSet?.weight && (
                  <p className="text-xs text-gray-500 mt-2">
                    Objetivo: {currentSet.weight}kg
                  </p>
                )}
              </div>
            </div>

            {/* RPE */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">RPE (Esforço Percebido)</p>
              <div className="flex justify-center gap-2">
                {[6, 7, 8, 9, 10].map(rpe => (
                  <button
                    key={rpe}
                    onClick={() => updateSetValue('rpe', rpe)}
                    className={`w-12 h-12 rounded-lg font-medium transition-all ${
                      currentSet?.rpe === rpe
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {rpe}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão Completar Set */}
          <button
            onClick={handleCompleteSet}
            disabled={!currentSet?.actualReps || currentSet?.actualReps === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Completar Set
          </button>
        </div>

        {/* Notas */}
        <div className="bg-gray-800 rounded-xl p-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium">Notas do Exercício</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${showNotes ? 'rotate-90' : ''}`} />
          </button>
          {showNotes && (
            <textarea
              value={exerciseNotes}
              onChange={(e) => setExerciseNotes(e.target.value)}
              placeholder="Adicionar notas..."
              className="w-full mt-3 p-3 bg-gray-900 rounded-lg text-sm resize-none"
              rows="3"
            />
          )}
        </div>

        {/* Botão Finalizar Treino */}
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que deseja finalizar o treino?')) {
              handleFinishWorkout();
            }
          }}
          className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Flag className="w-5 h-5" />
          Finalizar Treino
        </button>
      </div>
    </div>
  );
};

export default ActiveWorkout;