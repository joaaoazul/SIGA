// src/modules/trainer/pages/Workouts/views/TemplatesView.js

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Folder, 
  MoreVertical, 
  Clock, 
  Dumbbell, 
  User,
  ShoppingBag,
  Search
} from 'lucide-react';
import TemplateCard from '../components/templates/TemplateCard';
import EmptyWorkoutCard from '../components/templates/EmptyWorkoutCard';
import { mockTemplates } from '../data/mockTemplates';

/**
 * Vista principal dos Templates de Treino
 * 
 * Esta vista mostra:
 * - Botão para começar treino vazio
 * - Lista de templates criados
 * - Navegação inferior
 * 
 * É inspirada no design dark mode das imagens, mas vamos adaptar
 * para manter consistência com o resto da app
 */
const TemplatesView = ({ onStartWorkout, onNavigate, onSelectTemplate }) => {
  // Estado para os templates - virá da BD mais tarde
  const [templates, setTemplates] = useState([]);
  
  // Estado de carregamento
  const [loading, setLoading] = useState(true);
  
  // Estado para pesquisa/filtros (preparação futura)
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  // Carregar templates quando o componente monta
  useEffect(() => {
    loadTemplates();
  }, []);

  /**
   * Carrega os templates da base de dados
   * Por agora usa dados mock, mas preparado para integração com Supabase
   */
  const loadTemplates = async () => {
    try {
      setLoading(true);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Por agora usar dados mock
      // No futuro: const data = await workoutService.getTemplates();
      setTemplates(mockTemplates);
      
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      // Aqui poderias mostrar um toast de erro
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipula a criação de um novo template
   * Navega para o builder de templates
   */
  const handleCreateTemplate = () => {
    // Por implementar - vai abrir o WorkoutBuilder
    console.log('Criar novo template');
    onNavigate('builder');
  };

  /**
   * Manipula a edição de um template existente
   */
  const handleEditTemplate = (template) => {
    onSelectTemplate(template);
    onNavigate('builder');
  };

  /**
   * Manipula a duplicação de um template
   */
  const handleDuplicateTemplate = async (template) => {
    try {
      const duplicated = {
        ...template,
        id: Date.now(), // ID temporário
        name: `${template.name} (Cópia)`,
        createdAt: new Date().toISOString()
      };
      
      // Adicionar aos templates localmente
      setTemplates(prev => [...prev, duplicated]);
      
      // Guardar na BD
      // await workoutService.createTemplate(duplicated);
      
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
    }
  };

  /**
   * Manipula a eliminação de um template
   */
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Tem certeza que deseja eliminar este template?')) {
      return;
    }

    try {
      // Remover localmente para feedback imediato
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      
      // Eliminar da BD
      // await workoutService.deleteTemplate(templateId);
      
    } catch (error) {
      console.error('Erro ao eliminar template:', error);
      // Reverter se falhar
      loadTemplates();
    }
  };

  // Renderizar estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Planos de Treino</h1>
              <p className="text-sm text-gray-600 mt-1">
                {templates.length} templates disponíveis
              </p>
            </div>
            {/* Ícone de notificações ou stats */}
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              <span className="font-semibold">{templates.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Início Rápido</h2>
          <EmptyWorkoutCard onStart={() => onStartWorkout(null)} />
        </div>

        {/* Templates Section */}
        <div className="mt-8">
          {/* Section Header com Actions */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Meus Templates
            </h2>
            <div className="flex items-center gap-2">
              {/* Botão Criar Template */}
              <button
                onClick={handleCreateTemplate}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Template</span>
              </button>
              
              {/* Botão de Vista (Grid/Lista) */}
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Folder className="w-5 h-5" />
              </button>
              
              {/* Menu de Opções */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          {templates.length === 0 ? (
            // Estado vazio
            <div className="bg-white rounded-xl p-8 text-center">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Ainda não tem templates criados</p>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Template
              </button>
            </div>
          ) : (
            // Grid de Templates
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
                : 'space-y-3'
              }
            `}>
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onStart={() => onStartWorkout(template)}
                  onEdit={() => handleEditTemplate(template)}
                  onDuplicate={() => handleDuplicateTemplate(template)}
                  onDelete={() => handleDeleteTemplate(template.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* 
        Nota: Este navigation devia estar no layout principal,
        mas vou incluí-lo aqui para corresponder ao design 
      */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <NavButton icon={User} label="Profile" onClick={() => {}} />
          <NavButton icon={Clock} label="History" onClick={() => onNavigate('history')} />
          <NavButton 
            icon={Plus} 
            label="Start" 
            primary 
            onClick={() => onStartWorkout(null)} 
          />
          <NavButton 
            icon={Dumbbell} 
            label="Exercises" 
            onClick={() => onNavigate('exercises')} 
          />
          <NavButton icon={ShoppingBag} label="Store" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

/**
 * Componente auxiliar para os botões de navegação inferior
 * Mantém o código mais limpo e reutilizável
 */
const NavButton = ({ icon: Icon, label, primary = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-colors
        ${primary 
          ? 'text-blue-600' 
          : 'text-gray-600 hover:text-gray-900'
        }
      `}
    >
      <Icon className={`w-6 h-6 ${primary ? 'text-blue-600' : ''}`} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default TemplatesView;