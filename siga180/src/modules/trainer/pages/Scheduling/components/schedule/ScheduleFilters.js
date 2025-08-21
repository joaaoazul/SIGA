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

const ScheduleFilters = ({ onFiltersChange, athletes = [], initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    athleteId: 'all',
    dateFrom: '',
    dateTo: '',
    timeFrom: '',
    timeTo: '',
    types: [],
    status: [],
    location: 'all', // all, online, presencial
    tags: [],
    ...initialFilters
  });

  // Quick filters presets
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Esta Semana', filters: { 
      dateFrom: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0],
      dateTo: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0]
    }},
    { id: 2, name: 'Hoje', filters: { 
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0]
    }},
    { id: 3, name: 'Online', filters: { location: 'online' } }
  ]);

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
    { value: 'no_show', label: 'Não Compareceu', color: 'yellow' }
  ];

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.athleteId !== 'all') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.timeFrom || filters.timeTo) count++;
    if (filters.types.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.location !== 'all') count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Apply filters
  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      athleteId: 'all',
      dateFrom: '',
      dateTo: '',
      timeFrom: '',
      timeTo: '',
      types: [],
      status: [],
      location: 'all',
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Apply saved filter
  const applySavedFilter = (savedFilter) => {
    const newFilters = { ...filters, ...savedFilter.filters };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Update filters in real-time for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (filters.search !== initialFilters.search) {
        onFiltersChange({ ...filters });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.search]);

  return (
    <>
      {/* Filter Button */}
      <div className="flex gap-2">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pesquisar..."
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2">
          {savedFilters.map((saved) => (
            <button
              key={saved.id}
              onClick={() => applySavedFilter(saved)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              {saved.name}
            </button>
          ))}
        </div>

        {/* Advanced Filters Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors relative"
        >
          <Filter size={20} />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Limpar filtros"
          >
            <RotateCcw size={20} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filtros Avançados</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Body */}
            <div className="p-4 space-y-6">
              {/* Athletes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Users size={16} />
                  Atleta
                </label>
                <select
                  value={filters.athleteId}
                  onChange={(e) => setFilters({ ...filters, athleteId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Atletas</option>
                  {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.name || athlete.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
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
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateFrom: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Até</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateTo: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Time Range */}
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
                      value={filters.timeFrom}
                      onChange={(e) => setFilters({
                        ...filters,
                        timeFrom: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Até</label>
                    <input
                      type="time"
                      value={filters.timeTo}
                      onChange={(e) => setFilters({
                        ...filters,
                        timeTo: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Session Type */}
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
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                  Estado
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

              {/* Location */}
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
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
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