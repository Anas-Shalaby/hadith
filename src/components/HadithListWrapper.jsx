// src/components/HadithListWrapper.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHadithCategories } from '../hooks/useHadithCategories';
import HadithList from './HadithList';
import LoadingSpinner from './LoadingSpinner';

const HadithListWrapper = () => {
  const { categoryId } = useParams();
  const { categories, loading, error } = useHadithCategories();


  if (loading) return <LoadingSpinner />;

  if (error) return <div>Error loading categories: {error.message}</div>;

  if (!categories || categories.length === 0) {
    return <div>No hadith categories available</div>;
  }

  // If no categoryId is provided, use the first category
  const selectedCategory = categoryId 
    ? categories.find(cat => cat.id === Number(categoryId))
    : categories[0];


  return (
    <HadithList 
      categories={categories}
      initialCategory={selectedCategory}
    />
  );
};

export default HadithListWrapper;