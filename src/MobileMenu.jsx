import React from 'react';
import { motion } from 'framer-motion';

function MobileMenu({ isMenuOpen, toggleMenu, toggleTheme, isDarkTheme, setCurrentPage }) {
  const menuItems = [
    { name: 'About', icon: '👤', section: 'home' },
    { name: 'Skills', icon: '🛠️', section: 'home' },
    { name: 'Projects', icon: '🚀', section: 'home' },
    { name: 'Contact', icon: '📧', section: 'home' },
    { name: 'Blogs', icon: '📝', section: 'blogs' },
  ];

  const menuVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const handleNavClick = (section, itemName) => {
    setCurrentPage(section);
    toggleMenu();
    if (section === 'home') {
      setTimeout(() => {
        const element = document.getElementById(itemName.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <motion.div 
      className="fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-50 shadow-lg"
      variants={menuVariants}
      initial="closed"
      animate={isMenuOpen ? 'open' : 'closed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full p-6">
        <button 
          onClick={toggleMenu} 
          className="self-end text-2xl mb-8"
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav className="flex-grow">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={`#${item.name.toLowerCase()}`}
              className="block py-3 text-lg hover:text-purple-400 transition-colors duration-300"
              onClick={() => handleNavClick(item.section, item.name)}
              variants={itemVariants}
              initial="closed"
              animate="open"
              transition={{ delay: 0.1 * index }}
            >
              {item.icon} {item.name}
            </motion.a>
          ))}
        </nav>
        <motion.button
          onClick={() => {
            toggleTheme();
            toggleMenu();
          }}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded transition-colors duration-300"
          variants={itemVariants}
          initial="closed"
          animate="open"
          transition={{ delay: 0.5 }}
        >
          {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default MobileMenu;
