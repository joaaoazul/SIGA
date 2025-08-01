// src/services/websocket/WebSocketService.js
import { API_CONFIG, STORAGE_KEYS } from '../api/config';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.messageQueue = [];
    this.eventHandlers = new Map();
    this.isConnected = false;
    this.pingInterval = null;
    this.reconnectTimeout = null;
  }

  // Connect to WebSocket server
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      console.error('No auth token available');
      return;
    }

    try {
      this.ws = new WebSocket(`${API_CONFIG.WS_URL}?token=${token}`);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Send queued messages
      this.flushMessageQueue();
      
      // Start ping interval
      this.startPing();
      
      // Emit connected event
      this.emit('connected');
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.stopPing();
      
      // Emit disconnected event
      this.emit('disconnected', { code: event.code, reason: event.reason });
      
      // Attempt to reconnect
      if (event.code !== 1000) { // 1000 = normal closure
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  handleMessage(message) {
    const { type, data, id } = message;

    // Handle system messages
    switch (type) {
      case 'pong':
        // Ping response received
        break;
      
      case 'error':
        console.error('WebSocket server error:', data);
        this.emit('server-error', data);
        break;
      
      default:
        // Emit message to specific handlers
        this.emit(type, data, id);
        this.emit('message', message);
    }
  }

  // Send message through WebSocket
  send(type, data, options = {}) {
    const message = {
      id: options.id || Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString()
    };

    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return message.id;
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      console.log('Message queued, WebSocket not connected');
      return message.id;
    }
  }

  // Event handling
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(handler);
    }
  }

  emit(event, ...args) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Reconnection logic
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max-reconnect-failed');
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    console.log(`Reconnecting in ${delay}ms...`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Ping/Pong for connection health
  startPing() {
    this.pingInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('ping', {});
      }
    }, 30000); // Ping every 30 seconds
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Queue management
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(JSON.stringify(message));
    }
  }

  // Disconnect WebSocket
  disconnect() {
    this.stopPing();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.isConnected = false;
    this.messageQueue = [];
    this.eventHandlers.clear();
  }

  // Nutrition-specific methods
  joinMealChat(athleteId, mealId) {
    return this.send('join-meal-chat', { athleteId, mealId });
  }

  leaveMealChat(athleteId, mealId) {
    return this.send('leave-meal-chat', { athleteId, mealId });
  }

  sendMealMessage(athleteId, mealId, message) {
    return this.send('meal-message', {
      athleteId,
      mealId,
      message
    });
  }

  sendMealApproval(athleteId, mealId, approved) {
    return this.send('meal-approval', {
      athleteId,
      mealId,
      approved
    });
  }

  // Typing indicators
  startTyping(channel) {
    return this.send('typing-start', { channel });
  }

  stopTyping(channel) {
    return this.send('typing-stop', { channel });
  }

  // Check connection status
  isConnected() {
    return this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
const wsService = new WebSocketService();

export default wsService;