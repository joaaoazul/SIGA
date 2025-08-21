import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Settings,
  Save,
  Plus,
  Minus,
  AlertCircle,
  Check,
  X,
  Coffee,
  Moon,
  Sun,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AvailabilityView = () => {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    tuesday: { enabled: true, start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    wednesday: { enabled: true, start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    thursday: { enabled: true, start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    friday: { enabled: true, start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    saturday: { enabled: false, start: '09:00', end: '13:00', breaks: [] },
    sunday: { enabled: false, start: '', end: '', breaks: [] }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedDays, setExpandedDays] = useState(['monday']);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [bufferTime, setBufferTime] = useState(15);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');

  const weekDays = [
    { key: 'monday', label: 'Segunda-feira', icon: '💪' },
    { key: 'tuesday', label: 'Terça-feira', icon: '🏃' },
    { key: 'wednesday', label: 'Quarta-feira', icon: '🧘' },
    { key: 'thursday', label: 'Quinta-feira', icon: '🏋️' },
    { key: 'friday', label: 'Sexta-feira', icon: '🤸' },
    { key: 'saturday', label: 'Sábado', icon: '🚴' },
    { key: 'sunday', label: 'Domingo', icon: '😴' }
  ];

  const quickTemplates = [
    { name: 'Manhãs (8h-12h)', config: { start: '08:00', end: '12:00', breaks: [] } },
    { name: 'Tardes (14h-18h)', config: { start: '14:00', end: '18:00', breaks: [] } },
    { name: 'Dia Completo', config: { start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] } },
    { name: 'Noite (18h-22h)', config: { start: '18:00', end: '22:00', breaks: [] } }
  ];

  const toggleDay = (day) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const updateDaySchedule = (day, updates) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates }
    }));
  };

  const addBreak = (day) => {
    const currentBreaks = availability[day].breaks || [];
    const newBreak = { start: '15:00', end: '15:30' };
    updateDaySchedule(day, { breaks: [...currentBreaks, newBreak] });
  };

  const removeBreak = (day, index) => {
    const currentBreaks = availability[day].breaks || [];
    updateDaySchedule(day, { 
      breaks: currentBreaks.filter((_, i) => i !== index) 
    });
  };

  const updateBreak = (day, index, field, value) => {
    const currentBreaks = [...(availability[day].breaks || [])];
    currentBreaks[index] = { ...currentBreaks[index], [field]: value };
    updateDaySchedule(day, { breaks: currentBreaks });
  };

  const applyTemplate = (day, template) => {
    updateDaySchedule(day, {
      ...template.config,
      enabled: true
    });
  };

  const copyToAllDays = (sourceDay) => {
    const sourceConfig = availability[sourceDay];
    const updates = {};
    weekDays.forEach(({ key }) => {
      if (key !== sourceDay) {
        updates[key] = { ...sourceConfig, enabled: true };
      }
    });
    setAvailability(prev => ({ ...prev, ...updates }));
  };

  const addBlockedDate = () => {
    if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate('');
    }
  };

  const removeBlockedDate = (date) => {
    setBlockedDates(blockedDates.filter(d => d !== date));
  };

  const calculateTotalHours = () => {
    let total = 0;
    weekDays.forEach(({ key }) => {
      const day = availability[key];
      if (day.enabled && day.start && day.end) {
        const start = new Date(`2000-01-01 ${day.start}`);
        const end = new Date(`2000-01-01 ${day.end}`);
        let dayHours = (end - start) / (1000 * 60 * 60);
        
        (day.breaks || []).forEach(brk => {
          if (brk.start && brk.end) {
            const breakStart = new Date(`2000-01-01 ${brk.start}`);
            const breakEnd = new Date(`2000-01-01 ${brk.end}`);
            dayHours -= (breakEnd - breakStart) / (1000 * 60 * 60);
          }
        });
        
        total += dayHours;
      }
    });
    return total.toFixed(1);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Disponibilidade guardada com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Disponibilidade</h1>
        <p className="text-gray-600 mt-1">Configure os seus horários disponíveis para agendamentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Horário Semanal</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{calculateTotalHours()}h por semana</span>
              </div>
            </div>

            <div className="space-y-3">
              {weekDays.map(({ key, label, icon }) => {
                const day = availability[key];
                const isExpanded = expandedDays.includes(key);
                
                return (
                  <div key={key} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateDaySchedule(key, { enabled: !day.enabled })}
                            className="text-2xl"
                          >
                            {day.enabled ? <ToggleRight className="text-blue-600" /> : <ToggleLeft className="text-gray-400" />}
                          </button>
                          <span className="text-lg">{icon}</span>
                          <span className={`font-medium ${!day.enabled ? 'text-gray-400' : ''}`}>
                            {label}
                          </span>
                          {day.enabled && day.start && day.end && (
                            <span className="text-sm text-gray-600">
                              {day.start} - {day.end}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleDay(key)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 space-y-4 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de Início
                            </label>
                            <input
                              type="time"
                              value={day.start}
                              onChange={(e) => updateDaySchedule(key, { start: e.target.value })}
                              disabled={!day.enabled}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de Fim
                            </label>
                            <input
                              type="time"
                              value={day.end}
                              onChange={(e) => updateDaySchedule(key, { end: e.target.value })}
                              disabled={!day.enabled}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Pausas</label>
                            <button
                              onClick={() => addBreak(key)}
                              disabled={!day.enabled}
                              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center gap-1"
                            >
                              <Plus size={16} />
                              Adicionar Pausa
                            </button>
                          </div>
                          
                          {day.breaks && day.breaks.length > 0 ? (
                            <div className="space-y-2">
                              {day.breaks.map((brk, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Coffee size={16} className="text-gray-400" />
                                  <input
                                    type="time"
                                    value={brk.start}
                                    onChange={(e) => updateBreak(key, index, 'start', e.target.value)}
                                    disabled={!day.enabled}
                                    className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-500">até</span>
                                  <input
                                    type="time"
                                    value={brk.end}
                                    onChange={(e) => updateBreak(key, index, 'end', e.target.value)}
                                    disabled={!day.enabled}
                                    className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() => removeBreak(key, index)}
                                    disabled={!day.enabled}
                                    className="text-red-500 hover:text-red-600 disabled:text-gray-400"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Sem pausas configuradas</p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <span className="text-sm text-gray-600">Templates rápidos:</span>
                          {quickTemplates.map((template) => (
                            <button
                              key={template.name}
                              onClick={() => applyTemplate(key, template)}
                              disabled={!day.enabled}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                            >
                              {template.name}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => copyToAllDays(key)}
                          disabled={!day.enabled}
                          className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center gap-1"
                        >
                          <Copy size={14} />
                          Copiar para todos os dias
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">Configurações de Sessão</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração Padrão da Sessão
                </label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                  <option value={120}>120 minutos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo entre Sessões
                </label>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sem intervalo</option>
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">Dias Bloqueados</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addBlockedDate}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                </button>
              </div>

              {blockedDates.length > 0 ? (
                <div className="space-y-2">
                  {blockedDates.map((date) => (
                    <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString('pt-PT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                      <button
                        onClick={() => removeBlockedDate(date)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sem dias bloqueados</p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Nota Importante</p>
                <p className="text-yellow-700">
                  As alterações na disponibilidade não afetam agendamentos já confirmados.
                  Apenas novos agendamentos respeitarão estas configurações.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                A guardar...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar Disponibilidade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityView;