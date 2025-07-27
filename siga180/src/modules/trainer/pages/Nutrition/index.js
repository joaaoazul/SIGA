import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Apple, 
  Calculator,
  BarChart3,
  Database,
  Settings
} from 'lucide-react';

// Import Views
import DashboardView from './components/DashboardView';
import AthletesView from './components/AthletesView';
import PlansView from './components/PlansView';
import MealsView from './components/MealsView';
import ToolsView from './components/ToolsView';
// import DatabaseView from './components/DatabaseView';
// import AnalyticsView from './components/AnalyticsView';

const NutritionModule = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const views = {
    dashboard: {
      component: DashboardView,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    athletes: {
      component: AthletesView,
      label: 'Atletas',
      icon: Users
    },
    plans: {
      component: PlansView,
      label: 'Planos',
      icon: FileText
    },
    meals: {
      component: MealsView,
      label: 'Refeições',
      icon: Apple
    },
    tools: {
      component: ToolsView,
      label: 'Ferramentas',
      icon: Calculator
    },
    database: {
      component: null, // DatabaseView - A implementar
      label: 'Base de Dados',
      icon: Database
    },
    analytics: {
      component: null, // AnalyticsView - A implementar
      label: 'Analytics',
      icon: BarChart3
    }
  };

  const ActiveComponent = views[activeView].component;

  const handleNavigate = (view) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {Object.entries(views).map(([key, view]) => {
              const Icon = view.icon;
              const isActive = activeView === key;
              const isDisabled = !view.component;
              
              return (
                <button
                  key={key}
                  onClick={() => !isDisabled && setActiveView(key)}
                  disabled={isDisabled}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors
                    ${isActive 
                      ? 'border-blue-500 text-blue-600' 
                      : isDisabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{view.label}</span>
                  {isDisabled && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      Em breve
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {ActiveComponent ? (
          <ActiveComponent onNavigate={handleNavigate} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Esta secção está em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionModule;