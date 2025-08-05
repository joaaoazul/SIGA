// src/pages/auth/MagicLinkCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase/supabaseClient';
import InviteService from '../../services/supabase/invite.service';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MagicLinkCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    handleMagicLink();
  }, []);

  const handleMagicLink = async () => {
    try {
      // 1. Pegar o token da URL
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Link inválido. Token não encontrado.');
        setLoading(false);
        return;
      }

      // 2. Validar o token no backend
      const validation = await InviteService.validateInviteToken(token);
      
      if (!validation.valid) {
        setError(validation.error || 'Convite inválido ou expirado');
        setLoading(false);
        return;
      }

      // 3. Verificar se tem sessão (veio do magic link email)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Tem sessão - verificar se perfil está completo
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile?.setupCompleted || profile?.profile_complete) {
          // Perfil já completo, aceitar convite e ir para dashboard
          await InviteService.acceptInvite(token, session.user.id);
          toast.success('Login realizado com sucesso!');
          navigate('/athlete/dashboard');
        } else {
          // Perfil incompleto, ir para setup
          navigate(`/athlete-setup?token=${token}`);
        }
      } else {
        // Sem sessão - redirecionar para setup com token
        navigate(`/athlete-setup?token=${token}`);
      }

    } catch (error) {
      console.error('Error processing magic link:', error);
      setError('Erro ao processar o link. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Processando o seu acesso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao processar o link
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ir para Login
            </button>
            <p className="text-sm text-gray-500">
              Se continuar com problemas, contacte o seu trainer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MagicLinkCallback;