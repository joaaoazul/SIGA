// src/modules/trainer/pages/Workouts/views/SessionDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowLeft, User, Calendar, Clock, Activity, Dumbbell,
  Check, X, AlertCircle, MessageSquare, Video, Camera,
  TrendingUp, Target, Award, Edit, Trash2, Download,
  ChevronDown, ChevronUp, MoreVertical, Star, ThumbsUp
} from 'lucide-react';

// Configuração Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SessionDetailView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [athleteNotes, setAthleteNotes] = useState('');
  const [trainerNotes, setTrainerNotes] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      // Buscar detalhes da sessão
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          athlete:athletes (
            id,
            name,
            email,
            avatar_url
          ),
          workout:workouts (
            name,
            description,
            type
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      
      setSession(sessionData);
      setAthlete(sessionData.athlete);
      setAthleteNotes(sessionData.athlete_notes || '');
      setTrainerNotes(sessionData.trainer_notes || '');

      // Buscar exercícios da sessão
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('session_exercises')
        .select(`
          *,
          exercise:exercises (
            name,
            primary_muscle,
            equipment,
            instructions
          ),
          sets:session_sets (
            *
          )
        `)
        .eq('session_id', sessionId)
        .order('order_in_workout');

      if (exercisesError) throw exercisesError;
      
      setExercises(exercisesData || []);

      // Buscar vídeos da sessão
      const { data: videosData, error: videosError } = await supabase
        .from('athlete_videos')
        .select('*')
        .eq('session_id', sessionId);

      if (videosError) throw videosError;
      
      setVideos(videosData || []);

    } catch (error) {
      console.error('Erro ao buscar detalhes da sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSessionMetrics = () => {
    if (!exercises || exercises.length === 0) {
      return {
        totalVolume: 0,
        totalSets: 0,
        completedSets: 0,
        avgRPE: 0,
        completionRate: 0,
        duration: session?.duration || 0
      };
    }

    let totalVolume = 0;
    let totalSets = 0;
    let completedSets = 0;
    let totalRPE = 0;
    let rpeCount = 0;

    exercises.forEach(exercise => {
      exercise.sets?.forEach(set => {
        totalSets++;
        if (set.completed) {
          completedSets++;
          const volume = (set.weight || 0) * (set.reps || 0);
          totalVolume += volume;
          
          if (set.rpe) {
            totalRPE += set.rpe;
            rpeCount++;
          }
        }
      });
    });

    return {
      totalVolume,
      totalSets,
      completedSets,
      avgRPE: rpeCount > 0 ? (totalRPE / rpeCount).toFixed(1) : 0,
      completionRate: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
      duration: session?.duration || 0
    };
  };

  const updateSessionStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      setSession(prev => ({ ...prev, status: newStatus }));
      alert(`Sessão marcada como ${newStatus === 'completed' ? 'concluída' : newStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const saveNotes = async () => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ 
          trainer_notes: trainerNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      alert('Notas guardadas com sucesso!');
    } catch (error) {
      console.error('Erro ao guardar notas:', error);
    }
  };

  const deleteSession = async () => {
    if (!window.confirm('Tem certeza que deseja eliminar esta sessão? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      alert('Sessão eliminada com sucesso!');
      navigate('/workouts/calendar');
    } catch (error) {
      console.error('Erro ao eliminar sessão:', error);
      alert('Erro ao eliminar sessão');
    }
  };

  const exportSession = () => {
    const metrics = calculateSessionMetrics();
    
    // Preparar dados para export
    const exportData = {
      session: {
        date: new Date(session.date).toLocaleDateString('pt-PT'),
        athlete: athlete?.name,
        workout: session.workout?.name,
        duration: `${metrics.duration} minutos`,
        status: session.status,
        volume: `${(metrics.totalVolume / 1000).toFixed(1)}kg`,
        completionRate: `${metrics.completionRate}%`,
        avgRPE: metrics.avgRPE
      },
      exercises: exercises.map(ex => ({
        exercise: ex.exercise?.name,
        sets: ex.sets?.map(set => ({
          set: set.set_number,
          weight: `${set.weight}kg`,
          reps: set.reps,
          rpe: set.rpe || '-',
          completed: set.completed ? 'Sim' : 'Não'
        }))
      })),
      notes: {
        athlete: athleteNotes,
        trainer: trainerNotes
      }
    };

    // Converter para JSON e fazer download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sessao_${session.id}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Progresso';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">Sessão não encontrada</p>
          </div>
          <button
            onClick={() => navigate('/workouts/calendar')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar ao Calendário
          </button>
        </div>
      </div>
    );
  }

  const metrics = calculateSessionMetrics();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {session.workout?.name || 'Sessão de Treino'}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {athlete?.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(session.date).toLocaleDateString('pt-PT')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {session.start_time || '10:00'} - {session.end_time || '11:30'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
              {getStatusLabel(session.status)}
            </span>
            
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => navigate(`/workouts/session/${sessionId}/edit`)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={exportSession}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button
                  onClick={deleteSession}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas da Sessão */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</div>
          <div className="text-sm text-gray-600">Conclusão</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <Dumbbell className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(metrics.totalVolume / 1000).toFixed(1)}t
          </div>
          <div className="text-sm text-gray-600">Volume</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{exercises.length}</div>
          <div className="text-sm text-gray-600">Exercícios</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <Check className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.completedSets}/{metrics.totalSets}
          </div>
          <div className="text-sm text-gray-600">Séries</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.avgRPE}</div>
          <div className="text-sm text-gray-600">RPE Médio</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.duration}min</div>
          <div className="text-sm text-gray-600">Duração</div>
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Exercícios Realizados</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {exercises.map((exercise, idx) => (
            <ExerciseDetail
              key={exercise.id}
              exercise={exercise}
              index={idx}
              expanded={expandedExercise === idx}
              onToggle={() => setExpandedExercise(expandedExercise === idx ? null : idx)}
            />
          ))}
        </div>
      </div>

      {/* Vídeos */}
      {videos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vídeos da Sessão</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videos.map(video => (
                <div key={video.id} className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/workouts/videos/${video.id}`)}
                      className="p-2 bg-white rounded-full"
                    >
                      <Camera className="w-5 h-5 text-gray-900" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Notas e Observações</h2>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {showNotes && (
          <div className="p-6 space-y-4">
            {/* Notas do Atleta */}
            {athleteNotes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notas do Atleta</h3>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">{athleteNotes}</p>
                </div>
              </div>
            )}
            
            {/* Notas do Trainer */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Notas do Trainer</h3>
              <textarea
                value={trainerNotes}
                onChange={(e) => setTrainerNotes(e.target.value)}
                placeholder="Adicione observações sobre a sessão..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <button
                onClick={saveNotes}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar Notas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ações */}
      {session.status === 'scheduled' && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => updateSessionStatus('completed')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Marcar como Concluída
          </button>
          <button
            onClick={() => updateSessionStatus('cancelled')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar Sessão
          </button>
        </div>
      )}
    </div>
  );
};

