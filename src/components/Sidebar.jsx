// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Library, 
  Users, 
  Award, 
  X,
  Search
} from 'lucide-react';

const SidebarItem = ({ 
  to, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300
      ${isActive 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
      }
    `}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ 
  isOpen, 
  onClose, 
  language="ar", 
  onLanguageChange, 
  categories = [], 
  onLinkClick 
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const mainSidebarItems = [
    {
      id: 'home',
      label: language === 'ar' ? 'الرئيسية' : 'Home',
      to: '/',
      icon: Home
    },
    {
      id: 'hadiths',
      label: language === 'ar' ? 'الأحاديث' : 'Hadiths',
      to: '/hadiths/1/page/1',
      icon: BookOpen
    },
    {
      id: 'books',
      label: language === 'ar' ? 'كتب الحديث' : 'Hadith Books',
      to: '/books',
      icon: Library
    },
    {
      id: 'sahaba',
      label: language === 'ar' ? 'الصحابة' : 'Companions',
      to: '/sahaba',
      icon: Users
    },
    {
      id: 'achievements',
      label: language === 'ar' ? 'الإنجازات' : 'Achievements',
      to: '/achievements',
      icon: Award
    }
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 
        shadow-lg transform transition-transform duration-300 z-40 pt-16
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `}
    >
      <div className="relative px-4 py-6 h-full flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 
                     hover:text-gray-700 dark:hover:text-gray-300 
                     focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="relative">
            <input 
              type="text"
              placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-gray-50 dark:bg-gray-700 
                         text-gray-700 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 dark:text-gray-300 w-5 h-5"
            />
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation Items */}
          <nav className="space-y-2 mb-6 px-2">
            {mainSidebarItems.map(item => (
              <SidebarItem 
                key={item.id} 
                {...item} 
                onClick={onLinkClick}
                isActive={location.pathname === item.to}
              />
            ))}
          </nav>

          {/* Hadith Categories Section */}
          {categories.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 px-2">
              <span className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 block">
                {language === 'ar' ? 'تصنيفات الأحاديث' : 'Hadith Categories'}
              </span>
              <div className="space-y-2">
                {filteredCategories.map(category => (
                  <SidebarItem 
                    key={category.id}
                    label={category.title}
                    to={`/hadiths/${category.id}/page/1`}
                    icon={BookOpen}
                    onClick={onLinkClick}
                    isActive={location.pathname === `/hadiths/${category.id}/page/1`}
                  />
                ))}
                {filteredCategories.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle (Optional) */}
        {/* {onLanguageChange && (
          <div className="mt-4 px-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onLanguageChange('ar')}
                className={`px-3 py-1 rounded-md ${
                  language === 'ar' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                العربية
              </button>
              <button 
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-md ${
                  language === 'en' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                English
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;