import { STORAGE_KEYS } from '../api/config';
import axiosInstance from '../api/axiosInstance';

class PushNotificationService {
  constructor() {
    this.swRegistration = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.permission = Notification.permission;
  }

  // Initialize push notifications
  async init() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      // Check if user is logged in
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        // Check existing subscription
        const existingSubscription = await this.getSubscription();
        if (existingSubscription) {
          // Sync with server
          await this.syncSubscription(existingSubscription);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request permission
  async requestPermission() {
    if (!this.isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        console.log('Notification permission granted');
        return await this.subscribe();
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    if (!this.swRegistration) {
      console.error('Service worker not registered');
      return false;
    }

    try {
      // Get VAPID public key from server
      const response = await axiosInstance.get('/notifications/vapid-public-key');
      const vapidPublicKey = response.data.publicKey;

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      };

      const subscription = await this.swRegistration.pushManager.subscribe(subscribeOptions);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      // Store device token
      const deviceToken = this.generateDeviceToken(subscription);
      localStorage.setItem(STORAGE_KEYS.DEVICE_TOKEN, deviceToken);

      console.log('Push notification subscription successful');
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      const subscription = await this.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await this.removeSubscriptionFromServer();
        localStorage.removeItem(STORAGE_KEYS.DEVICE_TOKEN);
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  // Get current subscription
  async getSubscription() {
    if (!this.swRegistration) {
      return null;
    }

    try {
      return await this.swRegistration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      await axiosInstance.post('/notifications/subscribe', {
        subscription: subscription.toJSON(),
        deviceInfo: this.getDeviceInfo()
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  // Remove subscription from server
  async removeSubscriptionFromServer() {
    try {
      const deviceToken = localStorage.getItem(STORAGE_KEYS.DEVICE_TOKEN);
      if (deviceToken) {
        await axiosInstance.delete(`/notifications/unsubscribe/${deviceToken}`);
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  // Sync subscription with server
  async syncSubscription(subscription) {
    try {
      await axiosInstance.put('/notifications/sync', {
        subscription: subscription.toJSON(),
        deviceToken: localStorage.getItem(STORAGE_KEYS.DEVICE_TOKEN)
      });
    } catch (error) {
      console.error('Failed to sync subscription:', error);
    }
  }

  // Show local notification
  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options
    };

    if (this.swRegistration) {
      return await this.swRegistration.showNotification(title, defaultOptions);
    } else {
      return new Notification(title, defaultOptions);
    }
  }

  // Notification templates
  async notifyMealPhoto(athleteName, mealName) {
    return this.showNotification('Nova Foto de Refeição', {
      body: `${athleteName} enviou uma foto do ${mealName}`,
      tag: 'meal-photo',
      data: { type: 'meal-photo', athleteName, mealName },
      actions: [
        { action: 'view', title: 'Ver' },
        { action: 'approve', title: 'Aprovar' }
      ]
    });
  }

  async notifyWorkoutComplete(athleteName, workoutName) {
    return this.showNotification('Treino Concluído', {
      body: `${athleteName} completou ${workoutName}`,
      tag: 'workout-complete',
      data: { type: 'workout-complete', athleteName, workoutName }
    });
  }

  async notifyCheckInDue(athleteName) {
    return this.showNotification('Check-in Pendente', {
      body: `${athleteName} tem check-in agendado para hoje`,
      tag: 'checkin-due',
      data: { type: 'checkin-due', athleteName },
      actions: [
        { action: 'remind', title: 'Lembrar' },
        { action: 'view', title: 'Ver' }
      ]
    });
  }

  async notifyMessage(athleteName, message) {
    return this.showNotification(`Mensagem de ${athleteName}`, {
      body: message,
      tag: 'message',
      data: { type: 'message', athleteName }
    });
  }

  // Utility functions
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  generateDeviceToken(subscription) {
    const key = subscription.toJSON().keys.p256dh;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 22);
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // Check if notifications are enabled
  isEnabled() {
    return this.permission === 'granted' && !!localStorage.getItem(STORAGE_KEYS.DEVICE_TOKEN);
  }
}

// Create singleton instance
const pushService = new PushNotificationService();

export default pushService;