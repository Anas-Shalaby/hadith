import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  BookmarkIcon, 
  InformationCircleIcon,
  CameraIcon 
} from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SahabaPDFViewer() {
  const history = useHistory();
  const { sahabiId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [showBookmarkTooltip, setShowBookmarkTooltip] = useState(false);
  const [showSahabiInfo, setShowSahabiInfo] = useState(false);
  const [showScreenshotTooltip, setShowScreenshotTooltip] = useState(false);
  const pageRef = useRef(null);

  // New state for bookmarking and progress
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readPages, setReadPages] = useState([]);
  const [bookmarkData, setBookmarkData] = useState(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  const sahabaDetails = {
    'abu_bakr': { 
      name: 'أبو بكر الصديق', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 48,
      nextSahabiInitialPage: 94,
      bio: 'أول الخلفاء الراشدين، صاحب رسول الله ﷺ وأقرب الناس إليه'
    },
    'umar': { 
      name: 'عمر بن الخطاب', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 94,
      nextSahabiInitialPage: 159,
      bio: 'الخليفة الثاني، عُرف بالعدل والحزم وتوسيع الدولة الإسلامية'
    },
    'uthman': { 
      name: 'عثمان بن عفان', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 159,
      nextSahabiInitialPage: 185,
      bio: 'الخليفة الثالث، جمع المسلمين على مصحف واحد وأكمل توسعة المسجد النبوي'
    },
    'ali': { 
      name: 'علي بن أبي طالب', 
      pdfUrl: '/Noor-Book.pdf',
      initialPage: 185,
      nextSahabiInitialPage: null,
      bio: 'الخليفة الرابع، ابن عم النبي ﷺ وصهره، عُرف بالشجاعة والعلم'
    }
  };

  const selectedSahabi = sahabaDetails[sahabiId] || sahabaDetails['abu_bakr'];

  // Memoized page number to ensure it's always a valid number
  const safePageNumber = useMemo(() => {
    const parsed = Number(pageNumber);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageNumber]);

  // Resize handling
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate optimal PDF page width
  const calculatePageWidth = () => {
    const maxWidth = 800; // Maximum width for readability
    const padding = 40; // Additional padding

    if (width <= 640) { // Mobile devices
      return width - padding;
    } else if (width <= 1024) { // Tablets
      return Math.min(width * 0.8, maxWidth);
    } else { // Desktop
      return Math.min(width * 0.6, maxWidth);
    }
  };

  // Progress percentage calculation
  const progressPercentage = useMemo(() => {
    if (!numPages) return 0;
    
    return Math.round(
      ((safePageNumber - selectedSahabi.initialPage) / 
      (selectedSahabi.nextSahabiInitialPage 
        ? selectedSahabi.nextSahabiInitialPage - selectedSahabi.initialPage 
        : numPages - selectedSahabi.initialPage)) * 100
    );
  }, [safePageNumber, numPages, selectedSahabi]);

  // Screenshot function
  const takeScreenshot = async () => {
    if (pageRef.current) {
      try {
        const canvas = await html2canvas(pageRef.current, {
          scale: 2, // Increases resolution
          useCORS: true, // Helps with cross-origin images
          logging: false
        });

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          // Create a link to download the image
          const link = document.createElement('a');
          link.download = `${selectedSahabi.name}_page_${safePageNumber}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        });

        // Show tooltip
        setShowScreenshotTooltip(true);
        setTimeout(() => setShowScreenshotTooltip(false), 3000);
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
  };

  // Page change and tracking logic
  const changePage = (offset) => {
    setPageNumber(prevPage => {
      const newPage = Number(prevPage) + offset;
      const clampedPage = Math.max(1, Math.min(newPage, numPages || 1));
      
      // Update read pages
      if (!readPages.includes(clampedPage)) {
        const newReadPages = [...readPages, clampedPage];
        setReadPages(newReadPages);
        localStorage.setItem(`progress-${sahabiId}`, JSON.stringify(newReadPages));
      }

      return clampedPage;
    });
  };

  // Bookmark functionality
  const toggleBookmark = () => {
    if (isBookmarked) {
      localStorage.removeItem(`bookmark-${sahabiId}`);
      setIsBookmarked(false);
      setBookmarkData(null);
    } else {
      const bookmarkInfo = {
        page: safePageNumber,
        timestamp: new Date().toISOString(),
        sahabiName: selectedSahabi.name,
        readProgress: progressPercentage
      };
      
      localStorage.setItem(`bookmark-${sahabiId}`, JSON.stringify(bookmarkInfo));
      setBookmarkData(bookmarkInfo);
      setIsBookmarked(true);
      setShowBookmarkTooltip(true);
      
      // Auto-hide tooltip
      setTimeout(() => setShowBookmarkTooltip(false), 3000);
    }
  };

  // Document load handler
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    // Ensure numPages is a valid number
    const totalPages = Number(numPages);
    setNumPages(totalPages);
    setIsDocumentLoaded(true);

    // Prioritize bookmark, then initial page, then first page
    let targetPage = 1;
    const savedBookmarkData = localStorage.getItem(`bookmark-${sahabiId}`);
    
    if (savedBookmarkData) {
      const parsedBookmark = JSON.parse(savedBookmarkData);
      targetPage = Math.min(parsedBookmark.page, totalPages);
      setBookmarkData(parsedBookmark);
      setIsBookmarked(true);
    } else {
      targetPage = Math.min(selectedSahabi.initialPage, totalPages);
    }

    setPageNumber(targetPage);
  }, [sahabiId, selectedSahabi]);

  // Error handling for document loading
  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setIsDocumentLoaded(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-16">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center p-4 bg-white shadow-lg rounded-b-xl fixed top-16 left-0 right-0 z-40"
      >
        <div className="flex items-center space-x-2 space-x-reverse">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(-1)} 
            disabled={!numPages || safePageNumber >= numPages}
            className="disabled:opacity-50 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </motion.button>
          <span className="text-gray-700">
            صفحة {safePageNumber} من {numPages || '---'}
          </span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(1)} 
            disabled={safePageNumber <= 1}
            className="disabled:opacity-50 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </motion.button>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <motion.select 
            value={sahabiId} 
            onChange={(e) => history.push(`/sahaba/${e.target.value}/pdf`)}
            className="border rounded-lg p-2 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-300 transition-all"
            whileFocus={{ scale: 1.05 }}
          >
            <option disabled>اختر صحابي</option>
            {Object.keys(sahabaDetails).map(key => (
              <option key={key} value={key}>
                {sahabaDetails[key].name}
              </option>
            ))}
          </motion.select>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSahabiInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <InformationCircleIcon className="h-6 w-6 text-blue-500" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Sahabi Info Modal */}
      <AnimatePresence>
        {showSahabiInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowSahabiInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedSahabi.name}</h2>
              <p className="text-gray-600">{selectedSahabi.bio}</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSahabiInfo(false)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                إغلاق
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center justify-center min-h-screen mt-16">
      <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleBookmark} 
            className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg 
              ${isBookmarked 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            <BookmarkIcon className="h-6 w-6" />
          </motion.button>
        <div className="relative w-full max-w-4xl">
          

          <AnimatePresence>
            {showBookmarkTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-16 right-4 bg-white shadow-lg p-3 rounded-lg text-sm text-gray-700 z-20 border"
              >
                <div className="flex items-center space-x-2">
                  <BookmarkIcon className="h-5 w-5 text-yellow-500" />
                  <span>تم حفظ الإشارة في الصفحة {safePageNumber}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 h-2.5 rounded-full"
          ></motion.div>
        </motion.div>
        <div className="text-center text-sm text-gray-600 mt-1">
          تم قراءة {progressPercentage}% من قصة الصحابي
        </div>

        {/* PDF Viewer Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 mx-auto w-full px-4"
          style={{ 
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Document
            file={selectedSahabi.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<LoadingSpinner />}
            error={
              <div className="text-red-500 text-center">
                حدث خطأ في تحميل المستند
              </div>
            }
          >
            {isDocumentLoaded && numPages && (
              <>
                <motion.div
                  ref={pageRef}
                  key={safePageNumber}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Page
                    pageNumber={safePageNumber}
                    width={calculatePageWidth()}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-xl rounded-lg overflow-hidden"
                  />
                  
                  {/* Screenshot Button */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={takeScreenshot}
                    className="absolute top-4 left-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white"
                  >
                    <CameraIcon className="h-5 w-5 text-gray-700" />
                  </motion.button>
                </motion.div>
              
                {/* Screenshot Tooltip */}
                <AnimatePresence>
                  {showScreenshotTooltip && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute top-16 left-4 bg-white shadow-lg p-3 rounded-lg text-sm text-gray-700 z-20 border"
                    >
                      <div className="flex items-center space-x-2">
                        <CameraIcon className="h-5 w-5 text-blue-500" />
                        <span>تم حفظ لقطة الشاشة</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </Document>
        </motion.div>
      </div>
    </div>
  );
}

export default SahabaPDFViewer;