import React from 'react';
import { MessageCircle, Circle } from 'lucide-react';

const MessageItem = ({ message, onClick }) => {
  const { client, text, avatar, time, isRead = false } = message;
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer ${
        !isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative">
        <img 
          src={avatar} 
          alt={client}
          className="w-10 h-10 rounded-full object-cover"
        />
        {!isRead && (
          <Circle className="absolute -top-1 -right-1 w-3 h-3 fill-blue-600 text-blue-600" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-900 text-sm">{client}</div>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <div className={`text-sm truncate ${!isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {text}
        </div>
      </div>
      
      <MessageCircle className={`h-4 w-4 ${!isRead ? 'text-blue-600' : 'text-gray-400'}`} />
    </div>
  );
};

export default MessageItem;