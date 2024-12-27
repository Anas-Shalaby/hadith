import React from 'react';
import { BookOpenIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const SahabiCard = ({ sahabi }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {sahabi.name}
        </h2>
      </div>

      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
        <CalendarIcon className="w-5 h-5" />
        <span>{sahabi.periodOfLife}</span>
      </div>

      {sahabi.achievements && (
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-200">
            أبرز الإنجازات
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            {sahabi.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      <Link 
        to={`/sahaba/${sahabi.id}/pdf`}
        className="flex items-center justify-center space-x-2 w-full 
        bg-green-500 hover:bg-green-600 
        dark:bg-green-700 dark:hover:bg-green-600 
        text-white px-4 py-3 rounded-lg transition-colors"
      >
        <BookOpenIcon className="w-6 h-6" />
        <span className="font-semibold">استعراض السيرة</span>
      </Link>
    </div>
  );
};

export default SahabiCard;