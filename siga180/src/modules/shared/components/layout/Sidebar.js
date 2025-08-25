import React from 'react';
import {
  Home,
  Users,
  Dumbbell,
  TrendingUp,
  Apple,
  MessageSquare,
  Calendar,
  Settings,
  DollarSign,
  CheckSquare,
  Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isAthlete = user?.role === 'athlete';
  const isTrainer = user?.role === 'trainer';
  
  // Debug para verificar
  console.log('🎯 Sidebar - User Role:', user?.role, { isAthlete, isTrainer });
  
  // Menu items para TRAINER
  const trainerMenuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/athletes' },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/analytics' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, path: '/nutrition' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/schedule' },
    { id: 'financials', label: 'Financials', icon: DollarSign, path: '/financials' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];
  
  // Menu items para ATHLETE
  const athleteMenuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'workouts', label: 'My Workouts', icon: Dumbbell, path: '/workouts' },
    { id: 'progress', label: 'My Progress', icon: TrendingUp, path: '/progress' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, path: '/nutrition' },
    { id: 'checkin', label: 'Check-in', icon: CheckSquare, path: '/checkin' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const menuItems = isAthlete ? athleteMenuItems : trainerMenuItems;
  
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
                  ? 'bg-[#E8ECE3] text-[#333333]'
                  : 'text-[#333333] hover:bg-[#E8ECE3]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Info do utilizador */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center space-x-3 px-4 py-2">
          <Users className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {user?.name || user?.email || 'Utilizador'}
            </p>
            <p className="text-xs text-gray-500">
              {isTrainer ? 'Personal Trainer' : 'Atleta'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;