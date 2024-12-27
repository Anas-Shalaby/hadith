// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ language, onToggleSidebar }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const location = useLocation();

  // Check screen size and update menu visibility
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      label: language === 'ar' ? 'الرئيسية' : 'Home', 
      to: '/' 
    },
    { 
      label: language === 'ar' ? 'الأحاديث' : 'Hadiths', 
      to: '/hadiths/1/page/1' 
    },
    { 
      label: language === 'ar' ? 'كتب الحديث' : 'Hadith Books', 
      to: '/books' 
    },
    { 
      label: language === 'ar' ? 'الصحابة' : 'Companions', 
      to: '/sahaba' 
    },
    { 
      label: language === 'ar' ? 'الإنجازات' : 'Achievements', 
      to: '/achievements' 
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Sidebar Toggle - Only show on mobile */}
          {!isDesktop && (
            <button 
              onClick={onToggleSidebar}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Logo / Title */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isDesktop && (
            <div className="hidden md:flex gap-6 space-x-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;