// src/components/HadithBooks.jsx
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { fetchHadithBooksGading } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';

const HadithBooks = () => {
  const history = useHistory();
  const { data: books, isLoading, error } = useQuery(
    'hadithBooks', 
    fetchHadithBooksGading
  );

  const handleBookClick = (bookName, totalHadiths) => {
    // Navigate to hadiths list with the specific book and total hadiths
    history.push(`/hadeeths/${bookName}/page/1`, { totalHadiths });
  };
  

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">Error loading books</div>;
  console.log(books);
  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white"
      >
        كتب الحديث
      </motion.h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {books.map((book) => (
          <motion.div 
            key={book.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleBookClick(book.id)}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {book.name}
              </h2>
              {book.available ? (
                <span className="text-green-500 text-sm">متاح</span>
              ) : (
                <span className="text-red-500 text-sm">غير متاح</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                عدد الأحاديث: {book.available}
              </span>
              <button 
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookClick(book.name, book.available);
                }}
              >
                عرض الأحاديث
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          لا توجد كتب متاحة حاليًا
        </div>
      )}
    </div>
  );
};

export default HadithBooks;