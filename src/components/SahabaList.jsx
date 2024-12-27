// src/components/SahabaList.jsx
import React, { useState } from 'react';

const SahabaList = ({ 
  sahaba, 
  onSelectSahabi, 
  selectedId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter sahaba based on search term
  const filteredSahaba = sahaba.filter(sahabi => 
    sahabi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900  p-4">
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="ابحث عن صحابي..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 
        bg-gray-50 dark:bg-gray-800 
        text-gray-900 dark:text-white 
        border-gray-300 dark:border-gray-600 
        placeholder-gray-500 dark:placeholder-gray-400"
      />

      {/* Sahaba List */}
      <div className="space-y">
        {filteredSahaba.map(sahabi => (
          <div 
            key={sahabi.id}
            onClick={() => onSelectSahabi(sahabi)}
            className={`
              p-4 rounded-lg cursor-pointer transition-all duration-200
              ${selectedId === sahabi.id 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 shadow-md' 
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
            `}
          >
            <h3 className="text-lg font-semibold ">{sahabi.name}</h3>
            {sahabi.achievements && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {sahabi.achievements}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SahabaList;