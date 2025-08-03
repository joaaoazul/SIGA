// =============================================
// AdminAdvancedFeatures.js - src/modules/admin/components/AdminAdvancedFeatures.js
// =============================================

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Database,
  Activity,
  AlertTriangle,
  Download,
  Upload,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  Server,
  HardDrive,
  Zap,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import toast from 'react-hot-toast';

// =============================================
// 1. Componente de Backup do Sistema
// =============================================
export const SystemBackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [creating, setCreating] = useState(false);
  const [selectedTables, setSelectedTables] = useState([
    'profiles',
    'workout_plans',
    'workout_sessions',
    'nutrition_plans'
  ]);

  const tables = [
    { name: 'profiles', label: 'Perfis de Usuários', critical: true },
    { name: 'workout_plans', label: 'Planos de Treino', critical: true },
    { name: 'workout_sessions', label: 'Sessões de Treino', critical: false },
    { name: 'nutrition_plans', label: 'Planos Nutricionais', critical: true },
    { name: 'messages', label: 'Mensagens', critical: false },
    { name: 'system_settings', label: 'Configurações', critical: true }
  ];

  const createBackup = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('system_backups')
        .insert({
          backup_type: 'manual',
          status: 'running',
          tables_included: selectedTables,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (!error) {
        toast.success('Backup iniciado com sucesso!');
        // Simular progresso do backup
        setTimeout(() => {
          updateBackupStatus(data.id, 'completed');
        }, 5000);
      }
    } catch (error) {
      toast.error('Erro ao criar backup');
    } finally {
      setCreating(false);
    }
  };

  const updateBackupStatus = async (backupId, status) => {
    await supabase
      .from('system_backups')
      .update({
        status,
        completed_at: new Date().toISOString(),
        size_bytes: Math.floor(Math.random() * 1000000000) // Simular tamanho
      })
      .eq('id', backupId);
    
    loadBackups();
  };

  const loadBackups = async () => {
    const { data } = await supabase
      .from('system_backups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setBackups(data || []);
  };

  useEffect(() => {
    loadBackups();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Gestão de Backups
        </h3>
        <button
          onClick={createBackup}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {creating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Criar Backup
        </button>
      </div>

      {/* Seleção de Tabelas */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-3">Tabelas a incluir:</p>
        <div className="grid grid-cols-2 gap-2">
          {tables.map(table => (
            <label key={table.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTables.includes(table.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTables([...selectedTables, table.name]);
                  } else {
                    setSelectedTables(selectedTables.filter(t => t !== table.name));
                  }
                }}
                className="rounded text-blue-600"
                disabled={table.critical}
              />
              <span className={`text-sm ${table.critical ? 'font-medium' : ''}`}>
                {table.label}
                {table.critical && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Lista de Backups */}
      <div className="space-y-3">
        {backups.map(backup => (
          <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                backup.status === 'completed' ? 'bg-green-100' :
                backup.status === 'running' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Database className={`h-5 w-5 ${
                  backup.status === 'completed' ? 'text-green-600' :
                  backup.status === 'running' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Backup {backup.backup_type === 'manual' ? 'Manual' : 'Automático'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(backup.created_at).toLocaleString('pt-PT')}
                  {backup.size_bytes && ` • ${(backup.size_bytes / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {backup.status === 'completed' && (
                <>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Upload className="h-4 w-4" />
                  </button>
                </>
              )}
              {backup.status === 'running' && (
                <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================
// 2. Monitor de Performance em Tempo Real
// =============================================
export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeConnections: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    // Simular métricas em tempo real
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 30 + 20,
        memory: Math.random() * 20 + 60,
        disk: Math.random() * 10 + 70,
        network: Math.random() * 50 + 10,
        activeConnections: Math.floor(Math.random() * 50 + 100),
        avgResponseTime: Math.random() * 100 + 50
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, thresholds = { good: 50, warning: 70 }) => {
    if (value < thresholds.good) return 'text-green-600';
    if (value < thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2" />
        Monitor de Performance
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${metrics.cpu * 2.26} 226`}
                transform="rotate(-90 40 40)"
                className={getStatusColor(metrics.cpu)}
              />
            </svg>
            <span className="absolute text-xl font-bold">{Math.round(metrics.cpu)}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">CPU</p>
        </div>

        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${metrics.memory * 2.26} 226`}
                transform="rotate(-90 40 40)"
                className={getStatusColor(metrics.memory)}
              />
            </svg>
            <span className="absolute text-xl font-bold">{Math.round(metrics.memory)}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Memória</p>
        </div>

        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${metrics.disk * 2.26} 226`}
                transform="rotate(-90 40 40)"
                className={getStatusColor(metrics.disk, { good: 70, warning: 85 })}
              />
            </svg>
            <span className="absolute text-xl font-bold">{Math.round(metrics.disk)}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Disco</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{metrics.activeConnections}</p>
          <p className="text-sm text-gray-600">Conexões Ativas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.avgResponseTime)}ms</p>
          <p className="text-sm text-gray-600">Tempo Resposta</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.network)} MB/s</p>
          <p className="text-sm text-gray-600">Rede</p>
        </div>
      </div>
    </div>
  );
};

// =============================================
// 3. Gestor de Manutenção Programada
// =============================================
export const MaintenanceScheduler = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_start: '',
    scheduled_end: '',
    affected_services: []
  });

  const services = [
    'Base de Dados',
    'API',
    'Storage',
    'Email',
    'Pagamentos',
    'Notificações'
  ];

  const createMaintenance = async () => {
    try {
      const { error } = await supabase
        .from('scheduled_maintenance')
        .insert({
          ...formData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (!error) {
        toast.success('Manutenção agendada com sucesso!');
        setShowForm(false);
        loadMaintenances();
      }
    } catch (error) {
      toast.error('Erro ao agendar manutenção');
    }
  };

  const loadMaintenances = async () => {
    const { data } = await supabase
      .from('scheduled_maintenance')
      .select('*')
      .order('scheduled_start', { ascending: true });
    
    setMaintenances(data || []);
  };

  useEffect(() => {
    loadMaintenances();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Manutenção Programada
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Manutenção
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Início
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_start}
                  onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fim
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_end}
                  onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviços Afetados
              </label>
              <div className="grid grid-cols-3 gap-2">
                {services.map(service => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.affected_services.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            affected_services: [...formData.affected_services, service]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            affected_services: formData.affected_services.filter(s => s !== service)
                          });
                        }
                      }}
                      className="rounded text-orange-600"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={createMaintenance}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {maintenances.map(maintenance => (
          <div key={maintenance.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{maintenance.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{maintenance.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(maintenance.scheduled_start).toLocaleString('pt-PT')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Duração: {Math.round((new Date(maintenance.scheduled_end) - new Date(maintenance.scheduled_start)) / 60000)} min
                  </span>
                </div>
                {maintenance.affected_services && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {maintenance.affected_services.map(service => (
                      <span key={service} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                maintenance.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                maintenance.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                maintenance.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {maintenance.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};