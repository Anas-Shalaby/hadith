// src/hooks/useHadithCategories.js
import { useState, useEffect } from 'react';
import { fetchHadithBooks } from '../services/api';

export const useHadithCategories = (language = 'ar') => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchHadithBooks(language);
        

        // Ensure categories have the expected structure
        const processedCategories = fetchedCategories.map((cat, index) => ({
          id: cat.id || index + 1, // Fallback to index if no ID
          title: cat.title || `Book ${index + 1}`,
          ...cat
        }));


        setCategories(processedCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hadith categories:', err);
        setError(err);
        setLoading(false);
      }
    };

    loadCategories();
  }, [language]);

  return { 
    categories, 
    loading, 
    error 
  };
};