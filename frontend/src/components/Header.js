import React from 'react';
import { FaMoon, FaSun, FaRobot } from 'react-icons/fa';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={`py-4 px-6 flex justify-between items-center border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center">
        <FaRobot className={`text-2xl mr-2 ${darkMode ? 'text-primary-light' : 'text-primary'}`} />
        <h1 className="text-xl font-bold">AI Chat Bot</h1>
      </div>
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
      </button>
    </header>
  );
};

export default Header; 