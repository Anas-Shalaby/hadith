import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const [completedSahabaIds, setCompletedSahabaIds] = useState([]);
  const [isSahabaJourneyComplete, setIsSahabaJourneyComplete] = useState(false);

  const sahabaAchievements = [
    { id: 'abu_bakr', name: 'أبو بكر الصديق', icon: '🕌' },
    { id: 'umar', name: 'عمر بن الخطاب', icon: '⚔️' },
    { id: 'uthman', name: 'عثمان بن عفان', icon: '📖' },
    { id: 'ali', name: 'علي بن أبي طالب', icon: '🌟' }
  ];

  useEffect(() => {
    const storedCompletedSahaba = JSON.parse(localStorage.getItem('completed_sahaba') || '[]');
    const journeyComplete = localStorage.getItem('sahaba_journey_complete') === 'true';

    setCompletedSahabaIds(storedCompletedSahaba);
    setIsSahabaJourneyComplete(journeyComplete);
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600 dark:text-green-400">
          إنجازاتك في رحلة الصحابة
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sahabaAchievements.map((sahabi) => (
            <motion.div
              key={sahabi.id}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg text-center ${
                completedSahabaIds.includes(sahabi.id) 
                  ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500 dark:border-green-700' 
                  : 'bg-gray-200 dark:bg-gray-700 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{sahabi.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{sahabi.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completedSahabaIds.includes(sahabi.id) ? 'مكتمل ✅' : 'قيد التقدم'}
              </p>
            </motion.div>
          ))}
        </div>

        {isSahabaJourneyComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-4">🏆 مبروك! 🏆</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              لقد أكملت رحلة قراءة سير الصحابة الكرام. أنت الآن على طريق فهم تاريخ الإسلام العظيم.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Achievements;