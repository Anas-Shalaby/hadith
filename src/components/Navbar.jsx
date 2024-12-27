import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ language, onToggleSidebar, isSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || 
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Sidebar Toggle */}
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none mr-4"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo / Title */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">
                {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
              </h1>
            </Link>
          </div>

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;