// src/modules/trainer/pages/CreateAthlete.js
// CRIAR ATLETA MANUAL COM TEMA DO DASHBOARD

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import { 
  ArrowLeft, Save, Loader2, User, Phone, Mail, 
  Calendar, Users, AlertCircle, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateAthlete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: dados básicos, 2: confirmar
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando user começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    setSaving(true);

    try {
      // Gerar ID e email temporário se necessário
      const athleteId = crypto.randomUUID();
      const athleteEmail = formData.email || `athlete_${Date.now()}@temp.local`;

      console.log('Criando atleta:', { athleteId, name: formData.name });

      // Criar perfil na BD
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: athleteId,
          email: athleteEmail,
          name: formData.name,
          phone: formData.phone || null,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          role: 'athlete',
          setup_complete: false,
          profile_complete: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Criar relação trainer-atleta
      await supabase
        .from('invites')
        .insert({
          trainer_id: user.id,
          athlete_name: formData.name,
          athlete_email: athleteEmail,
          status: 'accepted',
          accepted_by: athleteId,
          accepted_at: new Date().toISOString()
        });

      toast.success('Atleta criado! A redirecionar para anamnese...');
      
      // Redirecionar para completar anamnese
      setTimeout(() => {
        navigate(`/athletes/${athleteId}/edit`);
      }, 1500);
      
    } catch (error) {
      console.error('Erro:', error);
      
      if (error.code === '42501') {
        toast.error('Erro de permissão. Contacte o suporte.');
      } else if (error.code === '23505') {
        toast.error('Este email já está registado');
      } else {
        toast.error('Erro ao criar atleta');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/athletes/new')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Criar Perfil de Atleta</h1>
                <p className="text-sm text-gray-500 mt-0.5">Preencha os dados básicos do atleta</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                1
              </div>
              <div className="w-16 h-1 bg-gray-200">
                <div className={`h-full bg-blue-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Card Principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              {/* Dados Pessoais */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Dados Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-2.5 border rounded-lg transition-colors
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="João Silva"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Mail className="h-3.5 w-3.5 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-2.5 border rounded-lg transition-colors
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="joao@exemplo.com (opcional)"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Phone className="h-3.5 w-3.5 inline mr-1" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+351 912 345 678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Calendar className="h-3.5 w-3.5 inline mr-1" />
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Género
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Masculino</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Feminino</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Outro</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto de Emergência */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  Contacto de Emergência
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome do Contacto
                    </label>
                    <input
                      type="text"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Maria Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefone de Emergência
                    </label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergency_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+351 912 345 678"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Próximo passo:</strong> Após criar o perfil, será redirecionado para completar a anamnese completa do atleta.
              </p>
            </div>

            {/* Botões */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/athletes/new')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`
                  px-8 py-2.5 rounded-lg font-medium transition-all flex items-center
                  ${saving 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }
                `}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A criar atleta...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar e Continuar para Anamnese
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAthlete;