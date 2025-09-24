// siga180/src/modules/trainer/hooks/useAthletes.js

import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

export const useAthletes = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });

  // Buscar atletas do trainer
  const fetchAthletes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar todos os atletas através dos convites aceites
      const { data: invites, error: invitesError } = await supabase
        .from('invites')
        .select(`
          *,
          athlete:accepted_by (
            id,
            email,
            name,
            phone,
            created_at
          )
        `)
        .eq('trainer_id', user.id)
        .eq('status', 'accepted');

      if (invitesError) throw invitesError;

      // Mapear para formato de atletas
      const athletesList = invites?.map(invite => ({
        id: invite.athlete?.id || invite.id,
        name: invite.athlete?.name || invite.athlete_name,
        email: invite.athlete?.email || invite.athlete_email,
        phone: invite.athlete?.phone || '',
        status: 'active',
        joinedAt: invite.accepted_at,
        lastActivity: new Date().toISOString(),
        completedWorkouts: 0,
        nextSession: null
      })) || [];

      setAthletes(athletesList);

      // Calcular estatísticas
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        total: athletesList.length,
        active: athletesList.filter(a => a.status === 'active').length,
        inactive: athletesList.filter(a => a.status === 'inactive').length,
        newThisMonth: athletesList.filter(a => 
          new Date(a.joinedAt) >= startOfMonth
        ).length
      });

    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
      toast.error('Erro ao carregar atletas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar atletas quando o componente monta
  useEffect(() => {
    fetchAthletes();

    // Subscrever a mudanças em tempo real
    const subscription = supabase
      .channel('athletes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invites',
          filter: `trainer_id=eq.${user?.id}`
        },
        () => {
          // Recarregar quando houver mudanças
          fetchAthletes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Adicionar novo atleta (criar convite)
  const addAthlete = async (athleteData) => {
    try {
      // Isto será integrado com o inviteService
      console.log('Adicionar atleta:', athleteData);
      await fetchAthletes(); // Recarregar lista
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar atleta:', error);
      return { success: false, error };
    }
  };

  // Atualizar atleta
  const updateAthlete = async (athleteId, updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', athleteId);

      if (error) throw error;

      toast.success('Atleta atualizado');
      await fetchAthletes();
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar atleta:', error);
      toast.error('Erro ao atualizar atleta');
      return { success: false, error };
    }
  };

  // Remover atleta (cancelar relação)
  const removeAthlete = async (athleteId) => {
    try {
      // Aqui você pode implementar a lógica de remover
      // Por exemplo, atualizar o status do convite ou criar uma tabela de relações
      console.log('Remover atleta:', athleteId);
      
      toast.success('Atleta removido');
      await fetchAthletes();
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover atleta:', error);
      toast.error('Erro ao remover atleta');
      return { success: false, error };
    }
  };

  // Buscar detalhes de um atleta
  const getAthleteById = async (athleteId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athleteId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar atleta:', error);
      return null;
    }
  };

  return {
    athletes,
    loading,
    stats,
    fetchAthletes,
    addAthlete,
    updateAthlete,
    removeAthlete,
    getAthleteById
  };
};