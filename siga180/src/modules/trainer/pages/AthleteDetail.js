// src/modules/trainer/pages/AthleteDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, Activity, Target,
  TrendingUp, Clock, Edit, MoreVertical, Dumbbell, Heart, Ruler,
  Weight, Award, AlertCircle, CheckCircle, FileText, BarChart3,
  Loader2, ChevronRight, History, Printer, Download, Coffee, Moon,
  Droplets, Apple, Brain, Stethoscope, Users, Music, Shield, Wine, Cigarette,
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';
// Importar jsPDF para gerar PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AthleteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [athlete, setAthlete] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id && user?.id) {
      fetchAthleteData();
    }
  }, [id, user]);

  const fetchAthleteData = async () => {
    try {
      setLoading(true);

      // Buscar convite
      const { data: invite } = await supabase
        .from('invites')
        .select('*')
        .eq('trainer_id', user.id)
        .or(`accepted_by.eq.${id},id.eq.${id}`)
        .eq('status', 'accepted')
        .single();

      if (!invite) {
        toast.error('Atleta não encontrado');
        navigate('/athletes');
        return;
      }

      // Buscar perfil completo
      const athleteId = invite.accepted_by || id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athleteId)
        .single();

      if (profile) {
        setAthlete({
          ...profile,
          id: athleteId,
          joinedAt: invite.accepted_at
        });
      }

      // Buscar planos de treino
      const { data: plans } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false });

      setWorkoutPlans(plans || []);

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Calcular idade
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Calcular IMC
  const calculateBMI = () => {
    if (athlete?.height && athlete?.weight) {
      const h = athlete.height / 100;
      return (athlete.weight / (h * h)).toFixed(1);
    }
    return null;
  };

  // Gerar PDF do Relatório
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ANAMNESE DO ATLETA', pageWidth/2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth - 20, 20, { align: 'right' });
    
    let yPosition = 35;

    // Dados Pessoais
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS PESSOAIS', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const personalData = [
      ['Nome:', athlete.name || '-'],
      ['Email:', athlete.email || '-'],
      ['Telefone:', athlete.phone || '-'],
      ['Data de Nascimento:', athlete.birth_date ? new Date(athlete.birth_date).toLocaleDateString('pt-PT') : '-'],
      ['Idade:', calculateAge(athlete.birth_date) ? `${calculateAge(athlete.birth_date)} anos` : '-'],
      ['Género:', athlete.gender === 'male' ? 'Masculino' : athlete.gender === 'female' ? 'Feminino' : athlete.gender || '-'],
      ['Profissão:', athlete.occupation || '-']
    ];

    personalData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += 7;
    });

    // Contacto de Emergência
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Contacto de Emergência', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${athlete.emergency_contact || '-'} - ${athlete.emergency_phone || '-'} (${athlete.emergency_relationship || '-'})`, 20, yPosition);
    yPosition += 10;

    // Avaliação Física
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AVALIAÇÃO FÍSICA', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const physicalData = [
      ['Altura:', `${athlete.height || '-'} cm`],
      ['Peso:', `${athlete.weight || '-'} kg`],
      ['IMC:', calculateBMI() || '-'],
      ['% Gordura:', athlete.body_fat_percentage ? `${athlete.body_fat_percentage}%` : '-'],
      ['Massa Muscular:', athlete.muscle_mass ? `${athlete.muscle_mass} kg` : '-']
    ];

    physicalData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += 7;
    });

    // Objetivos
    if (athlete.goals && athlete.goals.length > 0) {
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('OBJETIVOS', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      athlete.goals.forEach(goal => {
        doc.text(`• ${goal}`, 25, yPosition);
        yPosition += 7;
      });
    }

    // Nova página se necessário
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Histórico de Saúde
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTÓRICO DE SAÚDE', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (athlete.medical_conditions && athlete.medical_conditions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Condições Médicas:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      athlete.medical_conditions.forEach(condition => {
        doc.text(`• ${condition}`, 25, yPosition);
        yPosition += 7;
      });
    }

    if (athlete.medications) {
      doc.setFont('helvetica', 'bold');
      doc.text('Medicamentos:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(athlete.medications, 25, yPosition, { maxWidth: pageWidth - 45 });
      yPosition += 10;
    }

    // Estilo de Vida
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTILO DE VIDA', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const lifestyleData = [
      ['Nível de Atividade:', athlete.activity_level || '-'],
      ['Horas de Sono:', athlete.sleep_hours || '-'],
      ['Qualidade do Sono:', athlete.sleep_quality || '-'],
      ['Nível de Stress:', athlete.stress_level || '-'],
      ['Hidratação:', athlete.hydration || '-']
    ];

    lifestyleData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += 7;
    });

    // Notas do Trainer
    if (athlete.trainer_notes) {
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES DO TRAINER', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(athlete.trainer_notes, 20, yPosition, { maxWidth: pageWidth - 40 });
    }

    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth/2, 290, { align: 'center' });
    }

    // Guardar PDF
    doc.save(`anamnese_${athlete.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  // Tabs
  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  // Card de Informação
  const InfoCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600',
      orange: 'bg-orange-50 text-orange-600'
    };

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{value || '-'}</p>
          </div>
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
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

  if (!athlete) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Atleta não encontrado</h3>
          <Link to="/athletes" className="text-blue-600 hover:text-blue-700">
            Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  const age = calculateAge(athlete.birth_date);
  const bmi = calculateBMI();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/athletes')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Perfil do Atleta</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
            <Link
              to={`/athletes/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </div>
        </div>

        {/* Info Principal */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {athlete.avatar_url ? (
                  <img 
                    src={athlete.avatar_url} 
                    alt={athlete.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{athlete.name || 'Nome não definido'}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {athlete.email}
                  </div>
                  {athlete.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {athlete.phone}
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {age} anos
                    </div>
                  )}
                  {athlete.occupation && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {athlete.occupation}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end">
              <div className="text-right">
                {athlete.anamnese_completed_at ? (
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Anamnese Completa
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Anamnese Incompleta
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Membro desde {new Date(athlete.joinedAt || athlete.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          <TabButton 
            id="overview" 
            label="Visão Geral" 
            icon={BarChart3} 
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="anamnese" 
            label="Anamnese" 
            icon={FileText} 
            isActive={activeTab === 'anamnese'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="health" 
            label="Saúde" 
            icon={Heart} 
            isActive={activeTab === 'health'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="lifestyle" 
            label="Estilo de Vida" 
            icon={Coffee} 
            isActive={activeTab === 'lifestyle'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="nutrition" 
            label="Nutrição" 
            icon={Apple} 
            isActive={activeTab === 'nutrition'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="training" 
            label="Treino" 
            icon={Dumbbell} 
            isActive={activeTab === 'training'}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div>
        {/* Tab: Visão Geral */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InfoCard 
                icon={Ruler} 
                label="Altura" 
                value={athlete.height ? `${athlete.height} cm` : '-'}
                color="blue"
              />
              <InfoCard 
                icon={Weight} 
                label="Peso" 
                value={athlete.weight ? `${athlete.weight} kg` : '-'}
                color="green"
              />
              <InfoCard 
                icon={Activity} 
                label="IMC" 
                value={bmi || '-'}
                color="yellow"
              />
              <InfoCard 
                icon={Heart} 
                label="% Gordura" 
                value={athlete.body_fat_percentage ? `${athlete.body_fat_percentage}%` : '-'}
                color="red"
              />
            </div>

            {/* Objetivos */}
            {athlete.goals && athlete.goals.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Objetivos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {athlete.goals.map((goal, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
                
                {athlete.why_training && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Motivação para treinar:</p>
                    <p className="text-sm text-gray-600">{athlete.why_training}</p>
                  </div>
                )}
                
                {athlete.expectations && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Expectativas:</p>
                    <p className="text-sm text-gray-600">{athlete.expectations}</p>
                  </div>
                )}
              </div>
            )}

            {/* Desafios */}
            {athlete.biggest_challenges && athlete.biggest_challenges.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Maiores Desafios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {athlete.biggest_challenges.map((challenge, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                    >
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Anamnese Completa */}
        {activeTab === 'anamnese' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nome Completo</label>
                    <p className="text-gray-900 font-medium">{athlete.name || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-gray-900 font-medium">{athlete.email || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Telefone</label>
                    <p className="text-gray-900 font-medium">{athlete.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Data de Nascimento</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.birth_date ? new Date(athlete.birth_date).toLocaleDateString('pt-PT') : '-'}
                      {age && ` (${age} anos)`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Género</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.gender === 'male' ? 'Masculino' : 
                       athlete.gender === 'female' ? 'Feminino' : 
                       athlete.gender || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Profissão</label>
                    <p className="text-gray-900 font-medium">{athlete.occupation || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Contacto de Emergência */}
              {(athlete.emergency_contact || athlete.emergency_phone) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Contacto de Emergência
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg">
                    <div>
                      <label className="text-sm text-gray-600">Nome</label>
                      <p className="text-gray-900 font-medium">{athlete.emergency_contact || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Telefone</label>
                      <p className="text-gray-900 font-medium">{athlete.emergency_phone || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Relação</label>
                      <p className="text-gray-900 font-medium">{athlete.emergency_relationship || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Avaliação Física */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Ruler className="h-5 w-5 mr-2 text-green-600" />
                  Avaliação Física
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-600">Altura</label>
                    <p className="text-xl font-semibold text-gray-900">
                      {athlete.height ? `${athlete.height} cm` : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-600">Peso</label>
                    <p className="text-xl font-semibold text-gray-900">
                      {athlete.weight ? `${athlete.weight} kg` : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-600">IMC</label>
                    <p className="text-xl font-semibold text-gray-900">{bmi || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-600">% Gordura</label>
                    <p className="text-xl font-semibold text-gray-900">
                      {athlete.body_fat_percentage ? `${athlete.body_fat_percentage}%` : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-600">Massa Muscular</label>
                    <p className="text-xl font-semibold text-gray-900">
                      {athlete.muscle_mass ? `${athlete.muscle_mass} kg` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Saúde */}
        {activeTab === 'health' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Condições Médicas */}
              {athlete.medical_conditions && athlete.medical_conditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições Médicas</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {athlete.medical_conditions.map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Condições Crônicas */}
              {athlete.chronic_conditions && athlete.chronic_conditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições Crônicas</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {athlete.chronic_conditions.map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Medicamentos e Alergias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {athlete.medications && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Medicamentos</h4>
                    <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">{athlete.medications}</p>
                  </div>
                )}
                
                {athlete.allergies && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Alergias</h4>
                    <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">{athlete.allergies}</p>
                  </div>
                )}
              </div>

              {/* Histórico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {athlete.injuries_history && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Histórico de Lesões</h4>
                    <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">{athlete.injuries_history}</p>
                  </div>
                )}
                
                {athlete.surgeries_history && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Histórico de Cirurgias</h4>
                    <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">{athlete.surgeries_history}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Estilo de Vida */}
        {activeTab === 'lifestyle' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Nível de Atividade</h4>
                </div>
                <p className="text-gray-700">
                  {athlete.activity_level === 'sedentary' ? 'Sedentário' :
                   athlete.activity_level === 'lightly_active' ? 'Levemente Ativo' :
                   athlete.activity_level === 'moderately_active' ? 'Moderadamente Ativo' :
                   athlete.activity_level === 'very_active' ? 'Muito Ativo' :
                   athlete.activity_level === 'extra_active' ? 'Extra Ativo' :
                   athlete.activity_level || '-'}
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Moon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Sono</h4>
                </div>
                <p className="text-gray-700">
                  {athlete.sleep_hours || '-'} 
                  {athlete.sleep_quality && ` • ${athlete.sleep_quality === 'poor' ? 'Má qualidade' :
                                                   athlete.sleep_quality === 'fair' ? 'Razoável' :
                                                   athlete.sleep_quality === 'good' ? 'Boa' :
                                                   athlete.sleep_quality === 'excellent' ? 'Excelente' :
                                                   athlete.sleep_quality}`}
                </p>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Droplets className="h-5 w-5 text-cyan-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Hidratação</h4>
                </div>
                <p className="text-gray-700">{athlete.hydration || '-'}</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Nível de Stress</h4>
                </div>
                <p className="text-gray-700">
                  {athlete.stress_level === 'very_low' ? 'Muito Baixo' :
                   athlete.stress_level === 'low' ? 'Baixo' :
                   athlete.stress_level === 'moderate' ? 'Moderado' :
                   athlete.stress_level === 'high' ? 'Alto' :
                   athlete.stress_level === 'very_high' ? 'Muito Alto' :
                   athlete.stress_level || '-'}
                </p>
              </div>

              {athlete.alcohol_consumption && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Wine className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Álcool</h4>
                  </div>
                  <p className="text-gray-700">
                    {athlete.alcohol_consumption === 'never' ? 'Nunca' :
                     athlete.alcohol_consumption === 'rarely' ? 'Raramente' :
                     athlete.alcohol_consumption === 'occasional' ? 'Ocasional' :
                     athlete.alcohol_consumption === 'moderate' ? 'Moderado' :
                     athlete.alcohol_consumption === 'frequent' ? 'Frequente' :
                     athlete.alcohol_consumption}
                  </p>
                </div>
              )}

              {athlete.smoking_status && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Cigarette className="h-5 w-5 text-gray-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Tabagismo</h4>
                  </div>
                  <p className="text-gray-700">
                    {athlete.smoking_status === 'never' ? 'Nunca fumou' :
                     athlete.smoking_status === 'former' ? 'Ex-fumador' :
                     athlete.smoking_status === 'occasional' ? 'Fumador ocasional' :
                     athlete.smoking_status === 'regular' ? 'Fumador regular' :
                     athlete.smoking_status}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Nutrição */}
        {activeTab === 'nutrition' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Restrições Alimentares */}
              {athlete.dietary_restrictions && athlete.dietary_restrictions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restrições Alimentares</h3>
                  <div className="flex flex-wrap gap-2">
                    {athlete.dietary_restrictions.map((restriction, index) => (
                      <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suplementos */}
              {athlete.supplements && athlete.supplements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suplementação</h3>
                  <div className="flex flex-wrap gap-2">
                    {athlete.supplements.map((supplement, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {supplement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações Nutricionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {athlete.meal_frequency && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frequência de Refeições</h4>
                    <p className="text-gray-600">{athlete.meal_frequency}</p>
                  </div>
                )}
                
                {athlete.eating_habits && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hábitos Alimentares</h4>
                    <p className="text-gray-600">{athlete.eating_habits}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Treino */}
        {activeTab === 'training' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Experiência */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experiência em Treino</h4>
                  <p className="text-gray-600">
                    {athlete.training_experience === 'none' ? 'Sem experiência' :
                     athlete.training_experience === 'beginner' ? 'Iniciante' :
                     athlete.training_experience === 'intermediate' ? 'Intermediário' :
                     athlete.training_experience === 'advanced' ? 'Avançado' :
                     athlete.training_experience === 'expert' ? 'Expert' :
                     athlete.training_experience || '-'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Frequência Desejada</h4>
                  <p className="text-gray-600">{athlete.training_frequency || '-'}</p>
                </div>
              </div>

              {/* Preferências */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Preferências de Treino</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Horário Preferido</p>
                    <p className="font-medium text-gray-900">
                      {athlete.preferred_training_time || '-'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Local</p>
                    <p className="font-medium text-gray-900">
                      {athlete.training_location || '-'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Música</p>
                    <p className="font-medium text-gray-900">
                      {athlete.music_preference ? 'Sim' : 'Não'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disponibilidade */}
              {athlete.availability && athlete.availability.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Disponibilidade</h4>
                  <div className="flex flex-wrap gap-2">
                    {athlete.availability.map((day, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipamentos */}
              {athlete.equipment_available && athlete.equipment_available.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Equipamentos Disponíveis</h4>
                  <div className="flex flex-wrap gap-2">
                    {athlete.equipment_available.map((equipment, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteDetails;