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
    <div className="space-y-4">
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="ابحث عن صحابي..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      {/* Sahaba List */}
      <div className="space-y-2">
        {filteredSahaba.map(sahabi => (
          <div 
            key={sahabi.id}
            onClick={() => onSelectSahabi(sahabi)}
            className={`
              p-4 rounded-lg cursor-pointer transition-all duration-200
              ${selectedId === sahabi.id 
                ? 'bg-primary-100 text-primary-600 shadow-md' 
                : 'hover:bg-gray-100 text-gray-700'}
            `}
          >
            <h3 className="text-lg font-semibold">{sahabi.name}</h3>
            {sahabi.achievements && (
              <p className="text-sm text-gray-500 mt-1">
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