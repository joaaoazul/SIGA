// src/services/workout/workoutService.js
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (ajustar com as tuas credenciais)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const workoutService = {
  // ================ TEMPLATES ================
  
  /**
   * Buscar todos os templates de treino
   */
  async getTemplates(trainerId = null) {
    try {
      let query = supabase
        .from('workout_templates')
        .select(`
          *,
          workout_plan:workout_plans!inner(
            trainer_id
          ),
          template_exercises (
            *,
            exercise:exercises (
              *,
              exercise_videos (*)
            ),
            template_sets (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (trainerId) {
        query = query.eq('workout_plan.trainer_id', trainerId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Buscar template específico por ID
   */
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
              exercise_videos (*),
              primary_muscle,
              secondary_muscles,
              equipment
            ),
            template_sets (
              *,
              set_type,
              target_reps,
              target_weight,
              rpe_target
            )
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
  },

  /**
   * Criar novo template de treino
   */
  async createTemplate(templateData, exercises) {
    try {
      // Começar transação
      const { data: template, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          workout_plan_id: templateData.workout_plan_id,
          name: templateData.name,
          description: templateData.description,
          day_of_week: templateData.day_of_week,
          week_number: templateData.week_number,
          order_in_plan: templateData.order_in_plan,
          estimated_duration_minutes: templateData.estimated_duration
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Adicionar exercícios ao template
      for (const exercise of exercises) {
        const { data: templateExercise, error: exerciseError } = await supabase
          .from('template_exercises')
          .insert({
            workout_template_id: template.id,
            exercise_id: exercise.id,
            order_in_workout: exercise.order_in_workout,
            rest_seconds: exercise.rest_seconds,
            notes: exercise.notes
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Adicionar séries para cada exercício
        const setsToInsert = exercise.sets.map(set => ({
          template_exercise_id: templateExercise.id,
          set_number: set.set_number,
          set_type: set.set_type,
          target_reps: set.target_reps,
          target_weight: set.target_weight,
          rpe_target: set.rpe_target
        }));

        const { error: setsError } = await supabase
          .from('template_sets')
          .insert(setsToInsert);

        if (setsError) throw setsError;
      }

      return { success: true, data: template };
    } catch (error) {
      console.error('Error creating template:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Atualizar template existente
   */
  async updateTemplate(templateId, updates) {
    try {
      const { data, error } = await supabase
        .from('workout_templates')
        .update({
          name: updates.name,
          description: updates.description,
          estimated_duration_minutes: updates.estimated_duration,
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
  },

  /**
   * Duplicar template
   */
  async duplicateTemplate(templateId, newName) {
    try {
      // Buscar template original
      const { data: original } = await this.getTemplateById(templateId);
      
      if (!original) throw new Error('Template not found');

      // Criar cópia
      const newTemplate = {
        ...original.data,
        name: newName || `${original.data.name} (Cópia)`,
        created_at: new Date().toISOString()
      };

      // Remover ID para criar novo
      delete newTemplate.id;

      const result = await this.createTemplate(
        newTemplate,
        original.data.template_exercises
      );

      return result;
    } catch (error) {
      console.error('Error duplicating template:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar template
   */
  async deleteTemplate(templateId) {
    try {
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
  },

  // ================ ATRIBUIÇÕES ================

  /**
   * Atribuir template a atleta
   */
  async assignTemplateToAthlete(templateId, athleteId, startDate) {
    try {
      // Criar plano de treino para o atleta
      const { data: plan, error: planError } = await supabase
        .from('workout_plans')
        .insert({
          name: 'Plano Personalizado',
          trainer_id: (await supabase.auth.getUser()).data.user.id,
          athlete_id: athleteId,
          start_date: startDate,
          status: 'active'
        })
        .select()
        .single();

      if (planError) throw planError;

      // Criar sessões baseadas no template
      const { data: template } = await this.getTemplateById(templateId);
      
      // Gerar sessões para as próximas 4 semanas
      const sessions = [];
      for (let week = 0; week < 4; week++) {
        const sessionDate = new Date(startDate);
        sessionDate.setDate(sessionDate.getDate() + (week * 7) + (template.data.day_of_week || 0));
        
        sessions.push({
          workout_template_id: templateId,
          athlete_id: athleteId,
          scheduled_date: sessionDate.toISOString().split('T')[0],
          status: 'scheduled'
        });
      }

      const { error: sessionsError } = await supabase
        .from('workout_sessions')
        .insert(sessions);

      if (sessionsError) throw sessionsError;

      return { success: true, data: plan };
    } catch (error) {
      console.error('Error assigning template:', error);
      return { success: false, error: error.message };
    }
  },

  // ================ EXERCÍCIOS ================

  /**
   * Buscar todos os exercícios
   */
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
  },

  /**
   * Adicionar exercício aos favoritos
   */
  async toggleExerciseFavorite(exerciseId, userId) {
    try {
      // Verificar se já é favorito
      const { data: existing } = await supabase
        .from('exercise_favorites')
        .select()
        .eq('exercise_id', exerciseId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('exercise_favorites')
          .delete()
          .eq('id', existing.id);
          
        if (error) throw error;
        return { success: true, action: 'removed' };
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('exercise_favorites')
          .insert({
            exercise_id: exerciseId,
            user_id: userId
          });
          
        if (error) throw error;
        return { success: true, action: 'added' };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  },

  // ================ PROGRESSÃO ================

  /**
   * Buscar histórico de progressão do atleta
   */
  async getAthleteProgress(athleteId, exerciseId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('athlete_progress')
        .select(`
          *,
          performed_sets!inner (
            reps,
            weight,
            rpe,
            completed,
            completed_at
          )
        `)
        .eq('athlete_id', athleteId)
        .eq('exercise_id', exerciseId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Processar dados para o sistema de progressão
      const processedData = data.map(session => ({
        date: session.date,
        exercise_id: exerciseId,
        max_weight: session.max_weight,
        max_reps: session.max_reps,
        target_reps: 12, // Ajustar conforme necessário
        sets: session.performed_sets,
        avg_rpe: session.avg_rpe,
        total_volume: session.total_volume
      }));

      return { success: true, data: processedData };
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Calcular sugestão de progressão
   */
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
    const completedAllSets = lastSession.sets.every(set => 
      set.completed && set.reps >= set.target_reps
    );
    
    const avgRPE = lastSession.avg_rpe || 7;

    // Lógica de progressão
    if (completedAllSets) {
      if (avgRPE <= 7) {
        return {
          type: 'increase_weight',
          suggestion: 'Aumentar peso em 5-10%',
          recommendedWeight: Math.round(lastSession.max_weight * 1.075 * 2) / 2,
          recommendedReps: lastSession.target_reps,
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
          recommendedReps: lastSession.target_reps,
          confidence: 85,
          reasoning: [
            '✅ Completou todas as repetições',
            '⚖️ RPE adequado (7-8.5)',
            '📊 Progressão conservadora'
          ]
        };
      }
    }

    // Manter peso se não completou
    return {
      type: 'maintain',
      suggestion: 'Manter peso e focar na execução',
      recommendedWeight: lastSession.max_weight,
      recommendedReps: lastSession.target_reps,
      confidence: 75,
      reasoning: [
        '⚠️ Não completou todas as séries',
        '🔄 Repetir para consolidar',
        '💡 Focar na técnica'
      ]
    };
  },

  // ================ SESSÕES ================

  /**
   * Iniciar sessão de treino
   */
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
  },

  /**
   * Guardar série executada
   */
  async savePerformedSet(setData) {
    try {
      const { data, error } = await supabase
        .from('performed_sets')
        .insert({
          session_exercise_id: setData.session_exercise_id,
          template_set_id: setData.template_set_id,
          set_number: setData.set_number,
          set_type: setData.set_type,
          reps: setData.reps,
          weight: setData.weight,
          rpe: setData.rpe,
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
  },

  /**
   * Completar sessão de treino
   */
  async completeWorkoutSession(sessionId, totalVolume) {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
          total_volume_load: totalVolume
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
  },

  // ================ VÍDEOS ================

  /**
   * Upload de vídeo de exercício
   */
  async uploadExerciseVideo(exerciseId, videoFile, videoData) {
    try {
      // Upload do ficheiro para o storage
      const fileName = `exercises/${exerciseId}/${Date.now()}_${videoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('exercise-videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Obter URL público
      const { data: urlData } = supabase.storage
        .from('exercise-videos')
        .getPublicUrl(fileName);

      // Guardar referência na BD
      const { data, error } = await supabase
        .from('exercise_videos')
        .insert({
          exercise_id: exerciseId,
          video_url: urlData.publicUrl,
          thumbnail_url: videoData.thumbnail_url,
          video_type: 'upload',
          title: videoData.title,
          description: videoData.description,
          angle: videoData.angle,
          is_primary: videoData.is_primary || false,
          created_by: (await supabase.auth.getUser()).data.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload de vídeo do atleta (execução)
   */
  async uploadAthleteVideo(athleteId, exerciseId, sessionId, videoFile, formData) {
    try {
      // Upload do ficheiro
      const fileName = `athletes/${athleteId}/${Date.now()}_${videoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('athlete-videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Obter URL público
      const { data: urlData } = supabase.storage
        .from('athlete-videos')
        .getPublicUrl(fileName);

      // Guardar na BD
      const { data, error } = await supabase
        .from('athlete_exercise_videos')
        .insert({
          athlete_id: athleteId,
          exercise_id: exerciseId,
          workout_session_id: sessionId,
          video_url: urlData.publicUrl,
          weight: formData.weight,
          reps: formData.reps,
          set_number: formData.set_number,
          notes: formData.notes
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading athlete video:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Adicionar feedback do trainer ao vídeo
   */
  async addTrainerFeedback(videoId, feedback, formRating) {
    try {
      const { data, error } = await supabase
        .from('athlete_exercise_videos')
        .update({
          trainer_feedback: feedback,
          form_rating: formRating,
          is_reviewed: true,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user.id
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
};

export default workoutService;