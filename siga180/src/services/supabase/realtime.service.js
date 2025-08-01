import { supabase } from './supabaseClient';

class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
  }

  // Subscribe to meal chat
  subscribeMealChat(athleteId, mealId, callbacks) {
    const channelName = `meal-chat-${athleteId}-${mealId}`;
    
    if (this.subscriptions.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meal_messages',
          filter: `athlete_id=eq.${athleteId},meal_id=eq.${mealId}`
        },
        (payload) => {
          callbacks.onNewMessage && callbacks.onNewMessage(payload.new);
        }
      )
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = subscription.presenceState();
          callbacks.onPresenceSync && callbacks.onPresenceSync(state);
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          callbacks.onUserJoin && callbacks.onUserJoin({ key, newPresences });
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key, leftPresences }) => {
          callbacks.onUserLeave && callbacks.onUserLeave({ key, leftPresences });
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user presence
          await subscription.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString()
          });
        }
      });

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  // Subscribe to athlete updates (for trainer dashboard)
  subscribeAthleteUpdates(trainerId, callbacks) {
    const channel = supabase
      .channel(`trainer-${trainerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
          filter: `trainer_id=eq.${trainerId}`
        },
        (payload) => {
          callbacks.onMealUpdate && callbacks.onMealUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'check_ins',
          filter: `trainer_id=eq.${trainerId}`
        },
        (payload) => {
          callbacks.onNewCheckIn && callbacks.onNewCheckIn(payload.new);
        }
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe
  unsubscribe(channelName) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(channelName);
    }
  }

  // Send typing indicator
  async sendTypingIndicator(channelName, isTyping) {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: isTyping ? 'typing_start' : 'typing_stop',
        payload: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}

export default new RealtimeService();