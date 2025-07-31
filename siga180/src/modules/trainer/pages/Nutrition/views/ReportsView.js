import React, { useState } from 'react';
import { 
  FileText,
  Download,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Filter,
  Eye,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Printer,
  FileDown
} from 'lucide-react';

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Tipos de relatórios disponíveis
  const reportTypes = [
    {
      id: 'progress',
      title: 'Progress Report',
      description: 'Individual client progress tracking',
      icon: TrendingUp,
      color: 'emerald',
      frequency: 'Weekly/Monthly',
      lastGenerated: '2025-01-25'
    },
    {
      id: 'compliance',
      title: 'Compliance Analysis',
      description: 'Plan adherence and meal tracking',
      icon: CheckCircle2,
      color: 'blue',
      frequency: 'Weekly',
      lastGenerated: '2025-01-26'
    },
    {
      id: 'group',
      title: 'Group Overview',
      description: 'Aggregated client statistics',
      icon: Users,
      color: 'purple',
      frequency: 'Monthly',
      lastGenerated: '2025-01-15'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Summary',
      description: 'Macro and calorie analytics',
      icon: PieChart,
      color: 'orange',
      frequency: 'Bi-weekly',
      lastGenerated: '2025-01-20'
    }
  ];
  
  // Relatórios recentes
  const recentReports = [
    {
      id: 1,
      type: 'progress',
      client: 'João Azul',
      period: 'January 2025',
      generatedAt: '2025-01-25 14:30',
      status: 'ready',
      pages: 8,
      highlights: {
        weightLoss: -2.3,
        fatLoss: -1.8,
        compliance: 92
      }
    },
    {
      id: 2,
      type: 'compliance',
      client: 'Maria Silva',
      period: 'Week 3, Jan 2025',
      generatedAt: '2025-01-24 10:15',
      status: 'ready',
      pages: 4,
      highlights: {
        mealTracking: 89,
        planAdherence: 94,
        missedMeals: 3
      }
    },
    {
      id: 3,
      type: 'group',
      client: 'All Clients',
      period: 'December 2024',
      generatedAt: '2024-12-31 18:00',
      status: 'ready',
      pages: 12,
      highlights: {
        avgCompliance: 87,
        activeClients: 14,
        totalProgress: '+15%'
      }
    }
  ];
  
  // Scheduled reports
  const scheduledReports = [
    {
      id: 1,
      type: 'progress',
      client: 'Pedro Santos',
      scheduledFor: '2025-01-30',
      frequency: 'monthly',
      recipients: ['pedro@example.com', 'trainer@gym.com']
    },
    {
      id: 2,
      type: 'compliance',
      client: 'All Active Clients',
      scheduledFor: '2025-02-01',
      frequency: 'weekly',
      recipients: ['trainer@gym.com']
    }
  ];
  
  // Quick stats
  const reportStats = {
    totalGenerated: 156,
    thisMonth: 24,
    scheduled: 8,
    avgPages: 6.5
  };
  
  // Report Type Card
  const ReportTypeCard = ({ report }) => {
    const Icon = report.icon;
    const colorClasses = {
      emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };
    
    return (
      <button
        onClick={() => setSelectedReport(report.id)}
        className={`
          p-5 rounded-xl border-2 transition-all text-left w-full
          ${selectedReport === report.id 
            ? 'border-emerald-500 shadow-lg' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
        `}
      >
        <div className={`w-12 h-12 rounded-lg ${colorClasses[report.color]} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{report.frequency}</span>
          <span className="text-gray-400">Last: {report.lastGenerated}</span>
        </div>
      </button>
    );
  };
  
  // Recent Report Card
  const RecentReportCard = ({ report }) => {
    const typeConfig = reportTypes.find(t => t.id === report.type);
    const Icon = typeConfig?.icon || FileText;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${typeConfig?.color || 'gray'}-50 text-${typeConfig?.color || 'gray'}-600 flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{typeConfig?.title}</h3>
              <p className="text-sm text-gray-600">{report.client}</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {report.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Period:</span> {report.period}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Generated:</span> {report.generatedAt}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Pages:</span> {report.pages}
          </p>
        </div>
        
        {/* Highlights */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Key Highlights:</p>
          <div className="space-y-1">
            {Object.entries(report.highlights).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-medium text-gray-900">
                  {typeof value === 'number' && value < 0 && '-'}
                  {typeof value === 'number' && key.includes('Loss') ? Math.abs(value) + ' kg' : value}
                  {typeof value === 'number' && !key.includes('Loss') && !key.includes('missed') && '%'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPreview(true)}
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  
  // Scheduled Report Card
  const ScheduledReportCard = ({ report }) => {
    const typeConfig = reportTypes.find(t => t.id === report.type);
    const Icon = typeConfig?.icon || FileText;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded bg-${typeConfig?.color || 'gray'}-50 text-${typeConfig?.color || 'gray'}-600 flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{typeConfig?.title}</h4>
              <p className="text-xs text-gray-600">{report.client}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Clock className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Next generation:</span>
            <span className="font-medium">{new Date(report.scheduledFor).toLocaleDateString('pt-PT')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Frequency:</span>
            <span className="font-medium capitalize">{report.frequency}</span>
          </div>
          <div>
            <span className="text-gray-500">Recipients: {report.recipients.length}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and manage nutrition reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">All time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportStats.totalGenerated}</p>
          <p className="text-sm text-gray-500">Reports generated</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">+20%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportStats.thisMonth}</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportStats.scheduled}</p>
          <p className="text-sm text-gray-500">Scheduled</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Avg</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportStats.avgPages}</p>
          <p className="text-sm text-gray-500">Pages per report</p>
        </div>
      </div>
      
      {/* Report Types */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map(report => (
            <ReportTypeCard key={report.id} report={report} />
          ))}
        </div>
      </div>
      
      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {recentReports.map(report => (
              <RecentReportCard key={report.id} report={report} />
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View all reports →
          </button>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h2>
          <div className="space-y-3">
            {scheduledReports.map(report => (
              <ScheduledReportCard key={report.id} report={report} />
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pro Tip
            </h4>
            <p className="text-sm text-blue-700">
              Schedule automated weekly reports to keep clients engaged and track progress consistently.
            </p>
          </div>
        </div>
      </div>
      
      {/* Export Options */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group">
            <FileDown className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 mb-2" />
            <p className="font-medium text-gray-900">PDF Export</p>
            <p className="text-sm text-gray-500">Professional reports</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group">
            <Mail className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 mb-2" />
            <p className="font-medium text-gray-900">Email Delivery</p>
            <p className="text-sm text-gray-500">Direct to clients</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group">
            <Printer className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 mb-2" />
            <p className="font-medium text-gray-900">Print Ready</p>
            <p className="text-sm text-gray-500">High quality output</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;