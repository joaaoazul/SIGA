import React from 'react';
import { Bell, Plus, ChevronDown } from 'lucide-react';
import logoHeader from '../../assets/logo_header.png';

const Header = ({ title = 'Home', user }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <img
  src={logoHeader}
  alt="Logo"
  className="w-8 h-8 rounded-full object-cover"
/>
            <span className="text-xl font-bold text-gray-900">180 Performance Unit</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 bg-red-100 rounded-lg px-4 py-1">
  {title}
</h1>
        </div>
        

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150?img=5"} 
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;