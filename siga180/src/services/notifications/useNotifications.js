import { useState, useEffect, useCallback } from 'react';
import pushService from './PushNotificationService';
import wsService from '../websocket/WebSocketService';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check support
    setIsSupported(pushService.isSupported);
    
    // Initialize push service
    pushService.init().then(() => {
      setPermission(pushService.permission);
      setIsEnabled(pushService.isEnabled());
    });

    // Listen for WebSocket notifications
    const handleNotification = (data) => {
      // Show push notification based on type
      switch (data.type) {
        case 'meal-photo':
          pushService.notifyMealPhoto(data.athleteName, data.mealName);
          break;
        case 'workout-complete':
          pushService.notifyWorkoutComplete(data.athleteName, data.workoutName);
          break;
        case 'checkin-due':
          pushService.notifyCheckInDue(data.athleteName);
          break;
        case 'message':
          pushService.notifyMessage(data.athleteName, data.message);
          break;
        default:
          pushService.showNotification(data.title, data.options);
      }
    };

    wsService.on('notification', handleNotification);

    return () => {
      wsService.off('notification', handleNotification);
    };
  }, []);

  const enableNotifications = useCallback(async () => {
    const success = await pushService.requestPermission();
    if (success) {
      setPermission('granted');
      setIsEnabled(true);
    }
    return success;
  }, []);

  const disableNotifications = useCallback(async () => {
    const success = await pushService.unsubscribe();
    if (success) {
      setIsEnabled(false);
    }
    return success;
  }, []);

  const showTestNotification = useCallback(() => {
    pushService.showNotification('Notificação de Teste', {
      body: 'As notificações estão a funcionar corretamente!',
      tag: 'test'
    });
  }, []);

  return {
    permission,
    isEnabled,
    isSupported,
    enableNotifications,
    disableNotifications,
    showTestNotification
  };
};