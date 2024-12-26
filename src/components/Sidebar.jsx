// src/components/Sidebar.jsx
import React from 'react';
import { Home, Book, Users, Languages, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, isActive }) => (
  <Link 
    to={to}
    className={`
      flex items-center p-3 rounded-lg transition-all duration-200 
      ${isActive 
        ? 'bg-primary-100 text-primary-600 font-semibold' 
        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
    `}
  >
    <Icon className="w-6 h-6 mr-3" />
    <span className="text-sm">{label}</span>
  </Link>
);

const Sidebar = ({ 
  isOpen, 
  onClose, 
  language, 
  onLanguageChange, 
  categories = [] 
}) => {
  const sidebarItems = [
    {
      id: 'home',
      label: language === 'ar' ? 'الرئيسية' : 'Home',
      icon: Home,
      to: '/'
    }
  ];

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 h-screen overflow-y-auto scroll bg-white shadow-lg 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}
    >
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Sidebar Content */}
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
        </h2>

        <nav className="space-y-2 overflow-y-auto">
          {sidebarItems.map(item => (
            <SidebarItem 
              key={item.id} 
              {...item} 
            />
          ))}

          {/* Hadith Categories */}
          {categories.map(category => (
            <SidebarItem 
              key={category.id}
              label={category.title}
              to={`/hadiths/${category.id}`}
              icon={Book}
            />
          ))}
        </nav>

        
      </div>
    </div>
  );
};

export default Sidebar;