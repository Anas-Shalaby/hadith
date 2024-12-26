import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, initialPage = 1 }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
  
    // Reset page when initialPage changes
    useEffect(() => {
      setPageNumber(initialPage);
    }, [initialPage]);
  
    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth);
        }
      };
  
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);
  
    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
      // Ensure initial page is within document range
      setPageNumber(Math.min(initialPage, numPages));
    };
  
    const changePage = (offset) => {
      setPageNumber(prevPage => {
        const newPage = prevPage + offset;
        return Math.max(1, Math.min(newPage, numPages));
      });
    };
  
    const zoomIn = () => {
      setScale(prevScale => Math.min(prevScale + 0.25, 2));
    };
  
    const zoomOut = () => {
      setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
    };
  
    return (
      <div 
        ref={containerRef}
        className="bg-white bg-gray-800 rounded-lg shadow-lg p-4 overflow-hidden"
      >
        <div className="relative">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
              </div>
            }
            error={
              <div className="text-center text-red-500 p-4">
                Error loading PDF. Please try again.
              </div>
            }
          >
            <div className="flex justify-center overflow-auto">
              <Page
                pageNumber={pageNumber}
                width={Math.min(containerWidth * 0.95, 800)}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          </Document>
  
          {numPages && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <div className="bg-white rounded-full shadow-lg flex items-center">
                <button 
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className="p-2 disabled:opacity-50 hover:bg-gray-100  rounded-l-full"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <span className="px-4 text-sm text-gray-700">
                  {pageNumber} / {numPages}
                </span>
                <button 
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                  className="p-2 disabled:opacity-50 hover:bg-gray-100  rounded-r-full"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </div>
  
              <div className="bg-white  rounded-full shadow-lg flex items-center">
                <button 
                  onClick={zoomOut}
                  className="p-2 hover:bg-gray-100  rounded-l-full"
                >
                  <ZoomOutIcon className="w-6 h-6" />
                </button>
                <span className="px-4 text-sm text-gray-700 ">
                  {Math.round(scale * 100)}%
                </span>
                <button 
                  onClick={zoomIn}
                  className="p-2 hover:bg-gray-100  rounded-r-full"
                >
                  <ZoomInIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default PDFViewer;