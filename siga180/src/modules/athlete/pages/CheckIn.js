import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../shared/components/layout/Layout';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { 
  Brain, 
  Activity,
  Smile,
  Moon,
  Save,
  TrendingUp,
  AlertCircle,
  Keyboard,
  CheckCircle,
  Check,
  MessageSquare,
  Calendar,
  Clock,
  Zap,
  Heart
} from 'lucide-react';

// Componente de Slider Emoji Melhorado
const EmojiSlider = ({ label, value, onChange, emojis, colors, descriptions }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <label className="text-base font-semibold text-gray-800 mb-4 block">{label}</label>
      <div className="flex items-center justify-between gap-3">
        {emojis.map((emoji, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <button
              onClick={() => onChange(index + 1)}
              className={`
                w-full aspect-square max-w-[80px] rounded-2xl transition-all duration-200 transform
                flex flex-col items-center justify-center
                ${value === index + 1
                  ? `${colors[index]} scale-110 shadow-lg`
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="text-3xl">{emoji}</span>
            </button>
            <span className={`text-xs mt-2 font-medium transition-opacity ${
              value === index + 1 ? 'opacity-100 text-gray-800' : 'opacity-60 text-gray-500'
            }`}>
              {descriptions[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal CheckIn
const CheckIn = () => {
  // ESTADOS
  const [currentStep, setCurrentStep] = useState(1);
  const [savedDraft, setSavedDraft] = useLocalStorage('checkInDraft', null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado inicial simplificado - SEM MEDIDAS
  const [checkInData, setCheckInData] = useState(() => {
    if (savedDraft && savedDraft.date === new Date().toDateString()) {
      return savedDraft.data;
    }
    return {
      // Bem-estar
      mood: 3,
      energy: 3,
      motivation: 3,
      // Recuperação
      sleepHours: '',
      sleepQuality: 3,
      soreness: 3,
      stress: 3,
      // Notas
      workoutFeedback: '',
      privateNotes: ''
    };
  });

  const [recentCheckIns] = useState([
    { date: 'Hoje', time: '07:30', mood: 4, energy: 4 },
    { date: 'Ontem', time: '08:00', mood: 5, energy: 5 },
    { date: '26/07', time: '07:45', mood: 3, energy: 3 },
  ]);

  // STEPS ATUALIZADOS - Agora são só 3
  const steps = [
    { number: 1, title: 'Bem-estar', icon: Smile, color: 'text-blue-600' },
    { number: 2, title: 'Recuperação', icon: Moon, color: 'text-purple-600' },
    { number: 3, title: 'Feedback', icon: MessageSquare, color: 'text-green-600' }
  ];

  // FUNÇÕES DE NAVEGAÇÃO
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting check-in:', checkInData);
    clearDraft();
    alert('Check-in registado com sucesso!');
  };

  const updateData = (field, value) => {
    setCheckInData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // FUNÇÃO AUTO-SAVE
  const autoSave = useCallback(() => {
    setIsSaving(true);
    const draft = {
      date: new Date().toDateString(),
      data: checkInData,
      step: currentStep,
      timestamp: new Date().toISOString()
    };
    setSavedDraft(draft);
    setLastSaved(new Date());
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  }, [checkInData, currentStep, setSavedDraft]);

  // Auto-save a cada 10 segundos
  useEffect(() => {
    const hasChanges = JSON.stringify(checkInData) !== JSON.stringify(savedDraft?.data || {});
    
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        autoSave();
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [checkInData, savedDraft, autoSave]);

  // ATALHOS DE TECLADO
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        autoSave();
      }

      if (e.key === 'ArrowRight' && currentStep < steps.length) {
        handleNext();
      }
      if (e.key === 'ArrowLeft' && currentStep > 1) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, steps.length, autoSave]);

  // FUNÇÕES AUXILIARES
  const clearDraft = () => {
    setSavedDraft(null);
    setLastSaved(null);
  };

  const restoreDraft = () => {
    if (savedDraft) {
      setCheckInData(savedDraft.data);
      setCurrentStep(savedDraft.step || 1);
    }
  };

  // COMPONENTES INTERNOS
  const AutoSaveStatus = () => {
    if (isSaving) {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2"></div>
          A guardar...
        </div>
      );
    }

    if (lastSaved) {
      const timeAgo = Math.round((new Date() - lastSaved) / 1000);
      return (
        <div className="flex items-center text-sm text-gray-500">
          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
          Guardado há {timeAgo < 60 ? `${timeAgo}s` : `${Math.round(timeAgo / 60)}m`}
        </div>
      );
    }

    return null;
  };

  const ShortcutsHelp = () => {
    const [showHelp, setShowHelp] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-gray-400 hover:text-gray-600 p-2"
          title="Atalhos de teclado"
        >
          <Keyboard className="w-5 h-5" />
        </button>
        
        {showHelp && (
          <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
            <h4 className="font-semibold text-gray-900 mb-2">Atalhos de Teclado</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Próximo passo</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passo anterior</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guardar rascunho</span>
                <div>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">S</kbd>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // RENDER PRINCIPAL
  return (
    
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header com status de auto-save */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check-in Diário</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('pt-PT', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <AutoSaveStatus />
            <ShortcutsHelp />
          </div>
        </div>

        {/* Progress Steps - Mais Limpo */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full transition-all
                      ${isCompleted ? 'bg-green-100 text-green-600' : 
                        isActive ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-100' : 
                        'bg-gray-100 text-gray-400'}
                    `}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium mt-2 ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-1 rounded-full transition-all ${
                      currentStep > step.number ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {/* Step 1: Bem-estar */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Como te sentes hoje?</h2>
                    <p className="text-gray-600">Avalia o teu estado geral antes do treino</p>
                  </div>

                  <EmojiSlider
                    label="Estado de Espírito"
                    value={checkInData.mood}
                    onChange={(value) => updateData('mood', value)}
                    emojis={['😔', '😕', '😐', '😊', '😄']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Mal', 'Baixo', 'Normal', 'Bem', 'Ótimo']}
                  />

                  <EmojiSlider
                    label="Nível de Energia"
                    value={checkInData.energy}
                    onChange={(value) => updateData('energy', value)}
                    emojis={['🪫', '🔋', '🔋', '🔋', '⚡']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Vazio', 'Baixa', 'Normal', 'Boa', 'Máxima']}
                  />

                  <EmojiSlider
                    label="Motivação para Treinar"
                    value={checkInData.motivation}
                    onChange={(value) => updateData('motivation', value)}
                    emojis={['😴', '😑', '🙂', '💪', '🔥']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Nenhuma', 'Pouca', 'Normal', 'Alta', 'Máxima']}
                  />
                </div>
              )}

              {/* Step 2: Recuperação */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Como foi a tua recuperação?</h2>
                    <p className="text-gray-600">Avalia o teu descanso e recuperação muscular</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <label className="text-base font-semibold text-gray-800 mb-3 block flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-600" />
                      Horas de Sono
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={checkInData.sleepHours}
                        onChange={(e) => updateData('sleepHours', e.target.value)}
                        className="w-24 px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <span className="text-gray-600">horas</span>
                    </div>
                  </div>

                  <EmojiSlider
                    label="Qualidade do Sono"
                    value={checkInData.sleepQuality}
                    onChange={(value) => updateData('sleepQuality', value)}
                    emojis={['😫', '😣', '😴', '😊', '🤗']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Péssima', 'Má', 'Normal', 'Boa', 'Excelente']}
                  />

                  <EmojiSlider
                    label="Dores Musculares"
                    value={checkInData.soreness}
                    onChange={(value) => updateData('soreness', value)}
                    emojis={['💀', '😣', '😐', '😊', '💪']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Severas', 'Moderadas', 'Ligeiras', 'Mínimas', 'Nenhuma']}
                  />

                  <EmojiSlider
                    label="Nível de Stress"
                    value={checkInData.stress}
                    onChange={(value) => updateData('stress', value)}
                    emojis={['😰', '😟', '😐', '😌', '😎']}
                    colors={['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-emerald-100']}
                    descriptions={['Muito Alto', 'Alto', 'Médio', 'Baixo', 'Relaxado']}
                  />
                </div>
              )}

              {/* Step 3: Feedback */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Feedback do Treino</h2>
                    <p className="text-gray-600">Partilha como correu ou deixa notas importantes</p>
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-800 mb-3 block">
                      Como foi o treino? (Opcional)
                    </label>
                    <textarea
                      value={checkInData.workoutFeedback}
                      onChange={(e) => updateData('workoutFeedback', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Ex: Senti-me forte no supino, consegui aumentar o peso! O cardio foi difícil hoje..."
                    />
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-800 mb-3 block">
                      Notas Privadas (Opcional)
                    </label>
                    <textarea
                      value={checkInData.privateNotes}
                      onChange={(e) => updateData('privateNotes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Notas pessoais que só tu vês..."
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 text-center">
                      🎉 Parabéns por mais um check-in! A consistência é o segredo do sucesso.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  className={`px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                >
                  ← Anterior
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Próximo →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Concluir Check-in</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Esta Semana</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-gray-600">Check-ins</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">4.2</p>
                  <p className="text-xs text-gray-600">Média Energia</p>
                </div>
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Check-ins</h3>
              <div className="space-y-3">
                {recentCheckIns.map((checkIn, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{checkIn.date}</p>
                      <p className="text-xs text-gray-500">{checkIn.time}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-lg">{['😔', '😕', '😐', '😊', '😄'][checkIn.mood - 1]}</span>
                        <p className="text-xs text-gray-500 mt-1">Humor</p>
                      </div>
                      <div className="text-center">
                        <span className="text-lg">{['🪫', '🔋', '🔋', '🔋', '⚡'][checkIn.energy - 1]}</span>
                        <p className="text-xs text-gray-500 mt-1">Energia</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de atalhos */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Usa as setas ← → para navegar • Ctrl+S para guardar</p>
        </div>
      </div>
    
  );
};

export default CheckIn;