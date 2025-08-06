

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { 
  User, 
  Mail, 
  Send,
  Link as LinkIcon,
  Copy,
  Check,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import inviteService from '../../../services/supabase/inviteService.js';

const AthleteFormWithMagicLink = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState('quickInvite'); // 'quickInvite' or 'fullForm'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    personalMessage: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [magicLink, setMagicLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickInvite = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Obter dados do trainer atual
      const trainerName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Seu Trainer';
      
      // Usar o serviço de convites
      const result = await inviteService.sendInvite({
        athleteName: formData.name,
        athleteEmail: formData.email,
        trainerId: user.id,
        trainerName: trainerName,
        personalMessage: formData.personalMessage || null
      });

      if (result.success) {
        setMagicLink(result.inviteLink);
        setInviteSent(true);
        
        // Notificar o componente pai se necessário
        if (onSubmit) {
          await onSubmit({
            name: formData.name,
            email: formData.email,
            inviteId: result.invite.id,
            inviteToken: result.invite.token,
            status: 'invited',
            invitedAt: new Date().toISOString(),
            setupCompleted: false
          });
        }
        
        console.log('🎉 Convite criado com sucesso!');
        
      } else {
        throw new Error(result.error || 'Erro ao criar convite');
      }
      
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      
      let errorMessage = 'Falha ao enviar convite. ';
      
      if (error.message?.includes('already')) {
        errorMessage = 'Este atleta já tem um convite pendente. Verifique a lista de convites.';
      } else {
        errorMessage += error.message || 'Tente novamente.';
      }
      
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o utilizador começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Se o convite foi enviado, mostrar tela de sucesso
  if (inviteSent) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Convite Enviado!</h3>
          <p className="text-gray-600 mt-2">
            Um convite foi enviado para <strong>{formData.email}</strong>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-3">
            O atleta receberá um email com um link seguro para completar o perfil.
            Também pode partilhar este link diretamente:
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={magicLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </button>
          </div>

          {formData.personalMessage && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Mensagem enviada:</p>
              <p className="text-sm text-gray-700 italic">"{formData.personalMessage}"</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setInviteSent(false);
              setFormData({ name: '', email: '', personalMessage: '' });
              setMagicLink('');
              setShowMessage(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Convidar Outro
          </button>
          <button
            onClick={() => navigate('/trainer/athletes')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Ver Atletas
          </button>
        </div>
      </div>
    );
  }

  // Renderizar o formulário principal
  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Como deseja adicionar este atleta?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('quickInvite')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'quickInvite' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                mode === 'quickInvite' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Convite Rápido</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Enviar um magic link para o atleta completar o próprio perfil
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('fullForm')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'fullForm' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                mode === 'fullForm' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Perfil Completo</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Preencher todos os detalhes do atleta agora
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Invite Form */}
      {mode === 'quickInvite' && (
        <form onSubmit={handleQuickInvite} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar Convite</h3>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Atleta *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="João Silva"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email do Atleta *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="joao@exemplo.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Personal Message Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowMessage(!showMessage)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {showMessage ? 'Remover mensagem' : 'Adicionar mensagem personalizada'}
              </button>
            </div>

            {/* Personal Message */}
            {showMessage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem Personalizada (Opcional)
                </label>
                <textarea
                  name="personalMessage"
                  value={formData.personalMessage}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Olá! Estou ansioso para começarmos a treinar juntos..."
                />
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">O que acontece a seguir?</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>O atleta recebe um email com link seguro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Completa o perfil com detalhes pessoais</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Após completar, acede ao dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/trainer/athletes')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    A enviar...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Convite
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Full Form Mode */}
      {mode === 'fullForm' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">A redirecionar...</h3>
            <p className="text-gray-600 mb-6">A abrir o formulário completo de atleta.</p>
            <button
              onClick={() => navigate('/trainer/athletes/new/full')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteFormWithMagicLink;