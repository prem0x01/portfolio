import React from 'react';

function Header({ isDarkTheme, toggleTheme, setCurrentPage }) {
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Prem Mankar</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><a href="#about" onClick={() => setCurrentPage('home')} className="hover:text-purple-400 transition-colors duration-300">About</a></li>
            <li><a href="#skills" onClick={() => setCurrentPage('home')} className="hover:text-purple-400 transition-colors duration-300">Skills</a></li>
            <li><a href="#projects" onClick={() => setCurrentPage('home')} className="hover:text-purple-400 transition-colors duration-300">Projects</a></li>
            <li><a href="#contact" onClick={() => setCurrentPage('home')} className="hover:text-purple-400 transition-colors duration-300">Contact</a></li>
            <li><a href="#blogs" onClick={() => setCurrentPage('blogs')} className="hover:text-purple-400 transition-colors duration-300">Blogs</a></li>
          </ul>
        </nav>
        <button 
          onClick={toggleTheme} 
          className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-sm transition-colors duration-300"
        >
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
