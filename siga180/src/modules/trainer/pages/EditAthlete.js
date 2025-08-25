// src/modules/trainer/pages/EditAthlete.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Target,
  Heart,
  Ruler,
  Weight,
  AlertCircle,
  Info,
  Loader2,
  X,
  Plus,
  Trash2,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const EditAthlete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [athlete, setAthlete] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    // Informações Básicas
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    
    // Informações Físicas
    height: '',
    weight: '',
    
    // Objetivos (array)
    goals: [],
    customGoal: '',
    
    // Informações de Saúde
    medical_conditions: [],
    customCondition: '',
    medications: '',
    allergies: '',
    
    // Contacto de Emergência
    emergency_contact: '',
    emergency_phone: '',
    emergency_relationship: '',
    
    // Nível e Experiência
    activity_level: '',
    training_experience: '',
    training_frequency: '',
    
    // Preferências
    preferred_training_time: '',
    training_location: '',
    equipment_available: [],
    customEquipment: '',
    
    // Disponibilidade
    availability: [],
    
    // Notas do Trainer
    trainer_notes: '',
    
    // Outras informações
    occupation: '',
    lifestyle: '',
    sleep_hours: '',
    stress_level: '',
    hydration: '',
    
    // Estado do perfil
    profile_complete: false
  });

  // Opções para selects
  const goalOptions = [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar condicionamento',
    'Aumentar força',
    'Melhorar flexibilidade',
    'Preparação para competição',
    'Reabilitação',
    'Bem-estar geral',
    'Melhorar postura',
    'Reduzir stress'
  ];

  const medicalConditionOptions = [
    'Hipertensão',
    'Diabetes',
    'Asma',
    'Problemas cardíacos',
    'Lesão no joelho',
    'Lesão no ombro',
    'Lesão nas costas',
    'Artrite',
    'Osteoporose',
    'Ansiedade/Depressão'
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'lightly_active', label: 'Levemente ativo (1-3 dias/semana)' },
    { value: 'moderately_active', label: 'Moderadamente ativo (3-5 dias/semana)' },
    { value: 'very_active', label: 'Muito ativo (6-7 dias/semana)' },
    { value: 'extra_active', label: 'Extra ativo (atleta/trabalho físico)' }
  ];

  const experienceOptions = [
    { value: 'beginner', label: 'Iniciante (< 6 meses)' },
    { value: 'intermediate', label: 'Intermediário (6 meses - 2 anos)' },
    { value: 'advanced', label: 'Avançado (2-5 anos)' },
    { value: 'expert', label: 'Expert (> 5 anos)' }
  ];

  const equipmentOptions = [
    'Halteres',
    'Barra e anilhas',
    'Kettlebells',
    'Bandas elásticas',
    'TRX',
    'Bola suíça',
    'Tapete',
    'Pull-up bar',
    'Máquinas de ginásio',
    'Bicicleta/Elíptica',
    'Passadeira'
  ];

  const weekDays = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  useEffect(() => {
    if (id && user?.id) {
      fetchAthleteData();
    }
  }, [id, user]);

  const fetchAthleteData = async () => {
    try {
      setLoading(true);

      // Buscar dados do atleta através do convite
      const { data: inviteData, error: inviteError } = await supabase
        .from('invites')
        .select(`
          *,
          athlete:profiles!invites_accepted_by_fkey (*)
        `)
        .eq('trainer_id', user.id)
        .eq('accepted_by', id)
        .eq('status', 'accepted')
        .single();

      if (inviteError) {
        console.error('Erro ao buscar atleta:', inviteError);
        toast.error('Atleta não encontrado');
        navigate('/athletes');
        return;
      }

      const athleteProfile = inviteData.athlete;
      
      // Preencher o formulário com os dados existentes
      const existingData = {
        name: athleteProfile.name || inviteData.athlete_name || '',
        email: athleteProfile.email || inviteData.athlete_email || '',
        phone: athleteProfile.phone || '',
        birth_date: athleteProfile.birth_date || '',
        height: athleteProfile.height || '',
        weight: athleteProfile.weight || '',
        goals: athleteProfile.goals || [],
        medical_conditions: athleteProfile.medical_conditions || [],
        medications: athleteProfile.medications || '',
        allergies: athleteProfile.allergies || '',
        emergency_contact: athleteProfile.emergency_contact || '',
        emergency_phone: athleteProfile.emergency_phone || '',
        emergency_relationship: athleteProfile.emergency_relationship || '',
        activity_level: athleteProfile.activity_level || '',
        training_experience: athleteProfile.training_experience || '',
        training_frequency: athleteProfile.training_frequency || '',
        preferred_training_time: athleteProfile.preferred_training_time || '',
        training_location: athleteProfile.training_location || '',
        equipment_available: athleteProfile.equipment_available || [],
        availability: athleteProfile.availability || [],
        trainer_notes: athleteProfile.trainer_notes || '',
        occupation: athleteProfile.occupation || '',
        lifestyle: athleteProfile.lifestyle || '',
        sleep_hours: athleteProfile.sleep_hours || '',
        stress_level: athleteProfile.stress_level || '',
        hydration: athleteProfile.hydration || '',
        profile_complete: athleteProfile.profile_complete || false,
        customGoal: '',
        customCondition: '',
        customEquipment: ''
      };

      setFormData(existingData);
      setOriginalData(existingData);
      setAthlete(athleteProfile);

    } catch (error) {
      console.error('Erro geral:', error);
      toast.error('Erro ao carregar dados do atleta');
      navigate('/athletes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'availability') {
        setFormData(prev => ({
          ...prev,
          availability: checked 
            ? [...prev.availability, value]
            : prev.availability.filter(day => day !== value)
        }));
      } else if (name === 'equipment_available') {
        setFormData(prev => ({
          ...prev,
          equipment_available: checked 
            ? [...prev.equipment_available, value]
            : prev.equipment_available.filter(eq => eq !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addGoal = (goal) => {
    if (goal && !formData.goals.includes(goal)) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goal],
        customGoal: ''
      }));
    }
  };

  const removeGoal = (goalToRemove) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal !== goalToRemove)
    }));
  };

  const addMedicalCondition = (condition) => {
    if (condition && !formData.medical_conditions.includes(condition)) {
      setFormData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, condition],
        customCondition: ''
      }));
    }
  };

  const removeMedicalCondition = (conditionToRemove) => {
    setFormData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter(c => c !== conditionToRemove)
    }));
  };

  const addEquipment = (equipment) => {
    if (equipment && !formData.equipment_available.includes(equipment)) {
      setFormData(prev => ({
        ...prev,
        equipment_available: [...prev.equipment_available, equipment],
        customEquipment: ''
      }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const checkProfileCompleteness = () => {
    const requiredFields = [
      'name',
      'email',
      'birth_date',
      'height',
      'weight',
      'activity_level',
      'training_experience'
    ];

    const hasRequiredFields = requiredFields.every(field => formData[field]);
    const hasGoals = formData.goals.length > 0;
    const hasAvailability = formData.availability.length > 0;

    return hasRequiredFields && hasGoals && hasAvailability;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      // Preparar dados para atualização
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        birth_date: formData.birth_date || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        goals: formData.goals,
        medical_conditions: formData.medical_conditions,
        medications: formData.medications,
        allergies: formData.allergies,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
        emergency_relationship: formData.emergency_relationship,
        activity_level: formData.activity_level,
        training_experience: formData.training_experience,
        training_frequency: formData.training_frequency,
        preferred_training_time: formData.preferred_training_time,
        training_location: formData.training_location,
        equipment_available: formData.equipment_available,
        availability: formData.availability,
        trainer_notes: formData.trainer_notes,
        occupation: formData.occupation,
        lifestyle: formData.lifestyle,
        sleep_hours: formData.sleep_hours,
        stress_level: formData.stress_level,
        hydration: formData.hydration,
        profile_complete: checkProfileCompleteness(),
        updated_at: new Date().toISOString()
      };

      // Atualizar no Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Dados do atleta atualizados com sucesso!');
      navigate(`/athletes/${id}`);

    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar dados do atleta');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/athletes/${id}`)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Atleta</h1>
              <p className="text-gray-600 mt-1">
                Complete as informações do perfil do atleta
              </p>
            </div>
          </div>
          
          {/* Profile Complete Badge */}
          {checkProfileCompleteness() ? (
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Perfil Completo</span>
            </div>
          ) : (
            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Perfil Incompleto</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Informações Básicas
          </h2>
          
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
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
                placeholder="+351 XXX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.birth_date && (
                <p className="text-xs text-gray-500 mt-1">
                  Idade: {calculateAge(formData.birth_date)} anos
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profissão
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Ex: Engenheiro, Professor, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estilo de Vida
              </label>
              <select
                name="lifestyle"
                value={formData.lifestyle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="sedentary">Sedentário</option>
                <option value="moderate">Moderado</option>
                <option value="active">Ativo</option>
                <option value="very_active">Muito Ativo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informações Físicas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Ruler className="h-5 w-5 mr-2 text-green-600" />
            Informações Físicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                min="100"
                max="250"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="30"
                max="300"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IMC
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {formData.height && formData.weight 
                  ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)
                  : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Objetivos *
          </h2>
          
          {/* Objetivos selecionados */}
          {formData.goals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.goals.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeGoal(goal)}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Seletor de objetivos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => addGoal(goal)}
                disabled={formData.goals.includes(goal)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  formData.goals.includes(goal)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>

          {/* Objetivo personalizado */}
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.customGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
              placeholder="Adicionar objetivo personalizado..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                if (formData.customGoal.trim()) {
                  addGoal(formData.customGoal.trim());
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nível e Experiência */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-600" />
            Nível e Experiência
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Atividade Atual *
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {activityLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experiência em Treino *
              </label>
              <select
                name="training_experience"
                value={formData.training_experience}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência de Treino Desejada
              </label>
              <select
                name="training_frequency"
                value={formData.training_frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="1-2">1-2 vezes por semana</option>
                <option value="3-4">3-4 vezes por semana</option>
                <option value="5-6">5-6 vezes por semana</option>
                <option value="7">Todos os dias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário Preferido
              </label>
              <select
                name="preferred_training_time"
                value={formData.preferred_training_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="morning">Manhã (6h-12h)</option>
                <option value="afternoon">Tarde (12h-18h)</option>
                <option value="evening">Noite (18h-22h)</option>
                <option value="flexible">Horário Flexível</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Disponibilidade para Treinos *
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  value={day}
                  checked={formData.availability.includes(day)}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Local e Equipamentos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-600" />
            Local e Equipamentos
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local de Treino
              </label>
              <select
                name="training_location"
                value={formData.training_location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="gym">Ginásio</option>
                <option value="home">Casa</option>
                <option value="outdoor">Ar livre</option>
                <option value="studio">Estúdio/Box</option>
                <option value="mixed">Vários locais</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamentos Disponíveis
              </label>
              
              {/* Equipamentos selecionados */}
              {formData.equipment_available.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.equipment_available.map((equipment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {equipment}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          equipment_available: prev.equipment_available.filter(e => e !== equipment)
                        }))}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {equipmentOptions.map((equipment) => (
                  <label key={equipment} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="equipment_available"
                      value={equipment}
                      checked={formData.equipment_available.includes(equipment)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{equipment}</span>
                  </label>
                ))}
              </div>

              {/* Equipamento personalizado */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customEquipment}
                  onChange={(e) => setFormData(prev => ({ ...prev, customEquipment: e.target.value }))}
                  placeholder="Adicionar outro equipamento..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.customEquipment.trim()) {
                      addEquipment(formData.customEquipment.trim());
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Saúde */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-600" />
            Informações de Saúde
          </h2>
          
          <div className="space-y-4">
            {/* Condições Médicas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições Médicas / Lesões
              </label>
              
              {formData.medical_conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.medical_conditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeMedicalCondition(condition)}
                        className="ml-2 hover:text-red-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {medicalConditionOptions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addMedicalCondition(condition)}
                    disabled={formData.medical_conditions.includes(condition)}
                    className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      formData.medical_conditions.includes(condition)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCondition: e.target.value }))}
                  placeholder="Adicionar condição médica..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.customCondition.trim()) {
                      addMedicalCondition(formData.customCondition.trim());
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Medicamentos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicamentos
              </label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                rows="2"
                placeholder="Liste medicamentos em uso regular..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Alergias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alergias
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="2"
                placeholder="Liste alergias conhecidas..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Estilo de Vida e Hábitos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-teal-600" />
            Estilo de Vida e Hábitos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas de Sono
              </label>
              <select
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="<5">Menos de 5 horas</option>
                <option value="5-6">5-6 horas</option>
                <option value="6-7">6-7 horas</option>
                <option value="7-8">7-8 horas</option>
                <option value="8-9">8-9 horas</option>
                <option value=">9">Mais de 9 horas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Stress
              </label>
              <select
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="low">Baixo</option>
                <option value="moderate">Moderado</option>
                <option value="high">Alto</option>
                <option value="very_high">Muito Alto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hidratação Diária
              </label>
              <select
                name="hydration"
                value={formData.hydration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="<1L">Menos de 1L</option>
                <option value="1-1.5L">1 - 1.5L</option>
                <option value="1.5-2L">1.5 - 2L</option>
                <option value="2-2.5L">2 - 2.5L</option>
                <option value=">2.5L">Mais de 2.5L</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacto de Emergência */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-yellow-600" />
            Contacto de Emergência
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                placeholder="+351 XXX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relação
              </label>
              <input
                type="text"
                name="emergency_relationship"
                value={formData.emergency_relationship}
                onChange={handleChange}
                placeholder="Ex: Cônjuge, Pai/Mãe, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notas do Trainer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
            Notas do Trainer
          </h2>
          
          <textarea
            name="trainer_notes"
            value={formData.trainer_notes}
            onChange={handleChange}
            rows="4"
            placeholder="Adicione observações importantes sobre o atleta..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(`/athletes/${id}`)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            {hasChanges() && (
              <span className="text-sm text-gray-500">
                Tem alterações não guardadas
              </span>
            )}
            <button
              type="submit"
              disabled={saving || !hasChanges()}
              className={`inline-flex items-center px-6 py-2 rounded-lg transition-colors ${
                saving || !hasChanges()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAthlete;