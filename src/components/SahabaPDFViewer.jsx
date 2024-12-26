// src/components/SahabaPDFViewer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SahabaPDFViewer() {
  const history = useHistory();
  const { sahabiId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [pageTransition, setPageTransition] = useState({
    transform: 'rotateY(0deg)',
    opacity: 1
  });

  const sahabaDetails = {
    'abu_bakr': { 
      name: 'أبو بكر الصديق', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 48 
    },
    'umar': { 
      name: 'عمر بن الخطاب', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 94 
    },
    'uthman': { 
      name: 'عثمان بن عفان', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 159
    },
    'ali': { 
      name: 'علي بن أبي طالب', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 185 
    }
  };

  const selectedSahabi = sahabaDetails[sahabiId] || sahabaDetails['abu_bakr'];

  // Touch handling for mobile page sliding
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    
    // In RTL, swiping left means going to the next page
    if (swipeDistance < -75) {
      // Swipe left (go to next page)
      animatePageTurn(1);
    } else if (swipeDistance > 75) {
      // Swipe right (go to previous page)
      animatePageTurn(-1);
    }
  };

  // Smooth page turn animation
  const animatePageTurn = (direction) => {
    // Initial turn animation
    setPageTransition({
      transform: `rotateY(${direction > 0 ? '90' : '-90'}deg)`,
      opacity: 0,
      transition: 'transform 0.5s, opacity 0.5s'
    });

    // Change page after animation starts
    setTimeout(() => {
      setPageNumber(prev => {
        const newPage = prev + direction;
        return Math.max(1, Math.min(newPage, numPages));
      });

      // Reset animation
      setPageTransition({
        transform: `rotateY(${direction > 0 ? '-90' : '90'}deg)`,
        opacity: 0,
        transition: 'transform 0.5s, opacity 0.5s'
      });
    }, 250);

    // Final reset to default state
    setTimeout(() => {
      setPageTransition({
        transform: 'rotateY(0deg)',
        opacity: 1,
        transition: 'transform 0.5s, opacity 0.5s'
      });
    }, 500);
  };

  // Responsive width calculation
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set initial page based on sahabi details
  useEffect(() => {
    setPageNumber(selectedSahabi.initialPage || 1);
  }, [sahabiId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Calculate PDF page width based on screen size
   const calculatePageWidth = () => {
    if (width < 640) return width - 40; // Small screens
    if (width < 1024) return width - 80; // Medium screens
    return Math.min(width * 0.6, 800); // Large screens, max 60% of screen width or 800px
  };

  // Navigation handler to clear PDF view
  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      history.push(`/sahaba/${selectedId}/pdf`);
    }
  };

  return (
    <div 
      className="container mx-auto px-4 py-6" 
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navbar with Category Selection */}
      <nav className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedSahabi.name}
          </h1>
          
          {/* Category Dropdown */}
          <select 
            onChange={handleCategorySelect}
            value=""
            className="block w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>اختر صحابي</option>
            {Object.entries(sahabaDetails).map(([id, details]) => (
              <option key={id} value={id}>
                {details.name}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* PDF Viewer Container */}
      <div 
        className="flex flex-col items-center space-y-4 mx-auto"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          maxWidth: '1200px', // Limit overall container width
          width: '100%'
        }}
      >
        {/* PDF Document */}
        <div 
          className="w-full max-w-4xl mx-auto flex justify-center"
          style={{
            ...pageTransition,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          <Document
            file={selectedSahabi.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingSpinner />}
            error={
              <div className="text-red-500 text-center">
                خطأ في تحميل المستند
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              width={calculatePageWidth()}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        {/* Pagination Controls */}
        {numPages && (
          <div className="flex items-center space-x-4 space-x-reverse bg-white shadow-md rounded-lg p-4">
            <button
              onClick={() => animatePageTurn(1)}
              disabled={pageNumber >= numPages}
              className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 transition-colors duration-200 rounded-full p-2 hover:bg-blue-50"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
        
            <div className="text-gray-600 text-sm select-none">
              الصفحة {pageNumber} من {numPages}
            </div>

            <button
              onClick={() => animatePageTurn(-1)}
              disabled={pageNumber <= 1}
              className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 transition-colors duration-200 rounded-full p-2 hover:bg-blue-50"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default SahabaPDFViewer;