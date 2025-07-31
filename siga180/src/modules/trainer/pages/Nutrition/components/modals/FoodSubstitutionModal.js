import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Filter,
  RefreshCw,
  Info,
  Check,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Zap,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const FoodSubstitutionModal = ({ 
  isOpen, 
  onClose, 
  originalFood, 
  onSelectSubstitute,
  athletePreferences = {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, exact, similar, flexible
  const [sortBy, setSortBy] = useState('similarity'); // similarity, protein, carbs, calories
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && originalFood) {
      fetchSubstitutes();
    }
  }, [isOpen, originalFood]);

  const fetchSubstitutes = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSubstitutes = generateSubstitutes(originalFood);
      setSubstitutes(mockSubstitutes);
      setLoading(false);
    }, 500);
  };

  const generateSubstitutes = (food) => {
    // Mock algorithm to generate substitutes based on macro similarity
    const baseSubstitutes = [
      {
        id: 1,
        name: 'Peito de Peru',
        similarity: 95,
        reason: 'Proteína magra similar',
        per: 100,
        unit: 'g',
        macros: { calories: 135, protein: 29, carbs: 0.5, fat: 1 },
        tags: ['alta proteína', 'baixa gordura'],
        recommended: true,
        priceComparison: 'similar'
      },
      {
        id: 2,
        name: 'Claras de Ovo',
        similarity: 88,
        reason: 'Proteína pura, sem gordura',
        per: 100,
        unit: 'g',
        macros: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
        tags: ['alta proteína', 'versátil'],
        recommended: true,
        priceComparison: 'cheaper'
      },
      {
        id: 3,
        name: 'Pescada',
        similarity: 82,
        reason: 'Proteína magra, omega-3',
        per: 100,
        unit: 'g',
        macros: { calories: 82, protein: 18, carbs: 0, fat: 0.7 },
        tags: ['peixe', 'omega-3'],
        recommended: false,
        priceComparison: 'similar'
      },
      {
        id: 4,
        name: 'Tofu Firme',
        similarity: 65,
        reason: 'Opção vegetariana',
        per: 100,
        unit: 'g',
        macros: { calories: 144, protein: 15, carbs: 3, fat: 8 },
        tags: ['vegetariano', 'vegano'],
        recommended: false,
        priceComparison: 'expensive',
        warning: 'Maior teor de gordura'
      }
    ];

    return baseSubstitutes;
  };

  const calculateMacroDifference = (substitute) => {
    if (!originalFood) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const multiplier = originalFood.quantity / substitute.per;
    
    return {
      calories: Math.round((substitute.macros.calories * multiplier) - originalFood.calories),
      protein: Math.round(((substitute.macros.protein * multiplier) - originalFood.protein) * 10) / 10,
      carbs: Math.round(((substitute.macros.carbs * multiplier) - originalFood.carbs) * 10) / 10,
      fat: Math.round(((substitute.macros.fat * multiplier) - originalFood.fat) * 10) / 10
    };
  };

  const getMatchQualityColor = (similarity) => {
    if (similarity >= 90) return 'text-green-600 bg-green-50';
    if (similarity >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const handleSelectSubstitute = (substitute) => {
    const adjustedQuantity = Math.round((originalFood.calories / substitute.macros.calories) * substitute.per);
    
    onSelectSubstitute({
      ...substitute,
      quantity: adjustedQuantity
    });
    
    toast.success(`Substituído por ${substitute.name}!`);
    onClose();
  };

  const filteredSubstitutes = substitutes
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'exact' && sub.similarity >= 90) ||
                           (filterType === 'similar' && sub.similarity >= 75) ||
                           (filterType === 'flexible' && sub.similarity < 75);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'protein':
          return b.macros.protein - a.macros.protein;
        case 'carbs':
          return a.macros.carbs - b.macros.carbs;
        case 'calories':
          return Math.abs(a.macros.calories - originalFood.calories) - 
                 Math.abs(b.macros.calories - originalFood.calories);
        default:
          return b.similarity - a.similarity;
      }
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Substituir Alimento
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                A substituir: <span className="font-medium">{originalFood?.name}</span> 
                {' '}({originalFood?.quantity}{originalFood?.unit})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Original Food Macros */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Macros atuais:</p>
            <div className="flex gap-4 text-sm">
              <span><strong>{originalFood?.calories}</strong> kcal</span>
              <span>P: <strong>{originalFood?.protein}g</strong></span>
              <span>C: <strong>{originalFood?.carbs}g</strong></span>
              <span>G: <strong>{originalFood?.fat}g</strong></span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar substitutos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todos</option>
                <option value="exact">Correspondência Exata (90%+)</option>
                <option value="similar">Similar (75%+)</option>
                <option value="flexible">Flexível (&lt;75%)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="similarity">Similaridade</option>
                <option value="protein">Maior Proteína</option>
                <option value="carbs">Menor Carbs</option>
                <option value="calories">Calorias Próximas</option>
              </select>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-3 flex items-center text-xs text-gray-600">
            <Info className="h-3 w-3 mr-1" />
            <span>
              Dica: Os substitutos são ajustados automaticamente para manter as calorias similares
            </span>
          </div>
        </div>

        {/* Substitutes List */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">A procurar substitutos...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubstitutes.map(substitute => {
                const diff = calculateMacroDifference(substitute);
                
                return (
                  <div
                    key={substitute.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleSelectSubstitute(substitute)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {substitute.name}
                          </h4>
                          {substitute.recommended && (
                            <span className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              <Star className="h-3 w-3 mr-1" />
                              Recomendado
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${getMatchQualityColor(substitute.similarity)}`}>
                            {substitute.similarity}% match
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{substitute.reason}</p>

                        {/* Macro Comparison */}
                        <div className="flex gap-4 text-sm mb-3">
                          <div className="flex items-center">
                            <span className="text-gray-600">Cal:</span>
                            <span className="ml-1 font-medium">{substitute.macros.calories}</span>
                            <MacroDiff value={diff.calories} unit="kcal" />
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">P:</span>
                            <span className="ml-1 font-medium">{substitute.macros.protein}g</span>
                            <MacroDiff value={diff.protein} unit="g" />
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">C:</span>
                            <span className="ml-1 font-medium">{substitute.macros.carbs}g</span>
                            <MacroDiff value={diff.carbs} unit="g" />
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">G:</span>
                            <span className="ml-1 font-medium">{substitute.macros.fat}g</span>
                            <MacroDiff value={diff.fat} unit="g" />
                          </div>
                        </div>

                        {/* Tags and Warnings */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {substitute.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          
                          {substitute.priceComparison && (
                            <span className={`text-xs px-2 py-1 rounded flex items-center ${
                              substitute.priceComparison === 'cheaper' ? 'bg-green-100 text-green-700' :
                              substitute.priceComparison === 'expensive' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {substitute.priceComparison === 'cheaper' ? '€ Mais barato' :
                               substitute.priceComparison === 'expensive' ? '€€ Mais caro' :
                               '€ Preço similar'}
                            </span>
                          )}
                          
                          {substitute.warning && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {substitute.warning}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                          <Check className="h-5 w-5" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          ~{Math.round((originalFood.calories / substitute.macros.calories) * substitute.per)}{substitute.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              Baseado nas preferências e restrições do atleta
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for macro differences
const MacroDiff = ({ value, unit }) => {
  if (value === 0) return null;
  
  const isPositive = value > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? 'text-red-600' : 'text-green-600';
  
  return (
    <span className={`flex items-center ml-1 text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      {isPositive ? '+' : ''}{value}{unit}
    </span>
  );
};

export default FoodSubstitutionModal;