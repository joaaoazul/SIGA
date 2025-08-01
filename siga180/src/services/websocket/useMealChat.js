// src/modules/shared/hooks/useMealChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import realtimeService from '../../../services/supabase/realtime.service';
import { useAuth } from './useAuth';

export const useMealChat = (athleteId, mealId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!athleteId || !mealId) return;

    // Load initial messages
    loadMessages();

    // Subscribe to real-time updates
    channelRef.current = realtimeService.subscribeMealChat(athleteId, mealId, {
      onNewMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onPresenceSync: (state) => {
        setIsConnected(true);
        // Check if other user is typing
        const otherUsers = Object.values(state).filter(
          presence => presence[0]?.user_id !== user.id
        );
        setIsTyping(otherUsers.some(u => u[0]?.is_typing));
      },
      onUserJoin: ({ newPresences }) => {
        console.log('User joined:', newPresences);
      },
      onUserLeave: ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      }
    });

    // Cleanup
    return () => {
      if (channelRef.current) {
        realtimeService.unsubscribe(`meal-chat-${athleteId}-${mealId}`);
      }
    };
  }, [athleteId, mealId, user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_messages')
        .select('*')
        .eq('meal_id', mealId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = useCallback(async (content, type = 'text', metadata = {}) => {
    try {
      const { data, error } = await supabase
        .from('meal_messages')
        .insert({
          meal_id: mealId,
          athlete_id: athleteId,
          sender_id: user.id,
          sender_role: user.role,
          type,
          content,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      // Message will be added via realtime subscription
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [athleteId, mealId, user]);

  const sendApproval = useCallback(async (approved) => {
    try {
      // Update meal status
      const { error: mealError } = await supabase
        .from('meals')
        .update({
          status: approved ? 'approved' : 'needs_review',
          approved_by: user.trainer_id,
          approved_at: new Date().toISOString()
        })
        .eq('id', mealId);

      if (mealError) throw mealError;

      // Send approval message
      await sendMessage(
        approved ? 'Refeição aprovada!' : 'Esta refeição precisa de ajustes',
        'approval',
        { approved }
      );
    } catch (error) {
      console.error('Error sending approval:', error);
      throw error;
    }
  }, [mealId, user, sendMessage]);

  const startTyping = useCallback(() => {
    realtimeService.sendTypingIndicator(
      `meal-chat-${athleteId}-${mealId}`,
      true
    );
  }, [athleteId, mealId]);

  const stopTyping = useCallback(() => {
    realtimeService.sendTypingIndicator(
      `meal-chat-${athleteId}-${mealId}`,
      false
    );
  }, [athleteId, mealId]);

  return {
    messages,
    isConnected,
    isTyping,
    loading,
    sendMessage,
    sendApproval,
    startTyping,
    stopTyping,
    refresh: loadMessages
  };
};