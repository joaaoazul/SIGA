import React, { useState, useRef, useEffect } from 'react';
import { 
  Dumbbell, 
  Video, 
  Play, 
  Pause, 
  RotateCcw,
  Clock, 
  Target,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Search,
  Filter,
  BookOpen,
  Camera,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  Info,
  Edit,
  Trash2,
  Copy,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Save,
  Eye,
  Star,
  Youtube,
  Film,
  Link,
  Repeat,
  Activity,
  Timer,
  Weight,
  Hash,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Layers,
  PlusCircle,
  Grid,
  List
} from 'lucide-react';

// ================ COMPONENTE DE VIDEO PLAYER AVANÇADO ================
const AdvancedVideoPlayer = ({ 
  videoUrl, 
  thumbnailUrl, 
  exerciseName,
  videoType = 'upload', // 'youtube', 'upload', 'external'
  angle = 'front',
  onVideoEnd,
  showControls = true,
  autoPlay = false 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderizar YouTube embed
  if (videoType === 'youtube') {
    const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
    
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={exerciseName}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {angle && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-xs font-medium text-white">Vista: {angle}</span>
          </div>
        )}
      </div>
    );
  }

  // Renderizar video player customizado
  return (
    <div 
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnailUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onVideoEnd && onVideoEnd();
        }}
        onClick={togglePlay}
        autoPlay={autoPlay}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Overlay de controles */}
      {showControls && showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity">
          {/* Botão central de play/pause */}
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          {/* Barra de controles inferior */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Barra de progresso */}
            <div 
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-blue-500 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <span className="text-xs font-medium px-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Velocidade de reprodução */}
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="bg-transparent text-xs px-2 py-1 border border-white/30 rounded hover:bg-white/10"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Badge do ângulo */}
          {angle && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
              <span className="text-xs font-medium text-white">Vista: {angle}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ================ BIBLIOTECA DE EXERCÍCIOS COM VÍDEOS ================
const ExerciseLibrary = ({ onSelectExercise, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // Mock de exercícios com vídeos (viria da BD)
  const exercises = [
    {
      id: 1,
      name: 'Supino Reto com Barra',
      category: 'strength',
      primary_muscle: 'chest',
      secondary_muscles: ['triceps', 'shoulders'],
      equipment: 'Barra',
      instructions: 'Deite no banco, segure a barra com pegada na largura dos ombros...',
      videos: [
        { 
          id: 1, 
          video_url: '/videos/bench-press-front.mp4',
          thumbnail_url: '/thumbs/bench-press-front.jpg',
          angle: 'front',
          is_primary: true 
        },
        { 
          id: 2, 
          video_url: '/videos/bench-press-side.mp4',
          thumbnail_url: '/thumbs/bench-press-side.jpg',
          angle: 'side',
          is_primary: false 
        }
      ],
      tips: [
        'Mantenha os pés firmes no chão',
        'Arqueie ligeiramente as costas',
        'Desça a barra até tocar o peito'
      ],
      is_featured: true,
      view_count: 1523
    },
    {
      id: 2,
      name: 'Agachamento Livre',
      category: 'strength',
      primary_muscle: 'quadriceps',
      secondary_muscles: ['glutes', 'hamstrings'],
      equipment: 'Barra',
      instructions: 'Posicione a barra nas costas, afaste os pés na largura dos ombros...',
      videos: [
        { 
          id: 3, 
          video_url: 'https://youtube.com/watch?v=example',
          video_type: 'youtube',
          angle: 'front',
          is_primary: true 
        }
      ],
      tips: [
        'Mantenha o core contraído',
        'Joelhos alinhados com os pés',
        'Desça até as coxas ficarem paralelas ao chão'
      ],
      is_featured: true,
      view_count: 2341
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas', icon: Grid },
    { value: 'strength', label: 'Força', icon: Dumbbell },
    { value: 'cardio', label: 'Cardio', icon: Activity },
    { value: 'flexibility', label: 'Flexibilidade', icon: Repeat }
  ];

  const muscleGroups = [
    { value: 'all', label: 'Todos' },
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'arms', label: 'Braços' },
    { value: 'legs', label: 'Pernas' },
    { value: 'core', label: 'Core' }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesMuscle = selectedMuscle === 'all' || exercise.primary_muscle === selectedMuscle;
    
    return matchesSearch && matchesCategory && matchesMuscle;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Exercícios</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Barra de pesquisa e filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar exercícios..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {muscleGroups.map(muscle => (
                  <option key={muscle.value} value={muscle.value}>{muscle.label}</option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de exercícios */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  {/* Thumbnail do vídeo */}
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                    {exercise.videos[0]?.thumbnail_url ? (
                      <img 
                        src={exercise.videos[0].thumbnail_url} 
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Video size={32} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-white/90 rounded-full">
                        <Play size={20} className="text-gray-900" />
                      </div>
                    </div>

                    {/* Badge de destaque */}
                    {exercise.is_featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Destaque
                      </div>
                    )}

                    {/* Contador de vídeos */}
                    {exercise.videos.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Film size={12} />
                        {exercise.videos.length}
                      </div>
                    )}
                  </div>

                  {/* Info do exercício */}
                  <h3 className="font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {exercise.primary_muscle}
                    </span>
                    {exercise.equipment && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                        {exercise.equipment}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {exercise.view_count}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExercise(exercise);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex items-center gap-4">
                    {/* Mini thumbnail */}
                    <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {exercise.videos[0]?.thumbnail_url ? (
                        <img 
                          src={exercise.videos[0].thumbnail_url} 
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{exercise.primary_muscle}</span>
                        <span>•</span>
                        <span>{exercise.equipment}</span>
                        <span>•</span>
                        <span>{exercise.videos.length} vídeo(s)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowVideoPreview(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Play size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExercise(exercise);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalhes do exercício */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header do modal */}
              <div className="sticky top-0 bg-white p-6 border-b z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{selectedExercise.name}</h3>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Conteúdo do modal */}
              <div className="p-6">
                {/* Vídeos */}
                {selectedExercise.videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Vídeos Demonstrativos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExercise.videos.map(video => (
                        <AdvancedVideoPlayer
                          key={video.id}
                          videoUrl={video.video_url}
                          thumbnailUrl={video.thumbnail_url}
                          exerciseName={selectedExercise.name}
                          videoType={video.video_type || 'upload'}
                          angle={video.angle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Instruções */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Instruções</h4>
                  <p className="text-gray-600 whitespace-pre-line">{selectedExercise.instructions}</p>
                </div>

                {/* Dicas */}
                {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Dicas Importantes</h4>
                    <ul className="space-y-2">
                      {selectedExercise.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Músculos trabalhados */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Músculos Trabalhados</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Principal: {selectedExercise.primary_muscle}
                    </span>
                    {selectedExercise.secondary_muscles?.map(muscle => (
                      <span key={muscle} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onSelectExercise(selectedExercise);
                      setSelectedExercise(null);
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Adicionar ao Treino
                  </button>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================ SISTEMA DE PROGRESSÃO AUTOMÁTICA ================
const ProgressionSystem = ({ 
  exercise, 
  athleteHistory, 
  onApplySuggestion 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calcular sugestões baseadas no histórico
  const calculateProgression = () => {
    if (!athleteHistory || athleteHistory.length === 0) {
      return {
        type: 'initial',
        suggestion: 'Primeira vez realizando este exercício',
        recommendedWeight: exercise.equipment === 'Barra' ? 20 : 5,
        recommendedReps: 12,
        confidence: 0
      };
    }

    const lastSession = athleteHistory[0];
    const last3Sessions = athleteHistory.slice(0, 3);
    
    // Verificar se completou todas as reps na última sessão
    const completedAllSets = lastSession.sets.every(set => 
      set.completed && set.performed_reps >= set.target_reps
    );
    
    // Calcular média de RPE
    const avgRPE = lastSession.sets.reduce((acc, set) => acc + (set.rpe || 0), 0) / lastSession.sets.length;
    
    // Lógica de progressão
    let progression = {
      type: 'maintain',
      suggestion: '',
      recommendedWeight: lastSession.max_weight,
      recommendedReps: lastSession.target_reps,
      confidence: 0,
      reasoning: []
    };

    // PROGRESSÃO POSITIVA
    if (completedAllSets) {
      if (avgRPE <= 7) {
        // Fácil demais - aumentar peso significativamente
        progression = {
          type: 'increase_weight',
          suggestion: 'Aumentar peso em 5-10%',
          recommendedWeight: Math.round(lastSession.max_weight * 1.075 * 2) / 2, // Arredondar para 0.5kg
          recommendedReps: lastSession.target_reps,
          confidence: 95,
          reasoning: [
            '✅ Completou todas as repetições',
            '💪 RPE médio baixo (≤7)',
            '📈 Pronto para progressão'
          ]
        };
      } else if (avgRPE <= 8.5) {
        // Intensidade adequada - pequeno aumento
        progression = {
          type: 'small_increase',
          suggestion: 'Aumentar peso em 2.5%',
          recommendedWeight: Math.round(lastSession.max_weight * 1.025 * 2) / 2,
          recommendedReps: lastSession.target_reps,
          confidence: 85,
          reasoning: [
            '✅ Completou todas as repetições',
            '⚖️ RPE adequado (7-8.5)',
            '📊 Progressão conservadora'
          ]
        };
      } else {
        // RPE alto mas completou - manter ou aumentar reps
        progression = {
          type: 'increase_reps',
          suggestion: 'Manter peso e aumentar 1-2 reps',
          recommendedWeight: lastSession.max_weight,
          recommendedReps: lastSession.target_reps + 1,
          confidence: 80,
          reasoning: [
            '✅ Completou todas as repetições',
            '⚠️ RPE elevado (>8.5)',
            '🔄 Consolidar antes de aumentar peso'
          ]
        };
      }
    } 
    // REGRESSÃO OU MANUTENÇÃO
    else {
      const completionRate = lastSession.sets.filter(s => s.completed).length / lastSession.sets.length;
      
      if (completionRate < 0.5) {
        // Falhou muitas séries - reduzir peso
        progression = {
          type: 'decrease_weight',
          suggestion: 'Reduzir peso em 10%',
          recommendedWeight: Math.round(lastSession.max_weight * 0.9 * 2) / 2,
          recommendedReps: lastSession.target_reps,
          confidence: 90,
          reasoning: [
            '❌ Não completou 50% das séries',
            '⬇️ Peso excessivo para o momento',
            '🎯 Focar na técnica'
          ]
        };
      } else {
        // Falhou algumas - manter e focar na execução
        progression = {
          type: 'maintain',
          suggestion: 'Manter peso e focar na execução',
          recommendedWeight: lastSession.max_weight,
          recommendedReps: lastSession.target_reps,
          confidence: 75,
          reasoning: [
            '⚠️ Completou parcialmente',
            '🔄 Repetir para consolidar',
            '💡 Possível fadiga ou técnica'
          ]
        };
      }
    }

    // Análise de tendência (últimas 3 sessões)
    if (last3Sessions.length === 3) {
      const trend = last3Sessions.map(s => s.max_weight);
      const isStagnant = trend.every(w => w === trend[0]);
      
      if (isStagnant && completedAllSets) {
        progression.additionalNote = '📊 Peso estagnado há 3 sessões - considerar mudança de estímulo';
      }
    }

    return progression;
  };

  const progression = calculateProgression();
  
  // Cores baseadas no tipo de progressão
  const getProgressionColor = () => {
    switch(progression.type) {
      case 'increase_weight':
      case 'small_increase':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'increase_reps':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'maintain':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'decrease_weight':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getProgressionColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <span className="font-semibold">Sugestão de Progressão</span>
            {progression.confidence > 0 && (
              <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                {progression.confidence}% confiança
              </span>
            )}
          </div>
          
          <p className="text-sm mb-2">{progression.suggestion}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Weight size={14} />
              <span className="font-medium">{progression.recommendedWeight}kg</span>
            </div>
            <div className="flex items-center gap-1">
              <Hash size={14} />
              <span className="font-medium">{progression.recommendedReps} reps</span>
            </div>
          </div>

          {progression.additionalNote && (
            <p className="text-xs mt-2 italic">{progression.additionalNote}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <Info size={16} />
          </button>
          <button
            onClick={() => onApplySuggestion(progression)}
            className="px-3 py-1 bg-white/70 hover:bg-white rounded-lg transition-colors text-sm font-medium"
          >
            Aplicar
          </button>
        </div>
      </div>

      {showDetails && progression.reasoning && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <p className="text-xs font-medium mb-2">Análise:</p>
          <ul className="space-y-1">
            {progression.reasoning.map((reason, idx) => (
              <li key={idx} className="text-xs">{reason}</li>
            ))}
          </ul>
          
          {athleteHistory && athleteHistory.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium mb-1">Histórico recente:</p>
              <div className="text-xs space-y-1">
                {athleteHistory.slice(0, 3).map((session, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-500">{session.date}:</span>
                    <span>{session.max_weight}kg x {session.max_reps} reps</span>
                    <span className="text-gray-500">(RPE: {session.avg_rpe})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ================ CRIAR/EDITAR TREINO COMPLETO ================
const WorkoutBuilder = () => {
  const [workout, setWorkout] = useState({
    name: '',
    description: '',
    athlete_id: null,
    exercises: []
  });

  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [athleteHistory, setAthleteHistory] = useState({});

  // Simular busca de histórico do atleta (viria da API)
  useEffect(() => {
    if (workout.athlete_id && workout.exercises.length > 0) {
      // Buscar histórico para cada exercício
      workout.exercises.forEach(exercise => {
        fetchAthleteHistory(workout.athlete_id, exercise.id);
      });
    }
  }, [workout.athlete_id, workout.exercises.length]);

  const fetchAthleteHistory = async (athleteId, exerciseId) => {
    // Mock - substituir por chamada real à API
    const mockHistory = [
      {
        date: '2025-01-10',
        exercise_id: exerciseId,
        max_weight: 60,
        max_reps: 12,
        target_reps: 12,
        sets: [
          { completed: true, performed_reps: 12, target_reps: 12, weight: 60, rpe: 7 },
          { completed: true, performed_reps: 12, target_reps: 12, weight: 60, rpe: 7.5 },
          { completed: true, performed_reps: 11, target_reps: 12, weight: 60, rpe: 8 },
          { completed: true, performed_reps: 10, target_reps: 10, weight: 60, rpe: 8.5 }
        ],
        avg_rpe: 7.75
      },
      {
        date: '2025-01-05',
        exercise_id: exerciseId,
        max_weight: 57.5,
        max_reps: 12,
        target_reps: 12,
        sets: [
          { completed: true, performed_reps: 12, target_reps: 12, weight: 57.5, rpe: 7.5 },
          { completed: true, performed_reps: 12, target_reps: 12, weight: 57.5, rpe: 8 },
          { completed: true, performed_reps: 12, target_reps: 12, weight: 57.5, rpe: 8.5 },
          { completed: true, performed_reps: 10, target_reps: 10, weight: 57.5, rpe: 9 }
        ],
        avg_rpe: 8.25
      }
    ];

    setAthleteHistory(prev => ({
      ...prev,
      [exerciseId]: mockHistory
    }));
  };

  const applyProgressionSuggestion = (exerciseIndex, progression) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      const exercise = newExercises[exerciseIndex];
      
      // Aplicar peso e reps sugeridos a todas as séries working
      exercise.sets = exercise.sets.map(set => {
        if (set.set_type === 'working') {
          return {
            ...set,
            target_weight: progression.recommendedWeight,
            target_reps: progression.recommendedReps
          };
        }
        // Ajustar aquecimento proporcionalmente
        if (set.set_type === 'warmup') {
          return {
            ...set,
            target_weight: Math.round(progression.recommendedWeight * 0.5 * 2) / 2
          };
        }
        return set;
      });
      
      // Adicionar nota sobre a progressão aplicada
      exercise.notes = `📈 Progressão automática aplicada: ${progression.suggestion}`;
      
      return { ...prev, exercises: newExercises };
    });
  };

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      order_in_workout: workout.exercises.length + 1,
      sets: [
        { 
          set_number: 1, 
          set_type: 'warmup',
          target_reps: 15,
          target_weight: 0,
          rpe_target: 5
        },
        { 
          set_number: 2, 
          set_type: 'working',
          target_reps: 12,
          target_weight: 0,
          rpe_target: 7
        },
        { 
          set_number: 3, 
          set_type: 'working',
          target_reps: 10,
          target_weight: 0,
          rpe_target: 8
        },
        { 
          set_number: 4, 
          set_type: 'working',
          target_reps: 8,
          target_weight: 0,
          rpe_target: 9
        }
      ],
      rest_seconds: 90,
      notes: '',
      hasProgression: false // Flag para mostrar sugestões
    };

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    setShowExerciseLibrary(false);
    
    // Buscar histórico para o novo exercício se já houver atleta selecionado
    if (workout.athlete_id) {
      fetchAthleteHistory(workout.athlete_id, exercise.id);
    }
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const addSet = (exerciseIndex) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      const exercise = newExercises[exerciseIndex];
      const lastSet = exercise.sets[exercise.sets.length - 1];
      
      exercise.sets.push({
        set_number: exercise.sets.length + 1,
        set_type: 'working',
        target_reps: lastSet.target_reps,
        target_weight: lastSet.target_weight,
        rpe_target: lastSet.rpe_target
      });
      
      return { ...prev, exercises: newExercises };
    });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      
      // Reordenar números das séries
      newExercises[exerciseIndex].sets.forEach((set, idx) => {
        set.set_number = idx + 1;
      });
      
      return { ...prev, exercises: newExercises };
    });
  };

  const removeExercise = (exerciseIndex) => {
    setWorkout(prev => {
      const newExercises = prev.exercises.filter((_, idx) => idx !== exerciseIndex);
      
      // Reordenar exercícios
      newExercises.forEach((ex, idx) => {
        ex.order_in_workout = idx + 1;
      });
      
      return { ...prev, exercises: newExercises };
    });
  };

  const moveExercise = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === workout.exercises.length - 1)
    ) {
      return;
    }

    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Trocar posições
      [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];
      
      // Atualizar order_in_workout
      newExercises.forEach((ex, idx) => {
        ex.order_in_workout = idx + 1;
      });
      
      return { ...prev, exercises: newExercises };
    });
  };

  const duplicateExercise = (exerciseIndex) => {
    setWorkout(prev => {
      const exerciseToDuplicate = prev.exercises[exerciseIndex];
      const duplicated = {
        ...exerciseToDuplicate,
        order_in_workout: prev.exercises.length + 1,
        sets: exerciseToDuplicate.sets.map(set => ({ ...set }))
      };
      
      return {
        ...prev,
        exercises: [...prev.exercises, duplicated]
      };
    });
  };

  const saveWorkout = () => {
    console.log('Saving workout:', workout);
    // Aqui faria a chamada à API para salvar
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Treino</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Treino
            </label>
            <input
              type="text"
              value={workout.name}
              onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Treino A - Peito e Tríceps"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Atleta
            </label>
            <select
              value={workout.athlete_id || ''}
              onChange={(e) => setWorkout(prev => ({ ...prev, athlete_id: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecionar atleta...</option>
              <option value="1">João Silva</option>
              <option value="2">Maria Santos</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={workout.description}
            onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o objetivo deste treino..."
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Exercícios</h2>
          <button
            onClick={() => setShowExerciseLibrary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Adicionar Exercício
          </button>
        </div>

        {workout.exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Dumbbell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Nenhum exercício adicionado ainda</p>
            <button
              onClick={() => setShowExerciseLibrary(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar Primeiro Exercício
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {workout.exercises.map((exercise, exerciseIndex) => (
              <div
                key={exerciseIndex}
                className="border rounded-lg overflow-hidden"
              >
                {/* Header do exercício */}
                <div className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">
                        #{exercise.order_in_workout}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {exercise.primary_muscle}
                          </span>
                          {exercise.equipment && (
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                              {exercise.equipment}
                            </span>
                          )}
                          {exercise.videos && exercise.videos.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <Video size={12} />
                              {exercise.videos.length} vídeo(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Botões de ação */}
                      <button
                        onClick={() => moveExercise(exerciseIndex, 'up')}
                        disabled={exerciseIndex === 0}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        onClick={() => moveExercise(exerciseIndex, 'down')}
                        disabled={exerciseIndex === workout.exercises.length - 1}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        onClick={() => duplicateExercise(exerciseIndex)}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => setExpandedExercise(
                          expandedExercise === exerciseIndex ? null : exerciseIndex
                        )}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      >
                        {expandedExercise === exerciseIndex ? 
                          <ChevronUp size={18} /> : 
                          <ChevronDown size={18} />
                        }
                      </button>
                      <button
                        onClick={() => removeExercise(exerciseIndex)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conteúdo expandido do exercício */}
                {expandedExercise === exerciseIndex && (
                  <div className="p-4 space-y-4">
                    {/* Sistema de Progressão Automática */}
                    {workout.athlete_id && athleteHistory[exercise.id] && (
                      <ProgressionSystem
                        exercise={exercise}
                        athleteHistory={athleteHistory[exercise.id]}
                        onApplySuggestion={(progression) => 
                          applyProgressionSuggestion(exerciseIndex, progression)
                        }
                      />
                    )}

                    {/* Vídeo preview se existir */}
                    {exercise.videos && exercise.videos[0] && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Vídeo Demonstrativo</h4>
                        <div className="max-w-md">
                          <AdvancedVideoPlayer
                            videoUrl={exercise.videos[0].video_url}
                            thumbnailUrl={exercise.videos[0].thumbnail_url}
                            exerciseName={exercise.name}
                            videoType={exercise.videos[0].video_type || 'upload'}
                            angle={exercise.videos[0].angle}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tabela de séries */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Séries</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-gray-500 border-b">
                              <th className="text-left pb-2">Série</th>
                              <th className="text-left pb-2">Tipo</th>
                              <th className="text-center pb-2">Reps</th>
                              <th className="text-center pb-2">Peso (kg)</th>
                              <th className="text-center pb-2">RPE</th>
                              <th className="text-center pb-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {exercise.sets.map((set, setIndex) => (
                              <tr key={setIndex} className="border-b">
                                <td className="py-2 text-sm font-medium">#{set.set_number}</td>
                                <td className="py-2">
                                  <select
                                    value={set.set_type}
                                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'set_type', e.target.value)}
                                    className="text-sm px-2 py-1 border rounded"
                                  >
                                    <option value="warmup">Aquecimento</option>
                                    <option value="working">Normal</option>
                                    <option value="drop">Drop Set</option>
                                    <option value="failure">Falha</option>
                                  </select>
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    value={set.target_reps}
                                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'target_reps', parseInt(e.target.value))}
                                    className="w-16 text-center px-2 py-1 border rounded"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    value={set.target_weight}
                                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'target_weight', parseFloat(e.target.value))}
                                    className="w-20 text-center px-2 py-1 border rounded"
                                    step="0.5"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    value={set.rpe_target}
                                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'rpe_target', parseInt(e.target.value))}
                                    className="w-16 text-center px-2 py-1 border rounded"
                                    min="1"
                                    max="10"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <button
                                    onClick={() => removeSet(exerciseIndex, setIndex)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <X size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <button
                        onClick={() => addSet(exerciseIndex)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Adicionar Série
                      </button>
                    </div>

                    {/* Tempo de descanso e notas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tempo de Descanso (segundos)
                        </label>
                        <input
                          type="number"
                          value={exercise.rest_seconds}
                          onChange={(e) => {
                            const newExercises = [...workout.exercises];
                            newExercises[exerciseIndex].rest_seconds = parseInt(e.target.value);
                            setWorkout(prev => ({ ...prev, exercises: newExercises }));
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas
                        </label>
                        <input
                          type="text"
                          value={exercise.notes}
                          onChange={(e) => {
                            const newExercises = [...workout.exercises];
                            newExercises[exerciseIndex].notes = e.target.value;
                            setWorkout(prev => ({ ...prev, exercises: newExercises }));
                          }}
                          placeholder="Observações sobre a execução..."
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-4">
        <button
          onClick={saveWorkout}
          disabled={!workout.name || workout.exercises.length === 0}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="inline mr-2" size={18} />
          Guardar Treino
        </button>
        <button
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>

      {/* Modal da biblioteca de exercícios */}
      {showExerciseLibrary && (
        <ExerciseLibrary
          onSelectExercise={addExercise}
          onClose={() => setShowExerciseLibrary(false)}
        />
      )}
    </div>
  );
};

// Exportar o componente principal
export default WorkoutBuilder;