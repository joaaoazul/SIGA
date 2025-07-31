import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  User,
  Plus,
  Filter,
  Search,
  Camera,
  Ruler,
  Weight,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Eye,
  Activity
} from 'lucide-react';

const CheckInsView = () => {
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCheckIn, setShowNewCheckIn] = useState(false);
  
  // Mock data - check-ins agendados e histórico
  const scheduledCheckIns = [
    {
      id: 1,
      clientName: 'João Azul',
      clientAvatar: null,
      date: '2025-01-28',
      time: '09:00',
      type: 'weekly',
      measurements: ['weight', 'bodyFat', 'photos'],
      status: 'scheduled',
      planName: 'Muscle Gain',
      lastCheckIn: '2025-01-21'
    },
    {
      id: 2,
      clientName: 'Maria Silva',
      clientAvatar: null,
      date: '2025-01-28',
      time: '14:30',
      type: 'biweekly',
      measurements: ['weight', 'measurements'],
      status: 'scheduled',
      planName: 'Fat Loss',
      lastCheckIn: '2025-01-14'
    },
    {
      id: 3,
      clientName: 'Pedro Santos',
      clientAvatar: null,
      date: '2025-01-29',
      time: '10:00',
      type: 'monthly',
      measurements: ['weight', 'bodyFat', 'measurements', 'photos'],
      status: 'scheduled',
      planName: 'Maintenance',
      lastCheckIn: '2024-12-29'
    }
  ];
  
  const checkInHistory = [
    {
      id: 4,
      clientName: 'Ana Costa',
      date: '2025-01-26',
      type: 'weekly',
      status: 'completed',
      data: {
        weight: 58.2,
        weightChange: -0.5,
        bodyFat: 22.1,
        bodyFatChange: -0.3,
        compliance: 92,
        notes: 'Excelente progresso. Mantendo deficit calórico bem.'
      }
    },
    {
      id: 5,
      clientName: 'Carlos Dias',
      date: '2025-01-25',
      type: 'biweekly',
      status: 'completed',
      data: {
        weight: 82.7,
        weightChange: +0.3,
        measurements: { waist: 88, chest: 106, arm: 38 },
        compliance: 88,
        notes: 'Ganho de massa muscular conforme esperado.'
      }
    },
    {
      id: 6,
      clientName: 'Rita Mendes',
      date: '2025-01-24',
      type: 'weekly',
      status: 'missed',
      notes: 'Cliente não compareceu. Reagendar.'
    }
  ];
  
  // Tipos de check-in
  const checkInTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];
  
  // Componente de avatar
  const ClientAvatar = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
        {initials}
      </div>
    );
  };
  
  // Card de check-in agendado
  const ScheduledCheckInCard = ({ checkIn }) => {
    const measurementIcons = {
      weight: Weight,
      bodyFat: Activity,
      measurements: Ruler,
      photos: Camera
    };
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <ClientAvatar name={checkIn.clientName} />
            <div>
              <h3 className="font-semibold text-gray-900">{checkIn.clientName}</h3>
              <p className="text-sm text-gray-600">{checkIn.planName}</p>
            </div>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
            {checkIn.type}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(checkIn.date).toLocaleDateString('pt-PT')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{checkIn.time}</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2">Measurements to take:</p>
            <div className="flex flex-wrap gap-2">
              {checkIn.measurements.map(measurement => {
                const Icon = measurementIcons[measurement] || FileText;
                return (
                  <span 
                    key={measurement}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    {measurement}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Last check-in: {new Date(checkIn.lastCheckIn).toLocaleDateString('pt-PT')}
            </p>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
              Start Check-in
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Card de histórico
  const HistoryCard = ({ checkIn }) => {
    const statusConfig = {
      completed: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        icon: CheckCircle2
      },
      missed: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: AlertCircle
      }
    };
    
    const config = statusConfig[checkIn.status];
    const StatusIcon = config.icon;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <ClientAvatar name={checkIn.clientName} />
            <div>
              <h3 className="font-semibold text-gray-900">{checkIn.clientName}</h3>
              <p className="text-sm text-gray-600">
                {new Date(checkIn.date).toLocaleDateString('pt-PT', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs ${config.bg} ${config.text} px-2 py-1 rounded-full`}>
            <StatusIcon className="w-3 h-3" />
            {checkIn.status}
          </span>
        </div>
        
        {checkIn.status === 'completed' && checkIn.data && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {checkIn.data.weight && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Weight</p>
                  <p className="text-lg font-bold text-gray-900">
                    {checkIn.data.weight} kg
                    {checkIn.data.weightChange && (
                      <span className={`text-sm font-normal ml-1 ${
                        checkIn.data.weightChange < 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {checkIn.data.weightChange > 0 ? '+' : ''}{checkIn.data.weightChange}
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              {checkIn.data.bodyFat && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Body Fat</p>
                  <p className="text-lg font-bold text-gray-900">
                    {checkIn.data.bodyFat}%
                    {checkIn.data.bodyFatChange && (
                      <span className={`text-sm font-normal ml-1 ${
                        checkIn.data.bodyFatChange < 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {checkIn.data.bodyFatChange > 0 ? '+' : ''}{checkIn.data.bodyFatChange}
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              {checkIn.data.compliance && (
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Plan Compliance</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${checkIn.data.compliance}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {checkIn.data.compliance}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {checkIn.data.notes && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 italic">"{checkIn.data.notes}"</p>
              </div>
            )}
          </div>
        )}
        
        {checkIn.status === 'missed' && checkIn.notes && (
          <p className="text-sm text-gray-600 mt-3">{checkIn.notes}</p>
        )}
        
        <div className="flex items-center justify-end gap-2 mt-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-ins</h1>
          <p className="text-gray-500 mt-1">Track client progress and measurements</p>
        </div>
        <button 
          onClick={() => setShowNewCheckIn(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Check-in
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {checkInTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More filters
          </button>
        </div>
      </div>
      
      {/* Scheduled Check-ins */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Check-ins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledCheckIns.map(checkIn => (
            <ScheduledCheckInCard key={checkIn.id} checkIn={checkIn} />
          ))}
        </div>
      </div>
      
      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkInHistory.map(checkIn => (
            <HistoryCard key={checkIn.id} checkIn={checkIn} />
          ))}
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">48</p>
          <p className="text-sm text-gray-500">Total this month</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">94%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">6%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-500">Missed</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">14</p>
          <p className="text-sm text-gray-500">Clients tracked</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInsView;