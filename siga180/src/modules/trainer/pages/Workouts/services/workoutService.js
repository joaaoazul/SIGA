// src/services/workout/workoutService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class WorkoutService {
  // ================ TEMPLATES ================
  
  async getTemplates(trainerId = null) {
    try {
      let query = supabase
        .from('workout_templates')
        .select(`
          *,
          workout_plan:workout_plans!inner(
            id,
            name,
            trainer_id,
            athlete_id,
            status
          ),
          template_exercises (
            id,
            order_in_workout,
            rest_seconds,
            notes,
            exercise:exercises (
              id,
              name,
              category,
              primary_muscle,
              secondary_muscles,
              equipment,
              instructions,
              tips,
              exercise_videos (
                id,
                video_url,
                thumbnail_url,
                video_type,
                angle,
                is_primary
              )
            ),
            template_sets (
              id,
              set_number,
              set_type,
              target_reps,
              target_weight,
              target_time_seconds,
              rpe_target
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (trainerId) {
        query = query.eq('workout_plan.trainer_id', trainerId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Formatar dados para o frontend
      const formatted = data?.map(template => ({
        id: template.id,
        planId: template.workout_plan_id,
        name: template.name,
        description: template.description,
        dayOfWeek: template.day_of_week,
        weekNumber: template.week_number,
        orderInPlan: template.order_in_plan,
        estimatedDuration: template.estimated_duration_minutes,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
        exercises: template.template_exercises?.map(te => ({
          id: te.id,
          exerciseId: te.exercise.id,
          name: te.exercise.name,
          category: te.exercise.category,
          primaryMuscle: te.exercise.primary_muscle,
          secondaryMuscles: te.exercise.secondary_muscles,
          equipment: te.exercise.equipment,
          instructions: te.exercise.instructions,
          tips: te.exercise.tips,
          orderInWorkout: te.order_in_workout,
          restSeconds: te.rest_seconds,
          notes: te.notes,
          videos: te.exercise.exercise_videos,
          sets: te.template_sets?.map(set => ({
            id: set.id,
            setNumber: set.set_number,
            setType: set.set_type,
            targetReps: set.target_reps,
            targetWeight: set.target_weight,
            targetTime: set.target_time_seconds,
            rpeTarget: set.rpe_target
          }))
        }))
      }));
      
      return { success: true, data: formatted };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { success: false, error: error.message };
    }
  }

  async getTemplateById(templateId) {
    try {
      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          template_exercises (
            *,
            exercise:exercises (
              *,
              exercise_videos (*)
            ),
            template_sets (*)
          )
        `)
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching template:', error);
      return { success: false, error: error.message };
    }
  }

  async createTemplate(templateData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Criar ou buscar workout_plan
      let planId = templateData.planId;
      
      if (!planId) {
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .insert({
            name: templateData.planName || 'Novo Plano',
            description: templateData.planDescription,
            trainer_id: user.id,
            athlete_id: templateData.athleteId,
            start_date: templateData.startDate || new Date().toISOString(),
            status: 'active'
          })
          .select()
          .single();
          
        if (planError) throw planError;
        planId = plan.id;
      }

      // 2. Criar template
      const { data: template, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          workout_plan_id: planId,
          name: templateData.name,
          description: templateData.description,
          day_of_week: templateData.dayOfWeek,
          week_number: templateData.weekNumber || 1,
          order_in_plan: templateData.orderInPlan || 1,
          estimated_duration_minutes: templateData.estimatedDuration || 60
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // 3. Adicionar exercícios e séries
      if (templateData.exercises && templateData.exercises.length > 0) {
        for (const exercise of templateData.exercises) {
          const { data: templateExercise, error: exerciseError } = await supabase
            .from('template_exercises')
            .insert({
              workout_template_id: template.id,
              exercise_id: exercise.exerciseId,
              order_in_workout: exercise.orderInWorkout,
              rest_seconds: exercise.restSeconds || 60,
              notes: exercise.notes
            })
            .select()
            .single();

          if (exerciseError) throw exerciseError;

          // Adicionar séries
          if (exercise.sets && exercise.sets.length > 0) {
            const setsToInsert = exercise.sets.map(set => ({
              template_exercise_id: templateExercise.id,
              set_number: set.setNumber,
              set_type: set.setType || 'working',
              target_reps: set.targetReps,
              target_weight: set.targetWeight,
              target_time_seconds: set.targetTime,
              rpe_target: set.rpeTarget
            }));

            const { error: setsError } = await supabase
              .from('template_sets')
              .insert(setsToInsert);

            if (setsError) throw setsError;
          }
        }
      }

      return { success: true, data: template };
    } catch (error) {
      console.error('Error creating template:', error);
      return { success: false, error: error.message };
    }
  }

  async updateTemplate(templateId, updates) {
    try {
      const { data, error } = await supabase
        .from('workout_templates')
        .update({
          name: updates.name,
          description: updates.description,
          estimated_duration_minutes: updates.estimatedDuration,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating template:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTemplate(templateId) {
    try {
      // Deletar cascata: template_sets -> template_exercises -> workout_template
      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { success: false, error: error.message };
    }
  }

  async duplicateTemplate(templateId, newName) {
    try {
      const { data: original, error: fetchError } = await this.getTemplateById(templateId);
      
      if (fetchError || !original.success) throw new Error('Template not found');

      const newTemplate = {
        ...original.data,
        name: newName || `${original.data.name} (Cópia)`,
        exercises: original.data.template_exercises
      };

      delete newTemplate.id;
      delete newTemplate.created_at;
      delete newTemplate.updated_at;

      return await this.createTemplate(newTemplate);
    } catch (error) {
      console.error('Error duplicating template:', error);
      return { success: false, error: error.message };
    }
  }

  // ================ EXERCÍCIOS ================

  async getExercises(filters = {}) {
    try {
      let query = supabase
        .from('exercises')
        .select(`
          *,
          exercise_videos (*),
          exercise_favorites (user_id)
        `)
        .eq('is_public', true)
        .order('name');

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.muscle) {
        query = query.eq('primary_muscle', filters.muscle);
      }

      if (filters.equipment) {
        query = query.eq('equipment', filters.equipment);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return { success: false, error: error.message };
    }
  }

  async createExercise(exerciseData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('exercises')
        .insert({
          name: exerciseData.name,
          category: exerciseData.category,
          primary_muscle: exerciseData.primaryMuscle,
          secondary_muscles: exerciseData.secondaryMuscles || [],
          equipment: exerciseData.equipment,
          instructions: exerciseData.instructions,
          tips: exerciseData.tips || [],
          is_public: exerciseData.isPublic !== false,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating exercise:', error);
      return { success: false, error: error.message };
    }
  }

  // ================ ATRIBUIÇÕES ================

  async assignTemplateToAthletes(templateId, athleteIds, settings) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const results = [];

      for (const athleteId of athleteIds) {
        // 1. Criar plano para cada atleta
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .insert({
            name: settings.planName || 'Plano Personalizado',
            trainer_id: user.id,
            athlete_id: athleteId,
            start_date: settings.startDate,
            end_date: settings.endDate,
            status: 'active'
          })
          .select()
          .single();

        if (planError) {
          results.push({ athleteId, success: false, error: planError.message });
          continue;
        }

        // 2. Copiar template para o novo plano
        const { data: template } = await this.getTemplateById(templateId);
        
        if (template) {
          const newTemplate = {
            ...template.data,
            workout_plan_id: plan.id,
            exercises: template.data.template_exercises
          };
          
          delete newTemplate.id;
          await this.createTemplate(newTemplate);
        }

        // 3. Criar sessões baseadas na frequência
        const sessions = this.generateSessions(
          templateId,
          athleteId,
          settings.startDate,
          settings.endDate,
          settings.frequency,
          settings.daysOfWeek
        );

        if (sessions.length > 0) {
          const { error: sessionsError } = await supabase
            .from('workout_sessions')
            .insert(sessions);

          if (sessionsError) {
            results.push({ athleteId, success: false, error: sessionsError.message });
            continue;
          }
        }

        // 4. Enviar notificação se configurado
        if (settings.sendNotification) {
          await this.sendAssignmentNotification(athleteId, plan.id);
        }

        results.push({ athleteId, success: true, planId: plan.id });
      }

      return { 
        success: true, 
        results,
        summary: {
          total: athleteIds.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      };
    } catch (error) {
      console.error('Error assigning template:', error);
      return { success: false, error: error.message };
    }
  }

  generateSessions(templateId, athleteId, startDate, endDate, frequency, daysOfWeek) {
    const sessions = [];
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias padrão
    
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      let shouldAddSession = false;
      
      if (frequency === 'daily') {
        shouldAddSession = true;
      } else if (frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
        shouldAddSession = daysOfWeek.includes(currentDate.getDay());
      }
      
      if (shouldAddSession) {
        sessions.push({
          workout_template_id: templateId,
          athlete_id: athleteId,
          scheduled_date: currentDate.toISOString().split('T')[0],
          status: 'scheduled'
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return sessions;
  }

  async sendAssignmentNotification(athleteId, planId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: athleteId,
          notification_type: 'workout_assigned',
          title: 'Novo Treino Atribuído',
          message: 'O seu treinador atribuiu um novo plano de treino para você.',
          data: { planId },
          is_read: false
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  // ================ SESSÕES ================

  async getWorkoutSessions(filters = {}) {
    try {
      let query = supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_template:workout_templates (
            id,
            name,
            description,
            estimated_duration_minutes
          ),
          athlete:profiles!workout_sessions_athlete_id_fkey (
            id,
            name,
            email,
            avatar_url
          ),
          session_exercises (
            *,
            exercise:exercises (
              id,
              name,
              category,
              primary_muscle
            ),
            performed_sets (
              *
            )
          )
        `)
        .order('scheduled_date', { ascending: true });

      if (filters.athleteId) {
        query = query.eq('athlete_id', filters.athleteId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('scheduled_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('scheduled_date', filters.dateTo);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return { success: false, error: error.message };
    }
  }

  async startWorkoutSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error starting session:', error);
      return { success: false, error: error.message };
    }
  }

  async completeWorkoutSession(sessionId, summary) {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
          total_volume_load: summary.totalVolume,
          notes: summary.notes
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error completing session:', error);
      return { success: false, error: error.message };
    }
  }

  async savePerformedSet(setData) {
    try {
      const volumeLoad = (setData.reps || 0) * (setData.weight || 0);
      
      const { data, error } = await supabase
        .from('performed_sets')
        .insert({
          session_exercise_id: setData.sessionExerciseId,
          template_set_id: setData.templateSetId,
          set_number: setData.setNumber,
          set_type: setData.setType || 'working',
          reps: setData.reps,
          weight: setData.weight,
          time_seconds: setData.timeSeconds,
          distance_meters: setData.distanceMeters,
          rpe: setData.rpe,
          volume_load: volumeLoad,
          completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving set:', error);
      return { success: false, error: error.message };
    }
  }

  // ================ PROGRESSÃO ================

  async getAthleteProgress(athleteId, exerciseId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('athlete_progress')
        .select(`
          *
        `)
        .eq('athlete_id', athleteId)
        .eq('exercise_id', exerciseId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Buscar detalhes das séries executadas
      const progressWithSets = await Promise.all(
        data.map(async (progress) => {
          const { data: sets } = await supabase
            .from('performed_sets')
            .select('*')
            .eq('session_exercise_id', progress.id);
          
          return {
            ...progress,
            sets: sets || []
          };
        })
      );

      return { success: true, data: progressWithSets };
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { success: false, error: error.message };
    }
  }

  calculateProgression(historyData) {
    if (!historyData || historyData.length === 0) {
      return {
        type: 'initial',
        suggestion: 'Primeira vez realizando este exercício',
        recommendedWeight: 20,
        recommendedReps: 12,
        confidence: 0
      };
    }

    const lastSession = historyData[0];
    const last3Sessions = historyData.slice(0, 3);
    
    // Verificar se completou todas as séries
    const completedAllSets = lastSession.sets?.every(set => 
      set.completed && set.reps >= (set.target_reps || 0)
    ) || false;
    
    // Calcular média de RPE
    const avgRPE = lastSession.avg_rpe || 
      (lastSession.sets?.reduce((acc, set) => acc + (set.rpe || 7), 0) / (lastSession.sets?.length || 1));

    // Lógica de progressão
    if (completedAllSets) {
      if (avgRPE <= 7) {
        return {
          type: 'increase_weight',
          suggestion: 'Aumentar peso em 5-10%',
          recommendedWeight: Math.round(lastSession.max_weight * 1.075 * 2) / 2,
          recommendedReps: lastSession.max_reps,
          confidence: 95,
          reasoning: [
            '✅ Completou todas as repetições',
            '💪 RPE médio baixo (≤7)',
            '📈 Pronto para progressão'
          ]
        };
      } else if (avgRPE <= 8.5) {
        return {
          type: 'small_increase',
          suggestion: 'Aumentar peso em 2.5%',
          recommendedWeight: Math.round(lastSession.max_weight * 1.025 * 2) / 2,
          recommendedReps: lastSession.max_reps,
          confidence: 85,
          reasoning: [
            '✅ Completou todas as repetições',
            '⚖️ RPE adequado (7-8.5)',
            '📊 Progressão conservadora'
          ]
        };
      } else {
        return {
          type: 'increase_reps',
          suggestion: 'Manter peso e aumentar 1-2 reps',
          recommendedWeight: lastSession.max_weight,
          recommendedReps: lastSession.max_reps + 1,
          confidence: 80,
          reasoning: [
            '✅ Completou todas as repetições',
            '⚠️ RPE elevado (>8.5)',
            '🔄 Consolidar antes de aumentar peso'
          ]
        };
      }
    }

    // Não completou - manter ou reduzir
    const completionRate = lastSession.sets?.filter(s => s.completed).length / (lastSession.sets?.length || 1);
    
    if (completionRate < 0.5) {
      return {
        type: 'decrease_weight',
        suggestion: 'Reduzir peso em 10%',
        recommendedWeight: Math.round(lastSession.max_weight * 0.9 * 2) / 2,
        recommendedReps: lastSession.max_reps,
        confidence: 90,
        reasoning: [
          '❌ Não completou 50% das séries',
          '⬇️ Peso excessivo',
          '🎯 Focar na técnica'
        ]
      };
    }

    return {
      type: 'maintain',
      suggestion: 'Manter peso e focar na execução',
      recommendedWeight: lastSession.max_weight,
      recommendedReps: lastSession.max_reps,
      confidence: 75,
      reasoning: [
        '⚠️ Completou parcialmente',
        '🔄 Repetir para consolidar',
        '💡 Verificar técnica e descanso'
      ]
    };
  }

  // ================ VÍDEOS ================

  async uploadExerciseVideo(exerciseId, videoFile, videoData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Upload do ficheiro
      const fileName = `exercises/${exerciseId}/${Date.now()}_${videoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('exercise-videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Obter URL público
      const { data: { publicUrl } } = supabase.storage
        .from('exercise-videos')
        .getPublicUrl(fileName);

      // Guardar na BD
      const { data, error } = await supabase
        .from('exercise_videos')
        .insert({
          exercise_id: exerciseId,
          video_url: publicUrl,
          thumbnail_url: videoData.thumbnailUrl,
          video_type: 'upload',
          title: videoData.title,
          description: videoData.description,
          angle: videoData.angle,
          is_primary: videoData.isPrimary || false,
          order_index: videoData.orderIndex || 0,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadAthleteVideo(athleteId, exerciseId, sessionId, videoFile, metadata) {
    try {
      // Upload do ficheiro
      const fileName = `athletes/${athleteId}/${Date.now()}_${videoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('athlete-videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Obter URL público
      const { data: { publicUrl } } = supabase.storage
        .from('athlete-videos')
        .getPublicUrl(fileName);

      // Guardar na BD
      const { data, error } = await supabase
        .from('athlete_exercise_videos')
        .insert({
          athlete_id: athleteId,
          exercise_id: exerciseId,
          workout_session_id: sessionId,
          video_url: publicUrl,
          thumbnail_url: metadata.thumbnailUrl,
          recorded_at: new Date().toISOString(),
          weight: metadata.weight,
          reps: metadata.reps,
          set_number: metadata.setNumber,
          notes: metadata.notes
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading athlete video:', error);
      return { success: false, error: error.message };
    }
  }

  async addTrainerFeedback(videoId, feedback, formRating) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('athlete_exercise_videos')
        .update({
          trainer_feedback: feedback,
          form_rating: formRating,
          is_reviewed: true,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', videoId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding feedback:', error);
      return { success: false, error: error.message };
    }
  }

  // ================ ANALYTICS ================

  async getWorkoutAnalytics(trainerId, dateRange) {
    try {
      // Estatísticas gerais
      const { data: stats, error: statsError } = await supabase
        .rpc('get_workout_statistics', {
          p_trainer_id: trainerId,
          p_date_from: dateRange.from,
          p_date_to: dateRange.to
        });

      if (statsError) throw statsError;

      // Taxa de conclusão por atleta
      const { data: completionRates, error: completionError } = await supabase
        .from('workout_sessions')
        .select(`
          athlete_id,
          status,
          athlete:profiles!workout_sessions_athlete_id_fkey (
            name
          )
        `)
        .in('status', ['completed', 'scheduled', 'missed'])
        .gte('scheduled_date', dateRange.from)
        .lte('scheduled_date', dateRange.to);

      if (completionError) throw completionError;

      // Processar dados
      const athleteStats = {};
      completionRates?.forEach(session => {
        const athleteId = session.athlete_id;
        if (!athleteStats[athleteId]) {
          athleteStats[athleteId] = {
            name: session.athlete?.name,
            total: 0,
            completed: 0,
            scheduled: 0,
            missed: 0
          };
        }
        
        athleteStats[athleteId].total++;
        athleteStats[athleteId][session.status]++;
      });

      // Calcular taxas de conclusão
      Object.values(athleteStats).forEach(stat => {
        stat.completionRate = stat.total > 0 
          ? Math.round((stat.completed / stat.total) * 100) 
          : 0;
      });

      return { 
        success: true, 
        data: {
          generalStats: stats,
          athleteStats: Object.values(athleteStats)
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error.message };
    }
  }
}

export const workoutService = new WorkoutService();
export default workoutService;