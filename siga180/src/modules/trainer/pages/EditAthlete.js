// src/modules/trainer/pages/EditAthleteCreate.js
// Versão do EditAthlete para CRIAR novos atletas (sem ID)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Importar todos os componentes e sections do EditAthlete original
// (copiar as sections e options do teu EditAthlete.js)

const EditAthleteCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  
  // Estado inicial vazio para novo atleta
  const [formData, setFormData] = useState({
    // Informações Básicas
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    occupation: '',
    
    // Informações Físicas
    height: '',
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    
    // Objetivos
    goals: [],
    why_training: '',
    expectations: '',
    motivation_level: '',
    biggest_challenges: [],
    
    // Histórico de Saúde
    medical_conditions: [],
    medications: '',
    allergies: '',
    injuries_history: '',
    surgeries_history: '',
    chronic_conditions: [],
    
    // Contacto de Emergência
    emergency_contact: '',
    emergency_phone: '',
    emergency_relationship: '',
    
    // Arrays vazios
    dietary_restrictions: [],
    supplements: [],
    equipment_available: [],
    availability: [],
    communication_preference: [],
    
    // Outros campos
    activity_level: '',
    training_experience: '',
    music_preference: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (Array.isArray(formData[name])) {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }
    
    try {
      setSaving(true);
      console.log('📝 Criando novo atleta...');
      
      // 1. Criar o perfil do atleta
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          email: formData.email,
          name: formData.name,
          phone: formData.phone || null,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          occupation: formData.occupation || null,
          role: 'athlete',
          
          // Dados físicos
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
          muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
          
          // Arrays
          goals: formData.goals.length > 0 ? formData.goals : null,
          medical_conditions: formData.medical_conditions.length > 0 ? formData.medical_conditions : null,
          dietary_restrictions: formData.dietary_restrictions.length > 0 ? formData.dietary_restrictions : null,
          
          // Contacto emergência
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          
          // Outros
          training_experience: formData.training_experience || null,
          activity_level: formData.activity_level || null,
          
          // Flags
          setup_complete: true,
          profile_complete: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError);
        
        // Se for erro de email duplicado
        if (profileError.message?.includes('duplicate')) {
          throw new Error('Este email já está registado');
        }
        throw profileError;
      }
      
      console.log('✅ Perfil criado:', newProfile.id);
      
      // 2. Criar relação trainer-atleta via invites
      const { error: inviteError } = await supabase
        .from('invites')
        .insert({
          trainer_id: user.id,
          athlete_name: formData.name,
          athlete_email: formData.email,
          status: 'accepted',
          accepted_by: newProfile.id,
          accepted_at: new Date().toISOString(),
          token: crypto.randomUUID()
        });
      
      if (inviteError) {
        console.error('⚠️ Erro ao criar relação:', inviteError);
        // Não é crítico, continuar
      }
      
      toast.success('✅ Atleta criado com sucesso!');
      
      // Navegar para a página de detalhes
      setTimeout(() => {
        navigate(`/athletes/${newProfile.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro:', error);
      toast.error(error.message || 'Erro ao criar atleta');
    } finally {
      setSaving(false);
    }
  };

  // Copiar todas as sections do EditAthlete.js
  // (usar o mesmo JSX das sections, apenas mudando o título para "Criar Novo Atleta")
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/athletes')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Criar Novo Atleta</h1>
              <p className="text-gray-600 mt-1">Preencher ficha completa do atleta</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section: Dados Pessoais */}
        {activeSection === 'basic' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do atleta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+351 912 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* COPIAR TODAS AS OUTRAS SECTIONS DO EditAthlete.js AQUI */}
        {/* ... */}

        {/* Botões de Ação */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/athletes')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center px-6 py-2 rounded-lg ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A criar...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Atleta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAthleteCreate;