import React from 'react';
import { 
  Home,
  Users,
  Dumbbell,
  TrendingUp,
  Apple,
  MessageSquare,
  Calendar1,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/athletes' },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/analytics' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, path: '/nutrition' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
   { id: 'calendar', label: 'Calendar', icon: Calendar1, path: '/schedule' },

    {id: 'financials', label: 'Financials', icon: TrendingUp, path: '/financials'},
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
   <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">

  <nav className="p-4 space-y-1">
    {menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path || 
                      (item.path === '/athletes' && location.pathname.startsWith('/athletes'));

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      );
    })}
  </nav>

  {/* Subir o bloco com mt-6 */}
  <div className="p-4 border-t border-gray-200 mt-[70px]">
    <div className="flex items-center space-x-3 px-4 py-2">
      <Users className="h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">Rúben Ramos</p>
        <p className="text-xs text-gray-500">20/25 Athletes</p>
      </div>
    </div>
  </div>
</aside>


  );
};

export default Sidebar;