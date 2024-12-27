import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Linkedin, 
  Github 
} from 'lucide-react';

const Footer = ({ language }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Twitter, 
      href: 'https://x.com/ansyoussef12', 
      label: language === 'ar' ? 'تويتر' : 'Twitter' 
    },
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/anas-youssef-29339b225/', 
      label: language === 'ar' ? 'لينكدان' : 'Linkedin' 
    },
    { 
      icon: Github, 
      href: 'https://github.com/AnasYoussef12', 
      label: language === 'ar' ? 'جيتهب' : 'GitHub' 
    }
  ];

  const quickLinks = [
    { 
      label: language === 'ar' ? 'الرئيسية' : 'Home', 
      to: '/' 
    },
    { 
      label: language === 'ar' ? 'الأحاديث' : 'Hadiths', 
      to: '/hadiths/1/page/1' 
    },
    { 
      label: language === 'ar' ? 'الصحابة' : 'Companions', 
      to: '/sahaba' 
    },
    { 
      label: language === 'ar' ? 'الإنجازات' : 'Achievements', 
      to: '/achievements' 
    }
  ];

  return (
    <footer className="bg-gray-100 text-gray-900 w-full" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}
            </h2>
            <p className="text-gray-700">
              {language === 'ar' 
                ? 'منصة متكاملة لدراسة وفهم السنة النبوية' 
                : 'A comprehensive platform for studying and understanding the Prophetic Tradition'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold mb-4 text-right">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index} className="text-right">
                  <Link 
                    to={link.to} 
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold mb-4 text-right">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-2 text-right text-gray-700" style={{direction:"ltr"}}>
              <li>anasyoussef649@gmail.com</li>
              <li>+20 010 1118 8416</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold mb-4 text-right">
              {language === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h3>
            <div className="flex gap-2 justify-end">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  title={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-600">
            © {currentYear} {language === 'ar' ? 'مجموعة الأحاديث' : 'Hadith Collection'}. 
            {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;