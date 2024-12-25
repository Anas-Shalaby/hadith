import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { fetchHadithBooks } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { AVAILABLE_LANGUAGES } from '../constants/books';
import { QuestionMarkCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useMemo } from 'react';

function Sidebar({ selectedCategory, onSelectCategory, language, onChangeLanguage }) {
  const { data: categories, isLoading, error } = useQuery(
    ['categories', language],
    () => fetchHadithBooks(language)
  );

  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered categories
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    return categories.filter(category => 
      category.title.includes(searchTerm)
    );
  }, [categories, searchTerm]);

  if (isLoading) return (
    <div className="h-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="text-red-600 p-4 text-center" dir="rtl">
      خطأ في تحميل الكتب
    </div>
  );

  return (
    <div 
      className="bg-white shadow-lg h-screen max-h-screen overflow-hidden flex flex-col rounded-l-2xl border-l-4 border-green-600"
      dir="rtl"
    >
      {/* Header with Islamic Motif */}
      <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100">
        <div className="text-center">
          <div className="inline-block bg-green-50 p-3 rounded-full mb-4">
            <QuestionMarkCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            مجموعة الأحاديث النبوية
          </h2>
          <p className="text-sm text-gray-600">
            اختر التصنيف للاطلاع على الأحاديث
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن كتاب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Navigation - Scrollable Container */}
      <div className="flex-grow overflow-y-auto custom-scrollbar px-6 py-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            لا توجد كتب مطابقة للبحث
          </div>
        ) : (
          <nav className="space-y-3">
            {filteredCategories.map((category) => (
              <div 
                key={category.id}
                className={`
                  w-full rounded-xl transition-all duration-300
                  ${selectedCategory === category.id 
                    ? 'bg-green-100 text-green-900 shadow-md' 
                    : 'bg-gray-50 text-gray-700 hover:bg-green-50'}
                  flex items-center justify-between
                `}
              >
                <Link 
                  to={`/category/${category.id}`}
                  onClick={() => onSelectCategory(category.id)}
                  className="w-full text-right p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-lg">{category.title}</div>
                    {category.hadeeths_count && (
                      <div className="text-sm text-gray-500 mt-1">
                        {category.hadeeths_count} حديث
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative Arrow */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 transition-transform ${
                      selectedCategory === category.id 
                        ? 'rotate-180 text-green-600' 
                        : 'text-gray-400'
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Footer Inspiration */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-500 italic">
          "طلب العلم فريضة على كل مسلم"
        </p>
      </div>
    </div>
  );
}

export default Sidebar;