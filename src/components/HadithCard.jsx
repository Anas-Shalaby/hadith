import React, { useState, useEffect, useRef ,useCallback } from "react";
import axios from "axios"; // Add this import
import html2canvas from "html2canvas";
import {
  ClipboardDocumentIcon,
  CameraIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

function HadithDetailsModal({ 
  details, 
  isOpen, 
  onClose, 
  language 
}) {
  const modalRef = useRef(null);

  const takeScreenshot = async () => {
    if (modalRef.current) {
      try {
        const canvas = await html2canvas(modalRef.current, {
          scale: 3, // Higher resolution
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 0,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: modalRef.current.scrollWidth,
          windowHeight: modalRef.current.scrollHeight
        });
        
        const link = document.createElement('a');
        link.download = `hadith_details_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0); // Full quality
        link.click();
        toast.success('تم حفظ لقطة الشاشة');
      } catch (error) {
        console.error('Screenshot error:', error);
        toast.error('فشل أخذ لقطة الشاشة');
      }
    }
  };

  if (!isOpen || !details) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
        dir="rtl"
      >
        {/* Close and Screenshot Buttons */}
        <div className="absolute top-4 left-4 flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={takeScreenshot}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            title={language === 'ar' ? 'لقطة شاشة' : 'Screenshot'}
          >
            <CameraIcon className="h-6 w-6" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            ×
          </button>
        </div>

        {/* Hadith Details */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          التفاصيل:
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {details.hadeeth}
        </p>
        {/* Explanation Section */}
        {details?.explanation && (
          <>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              الشرح:
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {details.explanation}
            </p>
          </>
        )}

        {/* Word Meanings Section */}
        {details?.words_meanings?.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
              معاني الكلمات:
            </h4>
            <div className="space-y-3">
              {details.words_meanings.map((wordMeaning, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {wordMeaning.word}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {wordMeaning.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const API_BASE_URL = "https://hadeethenc.com/api/v1";

function HadithCard({ hadith, language = "ar", categoryId, page = 1 }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHadithDetails = useCallback(async () => {
    if (!hadith || !hadith.id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hadeeths/one/`, {
        params: {
          language: language,
          id: hadith.id,
        },
      });
      
      setDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Hadith details fetch error:', error);
      toast.error('فشل تحميل التفاصيل');
      setIsLoading(false);
    }
  }, [hadith?.id, language]);

  useEffect(() => {
    fetchHadithDetails();
  }, [fetchHadithDetails]);

  const copyToClipboard = async () => {
    if (!details) return;
    
    const textToCopy = `${details.hadeeth}\n${details.attribution}\n${details?.grade || ''}${
      details?.explanation ? `\n\nالشرح:\n${details.explanation}` : ""
    }`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('تم النسخ');
    } catch (err) {
      toast.error('فشل النسخ');
    }
  };

  const takeScreenshot = async () => {
    const element = document.getElementById(`hadith-${hadith.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement("a");
      link.download = `hadith-${hadith.id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      
      toast.success('تم حفظ لقطة الشاشة');
    } catch (err) {
      console.error('Screenshot error:', err);
      toast.error('فشل أخذ لقطة الشاشة');
    }
  };  

  return (
    <>
      <div
        id={`hadith-${hadith.id}`}
        className="bg-white dark:bg-gray-800 rounded-2xl flex flex-col justify-between shadow-md overflow-hidden border-r-2 border-gray-200 dark:border-gray-700 mb-6 transition-shadow hover:shadow-lg relative cursor-pointer"
        dir="rtl"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Card Header */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-800 dark:text-white font-bold text-lg">
              {hadith.title}
            </span>
            {details?.grade && (
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {details.grade}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              title={language === 'ar' ? 'نسخ' : 'Copy'}
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                takeScreenshot();
              }}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              title={language === 'ar' ? 'لقطة شاشة' : 'Screenshot'}
            >
              <CameraIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {details?.reference}
          </p>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-between items-center">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {details?.attribution}
            </span>
          </div>
          <div className="text-blue-600 dark:text-blue-400 text-sm">
            اضغط للتفاصيل
          </div>
        </div>
      </div>

      {/* Modal with Dark Mode */}
      {details && (
        <HadithDetailsModal 
          details={details}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          language={language}
        />
      )}
    </>
  );
}

export default HadithCard;