// src/modules/trainer/pages/Nutrition/components/DatabaseView.js
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  X,
  Upload,
  Download,
  Scan,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Star,
  Fish,
  Wheat,
  Droplets,
  Milk,
  Apple,
  Salad,
  Package,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Database,
  FileText,
  Camera
} from 'lucide-react';
import FoodCard from '../components/cards/FoodCard';

const DatabaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [showAddFood, setShowAddFood] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBrand, setFilterBrand] = useState('all');

  // Categories with icons
  const categories = [
    { id: 'all', name: 'Todos', icon: Database, count: 2847, color: 'gray' },
    { id: 'proteins', name: 'Proteínas', icon: Fish, count: 487, color: 'red' },
    { id: 'carbs', name: 'Carboidratos', icon: Wheat, count: 892, color: 'orange' },
    { id: 'fats', name: 'Gorduras', icon: Droplets, count: 234, color: 'yellow' },
    { id: 'dairy', name: 'Lacticínios', icon: Milk, count: 345, color: 'blue' },
    { id: 'fruits', name: 'Frutas', icon: Apple, count: 456, color: 'green' },
    { id: 'vegetables', name: 'Vegetais', icon: Salad, count: 433, color: 'emerald' }
  ];

  // Mock food database (expandir com mais alimentos portugueses)
  const [foods] = useState([
    {
      id: 1,
      name: 'Peito de Frango Grelhado',
      category: 'proteins',
      brand: 'Genérico',
      barcode: null,
      verified: true,
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      serving: '100g',
      servingOptions: ['100g', '150g', '200g', '1 peito médio (120g)'],
      popularity: 4.8,
      usageCount: 1250
    },
    {
      id: 2,
      name: 'Arroz Branco Cozido',
      category: 'carbs',
      brand: 'Genérico',
      barcode: null,
      verified: true,
      calories: 130,
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0.1,
      sodium: 1,
      serving: '100g',
      servingOptions: ['100g', '150g', '1 chávena (158g)', '1/2 chávena (79g)'],
      popularity: 4.6,
      usageCount: 980
    },
    {
      id: 3,
      name: 'Abacate',
      category: 'fats',
      brand: 'Genérico',
      barcode: null,
      verified: true,
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      fiber: 6.7,
      sugar: 0.7,
      sodium: 7,
      serving: '100g',
      servingOptions: ['100g', '1/2 abacate (68g)', '1 abacate (136g)', '30g'],
      popularity: 4.9,
      usageCount: 750
    },
    {
      id: 4,
      name: 'Whey Protein Gold Standard',
      category: 'proteins',
      brand: 'Optimum Nutrition',
      barcode: '748927024081',
      verified: true,
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1.5,
      fiber: 0,
      sugar: 1,
      sodium: 130,
      serving: '30g',
      servingOptions: ['30g (1 scoop)', '60g (2 scoops)'],
      popularity: 4.7,
      usageCount: 520
    },
    {
      id: 5,
      name: 'Leite Magro',
      category: 'dairy',
      brand: 'Mimosa',
      barcode: '5601234567890',
      verified: true,
      calories: 35,
      protein: 3.4,
      carbs: 5,
      fat: 0.1,
      fiber: 0,
      sugar: 5,
      sodium: 40,
      serving: '100ml',
      servingOptions: ['100ml', '200ml', '250ml (1 copo)', '1L'],
      popularity: 4.5,
      usageCount: 890
    },
    {
      id: 6,
      name: 'Banana',
      category: 'fruits',
      brand: 'Genérico',
      barcode: null,
      verified: true,
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12.2,
      sodium: 1,
      serving: '100g',
      servingOptions: ['100g', '1 pequena (81g)', '1 média (118g)', '1 grande (136g)'],
      popularity: 4.8,
      usageCount: 1100
    },
    {
      id: 7,
      name: 'Brócolos Cozidos',
      category: 'vegetables',
      brand: 'Genérico',
      barcode: null,
      verified: true,
      calories: 35,
      protein: 2.4,
      carbs: 7.2,
      fat: 0.4,
      fiber: 3.3,
      sugar: 1.4,
      sodium: 41,
      serving: '100g',
      servingOptions: ['100g', '150g', '1 chávena (156g)', '1/2 chávena (78g)'],
      popularity: 4.4,
      usageCount: 450
    }
  ]);

  // Get unique brands
  const brands = [...new Set(foods.map(f => f.brand))].sort();

  // Filter and sort foods
  const filteredFoods = foods.filter(food => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.barcode && food.barcode.includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    const matchesBrand = filterBrand === 'all' || food.brand === filterBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const sortedFoods = [...filteredFoods].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'calories':
        return b.calories - a.calories;
      case 'protein':
        return b.protein - a.protein;
      case 'popularity':
        return b.popularity - a.popularity;
      case 'usage':
        return b.usageCount - a.usageCount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <DatabaseHeader
        totalFoods={foods.length}
        onAddFood={() => setShowAddFood(true)}
        onImport={() => setShowImportModal(true)}
      />

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        brands={brands}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Categories */}
      <CategoriesBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Foods Display */}
      {sortedFoods.length > 0 ? (
        viewMode === 'grid' ? (
          <FoodsGrid foods={sortedFoods} />
        ) : (
          <FoodsTable foods={sortedFoods} />
        )
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}

      {/* Quick Stats */}
      <QuickStats foods={foods} />

      {/* Modals */}
      {showAddFood && (
        <AddFoodModal onClose={() => setShowAddFood(false)} />
      )}
      
      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
};

// Database Header Component
const DatabaseHeader = ({ totalFoods, onAddFood, onImport }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Base de Dados de Alimentos</h3>
          <p className="text-sm text-gray-600 mt-1">
            {totalFoods.toLocaleString()} alimentos disponíveis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Scan Código de Barras"
          >
            <Scan className="h-5 w-5" />
          </button>
          <button
            onClick={onImport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Importar"
          >
            <Upload className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Exportar">
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onAddFood}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Alimento
          </button>
        </div>
      </div>
    </div>
  );
};

// Search and Filters Component
const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBrand,
  setFilterBrand,
  brands,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar alimentos, marcas ou código de barras..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todas as marcas</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="name">Nome</option>
            <option value="calories">Calorias</option>
            <option value="protein">Proteína</option>
            <option value="popularity">Popularidade</option>
            <option value="usage">Mais usados</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Categories Bar Component
const CategoriesBar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {categories.map(category => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const colorClasses = {
            gray: 'text-gray-600 bg-gray-100',
            red: 'text-red-600 bg-red-100',
            orange: 'text-orange-600 bg-orange-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            emerald: 'text-emerald-600 bg-emerald-100'
          };

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className={`p-1.5 rounded ${
                isSelected ? 'bg-white/20' : colorClasses[category.color]
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-white/20'
                  : 'bg-gray-200'
              }`}>
                {category.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Foods Grid Component
const FoodsGrid = ({ foods }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map(food => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

// Foods Table Component
const FoodsTable = ({ foods }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    setExpandedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alimento
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Porção
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Calorias
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proteína
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carbs
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gordura
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pop.
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {foods.map(food => (
            <React.Fragment key={food.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{food.name}</p>
                      {food.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{food.brand}</p>
                    {food.barcode && (
                      <p className="text-xs text-gray-400 mt-1">
                        <Package className="h-3 w-3 inline mr-1" />
                        {food.barcode}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {food.serving}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">{food.calories}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-green-600">{food.protein}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-orange-600">{food.carbs}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-yellow-600">{food.fat}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{food.popularity}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleRow(food.id)}
                    className="text-gray-600 hover:text-gray-900 mr-3"
                  >
                    {expandedRows.includes(food.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Copy className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              
              {/* Expanded Row */}
              {expandedRows.includes(food.id) && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Fibra</p>
                        <p className="font-medium">{food.fiber}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Açúcar</p>
                        <p className="font-medium">{food.sugar}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Sódio</p>
                        <p className="font-medium">{food.sodium}mg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Utilizações</p>
                        <p className="font-medium">{food.usageCount}</p>
                      </div>
                    </div>
                    
                    {food.servingOptions.length > 1 && (
                      <div className="mt-4">
                        <p className="text-gray-600 mb-2">Opções de porção:</p>
                        <div className="flex flex-wrap gap-2">
                          {food.servingOptions.map((option, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded-md text-xs border"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Quick Stats Component
const QuickStats = ({ foods }) => {
  const avgCalories = Math.round(
    foods.reduce((acc, f) => acc + f.calories, 0) / foods.length
  );
  const avgProtein = (
    foods.reduce((acc, f) => acc + f.protein, 0) / foods.length
  ).toFixed(1);
  const verifiedCount = foods.filter(f => f.verified).length;
  const withBarcode = foods.filter(f => f.barcode).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{avgCalories}</p>
        <p className="text-sm text-gray-600">Calorias Médias/100g</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{avgProtein}g</p>
        <p className="text-sm text-gray-600">Proteína Média/100g</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
        <p className="text-sm text-gray-600">Alimentos Verificados</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{withBarcode}</p>
        <p className="text-sm text-gray-600">Com Código de Barras</p>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ searchTerm }) => {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum alimento encontrado
      </h3>
      <p className="text-gray-500 mb-6">
        {searchTerm
          ? `Não foram encontrados alimentos para "${searchTerm}"`
          : 'Tente ajustar os filtros ou adicione um novo alimento'}
      </p>
      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Alimento
      </button>
    </div>
  );
};

// Add Food Modal Component (simplified)
const AddFoodModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Nutrition, 3: Review
  const [foodData, setFoodData] = useState({
    name: '',
    brand: '',
    category: '',
    barcode: '',
    serving: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Adicionar Novo Alimento
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">
                  O alimento será verificado antes de ficar disponível publicamente
                </p>
                <p className="text-blue-700 mt-1">
                  Certifique-se de que as informações nutricionais estão corretas
                </p>
              </div>
            </div>
          </div>

          {/* Form would go here */}
          <div className="text-center py-8 text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-4" />
            <p>Formulário de adição em desenvolvimento</p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Adicionar Alimento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Modal Component
const ImportModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Importar Alimentos
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arraste ficheiros ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500">
                Suporta CSV, Excel (.xlsx) e JSON
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Selecionar Ficheiros
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Formato esperado:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nome, Marca, Categoria, Calorias, Proteína, Carbs, Gordura</li>
                <li>• Valores por 100g ou porção especificada</li>
                <li>• Opcional: Código de barras, fibra, açúcar, sódio</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;
