import React from 'react';
import { BookOpenIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const SahabiCard = ({ sahabi }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
      
        <h2 className="text-2xl font-bold text-gray-800 ">
          {sahabi.name}
        </h2>
      </div>

      <div className="flex items-center space-x-3 text-gray-600 ">
        <CalendarIcon className="w-5 h-5" />
        <span>{sahabi.periodOfLife}</span>
      </div>

      {sahabi.achievements && (
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-700 ">
            أبرز الإنجازات
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ">
            {sahabi.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      <Link 
        to={`/sahaba/${sahabi.id}/pdf`}
        className="flex items-center justify-center space-x-2 w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <BookOpenIcon className="w-6 h-6" />
        <span className="font-semibold">استعراض السيرة</span>
      </Link>
    </div>
  );
};

export default SahabiCard;