import React, { useState, useEffect } from 'react';
import { Users, CheckCircle } from 'lucide-react';
import Layout from '../../shared/components/layout/Layout';
import ClientSessionCard from '../components/ClientSessionCard';
import MessageItem from '../components/MessageItem';
import ProgressChart from '../components/ProgressChart';
import StatsCard from '../components/StatsCard';
import OverviewCard from '../components/OverviewCard';
// Importar hooks quando estiverem disponíveis
// import { useAthletes } from '../../shar../../shared/hooks/useAthletes';
// import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

const Dashboard = () => {
  // Dados mockados - substituir com dados reais dos hooks
  const [todaySessions] = useState([
    {
      id: 1,
      time: '1:00 - 2:00',
      client: 'Ambrosio Silva',
      activity: 'Strength Training',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'scheduled'
    },
    {
      id: 2,
      time: '3:00 - 4:00',
      client: 'Ryan Harris',
      activity: 'Cardio',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'ongoing'
    }
  ]);

  const [recentMessages] = useState([
    {
      id: 1,
      client: 'Sarah Moore',
      text: 'Great workout today!',
      avatar: 'https://i.pravatar.cc/150?img=3',
      time: '2h ago',
      isRead: false
    },
    {
      id: 2,
      client: 'Daniel Scott',
      text: 'Thanks for feedback',
      avatar: 'https://i.pravatar.cc/150?img=4',
      time: '5h ago',
      isRead: true
    }
  ]);

  const [progressData] = useState([
    { day: 'S', value: 8 },
    { day: 'M', value: 15 },
    { day: 'T', value: 12 },
    { day: 'W', value: 25 },
    { day: 'T', value: 38 },
    { day: 'F', value: 22 },
    { day: 'S', value: 30 }
  ]);

  const [overviewStats] = useState({
    totalClients: 20,
    activePlans: 12,
    monthlyGrowth: 15,
    completionRate: 92,
    avgSessionTime: 55,
    weeklyRevenue: 3250
  });

  // Handlers
  const handleSessionClick = (session) => {
    console.log('Session clicked:', session);
    // Navegar para detalhes da sessão
  };

  const handleMessageClick = (message) => {
    console.log('Message clicked:', message);
    // Navegar para mensagens
  };

  const handleViewMore = () => {
    console.log('View more clicked');
    // Navegar para analytics
  };

  return (
    
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Esquerda - Sessões e Mensagens */}
          <div className="space-y-6">
            {/* Today's Sessions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Client Sessions
              </h2>
              <div className="space-y-2">
                {todaySessions.map((session) => (
                  <ClientSessionCard 
                    key={session.id} 
                    session={session}
                    onClick={() => handleSessionClick(session)}
                  />
                ))}
              </div>
            </div>
            
            {/* Recent Messages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Messages
              </h2>
              <div className="space-y-2">
                {recentMessages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message}
                    onClick={() => handleMessageClick(message)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Central - Gráfico e Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ProgressChart 
                data={progressData}
                title="Progress"
                metric="Weekly Stats"
              />
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <StatsCard 
                  icon={Users} 
                  value="12" 
                  label="Active Plans" 
                  color="green"
                  trend={8}
                />
                <StatsCard 
                  icon={CheckCircle} 
                  value="240" 
                  label="Total Sessions" 
                  color="blue"
                  trend={12}
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita - Overview */}
          <OverviewCard 
            stats={overviewStats}
            onViewMore={handleViewMore}
            
          />
        </div>
      </div>
    
  );
};

export default Dashboard;