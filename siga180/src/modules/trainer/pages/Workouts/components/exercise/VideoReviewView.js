// src/modules/trainer/pages/Workouts/views/VideoReviewView.js
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Video, User, Calendar, X, Check, AlertCircle, Play, Pause,
  Volume2, VolumeX, Maximize2, RotateCcw, MessageSquare,
  Clock, Filter, Search, Download, ChevronLeft, ChevronRight,
  Star, ThumbsUp, ThumbsDown, Eye
} from 'lucide-react';

// Configuração Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const VideoReviewView = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState('all');
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    fetchAthletes();
    fetchVideos();
  }, [filter, selectedAthlete]);

  const fetchAthletes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('athletes')
        .select('id, name')
        .eq('trainer_id', user.id)
        .order('name');
      
      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('athlete_videos')
        .select(`
          *,
          athlete:athletes!inner (
            id,
            name,
            avatar_url,
            trainer_id
          ),
          exercise:exercises (name, primary_muscle),
          session:workout_sessions (
            date,
            workout_name
          )
        `)
        .eq('athlete.trainer_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('review_status', filter);
      }

      if (selectedAthlete !== 'all') {
        query = query.eq('athlete_id', selectedAthlete);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setVideos(data || []);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVideoStatus = async (videoId, status, feedback = '') => {
    try {
      const { error } = await supabase
        .from('athlete_videos')
        .update({ 
          review_status: status,
          trainer_feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user.id
        })
        .eq('id', videoId);

      if (error) throw error;
      
      // Enviar notificação ao atleta
      await sendNotification(videoId, status, feedback);
      
      // Atualizar lista
      fetchVideos();
      setSelectedVideo(null);
      
      alert(`Vídeo ${status === 'approved' ? 'aprovado' : 'marcado para correção'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      alert('Erro ao atualizar status do vídeo');
    }
  };

  const sendNotification = async (videoId, status, feedback) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      await supabase
        .from('notifications')
        .insert({
          user_id: video.athlete_id,
          type: 'video_review',
          title: status === 'approved' ? 'Vídeo Aprovado!' : 'Correção Necessária',
          message: feedback || 'Seu vídeo foi revisado pelo trainer.',
          data: { video_id: videoId, status }
        });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchTerm === '' || 
      video.exercise?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.athlete?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'needs_correction': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'needs_correction': return 'Correção';
      default: return status;
    }
  };

  const stats = {
    total: videos.length,
    pending: videos.filter(v => v.review_status === 'pending').length,
    approved: videos.filter(v => v.review_status === 'approved').length,
    corrections: videos.filter(v => v.review_status === 'needs_correction').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revisão de Vídeos</h1>
        <p className="text-gray-600 mt-1">Analise a execução dos exercícios dos seus atletas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Vídeos</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-yellow-600">Aguardando</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pendentes</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-600">Completo</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
          <div className="text-sm text-gray-600">Aprovados</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-600">Atenção</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.corrections}</div>
          <div className="text-sm text-gray-600">Correções</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'pending', label: 'Pendentes' },
              { value: 'approved', label: 'Aprovados' },
              { value: 'needs_correction', label: 'Correções' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Athlete Filter */}
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os atletas</option>
            {athletes.map(athlete => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Vídeos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo encontrado</h3>
          <p className="text-gray-500">
            {filter === 'pending' 
              ? 'Não há vídeos pendentes de revisão' 
              : 'Ajuste os filtros para ver mais resultados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map(video => (
            <VideoCard 
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      )}

      {/* Modal de Revisão */}
      {selectedVideo && (
        <VideoReviewModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onUpdateStatus={updateVideoStatus}
        />
      )}
    </div>
  );
};

// Card de Vídeo
const VideoCard = ({ video, onClick }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'needs_correction': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="aspect-video bg-gray-200 relative">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.exercise?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.review_status)}`}>
            {video.review_status === 'pending' ? 'Pendente' :
             video.review_status === 'approved' ? 'Aprovado' :
             video.review_status === 'needs_correction' ? 'Correção' : ''}
          </span>
        </div>
        
        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {formatDuration(video.duration)}
          </div>
        )}
        
        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 rounded-full p-3">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{video.exercise?.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <User className="w-4 h-4" />
          <span>{video.athlete?.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(video.created_at).toLocaleDateString('pt-PT')}</span>
          </div>
          {video.session?.workout_name && (
            <span className="truncate">{video.session.workout_name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal de Revisão de Vídeo
const VideoReviewModal = ({ video, onClose, onUpdateStatus }) => {
  const [feedback, setFeedback] = useState(video.trainer_feedback || '');
  const [markers, setMarkers] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const handleApprove = () => {
    if (!feedback && !window.confirm('Aprovar sem adicionar feedback?')) return;
    onUpdateStatus(video.id, 'approved', feedback);
  };
  
  const handleRequestCorrection = () => {
    if (!feedback) {
      alert('Por favor, adicione feedback explicando as correções necessárias.');
      return;
    }
    onUpdateStatus(video.id, 'needs_correction', feedback);
  };
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const addMarker = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const newMarker = {
        id: Date.now(),
        time,
        note: ''
      };
      setMarkers([...markers, newMarker]);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{video.exercise?.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {video.athlete?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.created_at).toLocaleDateString('pt-PT')}
                </span>
                {video.session?.workout_name && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.session.workout_name}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Video Player */}
          <div className="flex-1">
            <div className="bg-black rounded-lg overflow-hidden h-full flex flex-col">
              <video 
                ref={videoRef}
                className="flex-1 w-full"
                src={video.video_url}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Video Controls */}
              <div className="bg-gray-900 p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(video.duration || 0)}
                    </div>
                  </div>
                  
                  <button
                    onClick={addMarker}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Adicionar Marcação
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-96 flex flex-col gap-4">
            {/* Exercise Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Informações do Exercício</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Músculo:</dt>
                  <dd className="font-medium">{video.exercise?.primary_muscle}</dd>
                </div>
                {video.sets && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Séries:</dt>
                    <dd className="font-medium">{video.sets}</dd>
                  </div>
                )}
                {video.reps && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Repetições:</dt>
                    <dd className="font-medium">{video.reps}</dd>
                  </div>
                )}
                {video.weight && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Peso:</dt>
                    <dd className="font-medium">{video.weight}kg</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Markers */}
            {markers.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Marcações</h3>
                <div className="space-y-2">
                  {markers.map(marker => (
                    <div key={marker.id} className="flex items-center gap-2 text-sm">
                      <span className="text-blue-600 font-medium">
                        {formatTime(marker.time)}
                      </span>
                      <input
                        type="text"
                        placeholder="Adicionar nota..."
                        value={marker.note}
                        onChange={(e) => {
                          const updated = markers.map(m => 
                            m.id === marker.id ? {...m, note: e.target.value} : m
                          );
                          setMarkers(updated);
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes from Athlete */}
            {video.athlete_notes && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Notas do Atleta</h3>
                <p className="text-sm text-blue-800">{video.athlete_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback para o Atleta
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Adicione observações sobre a execução, pontos positivos e correções necessárias..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Quick Feedback Templates */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Feedback rápido:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Excelente execução! 👏',
                'Manter as costas retas',
                'Controlar mais a descida',
                'Amplitude de movimento completa',
                'Cuidado com a postura dos joelhos'
              ].map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeedback(prev => prev + (prev ? '\n' : '') + template)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Aprovar Execução
            </button>
            <button
              onClick={handleRequestCorrection}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Solicitar Correção
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility Functions
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VideoReviewView;