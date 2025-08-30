// src/modules/trainer/pages/Athletes.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, Mail, Phone, Calendar,
  TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, User,
  Users, Eye, Edit, Trash2, Loader2, Copy, Send
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const Athletes = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInvites, setShowInvites] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchAthletesAndInvites();
    }
  }, [user]);

  const fetchAthletesAndInvites = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando atletas para trainer:', user.id);
      
      // 1. BUSCAR ATLETAS DA TABELA ATHLETES (LÓGICA CORRIGIDA)
      const { data: athletesData, error: athletesError } = await supabase
        .from('athletes')
        .select(`
          id,
          profile_id,
          trainer_id,
          age,
          height,
          weight,
          goal,
          activity_level,
          created_at,
          updated_at
        `)
        .eq('trainer_id', user.id);

      if (athletesError) {
        console.error('❌ Erro ao buscar atletas:', athletesError);
        throw athletesError;
      }

      // 2. BUSCAR PERFIS DOS ATLETAS
      let athletesList = [];
      
      if (athletesData && athletesData.length > 0) {
        const profileIds = athletesData.map(a => a.profile_id).filter(Boolean);
        
        if (profileIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select(`
              id,
              email,
              name,
              phone,
              avatar_url,
              birth_date,
              gender,
              goals,
              medical_conditions,
              setup_complete,
              profile_complete,
              created_at
            `)
            .in('id', profileIds);
          
          if (profilesError) {
            console.error('❌ Erro ao buscar perfis:', profilesError);
          }
          
          // Combinar dados
          athletesList = athletesData.map(athlete => {
            const profile = profilesData?.find(p => p.id === athlete.profile_id);
            
            const age = profile?.birth_date ? 
              new Date().getFullYear() - new Date(profile.birth_date).getFullYear() : 
              athlete.age;
            
            const lastActivity = athlete.updated_at || athlete.created_at;
            const daysSinceActivity = Math.floor(
              (new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24)
            );
            
            let status = 'active';
            if (daysSinceActivity > 30) status = 'inactive';
            else if (daysSinceActivity > 14) status = 'warning';

            return {
              id: profile?.id || athlete.profile_id,
              athleteRecordId: athlete.id,
              name: profile?.name || profile?.email?.split('@')[0] || 'Sem nome',
              email: profile?.email || 'Sem email',
              phone: profile?.phone || '',
              avatar: profile?.avatar_url,
              age: age,
              height: athlete.height || profile?.height,
              weight: athlete.weight || profile?.weight,
              goal: athlete.goal || 'Não definido',
              goals: profile?.goals || [],
              status: status,
              setupComplete: profile?.setup_complete || false,
              profileComplete: profile?.profile_complete || false,
              joinedAt: athlete.created_at,
              lastActivity: lastActivity,
              daysSinceActivity: daysSinceActivity
            };
          });
        }
      }

      // 3. BUSCAR CONVITES PENDENTES
      const { data: pendingInvites, error: invitesError } = await supabase
        .from('invites')
        .select('*')
        .eq('trainer_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitesError) {
        console.error('⚠️ Erro ao buscar convites:', invitesError);
      }

      const invitesList = pendingInvites?.map(invite => ({
        id: invite.id,
        name: invite.athlete_name || 'Sem nome',
        email: invite.athlete_email,
        status: 'pending',
        createdAt: invite.created_at,
        expiresAt: invite.expires_at,
        token: invite.token,
        message: invite.invite_message
      })) || [];

      console.log('✅ Dados carregados:', {
        atletas: athletesList.length,
        convites: invitesList.length
      });

      setAthletes(athletesList);
      setInvites(invitesList);
      
    } catch (error) {
      console.error('❌ Erro geral:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar atletas
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && athlete.status === 'active') ||
      (filterStatus === 'inactive' && athlete.status === 'inactive') ||
      (filterStatus === 'warning' && athlete.status === 'warning');
    
    return matchesSearch && matchesFilter;
  });

  // Copiar link do convite
  const copyInviteLink = (token) => {
    const link = `${window.location.origin}/athlete-setup?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    toast.success('Link copiado!');
    
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  // Cancelar convite

const cancelInvite = async (inviteId) => {
  if (!window.confirm('Cancelar este convite?')) return;

  try {
    console.log('🔄 Cancelando convite:', inviteId);
    
    // Opção 1: DELETE direto (mais simples e eficaz)
    const { error } = await supabase
      .from('invites')
      .delete()
      .eq('id', inviteId)
      .eq('trainer_id', user.id);

    if (error) {
      console.error('❌ Erro Supabase:', error);
      throw error;
    }

    // Atualizar UI localmente sem recarregar tudo
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success('Convite cancelado!');
    
  } catch (error) {
    console.error('❌ Erro ao cancelar:', error);
    toast.error(`Erro: ${error.message || 'Falha ao cancelar convite'}`);
  }
};

  // Remover atleta
  const removeAthlete = async (athleteRecordId) => {
    if (!window.confirm('Remover este atleta? Poderá ser reativado depois.')) return;

    try {
      const athlete = athletes.find(a => a.athleteRecordId === athleteRecordId);
      
      if (!athlete) {
        toast.error('Atleta não encontrado');
        return;
      }

      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', athlete.athleteRecordId)
        .eq('trainer_id', user.id);

      if (error) throw error;

      toast.success('Atleta removido');
      fetchAthletesAndInvites();
    } catch (error) {
      console.error('Erro ao remover atleta:', error);
      toast.error('Erro ao remover atleta');
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      warning: 'Atenção',
      pending: 'Convite Pendente'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atletas</h1>
          <p className="text-gray-600 mt-1">
            {athletes.length} atleta{athletes.length !== 1 ? 's' : ''} • 
            {invites.length} convite{invites.length !== 1 ? 's' : ''} pendente{invites.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/athletes/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Atleta
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Pesquisar atletas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="warning">Atenção</option>
            <option value="inactive">Inativos</option>
          </select>

          <button
            onClick={() => setShowInvites(!showInvites)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              showInvites 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showInvites ? 'Ocultar' : 'Mostrar'} Convites ({invites.length})
          </button>
        </div>
      </div>

      {/* SECÇÃO DE CONVITES PENDENTES */}
      {showInvites && invites.length > 0 && (
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-yellow-600" />
            Convites Pendentes
          </h3>
          <div className="space-y-2">
            {invites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{invite.name}</p>
                  <p className="text-sm text-gray-600">{invite.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enviado há {Math.floor((new Date() - new Date(invite.createdAt)) / (1000 * 60 * 60 * 24))} dias
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyInviteLink(invite.token)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Copiar link"
                  >
                    {copiedLink === invite.token ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => cancelInvite(invite.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Cancelar convite"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABELA DE ATLETAS */}
      {filteredAthletes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' 
              ? 'Nenhum atleta encontrado' 
              : 'Ainda não tens atletas'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Tenta ajustar os filtros'
              : 'Começa por adicionar o teu primeiro atleta'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link
              to="/athletes/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Atleta
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atividade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAthletes.map(athlete => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {athlete.avatar ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={athlete.avatar} 
                              alt={athlete.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {athlete.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {athlete.age ? `${athlete.age} anos` : 'Idade não definida'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{athlete.email}</div>
                      {athlete.phone && (
                        <div className="text-sm text-gray-500">{athlete.phone}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={athlete.status} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {athlete.profileComplete ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Completo</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Incompleto</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {athlete.daysSinceActivity === 0 
                        ? 'Hoje' 
                        : athlete.daysSinceActivity === 1
                        ? 'Ontem'
                        : `Há ${athlete.daysSinceActivity} dias`}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/athletes/${athlete.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver perfil"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/athletes/${athlete.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => removeAthlete(athlete.athleteRecordId)}
                          className="text-red-600 hover:text-red-900"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{athletes.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {athletes.filter(a => a.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atenção</p>
              <p className="text-2xl font-bold text-gray-900">
                {athletes.filter(a => a.status === 'warning').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Convites</p>
              <p className="text-2xl font-bold text-gray-900">{invites.length}</p>
            </div>
            <Mail className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Athletes;