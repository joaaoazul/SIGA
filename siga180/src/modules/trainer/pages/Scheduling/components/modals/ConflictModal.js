import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Check,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

const ConflictResolutionModal = ({ 
  isOpen, 
  onClose, 
  newSchedule, 
  conflicts, 
  onResolve 
}) => {
  const [resolution, setResolution] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gerar slots alternativos
  useEffect(() => {
    if (conflicts && conflicts.length > 0) {
      generateAlternativeSlots();
    }
  }, [conflicts]);

  const generateAlternativeSlots = () => {
    // Simular geração de slots alternativos
    const slots = [];
    const baseDate = new Date(newSchedule.scheduled_date);
    
    // Slots no mesmo dia
    const times = ['07:00', '09:00', '11:00', '14:00', '16:00', '18:00', '20:00'];
    times.forEach(time => {
      const [hour, min] = time.split(':');
      const isConflict = conflicts.some(c => 
        c.start_time <= time && c.end_time > time
      );
      
      if (!isConflict) {
        slots.push({
          date: newSchedule.scheduled_date,
          time: time,
          available: true,
          isSameDay: true
        });
      }
    });
    
    // Slots nos próximos dias
    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i);
      
      slots.push({
        date: nextDate.toISOString().split('T')[0],
        time: newSchedule.start_time,
        available: true,
        isSameDay: false
      });
    }
    
    setAvailableSlots(slots);
  };

  const resolutionOptions = [
    {
      id: 'reschedule',
      title: 'Reagendar para outro horário',
      description: 'Mover este agendamento para um horário disponível',
      icon: Calendar,
      action: 'reschedule'
    },
    {
      id: 'replace',
      title: 'Substituir agendamento existente',
      description: 'Cancelar o agendamento conflitante e criar este novo',
      icon: RefreshCw,
      action: 'replace'
    },
    {
      id: 'force',
      title: 'Criar mesmo assim',
      description: 'Permitir sobreposição (sessão em grupo ou especial)',
      icon: Users,
      action: 'force'
    }
  ];

  const handleResolve = async () => {
    setLoading(true);
    
    try {
      let resolvedData = { ...newSchedule };
      
      switch (resolution) {
        case 'reschedule':
          if (selectedSlot) {
            resolvedData.scheduled_date = selectedSlot.date;
            resolvedData.start_time = selectedSlot.time;
            // Calcular end_time baseado na duração
            const duration = newSchedule.duration_minutes || 60;
            const [h, m] = selectedSlot.time.split(':').map(Number);
            const endMinutes = h * 60 + m + duration;
            const endHours = Math.floor(endMinutes / 60);
            const endMins = endMinutes % 60;
            resolvedData.end_time = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
          }
          break;
          
        case 'replace':
          // Marcar conflitos para cancelamento
          resolvedData.conflictsToCancel = conflicts.map(c => c.id);
          break;
          
        case 'force':
          // Permitir criação com sobreposição
          resolvedData.allowOverlap = true;
          break;
      }
      
      await onResolve(resolution, resolvedData);
      onClose();
    } catch (error) {
      console.error('Error resolving conflict:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Conflito de Horário Detetado
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Existem {conflicts.length} agendamento{conflicts.length > 1 ? 's' : ''} no mesmo horário
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Conflitos Existentes */}
          <div className="p-6 border-b">
            <h3 className="font-medium text-gray-900 mb-3">Agendamentos Conflitantes</h3>
            <div className="space-y-2">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{conflict.athlete?.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {conflict.start_time} - {conflict.end_time} • {conflict.title}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${conflict.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'}`}
                  >
                    {conflict.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Novo Agendamento */}
          <div className="p-6 border-b bg-blue-50">
            <h3 className="font-medium text-gray-900 mb-3">Novo Agendamento</h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{newSchedule.athlete?.full_name}</p>
                  <p className="text-sm text-gray-600">
                    {newSchedule.start_time} - {newSchedule.end_time} • {newSchedule.title}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                A criar
              </span>
            </div>
          </div>

          {/* Opções de Resolução */}
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Como deseja resolver este conflito?</h3>
            
            <div className="space-y-3">
              {resolutionOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = resolution === option.id;
                
                return (
                  <div key={option.id}>
                    <button
                      onClick={() => setResolution(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                              {option.title}
                            </p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                      </div>
                    </button>
                    
                    {/* Slots alternativos para reagendamento */}
                    {isSelected && option.id === 'reschedule' && (
                      <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Horários alternativos disponíveis:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.slice(0, 6).map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                selectedSlot === slot
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {slot.isSameDay ? 'Hoje' : 
                                     new Date(slot.date).toLocaleDateString('pt-PT', { 
                                       weekday: 'short', 
                                       day: 'numeric' 
                                     })}
                                  </p>
                                  <p className="text-xs">{slot.time}</p>
                                </div>
                                {selectedSlot === slot && 
                                  <Check size={14} className="text-blue-600" />
                                }
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleResolve}
              disabled={!resolution || (resolution === 'reschedule' && !selectedSlot) || loading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !resolution || (resolution === 'reschedule' && !selectedSlot) || loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Resolver Conflito
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;