// Componente de Detalhe do Exercício
const ExerciseDetail = ({ exercise, index, expanded, onToggle }) => {
  const calculateExerciseMetrics = () => {
    let totalVolume = 0;
    let completedSets = 0;
    let maxWeight = 0;
    
    exercise.sets?.forEach(set => {
      if (set.completed) {
        completedSets++;
        const volume = (set.weight || 0) * (set.reps || 0);
        totalVolume += volume;
        maxWeight = Math.max(maxWeight, set.weight || 0);
      }
    });
    
    return {
      totalVolume,
      completedSets,
      totalSets: exercise.sets?.length || 0,
      maxWeight
    };
  };
  
  const metrics = calculateExerciseMetrics();
  
  return (
    <div className="hover:bg-gray-50 transition-colors">
      <div 
        className="p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{exercise.exercise?.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{exercise.exercise?.primary_muscle}</span>
                {exercise.exercise?.equipment && (
                  <>
                    <span>•</span>
                    <span>{exercise.exercise?.equipment}</span>
                  </>
                )}
                <span>•</span>
                <span>{metrics.completedSets}/{metrics.totalSets} séries</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {(metrics.totalVolume / 1000).toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600">Volume</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Tabela de Séries */}
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left pb-2">Série</th>
                  <th className="text-left pb-2">Peso</th>
                  <th className="text-left pb-2">Reps</th>
                  <th className="text-left pb-2">RPE</th>
                  <th className="text-left pb-2">Volume</th>
                  <th className="text-center pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exercise.sets?.map((set, setIdx) => (
                  <tr key={set.id} className="text-sm">
                    <td className="py-2 font-medium">{setIdx + 1}</td>
                    <td className="py-2">{set.weight || 0}kg</td>
                    <td className="py-2">{set.reps || 0}</td>
                    <td className="py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                        set.rpe >= 9 ? 'bg-red-100 text-red-700' :
                        set.rpe >= 7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {set.rpe || '-'}
                      </span>
                    </td>
                    <td className="py-2">{((set.weight || 0) * (set.reps || 0))}kg</td>
                    <td className="py-2 text-center">
                      {set.completed ? (
                        <Check className="w-4 h-4 text-green-600 inline" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Notas do Exercício */}
            {exercise.notes && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  {exercise.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetailView;