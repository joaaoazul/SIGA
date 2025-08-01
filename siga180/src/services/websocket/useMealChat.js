// src/services/websocket/useMealChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import wsService from './WebSocketService';
import { nutritionService } from '../api';

export const useMealChat = (athleteId, mealId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Connect to WebSocket
    wsService.connect();

    // Join meal chat room
    wsService.joinMealChat(athleteId, mealId);

    // Set up event handlers
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    
    const handleNewMessage = (data) => {
      if (data.athleteId === athleteId && data.mealId === mealId) {
        addMessage(data.message);
      }
    };

    const handleTypingStart = (data) => {
      if (data.athleteId === athleteId && data.mealId === mealId && data.sender !== 'trainer') {
        setIsTyping(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => setIsTyping(false), 3000);
        setTypingTimeout(timeout);
      }
    };

    const handleTypingStop = (data) => {
      if (data.athleteId === athleteId && data.mealId === mealId) {
        setIsTyping(false);
        if (typingTimeout) clearTimeout(typingTimeout);
      }
    };

    // Register event handlers
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('meal-message', handleNewMessage);
    wsService.on('typing-start', handleTypingStart);
    wsService.on('typing-stop', handleTypingStop);

    // Cleanup
    return () => {
      wsService.leaveMealChat(athleteId, mealId);
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('meal-message', handleNewMessage);
      wsService.off('typing-start', handleTypingStart);
      wsService.off('typing-stop', handleTypingStop);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [athleteId, mealId]);

  const loadMessages = async () => {
    try {
      const data = await nutritionService.getMealMessages(athleteId, mealId);
      setMessages(data.messages);
      messagesRef.current = data.messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const addMessage = useCallback((message) => {
    setMessages(prev => {
      const updated = [...prev, message];
      messagesRef.current = updated;
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (content, type = 'text', metadata = {}) => {
    const message = {
      id: Date.now(),
      sender: 'trainer',
      type,
      content,
      metadata,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Optimistic update
    addMessage(message);

    try {
      // Send via WebSocket
      wsService.sendMealMessage(athleteId, mealId, message);
      
      // Also save to database
      await nutritionService.sendMealMessage(athleteId, mealId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== message.id));
    }
  }, [athleteId, mealId, addMessage]);

  const sendApproval = useCallback(async (approved) => {
    const message = {
      id: Date.now(),
      sender: 'trainer',
      type: 'approval',
      content: approved ? 'Refeição aprovada!' : 'Esta refeição precisa de ajustes',
      approved,
      timestamp: new Date().toISOString()
    };

    addMessage(message);

    try {
      wsService.sendMealApproval(athleteId, mealId, approved);
      await nutritionService.approveMeal(athleteId, mealId, approved);
    } catch (error) {
      console.error('Failed to send approval:', error);
      setMessages(prev => prev.filter(m => m.id !== message.id));
    }
  }, [athleteId, mealId, addMessage]);

  const startTyping = useCallback(() => {
    wsService.startTyping(`meal-${athleteId}-${mealId}`);
  }, [athleteId, mealId]);

  const stopTyping = useCallback(() => {
    wsService.stopTyping(`meal-${athleteId}-${mealId}`);
  }, [athleteId, mealId]);

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    sendApproval,
    startTyping,
    stopTyping,
    refresh: loadMessages
  };
};