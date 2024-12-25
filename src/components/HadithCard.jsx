import React, { useState, useEffect, useRef } from "react";
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
        dir="rtl"
      >
        {/* Close and Screenshot Buttons */}
        <div className="absolute top-4 left-4 flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={takeScreenshot}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title={language === 'ar' ? 'لقطة شاشة' : 'Screenshot'}
          >
            <CameraIcon className="h-6 w-6" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            ×
          </button>
        </div>

        {/* Hadith Details */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          التفاصيل:
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {details.hadeeth}
        </p>
        {/* Explanation Section */}
        {details?.explanation && (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              الشرح:
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {details.explanation}
            </p>
          </>
        )}

        {/* Word Meanings Section */}
        {details?.words_meanings?.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">
              معاني الكلمات:
            </h4>
            <div className="space-y-3">
              {details.words_meanings.map((wordMeaning, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <span className="font-medium text-gray-900 ml-2">
                    {wordMeaning.word}:
                  </span>
                  <span className="text-gray-700">
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

function HadithCard({ hadith, language }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHadithDetails = async (hadithId, lang = "ar") => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://hadeethenc.com/api/v1/hadeeths/one/`, {
        params: {
          language: lang,
          id: hadithId,
        },
      }); 
      setDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Hadith details fetch error:', error);
      toast.error('فشل تحميل التفاصيل');
    }
  };  
  const copyToClipboard = async () => {
    const textToCopy = `${details.hadeeth}\n${details.attribution}\n ${details?.grade}${
      details ? `\n\nالشرح:\n${details.explanation}` : ""
    }`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success( 'تم النسخ');
    } catch (err) {
      toast.error('فشل النسخ');
    }
  };

  const takeScreenshot = async () => {
    try {
      const element = document.getElementById(`hadith-${hadith.id}`);
      const canvas = await html2canvas(element, {
        scale: 3, // Increased scale for higher resolution
        useCORS: true, // Handle cross-origin images
        allowTaint: true, // Allow drawing images from different origins
        logging: false, // Disable logging
        imageTimeout: 0, // Prevent timeout issues
        backgroundColor: '#ffffff', // Ensure white background
        scrollX: 0,
        scrollY: -window.scrollY, // Prevent scrolling issues
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const link = document.createElement("a");
      link.download = `hadith-${hadith.id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0); // Full quality
      link.click();
      toast.success('تم حفظ لقطة الشاشة');
    } catch (err) {
      console.error('Screenshot error:', err);
      toast.error('فشل أخذ لقطة الشاشة');
    }
  };

  useEffect(() => {
    fetchHadithDetails(hadith.id, language)
  }, [hadith.id, language]);


  return (
    <>
      <div
        id={`hadith-${hadith.id}`}
        className="bg-white rounded-2xl flex flex-col justify-between shadow-md overflow-hidden border-r-2 border-gray-200 mb-6 transition-shadow hover:shadow-lg relative"
        dir="rtl"
      >
        {/* Card Header */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-800  font-bold text-lg">
              {hadith.title}
            </span>
            {details?.grade && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {details.grade}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button 
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title={language === 'ar' ? 'نسخ الحديث' : 'Copy Hadith'}
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={takeScreenshot}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title={language === 'ar' ? 'لقطة شاشة' : 'Screenshot'}
            >
              <CameraIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            >
              <InformationCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hadith Text */}
        <div className="p-6">
          <p className="text-xl font-medium text-gray-900 leading-relaxed mb-4">
            {hadith.hadeeth}
          </p>

          {details?.attribution && (
            <div className="text-sm text-gray-600 italic mb-4">
              {details.attribution}
            </div>
          )}

          {/* Explanation Hint */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 text-center flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <InformationCircleIcon className="h-6 w-6 text-gray-600" />
            <span className="text-gray-700 font-medium">
              
               اضغط هنا للحصول على شرح الحديث وتفاصيله
            </span>
          </div>
        </div>

      </div>

      {/* Modal for Explanation and Word Meanings */}
      <HadithDetailsModal
        details={details}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </>
  );}

export default HadithCard;