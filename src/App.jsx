import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import {  Bars3Icon as MenuIcon } from "@heroicons/react/24/outline";

import Sidebar from "./components/Sidebar";
import HadithList from "./components/HadithList";
import ErrorBoundary from "./components/ErrorBoundary";
import { Route } from "react-router-dom";
import HadithCard from "./components/HadithCard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Query error:", error.message);
      },
    },
  },
});

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [language, setLanguage] = useState("ar"); // Default to Arabic
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div 
          className="min-h-screen bg-gray-100 flex flex-col" 
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <Toaster position={language === 'ar' ? 'top-left' : 'top-right'} />
          
          {/* Mobile Header with Sidebar Toggle */}
          <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
            </h1>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isSidebarOpen ? <MenuIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" 
              onClick={toggleSidebar}
            />
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar for Desktop and Mobile */}
            <div className={`
              fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
              md:relative md:translate-x-0
              ${isSidebarOpen ? 'translate-x-0' : `${language === 'ar' ? 'translate-x-full' : '-translate-x-full'}`}
            `}>
              <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setIsSidebarOpen(false);
                }}
                language={language}
                onChangeLanguage={setLanguage}
                className="h-full overflow-y-auto"
              />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto md:pl-0">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <header className="text-center mb-8 md:mb-12">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'مجموعة الأحاديث النبوية' : 'Hadith Collection'}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    {language === 'ar' 
                      ? 'تصفح الأحاديث الأصيلة مع الشروحات' 
                      : 'Browse authentic hadiths with explanations'}
                  </p>
                </header>
                {<HadithList 
                  categoryId={selectedCategory} 
                  language={language} 
                  className="px-2 sm:px-0"
                />
                }
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;