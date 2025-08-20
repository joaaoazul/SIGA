// src/modules/trainer/pages/Workouts/views/AthleteProgressView.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, TrendingUp, Target, Dumbbell, Clock, Activity,
  Download, ChevronLeft, ChevronRight, User, BarChart3,
  Award, Zap, ArrowUp, ArrowDown, Filter, Search
} from 'lucide-react';

// Configuração Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AthleteProgressView = () => {
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState([]);
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState('all');

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthlete) {
      fetchProgressData(selectedAthlete.id);
      fetchExerciseProgress(selectedAthlete.id);
    }
  }, [selectedAthlete, dateRange, selectedExercise]);

  const fetchAthletes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .eq('trainer_id', user.id)
        .order('name');
      
      if (error) throw error;
      setAthletes(data || []);
      if (data && data.length > 0) {
        setSelectedAthlete(data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async (athleteId) => {
    try {
      const startDate = getStartDate(dateRange);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          session_exercises (
            *,
            exercise:exercises (name, primary_muscle)
          )
        `)
        .eq('athlete_id', athleteId)
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Processar dados para gráficos e métricas
      const processed = processProgressData(data || []);
      setProgressData(processed);
    } catch (error) {
      console.error('Erro ao buscar dados de progresso:', error);
    }
  };

  const fetchExerciseProgress = async (athleteId) => {
    try {
      const startDate = getStartDate(dateRange);
      
      let query = supabase
        .from('session_exercises')
        .select(`
          *,
          exercise:exercises (name, primary_muscle),
          session:workout_sessions!inner (
            date,
            athlete_id
          )
        `)
        .eq('session.athlete_id', athleteId)
        .gte('session.date', startDate)
        .order('session.date', { ascending: false });

      if (selectedExercise !== 'all') {
        query = query.eq('exercise_id', selectedExercise);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Agrupar por exercício e calcular progresso
      const grouped = groupExerciseProgress(data || []);
      setExerciseProgress(grouped);
    } catch (error) {
      console.error('Erro ao buscar progresso de exercícios:', error);
    }
  };

  const getStartDate = (range) => {
    const now = new Date();
    switch(range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  const processProgressData = (sessions) => {
    if (!sessions || sessions.length === 0) {
      return {
        sessions: [],
        totalVolume: 0,
        avgDuration: 0,
        totalSessions: 0,
        completionRate: 0,
        weeklyFrequency: 0,
        personalRecords: 0,
        volumeProgress: 0
      };
    }

    // Calcular volume total
    const totalVolume = sessions.reduce((acc, session) => {
      const sessionVolume = session.session_exercises?.reduce((vol, ex) => {
        const exerciseVolume = (ex.weight || 0) * (ex.reps || 0) * (ex.sets_completed || 1);
        return vol + exerciseVolume;
      }, 0) || 0;
      return acc + sessionVolume;
    }, 0);

    // Calcular duração média
    const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
    
    // Taxa de conclusão
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const completionRate = sessions.length > 0 ? (completedSessions / sessions.length * 100) : 0;

    // Frequência semanal
    const weeks = Math.ceil((new Date() - new Date(getStartDate(dateRange))) / (7 * 24 * 60 * 60 * 1000));
    const weeklyFrequency = weeks > 0 ? (sessions.length / weeks).toFixed(1) : 0;

    // Calcular PRs (Personal Records)
    const personalRecords = calculatePersonalRecords(sessions);

    // Progresso do volume (comparação com período anterior)
    const volumeProgress = calculateVolumeProgress(sessions);

    return {
      sessions,
      totalVolume,
      avgDuration,
      totalSessions: sessions.length,
      completionRate,
      weeklyFrequency,
      personalRecords,
      volumeProgress
    };
  };

  const calculatePersonalRecords = (sessions) => {
    const maxWeights = {};
    let prCount = 0;

    sessions.forEach(session => {
      session.session_exercises?.forEach(ex => {
        const exerciseId = ex.exercise_id;
        if (!maxWeights[exerciseId] || ex.weight > maxWeights[exerciseId]) {
          if (maxWeights[exerciseId]) prCount++;
          maxWeights[exerciseId] = ex.weight;
        }
      });
    });

    return prCount;
  };

  const calculateVolumeProgress = (sessions) => {
    if (sessions.length < 2) return 0;
    
    const recentSessions = sessions.slice(-5);
    const olderSessions = sessions.slice(0, 5);
    
    const recentVolume = recentSessions.reduce((acc, s) => {
      return acc + (s.session_exercises?.reduce((v, e) => 
        v + (e.weight * e.reps * (e.sets_completed || 1)), 0) || 0);
    }, 0) / recentSessions.length;
    
    const olderVolume = olderSessions.reduce((acc, s) => {
      return acc + (s.session_exercises?.reduce((v, e) => 
        v + (e.weight * e.reps * (e.sets_completed || 1)), 0) || 0);
    }, 0) / olderSessions.length;
    
    return olderVolume > 0 ? ((recentVolume - olderVolume) / olderVolume * 100) : 0;
  };

  const groupExerciseProgress = (data) => {
    const grouped = {};
    
    data.forEach(item => {
      const exerciseName = item.exercise?.name;
      if (!exerciseName) return;
      
      if (!grouped[exerciseName]) {
        grouped[exerciseName] = {
          name: exerciseName,
          muscle: item.exercise.primary_muscle,
          sessions: [],
          maxWeight: 0,
          totalVolume: 0,
          avgReps: 0,
          lastWeight: 0,
          firstWeight: 0,
          progression: 0
        };
      }
      
      grouped[exerciseName].sessions.push({
        date: item.session.date,
        weight: item.weight,
        reps: item.reps,
        sets: item.sets_completed || 1,
        volume: item.weight * item.reps * (item.sets_completed || 1)
      });
      
      grouped[exerciseName].totalVolume += item.weight * item.reps * (item.sets_completed || 1);
      grouped[exerciseName].maxWeight = Math.max(grouped[exerciseName].maxWeight, item.weight);
    });
    
    // Calcular progressão e médias
    Object.values(grouped).forEach(ex => {
      ex.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (ex.sessions.length > 0) {
        ex.firstWeight = ex.sessions[0].weight;
        ex.lastWeight = ex.sessions[ex.sessions.length - 1].weight;
        ex.progression = ex.firstWeight > 0 
          ? ((ex.lastWeight - ex.firstWeight) / ex.firstWeight * 100)
          : 0;
        
        const totalReps = ex.sessions.reduce((acc, s) => acc + s.reps, 0);
        ex.avgReps = Math.round(totalReps / ex.sessions.length);
      }
    });
    
    return Object.values(grouped).sort((a, b) => b.totalVolume - a.totalVolume);
  };

  const exportData = async () => {
    if (!progressData || !selectedAthlete) return;
    
    try {
      // Preparar dados para CSV
      const csvData = progressData.sessions.map(session => ({
        Data: new Date(session.date).toLocaleDateString('pt-PT'),
        Treino: session.workout_name || 'N/A',
        Duração: `${session.duration} min`,
        Status: session.status,
        Exercícios: session.session_exercises?.length || 0,
        Volume: session.session_exercises?.reduce((v, e) => 
          v + (e.weight * e.reps * (e.sets_completed || 1)), 0) || 0
      }));
      
      // Converter para CSV
      const csv = convertToCSV(csvData);
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `progresso_${selectedAthlete.name}_${dateRange}.csv`;
      a.click();
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Progressão do Atleta</h1>
        <p className="text-gray-600 mt-1">Acompanhe a evolução detalhada dos seus atletas</p>
      </div>

      {/* Seleção de Atleta e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Seletor de Atleta */}
            <select
              value={selectedAthlete?.id || ''}
              onChange={(e) => {
                const athlete = athletes.find(a => a.id === e.target.value);
                setSelectedAthlete(athlete);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um atleta</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
            
            {/* Filtro de Período */}
            <div className="flex gap-2">
              {['week', 'month', 'quarter', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'week' ? 'Semana' : 
                   range === 'month' ? 'Mês' : 
                   range === 'quarter' ? 'Trimestre' : 'Ano'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Botão Exportar */}
          <button 
            onClick={exportData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      {progressData && selectedAthlete && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total de Sessões */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium text-green-600">
                  {progressData.weeklyFrequency} por semana
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {progressData.totalSessions}
              </div>
              <div className="text-sm text-gray-600">Sessões Totais</div>
            </div>
            
            {/* Taxa de Conclusão */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-gray-400" />
                <span className={`text-xs font-medium ${
                  progressData.completionRate >= 90 ? 'text-green-600' : 
                  progressData.completionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {progressData.completionRate >= 90 ? 'Excelente' : 
                   progressData.completionRate >= 70 ? 'Bom' : 'Melhorar'}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {progressData.completionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Taxa Conclusão</div>
            </div>
            
            {/* Volume Total */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Dumbbell className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-1">
                  {progressData.volumeProgress > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : progressData.volumeProgress < 0 ? (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  ) : null}
                  <span className={`text-xs font-medium ${
                    progressData.volumeProgress > 0 ? 'text-green-600' : 
                    progressData.volumeProgress < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {progressData.volumeProgress > 0 ? '+' : ''}
                    {progressData.volumeProgress.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(progressData.totalVolume / 1000).toFixed(1)}t
              </div>
              <div className="text-sm text-gray-600">Volume Total</div>
            </div>
            
            {/* Personal Records */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-gray-400" />
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {progressData.personalRecords}
              </div>
              <div className="text-sm text-gray-600">Recordes Pessoais</div>
            </div>
          </div>

          {/* Gráfico de Volume */}
          <VolumeChart sessions={progressData.sessions} />

          {/* Tabela de Progresso por Exercício */}
          <ExerciseProgressTable 
            exercises={exerciseProgress}
            onExerciseSelect={setSelectedExercise}
            selectedExercise={selectedExercise}
          />
        </>
      )}
    </div>
  );
};

// Componente Gráfico de Volume
const VolumeChart = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Volume</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Sem dados para exibir
        </div>
      </div>
    );
  }

  // Calcular máximo para escala
  const maxVolume = Math.max(...sessions.map(s => 
    s.session_exercises?.reduce((v, e) => 
      v + (e.weight * e.reps * (e.sets_completed || 1)), 0) || 0
  ));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Volume de Treino</h3>
      
      <div className="h-64 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-gray-100"></div>
          ))}
        </div>
        
        {/* Bars */}
        <div className="relative h-full flex items-end justify-between gap-2">
          {sessions.map((session, idx) => {
            const sessionVolume = session.session_exercises?.reduce((vol, ex) => {
              return vol + (ex.weight * ex.reps * (ex.sets_completed || 1));
            }, 0) || 0;
            const height = maxVolume > 0 ? (sessionVolume / maxVolume) * 100 : 0;
            
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div className="hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 absolute -top-8 z-10">
                  {(sessionVolume / 1000).toFixed(1)}kg
                </div>
                <div 
                  className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${new Date(session.date).toLocaleDateString('pt-PT')}: ${(sessionVolume / 1000).toFixed(1)}kg`}
                ></div>
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          {sessions.length <= 7 && sessions.map((session, idx) => (
            <div key={idx} className="flex-1 text-center">
              {new Date(session.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tabela de Progresso por Exercício
const ExerciseProgressTable = ({ exercises, onExerciseSelect, selectedExercise }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Progresso por Exercício</h3>
          <select
            value={selectedExercise}
            onChange={(e) => onExerciseSelect(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todos os exercícios</option>
            {exercises.map(ex => (
              <option key={ex.name} value={ex.exercise_id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exercício
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Músculo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessões
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peso Inicial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peso Atual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Máximo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progressão
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exercises.map((exercise, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900">{exercise.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {exercise.muscle}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {exercise.sessions.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {exercise.firstWeight}kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  {exercise.lastWeight}kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {exercise.maxWeight}kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {(exercise.totalVolume / 1000).toFixed(1)}t
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {exercise.progression > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : exercise.progression < 0 ? (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <span className="w-4 h-4"></span>
                    )}
                    <span className={`font-medium ${
                      exercise.progression > 0 ? 'text-green-600' : 
                      exercise.progression < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {exercise.progression > 0 ? '+' : ''}{exercise.progression.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AthleteProgressView;