import React, { useState } from 'react';
import { 
  Save,
  Search,
  Filter,
  Plus,
  Copy,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Coffee,
  Sun,
  Moon,
  Dumbbell,
  Tag,
  Clock,
  TrendingUp,
  Users,
  ChevronRight,
  X,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const MealTemplatesView = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Pré-Treino Power',
      description: 'Refeição ideal 90min antes do treino',
      category: 'pre-workout',
      tags: ['energia', 'performance', 'carboidratos'],
      isFavorite: true,
      usageCount: 45,
      createdBy: 'system',
      macros: {
        calories: 450,
        protein: 30,
        carbs: 65,
        fat: 8
      },
      foods: [
        { name: 'Aveia', quantity: 80, unit: 'g' },
        { name: 'Banana', quantity: 1, unit: 'unidade' },
        { name: 'Whey Protein', quantity: 30, unit: 'g' },
        { name: 'Mel', quantity: 15, unit: 'g' }
      ]
    },
    {
      id: 2,
      name: 'Pós-Treino Recovery',
      description: 'Maximizar recuperação muscular',
      category: 'post-workout',
      tags: ['recuperação', 'proteína', 'glicogénio'],
      isFavorite: true,
      usageCount: 52,
      createdBy: 'system',
      macros: {
        calories: 380,
        protein: 40,
        carbs: 45,
        fat: 5
      },
      foods: [
        { name: 'Whey Isolate', quantity: 40, unit: 'g' },
        { name: 'Arroz Branco', quantity: 60, unit: 'g' },
        { name: 'Ananás', quantity: 100, unit: 'g' }
      ]
    },
    {
      id: 3,
      name: 'Pequeno-Almoço Balanced',
      description: 'Começar o dia com energia sustentada',
      category: 'breakfast',
      tags: ['energia', 'fibra', 'completo'],
      isFavorite: false,
      usageCount: 28,
      createdBy: 'user',
      macros: {
        calories: 520,
        protein: 28,
        carbs: 58,
        fat: 18
      },
      foods: [
        { name: 'Ovos inteiros', quantity: 2, unit: 'unidades' },
        { name: 'Pão integral', quantity: 60, unit: 'g' },
        { name: 'Abacate', quantity: 50, unit: 'g' },
        { name: 'Tomate', quantity: 100, unit: 'g' }
      ]
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos', icon: null },
    { id: 'breakfast', name: 'Pequeno-Almoço', icon: Coffee },
    { id: 'lunch', name: 'Almoço', icon: Sun },
    { id: 'dinner', name: 'Jantar', icon: Moon },
    { id: 'pre-workout', name: 'Pré-Treino', icon: Dumbbell },
    { id: 'post-workout', name: 'Pós-Treino', icon: Dumbbell },
    { id: 'snack', name: 'Snack', icon: Coffee }
  ];

  const handleToggleFavorite = (templateId) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
    toast.success('Favorito atualizado!');
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Cópia)`,
      createdBy: 'user',
      usageCount: 0,
      isFavorite: false
    };
    setTemplates([...templates, newTemplate]);
    toast.success('Template duplicado com sucesso!');
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Tem certeza que deseja eliminar este template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Template eliminado!');
    }
  };

  const handleApplyToMeal = (template) => {
    // TODO: Navigate to meal planner with template
    toast.success(`Template "${template.name}" aplicado à refeição!`);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesFavorite = !showOnlyFavorites || template.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Templates de Refeições</h1>
        <p className="text-gray-600 mt-1">Reutilize combinações de alimentos que funcionam</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <Save className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favoritos</p>
              <p className="text-2xl font-bold">{templates.filter(t => t.isFavorite).length}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mais Usado</p>
              <p className="text-lg font-bold">
                {templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max).name}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uso Total</p>
              <p className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Template
            </button>

            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 border rounded-lg flex items-center ${
                showOnlyFavorites 
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              Favoritos
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div 
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <button
                  onClick={() => handleToggleFavorite(template.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {template.isFavorite ? (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  ) : (
                    <StarOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Macros Summary */}
              <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">Cal</p>
                  <p className="font-semibold">{template.macros.calories}</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <p className="text-xs text-gray-600">Prot</p>
                  <p className="font-semibold text-red-600">{template.macros.protein}g</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Carb</p>
                  <p className="font-semibold text-green-600">{template.macros.carbs}g</p>
                </div>
                <div className="bg-yellow-50 rounded p-2">
                  <p className="text-xs text-gray-600">Gord</p>
                  <p className="font-semibold text-yellow-600">{template.macros.fat}g</p>
                </div>
              </div>

              {/* Foods Preview */}
              <div className="space-y-1 mb-3">
                {template.foods.slice(0, 3).map((food, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    • {food.name} - {food.quantity}{food.unit}
                  </p>
                ))}
                {template.foods.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{template.foods.length - 3} mais alimentos
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {template.usageCount} usos
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApplyToMeal(template)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Aplicar a refeição"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                    title="Duplicar"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {template.createdBy === 'user' && (
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Save className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Nenhum template encontrado</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Criar Primeiro Template
          </button>
        </div>
      )}
    </div>
  );
};

export default MealTemplatesView;