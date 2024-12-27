// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Award, 
  Library 
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const LandingPage = ({ language }) => {
  const features = [
    {
      icon: BookOpen,
      title: language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection',
      description: language === 'ar' 
        ? 'استكشف مجموعة واسعة من الأحاديث النبوية الشريفة' 
        : 'Explore a comprehensive collection of authentic Hadiths'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'سير الصحابة' : 'Companions\' Biographies',
      description: language === 'ar' 
        ? 'تعرف على سير وقصص الصحابة الكرام' 
        : 'Discover the life stories of the noble Companions'
    },
    {
      icon: Library,
      title: language === 'ar' ? 'كتب الحديث' : 'Hadith Books',
      description: language === 'ar' 
        ? 'اطلع على مختلف كتب الحديث المعتمدة' 
        : 'Browse through various authenticated Hadith books'
    },
    {
      icon: Award,
      title: language === 'ar' ? 'إنجازات' : 'Achievements',
      description: language === 'ar' 
        ? 'تتبع إنجازاتك في دراسة السيرة والحديث' 
        : 'Track your achievements in studying Seerah and Hadiths'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'منصة شاملة لدراسة الأحاديث النبوية والسيرة النبوية' 
              : 'A comprehensive platform for studying Prophetic Hadiths and Seerah'}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            to="/hadiths/1/page/1"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full 
                       text-lg font-semibold hover:bg-blue-700 transition-colors 
                       shadow-md hover:shadow-lg"
          >
            {language === 'ar' ? 'ابدأ الاستكشاف' : 'Start Exploring'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;