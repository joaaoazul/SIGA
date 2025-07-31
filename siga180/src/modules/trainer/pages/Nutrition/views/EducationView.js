import React, { useState } from 'react';
import { 
  BookOpen,
  Video,
  FileText,
  Download,
  Search,
  Filter,
  Star,
  Clock,
  ChevronRight,
  Plus,
  Heart,
  Share2,
  MessageCircle,
  ChefHat,
  Lightbulb,
  GraduationCap,
  Apple,
  Utensils,
  Info,
  CheckCircle2,
  PlayCircle,
  ExternalLink
} from 'lucide-react';

const EducationView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Categorias de conteúdo educacional
  const categories = [
    { id: 'all', name: 'All Content', icon: BookOpen, count: 45 },
    { id: 'basics', name: 'Nutrition Basics', icon: Apple, count: 12 },
    { id: 'recipes', name: 'Healthy Recipes', icon: ChefHat, count: 18 },
    { id: 'tips', name: 'Tips & Tricks', icon: Lightbulb, count: 8 },
    { id: 'science', name: 'Science-Based', icon: GraduationCap, count: 7 }
  ];
  
  // Conteúdo educacional
  const educationalContent = [
    {
      id: 1,
      type: 'article',
      category: 'basics',
      title: 'Understanding Macronutrients',
      description: 'Complete guide to proteins, carbs, and fats for optimal nutrition',
      author: 'Nutrition Team',
      readTime: '8 min',
      difficulty: 'beginner',
      tags: ['macros', 'basics', 'nutrition 101'],
      likes: 234,
      saved: true,
      image: null
    },
    {
      id: 2,
      type: 'recipe',
      category: 'recipes',
      title: 'High-Protein Breakfast Bowl',
      description: '35g protein breakfast ready in 10 minutes',
      author: 'Chef Maria',
      prepTime: '10 min',
      difficulty: 'easy',
      macros: { protein: 35, carbs: 45, fat: 15 },
      calories: 455,
      tags: ['breakfast', 'high-protein', 'quick'],
      likes: 189,
      saved: false,
      image: null
    },
    {
      id: 3,
      type: 'video',
      category: 'tips',
      title: 'Meal Prep Like a Pro',
      description: 'Step-by-step guide to efficient weekly meal preparation',
      author: 'Coach João',
      duration: '12:30',
      difficulty: 'intermediate',
      tags: ['meal-prep', 'planning', 'time-saving'],
      likes: 456,
      views: 1230,
      saved: false,
      image: null
    },
    {
      id: 4,
      type: 'guide',
      category: 'science',
      title: 'The Science of Fat Loss',
      description: 'Evidence-based strategies for sustainable weight loss',
      author: 'Dr. Santos',
      readTime: '15 min',
      difficulty: 'advanced',
      tags: ['fat-loss', 'science', 'metabolism'],
      likes: 312,
      saved: true,
      references: 12,
      image: null
    },
    {
      id: 5,
      type: 'recipe',
      category: 'recipes',
      title: 'Post-Workout Smoothie',
      description: 'Perfect recovery drink with optimal macro ratios',
      author: 'Nutrition Team',
      prepTime: '5 min',
      difficulty: 'easy',
      macros: { protein: 25, carbs: 40, fat: 8 },
      calories: 332,
      tags: ['post-workout', 'smoothie', 'recovery'],
      likes: 278,
      saved: false,
      image: null
    },
    {
      id: 6,
      type: 'article',
      category: 'basics',
      title: 'Hydration Guidelines',
      description: 'How much water you really need and when to drink it',
      author: 'Sports Science Dept',
      readTime: '6 min',
      difficulty: 'beginner',
      tags: ['hydration', 'water', 'performance'],
      likes: 145,
      saved: false,
      image: null
    }
  ];
  
  // Quick tips para sidebar
  const quickTips = [
    {
      id: 1,
      tip: 'Protein intake should be spread throughout the day for optimal muscle synthesis',
      category: 'protein'
    },
    {
      id: 2,
      tip: 'Drink water before meals to help with portion control',
      category: 'hydration'
    },
    {
      id: 3,
      tip: 'Prepare vegetables in bulk at the beginning of the week',
      category: 'meal-prep'
    }
  ];
  
  // FAQ populares
  const popularFAQs = [
    {
      id: 1,
      question: 'How do I calculate my daily calorie needs?',
      views: 892
    },
    {
      id: 2,
      question: 'What should I eat before and after training?',
      views: 756
    },
    {
      id: 3,
      question: 'Is intermittent fasting right for me?',
      views: 634
    }
  ];
  
  // Content Card Component
  const ContentCard = ({ content }) => {
    const typeIcons = {
      article: FileText,
      recipe: Utensils,
      video: PlayCircle,
      guide: BookOpen
    };
    
    const TypeIcon = typeIcons[content.type] || FileText;
    
    const difficultyColors = {
      beginner: 'text-green-600 bg-green-50',
      easy: 'text-green-600 bg-green-50',
      intermediate: 'text-yellow-600 bg-yellow-50',
      advanced: 'text-red-600 bg-red-50'
    };
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${
            content.type === 'recipe' ? 'bg-orange-50 text-orange-600' :
            content.type === 'video' ? 'bg-purple-50 text-purple-600' :
            content.type === 'guide' ? 'bg-blue-50 text-blue-600' :
            'bg-emerald-50 text-emerald-600'
          } flex items-center justify-center`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[content.difficulty]}`}>
              {content.difficulty}
            </span>
            <button 
              onClick={(e) => e.stopPropagation()}
              className={`p-1 rounded transition-colors ${
                content.saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className="w-4 h-4" fill={content.saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
        
        {/* Recipe specific info */}
        {content.type === 'recipe' && content.macros && (
          <div className="flex items-center gap-3 mb-3 text-xs">
            <span className="text-gray-600">
              P: <span className="font-semibold text-gray-900">{content.macros.protein}g</span>
            </span>
            <span className="text-gray-600">
              C: <span className="font-semibold text-gray-900">{content.macros.carbs}g</span>
            </span>
            <span className="text-gray-600">
              F: <span className="font-semibold text-gray-900">{content.macros.fat}g</span>
            </span>
            <span className="text-emerald-600 font-semibold ml-auto">{content.calories} kcal</span>
          </div>
        )}
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {content.readTime || content.prepTime || content.duration}
            </span>
            <span>{content.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {content.likes}
            </span>
            {content.views && (
              <span className="flex items-center gap-1">
                <PlayCircle className="w-3 h-3" />
                {content.views}
              </span>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {content.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Education Center</h1>
          <p className="text-gray-500 mt-1">Resources to help your clients succeed</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, recipes, tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${selectedCategory === category.id 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {category.name}
                <span className="ml-1 text-xs">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalContent
              .filter(content => 
                selectedCategory === 'all' || content.category === selectedCategory
              )
              .map(content => (
                <ContentCard key={content.id} content={content} />
              ))
            }
          </div>
          
          {/* Load More */}
          <button className="w-full mt-6 py-3 text-center text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
            Load more content
          </button>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Quick Tips
            </h3>
            <div className="space-y-3">
              {quickTips.map(tip => (
                <div key={tip.id} className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">{tip.tip}</p>
                  <span className="text-xs text-yellow-700 mt-1">#{tip.category}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Popular FAQs */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Popular Questions
            </h3>
            <div className="space-y-3">
              {popularFAQs.map(faq => (
                <button 
                  key={faq.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <p className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">
                    {faq.question}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{faq.views} views</p>
                </button>
              ))}
            </div>
            <button className="w-full mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all FAQs →
            </button>
          </div>
          
          {/* Resources */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Downloadable Resources</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Macro Calculator Template</p>
                    <p className="text-xs text-gray-500">Excel spreadsheet</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Meal Prep Guide PDF</p>
                    <p className="text-xs text-gray-500">28 pages</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Shopping List Templates</p>
                    <p className="text-xs text-gray-500">5 templates</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-emerald-50 rounded-xl p-5">
            <h3 className="font-semibold text-emerald-900 mb-2">Share with Clients</h3>
            <p className="text-sm text-emerald-700 mb-4">
              Send educational content directly to your clients to keep them engaged and informed.
            </p>
            <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationView;