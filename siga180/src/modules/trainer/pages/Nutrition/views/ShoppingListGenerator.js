import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Download,
  Send,
  Filter,
  Check,
  Plus,
  Minus,
  X,
  Calendar,
  Users,
  Apple,
  Beef,
  Milk,
  Wheat,
  Fish,
  Carrot,
  Cookie,
  Coffee,
  ChevronDown,
  ChevronRight,
  Copy,
  Printer,
  Share2,
  RefreshCw,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const ShoppingListGenerator = () => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [dateRange, setDateRange] = useState('week'); // week, 2weeks, month
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Mock athletes with their plans
  const athletes = [
    { id: 1, name: 'João Silva', plan: 'Bulking 3500kcal', active: true },
    { id: 2, name: 'Maria Santos', plan: 'Cutting 1800kcal', active: true },
    { id: 3, name: 'Pedro Costa', plan: 'Manutenção 2500kcal', active: true },
    { id: 4, name: 'Ana Ferreira', plan: 'Sem plano ativo', active: false }
  ];

  const categoryIcons = {
    'Proteínas': Beef,
    'Carboidratos': Wheat,
    'Laticínios': Milk,
    'Frutas': Apple,
    'Vegetais': Carrot,
    'Gorduras': Fish,
    'Snacks': Cookie,
    'Bebidas': Coffee
  };

  useEffect(() => {
    // Select all active athletes by default
    setSelectedAthletes(athletes.filter(a => a.active).map(a => a.id));
  }, []);

  const generateShoppingList = async () => {
    if (selectedAthletes.length === 0) {
      toast.error('Selecione pelo menos um atleta');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockList = {
        dateRange: getDateRangeText(),
        athleteCount: selectedAthletes.length,
        totalServings: selectedAthletes.length * (dateRange === 'week' ? 7 : dateRange === '2weeks' ? 14 : 30),
        categories: [
          {
            name: 'Proteínas',
            items: [
              { 
                name: 'Peito de Frango', 
                quantity: 3.5, 
                unit: 'kg',
                athletes: ['João', 'Maria', 'Pedro'],
                priceEstimate: '€17.50',
                checked: false
              },
              { 
                name: 'Ovos', 
                quantity: 30, 
                unit: 'unidades',
                athletes: ['João', 'Maria'],
                priceEstimate: '€4.50',
                checked: false
              },
              { 
                name: 'Atum em água', 
                quantity: 12, 
                unit: 'latas',
                athletes: ['Maria', 'Pedro'],
                priceEstimate: '€9.60',
                checked: false
              },
              { 
                name: 'Whey Protein', 
                quantity: 2, 
                unit: 'kg',
                athletes: ['João', 'Pedro'],
                priceEstimate: '€45.00',
                checked: false
              }
            ]
          },
          {
            name: 'Carboidratos',
            items: [
              { 
                name: 'Arroz Integral', 
                quantity: 2, 
                unit: 'kg',
                athletes: ['João', 'Maria', 'Pedro'],
                priceEstimate: '€4.00',
                checked: false
              },
              { 
                name: 'Batata Doce', 
                quantity: 5, 
                unit: 'kg',
                athletes: ['João', 'Pedro'],
                priceEstimate: '€6.50',
                checked: false
              },
              { 
                name: 'Aveia', 
                quantity: 1.5, 
                unit: 'kg',
                athletes: ['João', 'Maria'],
                priceEstimate: '€3.75',
                checked: false
              },
              { 
                name: 'Pão Integral', 
                quantity: 3, 
                unit: 'pacotes',
                athletes: ['Pedro'],
                priceEstimate: '€5.40',
                checked: false
              }
            ]
          },
          {
            name: 'Vegetais',
            items: [
              { 
                name: 'Brócolos', 
                quantity: 2, 
                unit: 'kg',
                athletes: ['João', 'Maria', 'Pedro'],
                priceEstimate: '€5.00',
                checked: false
              },
              { 
                name: 'Espinafres', 
                quantity: 1, 
                unit: 'kg',
                athletes: ['Maria', 'Pedro'],
                priceEstimate: '€2.50',
                checked: false
              },
              { 
                name: 'Tomate', 
                quantity: 3, 
                unit: 'kg',
                athletes: ['João', 'Maria', 'Pedro'],
                priceEstimate: '€4.50',
                checked: false
              },
              { 
                name: 'Alface', 
                quantity: 5, 
                unit: 'unidades',
                athletes: ['Maria'],
                priceEstimate: '€3.75',
                checked: false
              }
            ]
          },
          {
            name: 'Frutas',
            items: [
              { 
                name: 'Banana', 
                quantity: 3, 
                unit: 'kg',
                athletes: ['João', 'Pedro'],
                priceEstimate: '€3.60',
                checked: false
              },
              { 
                name: 'Maçã', 
                quantity: 2, 
                unit: 'kg',
                athletes: ['Maria', 'Pedro'],
                priceEstimate: '€3.00',
                checked: false
              },
              { 
                name: 'Mirtilos', 
                quantity: 500, 
                unit: 'g',
                athletes: ['Maria'],
                priceEstimate: '€4.50',
                checked: false
              }
            ]
          },
          {
            name: 'Gorduras',
            items: [
              { 
                name: 'Azeite Extra Virgem', 
                quantity: 1, 
                unit: 'L',
                athletes: ['João', 'Maria', 'Pedro'],
                priceEstimate: '€7.50',
                checked: false
              },
              { 
                name: 'Abacate', 
                quantity: 6, 
                unit: 'unidades',
                athletes: ['João', 'Maria'],
                priceEstimate: '€9.00',
                checked: false
              },
              { 
                name: 'Amêndoas', 
                quantity: 500, 
                unit: 'g',
                athletes: ['Pedro'],
                priceEstimate: '€6.50',
                checked: false
              }
            ]
          }
        ],
        totalEstimate: '€137.85'
      };
      
      setShoppingList(mockList);
      setExpandedCategories(mockList.categories.map(c => c.name));
      setLoading(false);
    }, 1500);
  };

  const getDateRangeText = () => {
    const start = new Date();
    const end = new Date();
    
    if (dateRange === 'week') {
      end.setDate(end.getDate() + 7);
    } else if (dateRange === '2weeks') {
      end.setDate(end.getDate() + 14);
    } else {
      end.setDate(end.getDate() + 30);
    }
    
    return `${start.toLocaleDateString('pt-PT')} - ${end.toLocaleDateString('pt-PT')}`;
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleItemCheck = (categoryName, itemName) => {
    setShoppingList(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.name === categoryName
          ? {
              ...category,
              items: category.items.map(item =>
                item.name === itemName
                  ? { ...item, checked: !item.checked }
                  : item
              )
            }
          : category
      )
    }));
  };

  const adjustQuantity = (categoryName, itemName, adjustment) => {
    setShoppingList(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.name === categoryName
          ? {
              ...category,
              items: category.items.map(item =>
                item.name === itemName
                  ? { 
                      ...item, 
                      quantity: Math.max(0, 
                        typeof item.quantity === 'number' 
                          ? item.quantity + adjustment 
                          : parseFloat(item.quantity) + adjustment
                      )
                    }
                  : item
              )
            }
          : category
      )
    }));
  };

  const exportList = (format) => {
    if (!shoppingList) return;
    
    if (format === 'text') {
      let text = `Lista de Compras - ${shoppingList.dateRange}\n`;
      text += `${shoppingList.athleteCount} atletas - ${shoppingList.totalServings} porções\n\n`;
      
      shoppingList.categories.forEach(category => {
        text += `${category.name}:\n`;
        category.items.forEach(item => {
          text += `${item.checked ? '✓' : '○'} ${item.name} - ${item.quantity} ${item.unit} (${item.priceEstimate})\n`;
        });
        text += '\n';
      });
      
      text += `\nTotal Estimado: ${shoppingList.totalEstimate}`;
      
      // Create and download file
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Lista exportada!');
    } else if (format === 'copy') {
      let text = shoppingList.categories
        .flatMap(c => c.items.map(i => `${i.name} - ${i.quantity} ${i.unit}`))
        .join('\n');
      
      navigator.clipboard.writeText(text);
      toast.success('Lista copiada!');
    }
  };

  const shareViaWhatsApp = () => {
    if (!shoppingList) return;
    
    let text = `*Lista de Compras - ${shoppingList.dateRange}*\n\n`;
    
    shoppingList.categories.forEach(category => {
      text += `*${category.name}:*\n`;
      category.items.forEach(item => {
        text += `${item.checked ? '✅' : '⬜'} ${item.name} - ${item.quantity} ${item.unit}\n`;
      });
      text += '\n';
    });
    
    text += `*Total Estimado: ${shoppingList.totalEstimate}*`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Compras</h1>
        <p className="text-gray-600 mt-1">Gere listas de compras baseadas nos planos nutricionais</p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Athletes Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Atletas
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {athletes.map(athlete => (
                <label 
                  key={athlete.id}
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    !athlete.active ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAthletes.includes(athlete.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAthletes([...selectedAthletes, athlete.id]);
                      } else {
                        setSelectedAthletes(selectedAthletes.filter(id => id !== athlete.id));
                      }
                    }}
                    disabled={!athlete.active}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{athlete.name}</p>
                    <p className="text-xs text-gray-600">{athlete.plan}</p>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={() => setSelectedAthletes(athletes.filter(a => a.active).map(a => a.id))}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Selecionar todos ativos
            </button>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">1 Semana</option>
              <option value="2weeks">2 Semanas</option>
              <option value="month">1 Mês</option>
            </select>
            <p className="mt-2 text-xs text-gray-600">
              {getDateRangeText()}
            </p>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opções
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={groupByCategory}
                  onChange={(e) => setGroupByCategory(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Agrupar por categoria</span>
              </label>
            </div>
            
            <button
              onClick={generateShoppingList}
              disabled={selectedAthletes.length === 0}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                selectedAthletes.length === 0
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  A gerar...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Gerar Lista
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Shopping List */}
      {shoppingList && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* List Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Lista de Compras
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {shoppingList.athleteCount} atletas • {shoppingList.totalServings} porções • {shoppingList.dateRange}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportList('copy')}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  WhatsApp
                </button>
                <button
                  onClick={() => exportList('text')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-6">
            {shoppingList.categories.map((category, idx) => {
              const Icon = categoryIcons[category.name] || Apple;
              const isExpanded = expandedCategories.includes(category.name);
              const checkedCount = category.items.filter(i => i.checked).length;
              
              return (
                <div key={idx} className={`${idx > 0 ? 'mt-6' : ''}`}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-600 mr-3" />
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <span className="ml-3 text-sm text-gray-500">
                        ({checkedCount}/{category.items.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            item.checked 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItemCheck(category.name, item.name)}
                              className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <div className="ml-3 flex-1">
                              <p className={`font-medium ${
                                item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Para: {item.athletes.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => adjustQuantity(category.name, item.name, -0.5)}
                                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium w-16 text-center">
                                {item.quantity} {item.unit}
                              </span>
                              <button
                                onClick={() => adjustQuantity(category.name, item.name, 0.5)}
                                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm font-medium text-gray-700 w-16 text-right">
                              {item.priceEstimate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="text-sm">Preços estimados baseados em médias de mercado</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Estimado</p>
                  <p className="text-2xl font-bold text-gray-900">{shoppingList.totalEstimate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListGenerator;