import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  Calendar,
  Users,
  Clock,
  MapPin,
  Tag,
  ChevronDown,
  Search,
  RotateCcw,
  Save,
  AlertCircle
} from 'lucide-react';

const ScheduleFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    athletes: [],
    dateRange: { from: '', to: '' },
    timeRange: { from: '', to: '' },
    types: [],
    status: [],
    location: 'all', // all, online, presencial
    duration: { min: null, max: null },
    tags: [],
    ...initialFilters
  });

  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Treinos da Manhã', filters: { timeRange: { from: '06:00', to: '12:00' } } },
    { id: 2, name: 'Sessões Online', filters: { location: 'online' } },
    { id: 3, name: 'Esta Semana', filters: { dateRange: { from: '2025-01-20', to: '2025-01-26' } } }
  ]);

  // Mock data - substituir por dados reais
  const availableAthletes = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Santos' },
    { id: 3, name: 'Pedro Costa' },
    { id: 4, name: 'Ana Oliveira' }
  ];

  const sessionTypes = [
    { value: 'training', label: 'Treino', color: 'blue' },
    { value: 'consultation', label: 'Consulta', color: 'purple' },
    { value: 'assessment', label: 'Avaliação', color: 'green' },
    { value: 'recovery', label: 'Recuperação', color: 'orange' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Agendado', color: 'blue' },
    { value: 'confirmed', label: 'Confirmado', color: 'green' },
    { value: 'completed', label: 'Concluído', color: 'gray' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' },
    { value: 'rescheduled', label: 'Reagendado', color: 'yellow' }
  ];

  const availableTags = [
    'Iniciante', 'Avançado', 'Força', 'Cardio', 
    'Flexibilidade', 'Reabilitação', 'Grupo', 'Individual'
  ];

  // Contadores de filtros ativos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.athletes.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.timeRange.from || filters.timeRange.to) count++;
    if (filters.types.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.location !== 'all') count++;
    if (filters.duration.min || filters.duration.max) count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Aplicar filtros
  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  // Limpar filtros
  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      athletes: [],
      dateRange: { from: '', to: '' },
      timeRange: { from: '', to: '' },
      types: [],
      status: [],
      location: 'all',
      duration: { min: null, max: null },
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Salvar filtro atual
  const saveCurrentFilter = () => {
    const name = prompt('Nome do filtro:');
    if (name) {
      setSavedFilters([
        ...savedFilters,
        { id: Date.now(), name, filters: { ...filters } }
      ]);
    }
  };

  // Aplicar filtro salvo
  const applySavedFilter = (savedFilter) => {
    const newFilters = { ...filters, ...savedFilter.filters };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <>
      {/* Botão de Filtros */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors relative"
      >
        <Filter size={20} />
        <span>Filtros</span>
        {activeCount > 0 && (
          <>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {activeCount}
            </span>
            <ChevronDown size={16} />
          </>
        )}
      </button>

      {/* Painel de Filtros */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Filtros</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pesquisar por título ou descrição..."
                />
              </div>

              {/* Filtros Salvos */}
              {savedFilters.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Filtros Rápidos</p>
                  <div className="flex flex-wrap gap-2">
                    {savedFilters.map((saved) => (
                      <button
                        key={saved.id}
                        onClick={() => applySavedFilter(saved)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {saved.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Corpo dos Filtros */}
            <div className="p-4 space-y-6">
              {/* Atletas */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Users size={16} />
                  Atletas
                </label>
                <div className="space-y-2">
                  {availableAthletes.map((athlete) => (
                    <label key={athlete.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.athletes.includes(athlete.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, athletes: [...filters.athletes, athlete.id] });
                          } else {
                            setFilters({ ...filters, athletes: filters.athletes.filter(id => id !== athlete.id) });
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">{athlete.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Intervalo de Datas */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Calendar size={16} />
                  Período
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">De</label>
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, from: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Até</label>
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, to: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Horário */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Clock size={16} />
                  Horário
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Das</label>
                    <input
                      type="time"
                      value={filters.timeRange.from}
                      onChange={(e) => setFilters({
                        ...filters,
                        timeRange: { ...filters.timeRange, from: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Até</label>
                    <input
                      type="time"
                      value={filters.timeRange.to}
                      onChange={(e) => setFilters({
                        ...filters,
                        timeRange: { ...filters.timeRange, to: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Sessão */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Tag size={16} />
                  Tipo de Sessão
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        const types = filters.types.includes(type.value)
                          ? filters.types.filter(t => t !== type.value)
                          : [...filters.types, type.value];
                        setFilters({ ...filters, types });
                      }}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        filters.types.includes(type.value)
                          ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <AlertCircle size={16} />
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <label key={status.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, status: [...filters.status, status.value] });
                          } else {
                            setFilters({ ...filters, status: filters.status.filter(s => s !== status.value) });
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700`}>
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <MapPin size={16} />
                  Local
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'online', label: 'Online' },
                    { value: 'presencial', label: 'Presencial' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        checked={filters.location === option.value}
                        onChange={() => setFilters({ ...filters, location: option.value })}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Clock size={16} />
                  Duração (minutos)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      value={filters.duration.min || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        duration: { ...filters.duration, min: e.target.value ? parseInt(e.target.value) : null }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      value={filters.duration.max || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        duration: { ...filters.duration, max: e.target.value ? parseInt(e.target.value) : null }
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="120"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Tag size={16} />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const tags = filters.tags.includes(tag)
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        setFilters({ ...filters, tags });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={16} />
                  Limpar
                </button>
                <button
                  onClick={saveCurrentFilter}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
              <button
                onClick={applyFilters}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros ({activeCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleFilters;