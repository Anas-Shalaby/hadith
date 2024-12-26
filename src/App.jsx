import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
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

  const { sahaba, loading: sahabaLoading } = useSahabaData();
  const { categories, loading: categoriesLoading } = useHadithCategories();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen bg-gray-50 rtl">
          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            language={language}
            onLanguageChange={handleLanguageChange}
            categories={categories}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Navbar 
              language={language}
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Content Wrapper */}
            <main className="flex-1 p-6 transition-all duration-300">
              <Switch>
                <Route exact path="/">
                  {sahabaLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
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
            
                <Route exact path="/hadiths">
            <HadithListWrapper />
          </Route>
          <Route path="/hadiths/:categoryId">
            <HadithListWrapper />
          </Route>
                
                <Route path="/sahaba/:sahabiId/pdf">
                  <SahabaPDFViewer />
                </Route>
              </Switch>
            </main>
          </div>
        </div>
        <Toaster position={language === 'ar' ? 'top-left' : 'top-right'} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;