// src/components/HadithList.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useInfiniteQuery } from "react-query";
import { fetchHadithsByBook } from "../services/api";
import HadithCard from "./HadithCard";
import LoadingSpinner from "./LoadingSpinner";
import { useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function HadithList({ 
  categories = [], 
  language = "ar", 
  initialPage = 1, 
  className = "" 
}) {
  const history = useHistory();
  const { categoryId } = useParams();
  const [manualPage, setManualPage] = useState(initialPage);
  
  // Determine initial category
  const initialSelectedCategory = useMemo(() => {
   

    if (categoryId) {
      const urlCategory = categories.find(cat => cat.id === Number(categoryId));
      if (urlCategory) return urlCategory;
    }

    return categories[0] || null;
  }, [categories, categoryId]);

  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  // Fetch hadiths query
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery(
    ["hadiths", categoryId, language, initialPage],
    async ({ pageParam = initialPage }) => {
      if (!selectedCategory?.id) {
        throw new Error("No category selected");
      }
      const response = await fetchHadithsByBook(categoryId, language, pageParam);
      return {
        ...response,
        pageParam, // Include the current page parameter
      };
    },
    {
      enabled: !!selectedCategory?.id,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.pageParam;
        const totalPages = lastPage.pagination?.total_pages || 1;
        
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        const currentPage = firstPage.pageParam;
        
        return currentPage > 1 ? currentPage - 1 : undefined;
      },
      onError: (error) => {
        console.error("Error fetching hadiths:", error);
      },
    }
  );

  // Category change handler
  const handleCategoryChange = useCallback((newCategory) => {
    if (newCategory) {
      setSelectedCategory(newCategory);
      setManualPage(1);
      history.push(`/hadiths/${newCategory.id}`);
    }
  }, [history]);

  // Pagination details calculation
  const paginationDetails = useMemo(() => {
    if (!data?.pages?.length) return {
      currentPage: initialPage,
      totalPages: Math.ceil(711 / 20),
      hasNextPage: initialPage < Math.ceil(711 / 20),
      hasPreviousPage: initialPage > 1
    };

    const lastPage = data.pages[data.pages.length - 1];
    const pagination = lastPage.pagination || {};
    
    return {
      currentPage: pagination.current_page || initialPage,
      totalPages: pagination.total_pages || Math.ceil(711 / 20),
      hasNextPage: pagination.current_page < pagination.total_pages,
      hasPreviousPage: pagination.current_page > 1
    };
  }, [data, initialPage]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (  
      <div className="text-red-500 p-4 text-center" dir="rtl">
        خطأ في تحميل الأحاديث: {error.message}
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="text-center text-gray-500 p-4" dir="rtl">
        لم يتم تحديد كتاب
      </div>
    );
  }

  // Flatten all hadith pages
  const allHadiths = data?.pages?.flatMap(page => page.data) || [];

  return (
    <div className={`container mx-auto px-4 py-6 ${className}`} dir="rtl">
     

      {/* Hadiths Grid with Improved Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {allHadiths.map((hadith) => (
          <HadithCard key={hadith.id} hadith={hadith} />
        ))}
      </div>

      {/* Pagination Controls with Modern Design */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4 space-x-reverse bg-white shadow-md rounded-lg p-4">
          {/* Next Page Button (visually left, logically right) */}
          <button
            onClick={() => {
              fetchNextPage();
              history.push(`/category/${categoryId}/page/${paginationDetails.currentPage - 1}`);
            }}
            disabled={!paginationDetails.hasPreviousPage}
            className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>

        
          {/* Page Info */}
          <div className="text-gray-600 text-sm">
            الصفحة {paginationDetails.currentPage} من {paginationDetails.totalPages}
          </div>

          {/* Previous Page Button (visually right, logically left) */}
          <button
            onClick={() => {
              fetchPreviousPage();
              history.push(`/category/${categoryId}/page/${paginationDetails.currentPage + 1}`);
            }}
            disabled={!paginationDetails.hasNextPage}
            className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
        </div>

        {/* Loading Indicators */}
        {(isFetchingNextPage || isFetchingPreviousPage) && (
          <div className="text-gray-500 animate-pulse" dir="rtl">
            جارٍ تحميل المزيد من الأحاديث...
          </div>
        )}
      </div>
    </div>
  );
}

export default HadithList;