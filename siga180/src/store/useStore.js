// src/store/useStore.js
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../services/supabase/supabaseClient';
import toast from 'react-hot-toast';

const useStore = create(
  devtools(
    subscribeWithSelector((set, get) => ({
      // ========== ATHLETES STATE ==========
      athletes: [],
      athletesLoading: false,
      athletesError: null,
      
      // ========== WORKOUTS STATE ==========
      workoutTemplates: [],
      workoutSessions: [],
      workoutsLoading: false,
      
      // ========== NUTRITION STATE ==========
      nutritionPlans: [],
      meals: [],
      nutritionLoading: false,
      
      // ========== INVITES STATE ==========
      invites: [],
      invitesLoading: false,
      
      // ========== DASHBOARD STATS ==========
      dashboardStats: {
        totalAthletes: 0,
        activeWorkouts: 0,
        completionRate: 0,
        weeklyProgress: 0,
        pendingInvites: 0,
        upcomingSessions: 0
      },
      
      // ========== REAL-TIME SUBSCRIPTIONS ==========
      subscriptions: new Map(),
      
      // ========== ATHLETES ACTIONS ==========
      fetchAthletes: async (trainerId) => {
        set({ athletesLoading: true, athletesError: null });
        
        try {
          // Buscar convites aceites (atletas ativos)
          const { data: invites, error } = await supabase
            .from('invites')
            .select(`
              *,
              athlete:accepted_by (
                id,
                email,
                name,
                phone,
                created_at,
                avatar_url
              )
            `)
            .eq('trainer_id', trainerId)
            .eq('status', 'accepted');
          
          if (error) throw error;
          
          const athletesList = invites?.map(invite => ({
            id: invite.athlete?.id || invite.accepted_by,
            inviteId: invite.id,
            name: invite.athlete?.name || invite.athlete_name,
            email: invite.athlete?.email || invite.athlete_email,
            phone: invite.athlete?.phone,
            avatar: invite.athlete?.avatar_url,
            status: 'active',
            joinedAt: invite.accepted_at,
            lastActivity: new Date().toISOString()
          })) || [];
          
          set({ 
            athletes: athletesList, 
            athletesLoading: false,
            dashboardStats: {
              ...get().dashboardStats,
              totalAthletes: athletesList.length
            }
          });
          
          return athletesList;
        } catch (error) {
          console.error('Error fetching athletes:', error);
          set({ athletesError: error.message, athletesLoading: false });
          throw error;
        }
      },
      
      addAthlete: (athlete) => {
        const athletes = [...get().athletes, athlete];
        set({ 
          athletes,
          dashboardStats: {
            ...get().dashboardStats,
            totalAthletes: athletes.length
          }
        });
      },
      
      updateAthlete: (athleteId, updates) => {
        const athletes = get().athletes.map(a => 
          a.id === athleteId ? { ...a, ...updates } : a
        );
        set({ athletes });
      },
      
      removeAthlete: (athleteId) => {
        const athletes = get().athletes.filter(a => a.id !== athleteId);
        set({ 
          athletes,
          dashboardStats: {
            ...get().dashboardStats,
            totalAthletes: athletes.length
          }
        });
      },
      
      // ========== WORKOUTS ACTIONS ==========
      fetchWorkoutTemplates: async (trainerId) => {
        set({ workoutsLoading: true });
        
        try {
          const { data, error } = await supabase
            .from('workout_templates')
            .select(`
              *,
              template_exercises (
                *,
                exercise:exercises (*)
              )
            `)
            .eq('created_by', trainerId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          set({ 
            workoutTemplates: data || [],
            workoutsLoading: false 
          });
          
          return data;
        } catch (error) {
          console.error('Error fetching templates:', error);
          set({ workoutsLoading: false });
          throw error;
        }
      },
      
      fetchWorkoutSessions: async (trainerId) => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];
          
          const { data, error } = await supabase
            .from('workout_sessions')
            .select(`
              *,
              athlete:athlete_id (id, name, email),
              template:workout_template_id (name, description)
            `)
            .gte('scheduled_date', today)
            .lte('scheduled_date', nextWeek)
            .order('scheduled_date');
          
          if (error) throw error;
          
          const upcomingSessions = data?.length || 0;
          const activeSessions = data?.filter(s => s.status === 'in_progress').length || 0;
          
          set({ 
            workoutSessions: data || [],
            dashboardStats: {
              ...get().dashboardStats,
              upcomingSessions,
              activeWorkouts: activeSessions
            }
          });
          
          return data;
        } catch (error) {
          console.error('Error fetching sessions:', error);
          throw error;
        }
      },
      
      createWorkoutTemplate: async (template, exercises) => {
        try {
          // Criar template
          const { data: newTemplate, error: templateError } = await supabase
            .from('workout_templates')
            .insert(template)
            .select()
            .single();
          
          if (templateError) throw templateError;
          
          // Adicionar exercícios se fornecidos
          if (exercises && exercises.length > 0) {
            const exercisesToInsert = exercises.map((ex, index) => ({
              ...ex,
              workout_template_id: newTemplate.id,
              order_in_workout: index + 1
            }));
            
            const { error: exercisesError } = await supabase
              .from('template_exercises')
              .insert(exercisesToInsert);
            
            if (exercisesError) throw exercisesError;
          }
          
          // Atualizar store
          set({ 
            workoutTemplates: [...get().workoutTemplates, newTemplate] 
          });
          
          toast.success('Template criado com sucesso!');
          return newTemplate;
        } catch (error) {
          console.error('Error creating template:', error);
          toast.error('Erro ao criar template');
          throw error;
        }
      },
      
      // ========== INVITES ACTIONS ==========
      fetchInvites: async (trainerId) => {
        set({ invitesLoading: true });
        
        try {
          const { data, error } = await supabase
            .from('invites')
            .select('*')
            .eq('trainer_id', trainerId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          set({ 
            invites: data || [],
            invitesLoading: false,
            dashboardStats: {
              ...get().dashboardStats,
              pendingInvites: data?.length || 0
            }
          });
          
          return data;
        } catch (error) {
          console.error('Error fetching invites:', error);
          set({ invitesLoading: false });
          throw error;
        }
      },
      
      createInvite: async (inviteData) => {
        try {
          const { data, error } = await supabase
            .from('invites')
            .insert(inviteData)
            .select()
            .single();
          
          if (error) throw error;
          
          // Atualizar store
          const invites = [...get().invites, data];
          set({ 
            invites,
            dashboardStats: {
              ...get().dashboardStats,
              pendingInvites: invites.length
            }
          });
          
          toast.success('Convite enviado!');
          return data;
        } catch (error) {
          console.error('Error creating invite:', error);
          toast.error('Erro ao enviar convite');
          throw error;
        }
      },
      
      cancelInvite: async (inviteId, trainerId) => {
        try {
          const { error } = await supabase
            .from('invites')
            .delete()
            .eq('id', inviteId)
            .eq('trainer_id', trainerId);
          
          if (error) throw error;
          
          // Atualizar store
          const invites = get().invites.filter(i => i.id !== inviteId);
          set({ 
            invites,
            dashboardStats: {
              ...get().dashboardStats,
              pendingInvites: invites.length
            }
          });
          
          toast.success('Convite cancelado');
          return true;
        } catch (error) {
          console.error('Error canceling invite:', error);
          toast.error('Erro ao cancelar convite');
          throw error;
        }
      },
      
      // ========== DASHBOARD ACTIONS ==========
      refreshDashboard: async (trainerId) => {
        console.log('🔄 Refreshing dashboard...');
        
        try {
          // Buscar todos os dados em paralelo
          const promises = [
            get().fetchAthletes(trainerId),
            get().fetchWorkoutTemplates(trainerId),
            get().fetchWorkoutSessions(trainerId),
            get().fetchInvites(trainerId)
          ];
          
          await Promise.all(promises);
          
          // Calcular estatísticas adicionais
          const athletes = get().athletes;
          const sessions = get().workoutSessions;
          
          const completedSessions = sessions.filter(s => s.status === 'completed').length;
          const totalSessions = sessions.length;
          const completionRate = totalSessions > 0 
            ? Math.round((completedSessions / totalSessions) * 100) 
            : 0;
          
          set({
            dashboardStats: {
              ...get().dashboardStats,
              completionRate
            }
          });
          
          console.log('✅ Dashboard refreshed');
        } catch (error) {
          console.error('Error refreshing dashboard:', error);
          toast.error('Erro ao atualizar dashboard');
        }
      },
      
      // ========== REAL-TIME SUBSCRIPTIONS ==========
      subscribeToChanges: (trainerId) => {
        console.log('📡 Setting up real-time subscriptions...');
        
        // Limpar subscriptions antigas
        get().unsubscribeAll();
        
        // Subscribe to athletes changes (via invites table)
        const athletesChannel = supabase
          .channel('athletes-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'invites',
              filter: `trainer_id=eq.${trainerId}`
            },
            (payload) => {
              console.log('Athletes change:', payload);
              
              if (payload.eventType === 'UPDATE' && payload.new.status === 'accepted') {
                // Novo atleta aceitou convite
                get().fetchAthletes(trainerId);
                toast.success('Novo atleta aceitou o convite!');
              } else if (payload.eventType === 'DELETE') {
                // Convite cancelado
                get().fetchInvites(trainerId);
              }
            }
          )
          .subscribe();
        
        // Subscribe to workout sessions changes
        const sessionsChannel = supabase
          .channel('sessions-changes')
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'workout_sessions'
            },
            (payload) => {
              console.log('Session change:', payload);
              
              if (payload.eventType === 'UPDATE') {
                // Atualizar sessão específica
                const sessions = get().workoutSessions.map(s =>
                  s.id === payload.new.id ? payload.new : s
                );
                set({ workoutSessions: sessions });
                
                if (payload.new.status === 'completed') {
                  toast.success('Treino concluído!');
                }
              } else if (payload.eventType === 'INSERT') {
                // Nova sessão agendada
                get().fetchWorkoutSessions(trainerId);
              }
            }
          )
          .subscribe();
        
        // Guardar referências das subscriptions
        const subscriptions = get().subscriptions;
        subscriptions.set('athletes', athletesChannel);
        subscriptions.set('sessions', sessionsChannel);
        
        set({ subscriptions });
      },
      
      unsubscribeAll: () => {
        const subscriptions = get().subscriptions;
        subscriptions.forEach(channel => {
          supabase.removeChannel(channel);
        });
        subscriptions.clear();
        set({ subscriptions });
      }
    }))
  )
);

export default useStore;