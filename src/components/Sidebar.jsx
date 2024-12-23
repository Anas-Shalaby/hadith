import { useQuery } from 'react-query';
import { fetchHadithBooks } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { AVAILABLE_LANGUAGES } from '../constants/books';
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
function Sidebar({ selectedCategory, onSelectCategory, language, onChangeLanguage }) {
  const { data: categories, isLoading, error } = useQuery(
    ['categories', language],
    () => fetchHadithBooks(language)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error loading books</div>;

  return (
    <div 
      className="bg-white shadow-lg h-full overflow-y-auto p-6 rounded-l-2xl border-l-4 border-green-600"
      dir="rtl"
    >
      {/* Header with Islamic Motif */}
      <div className="mb-8 text-center">
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

      {/* Category Navigation */}
      <nav className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              w-full text-right p-4 rounded-xl transition-all duration-300
              ${selectedCategory === category.id 
                ? 'bg-green-100 text-green-900 shadow-md' 
                : 'bg-gray-50 text-gray-700 hover:bg-green-50'}
              flex items-center justify-between
            `}
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
          </button>
        ))}
      </nav>

      {/* Footer Inspiration */}
      <div className="mt-8 text-center border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-500 italic">
          "طلب العلم فريضة على كل مسلم"
        </p>
      </div>
    </div>
  );
}

export default Sidebar;