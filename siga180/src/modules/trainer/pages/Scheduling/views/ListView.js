// src/modules/trainer/pages/Scheduling/views/ListView.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  SortAsc,
  SortDesc,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { supabase } from '../../../../../services/supabase/supabaseClient';

const ListView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    athleteId: 'all',
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  // Ordenação
  const [sortField, setSortField] = useState('scheduled_date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Listas para filtros
  const [athletes, setAthletes] = useState([]);
  
  // Seleção múltipla
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ========================================
  // FETCH DATA
  // ========================================

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      
      // Calcular offset para paginação
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Query base
      let query = supabase
        .from('schedules')
        .select(`
          *,
          athlete:profiles!schedules_athlete_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('trainer_id', user?.id)
        .range(offset, offset + itemsPerPage - 1);
      
      // Aplicar filtros
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
      }
      
      if (filters.athleteId !== 'all') {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      
      if (filters.dateFrom) {
        query = query.gte('scheduled_date', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('scheduled_date', filters.dateTo);
      }
      
      // Aplicar ordenação
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      if (sortField === 'scheduled_date') {
        query = query.order('start_time', { ascending: sortDirection === 'asc' });
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching schedules:', error);
        toast.error('Erro ao carregar agendamentos');
      } else {
        // Processar dados
        const processedData = (data || []).map(schedule => ({
          ...schedule,
          athlete: {
            ...schedule.athlete,
            initials: schedule.athlete?.full_name
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase() || '??'
          }
        }));
        
        setSchedules(processedData);
        setTotalCount(count || 0);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
        
        // Extrair lista de atletas únicos
        const uniqueAthletes = [];
        const athleteIds = new Set();
        
        // Buscar todos os atletas do trainer para o filtro
        const { data: athleteData } = await supabase
          .from('athlete_trainer')
          .select(`
            athlete:profiles!athlete_trainer_athlete_id_fkey(
              id,
              full_name
            )
          `)
          .eq('trainer_id', user?.id)
          .eq('status', 'active');
        
        if (athleteData) {
          athleteData.forEach(item => {
            if (item.athlete && !athleteIds.has(item.athlete.id)) {
              athleteIds.add(item.athlete.id);
              uniqueAthletes.push({
                id: item.athlete.id,
                name: item.athlete.full_name
              });
            }
          });
        }
        
        setAthletes(uniqueAthletes);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, itemsPerPage, filters, sortField, sortDirection, user]);

  useEffect(() => {
    if (user?.id) {
      fetchSchedules();
    }
  }, [fetchSchedules, user]);

  // ========================================
  // AÇÕES
  // ========================================

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja eliminar este agendamento?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao eliminar agendamento');
      } else {
        toast.success('Agendamento eliminado com sucesso');
        fetchSchedules();
      }
    } catch (error) {
      toast.error('Erro ao eliminar agendamento');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) {
      toast.error('Selecione pelo menos um item');
      return;
    }

    if (!window.confirm(`Tem certeza que deseja eliminar ${selectedItems.length} agendamento(s)?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .in('id', selectedItems);

      if (error) {
        toast.error('Erro ao eliminar agendamentos');
      } else {
        toast.success(`${selectedItems.length} agendamento(s) eliminado(s)`);
        setSelectedItems([]);
        setSelectAll(false);
        fetchSchedules();
      }
    } catch (error) {
      toast.error('Erro ao eliminar agendamentos');
    }
  };

  const handleExport = () => {
    // Criar CSV
    const headers = ['Data', 'Hora', 'Atleta', 'Título', 'Tipo', 'Status', 'Local'];
    const rows = schedules.map(s => [
      new Date(s.scheduled_date).toLocaleDateString('pt-PT'),
      `${s.start_time?.slice(0, 5)} - ${s.end_time?.slice(0, 5)}`,
      s.athlete?.full_name || '',
      s.title || '',
      s.type || '',
      s.status || '',
      s.is_online ? 'Online' : (s.location || 'Presencial')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Dados exportados com sucesso');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(schedules.map(s => s.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // ========================================
  // UTILIDADES
  // ========================================

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { color: 'yellow', icon: Clock, label: 'Agendado' },
      confirmed: { color: 'blue', icon: CheckCircle, label: 'Confirmado' },
      completed: { color: 'green', icon: CheckCircle, label: 'Concluído' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelado' },
      no_show: { color: 'gray', icon: AlertCircle, label: 'Não compareceu' }
    };
    return badges[status] || { color: 'gray', icon: AlertCircle, label: status };
  };

  const getTypeBadge = (type) => {
    const badges = {
      training: { color: 'blue', label: 'Treino' },
      consultation: { color: 'purple', label: 'Consulta' },
      assessment: { color: 'green', label: 'Avaliação' },
      recovery: { color: 'orange', label: 'Recuperação' },
      group_class: { color: 'pink', label: 'Aula em Grupo' },
      online: { color: 'indigo', label: 'Online' },
      other: { color: 'gray', label: 'Outro' }
    };
    return badges[type] || { color: 'gray', label: type };
  };

  // ========================================
  // RENDER
  // ========================================

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar lista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Agendamentos</h1>
          <p className="text-gray-600 mt-1">
            {totalCount} agendamento{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Atualizar"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Exportar
          </button>
          
          <button
            onClick={() => navigate('/schedule/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Pesquisa */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Atleta */}
          <div>
            <select
              value={filters.athleteId}
              onChange={(e) => setFilters({ ...filters, athleteId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Atletas</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Estados</option>
              <option value="scheduled">Agendado</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
              <option value="no_show">Não Compareceu</option>
            </select>
          </div>
          
          {/* Data De */}
          <div>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Data de"
            />
          </div>
          
          {/* Data Até */}
          <div>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Data até"
            />
          </div>
        </div>
        
        {/* Ações em massa */}
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedItems.length} item(s) selecionado(s)
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Eliminar Selecionados
            </button>
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('scheduled_date')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Data
                    {sortField === 'scheduled_date' && (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('start_time')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Horário
                    {sortField === 'start_time' && (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Atleta
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Título
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Estado
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum agendamento encontrado</p>
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  const statusBadge = getStatusBadge(schedule.status);
                  const typeBadge = getTypeBadge(schedule.type);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(schedule.id)}
                          onChange={() => handleSelectItem(schedule.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Clock size={14} className="text-gray-400" />
                          {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {schedule.duration_minutes} min
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {schedule.athlete?.avatar_url ? (
                            <img 
                              src={schedule.athlete.avatar_url} 
                              alt={schedule.athlete.full_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                              {schedule.athlete?.initials}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {schedule.athlete?.full_name || 'Sem atleta'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {schedule.athlete?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {schedule.title || 'Sem título'}
                        </div>
                        {schedule.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {schedule.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded-full
                          bg-${typeBadge.color}-100 text-${typeBadge.color}-700
                        `}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {schedule.is_online ? (
                            <>
                              <Video size={14} />
                              Online
                            </>
                          ) : (
                            <>
                              <MapPin size={14} />
                              {schedule.location || 'Presencial'}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`
                            inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                            bg-${statusBadge.color}-100 text-${statusBadge.color}-700
                          `}>
                            <StatusIcon size={12} />
                            {statusBadge.label}
                          </span>
                          {schedule.athlete_confirmed && (
                            <CheckCircle size={14} className="text-green-500" title="Confirmado pelo atleta" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/schedule/detail/${schedule.id}`)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => navigate(`/schedule/edit/${schedule.id}`)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              A mostrar <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{' '}
              de <span className="font-medium">{totalCount}</span> resultados
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              
              <span className="px-3 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;