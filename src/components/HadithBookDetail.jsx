// src/components/HadithBookDetail.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Copy, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import LoadingSpinner from './LoadingSpinner';

const HadithBookDetail = () => {
  const { bookName, page: pageParam } = useParams();
  const [page, setPage] = useState(Number(pageParam) || 1);
  const hadithRefs = useRef({});
  const location = useLocation();
  
  // State to store total hadiths
  const [totalHadiths, setTotalHadiths] = useState(location.state?.totalHadiths || 0);

  const fetchHadithsByBook = async () => {
    try {
      const response = await axios.get(`https://api.hadith.gading.dev/books`);
      const book = response.data.data.find(b => b.id === bookName);
      // Update total hadiths from the API response
      setTotalHadiths(book?.available);

      // Fetch specific page range
      const pageResponse = await axios.get(`https://api.hadith.gading.dev/books/${book.id}`, {
        params: {
          range: `${(page - 1) * 20 + 1}-${page * 20}`
        }
      });
      
      return pageResponse.data.data;
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery(
    ['hadiths', bookName, page],
    fetchHadithsByBook
  );

  // Calculate total pages based on total hadiths
  const totalPages = Math.ceil(totalHadiths / 20);

  const copyHadith = (hadith) => {
    navigator.clipboard.writeText(hadith.arab)
      .then(() => {
        toast.success('تم نسخ الحديث', {
          icon: '📋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('فشل النسخ');
      });
  };

  const takeScreenshot = (hadithNumber) => {
    const element = hadithRefs.current[hadithNumber];
    if (element) {
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `hadith_${bookName}_${hadithNumber}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast.success('تم حفظ لقطة الشاشة', {
          icon: '🖼️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }).catch(err => {
        console.error('Screenshot failed:', err);
        toast.error('فشل أخذ لقطة الشاشة');
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">Error loading hadiths</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white"
      >
        {bookName}
      </motion.h1>

      <div className="space-y-6">
        {data.hadiths.map((hadith) => (
          <motion.div
            key={hadith.number}
            ref={el => hadithRefs.current[hadith.number] = el}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                الحديث رقم {hadith.number}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => copyHadith(hadith)}
                  className="text-gray-500 hover:text-blue-500 transition"
                  title="نسخ الحديث"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => takeScreenshot(hadith.number)}
                  className="text-gray-500 hover:text-green-500 transition"
                  title="لقطة شاشة"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-800 dark:text-white text-lg leading-relaxed">
              {hadith.arab}
            </p>
            {hadith.id && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                معرف الحديث: {hadith.id}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          السابق
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          الصفحة {page} من {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default HadithBookDetail;