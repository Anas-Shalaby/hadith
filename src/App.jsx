import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Achievements from './components/Achievements';
// Components
import HadithBookDetail from './components/HadithBookDetail'; 
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HadithList from './components/HadithList';
import SahabaList from './components/SahabaList';
import SahabiCard from './components/SahabiCard';
import SahabaPDFViewer from './components/SahabaPDFViewer';
import LoadingSpinner from './components/LoadingSpinner';
import HadithListWrapper from './components/HadithListWrapper';

// Hooks and Utilities
import { useSahabaData } from './hooks/useSahabaData';
import { useHadithCategories } from './hooks/useHadithCategories';
import HadithBooks from './components/HadithBooks';
import LandingPage from './components/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [language, setLanguage] = useState("ar");
  const [selectedSahabi, setSelectedSahabi] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { sahaba, loading: sahabaLoading } = useSahabaData();
  const { categories, loading: categoriesLoading } = useHadithCategories();

  // Toggle dark mode

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`
          flex 
          bg-gray-50 dark:bg-gray-900 
          text-gray-900 dark:text-white 
          rtl
        `}>
          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            language={language}
            onLanguageChange={handleLanguageChange}
            categories={categories}
            onLinkClick={closeSidebar}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Navbar 
              language={language}
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />

            {/* Content Wrapper with Top Padding */}
            <main className="flex-1 pt-10 overflow-y-auto bg-white dark:bg-gray-800">
              <Switch>
                <Route exact path="/sahaba">
                  {sahabaLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-800">
                      <SahabaList 
                        sahaba={sahaba}
                        onSelectSahabi={setSelectedSahabi}
                      />
                      {selectedSahabi && (
                        <SahabiCard 
                          sahabi={selectedSahabi}
                        />
                      )}
                    </div>
                  )}
                </Route>
                <Route exact path="/hadeeths/:bookName/page/:page" component={HadithBookDetail} />

                <Route exact path="/hadiths/:categoryId/page/:page">
                <HadithListWrapper />
              </Route>
              <Route exact path="/hadiths/page/:page">
                <HadithListWrapper />
              </Route>
              <Route exact path="/" render={() => (
  <LandingPage language={language} />
)} />
                <Route path="/achievements" component={Achievements} />
                <Route path="/books" component={HadithBooks} />
        {/* Other routes */}
                <Route path="/sahaba/:sahabiId/pdf">
                  <SahabaPDFViewer />
                </Route>
              </Switch>
            </main>
          </div>
        </div>
        <Footer language={language} />
        <Toaster 
          position={language === 'ar' ? 'top-left' : 'top-right'}
          toastOptions={{
            style: {
              background: isDarkMode ? '#2D3748' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;