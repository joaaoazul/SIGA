import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Camera,
  Paperclip,
  Check,
  CheckCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Image,
  X,
  Smile,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';

const MealChatComponent = ({ 
  mealId, 
  mealName, 
  athleteId, 
  athleteName,
  isMinimized = false,
  onToggleMinimize,
  position = 'inline' // 'inline' ou 'floating'
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'athlete',
      senderName: athleteName,
      type: 'text',
      content: 'Posso substituir o frango por peixe hoje?',
      timestamp: '10:30',
      read: true,
      reactions: []
    },
    {
      id: 2,
      sender: 'trainer',
      senderName: 'Tu',
      type: 'text',
      content: 'Claro! Usa 150g de pescada ou salmão para manter as proteínas.',
      timestamp: '10:32',
      read: true,
      reactions: ['👍']
    },
    {
      id: 3,
      sender: 'athlete',
      senderName: athleteName,
      type: 'image',
      content: '/api/placeholder/400/300',
      caption: 'Ficou assim, está bom?',
      timestamp: '12:45',
      read: true,
      reactions: []
    },
    {
      id: 4,
      sender: 'trainer',
      senderName: 'Tu',
      type: 'approval',
      content: 'Refeição aprovada! Ótima apresentação 👏',
      timestamp: '12:48',
      read: false,
      approved: true,
      reactions: []
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFullImage, setShowFullImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickResponses = [
    'Está perfeito! 👍',
    'Adiciona mais proteína',
    'Inclui vegetais',
    'Boa escolha!',
    'Usa integral',
    'Reduz a porção'
  ];

  const emojis = ['👍', '👏', '💪', '🔥', '✅', '❌', '⚠️', '🎯'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return;

    const message = {
      id: Date.now(),
      sender: 'trainer',
      senderName: 'Tu',
      type: selectedImage ? 'image' : 'text',
      content: selectedImage || newMessage,
      caption: selectedImage ? newMessage : undefined,
      timestamp: new Date().toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: false,
      reactions: []
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setSelectedImage(null);
    setShowImagePreview(false);
    
    // Simulate athlete typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const handleApproval = (approved) => {
    const message = {
      id: Date.now(),
      sender: 'trainer',
      senderName: 'Tu',
      type: 'approval',
      content: approved ? 'Refeição aprovada! ✅' : 'Esta refeição precisa de ajustes 🔄',
      approved,
      timestamp: new Date().toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: false,
      reactions: []
    };

    setMessages([...messages, message]);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const addReaction = (messageId, emoji) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reactions: msg.reactions.includes(emoji) 
              ? msg.reactions.filter(r => r !== emoji)
              : [...msg.reactions, emoji]
          }
        : msg
    ));
  };

  const MessageBubble = ({ message }) => {
    const isTrainer = message.sender === 'trainer';
    
    return (
      <div className={`flex ${isTrainer ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[70%] ${isTrainer ? 'order-2' : ''}`}>
          {/* Sender name */}
          {!isTrainer && (
            <p className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</p>
          )}
          
          <div className={`rounded-lg px-3 py-2 ${
            isTrainer 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          } ${message.type === 'approval' ? 'border-2 ' + (message.approved ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50') : ''}`}>
            
            {message.type === 'image' && (
              <img 
                src={message.content} 
                alt="Meal" 
                className="rounded-lg mb-2 cursor-pointer max-w-full"
                onClick={() => setShowFullImage(message.content)}
              />
            )}
            
            {(message.type === 'text' || message.caption) && (
              <p className={`text-sm ${message.type === 'approval' ? 'text-gray-900' : ''}`}>
                {message.caption || message.content}
              </p>
            )}
            
            {message.type === 'approval' && (
              <div className="flex items-center gap-2">
                {message.approved ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                )}
                <span className={`text-sm font-medium ${message.approved ? 'text-green-700' : 'text-orange-700'}`}>
                  {message.content}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-xs text-gray-400">{message.timestamp}</span>
            {isTrainer && (
              <span className="text-xs text-gray-400">
                {message.read ? <CheckCheck className="h-3 w-3 inline" /> : <Check className="h-3 w-3 inline" />}
              </span>
            )}
            {message.reactions.length > 0 && (
              <div className="flex gap-1">
                {message.reactions.map((emoji, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 rounded-full px-1">{emoji}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Versão minimizada
  if (isMinimized) {
    return (
      <div 
        className={`${position === 'floating' ? 'fixed bottom-4 right-4' : ''} bg-white rounded-lg shadow-md border border-gray-200 p-3 cursor-pointer hover:shadow-lg transition-all`}
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">{mealName}</p>
            <p className="text-xs text-gray-500">{athleteName}</p>
          </div>
          {messages.some(m => m.sender === 'athlete' && !m.read) && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-600 font-medium">Nova</span>
            </div>
          )}
          <ChevronUp className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }

  // Versão expandida
  const containerClasses = position === 'floating' 
    ? 'fixed bottom-4 right-4 w-96 h-[600px]' 
    : 'w-full h-full min-h-[500px]';

  return (
    <div className={`${containerClasses} bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{mealName}</h3>
              <p className="text-xs text-gray-600">{athleteName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={onToggleMinimize}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs">{athleteName} está a escrever...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">Ações rápidas</span>
          <div className="flex gap-1">
            <button
              onClick={() => handleApproval(true)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Aprovar refeição"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleApproval(false)}
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
              title="Solicitar ajustes"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Quick Responses */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {quickResponses.map((response, idx) => (
            <button
              key={idx}
              onClick={() => setNewMessage(response)}
              className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* Image Preview */}
      {showImagePreview && selectedImage && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="relative inline-block">
            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded" />
            <button
              onClick={() => {
                setSelectedImage(null);
                setShowImagePreview(false);
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
          
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escreve uma mensagem..."
            className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !selectedImage}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(null)}
        >
          <img 
            src={showFullImage} 
            alt="Full view" 
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
          <button
            onClick={() => setShowFullImage(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Exemplo de uso na página
const MealDetailPage = () => {
  const [chatMinimized, setChatMinimized] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plano Nutricional - João Silva</h2>
              <p className="text-gray-600">Detalhes do plano nutricional...</p>
            </div>
          </div>

          {/* Chat lateral */}
          <div className="lg:col-span-1">
            <MealChatComponent
              mealId="meal-1"
              mealName="Almoço"
              athleteId="athlete-1"
              athleteName="João Silva"
              isMinimized={chatMinimized}
              onToggleMinimize={() => setChatMinimized(!chatMinimized)}
              position="inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealChatComponent;