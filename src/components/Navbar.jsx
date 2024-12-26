import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ language, onToggleSidebar, isSidebarOpen }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={onToggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo / Title */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">
              {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
            </h1>
          </Link>

          {/* Search and Notification Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-600">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;