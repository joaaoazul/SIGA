import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

const ClientSessionCard = ({ session, onClick }) => {
  const { time, client, activity, avatar, status = 'scheduled' } = session;
  
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group"
    >
      <div className="relative">
        <img 
          src={avatar} 
          alt={client}
          className="w-12 h-12 rounded-full object-cover"
        />
        {status === 'ongoing' && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{time}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
            {status}
          </span>
        </div>
        <div className="text-base font-semibold text-gray-900">{client}</div>
        <div className="text-sm text-gray-600">{activity}</div>
      </div>
      
      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ClientSessionCard;