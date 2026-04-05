import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useFinance();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group relative"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5">
        <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-amber-500'}`} />
        <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-0 scale-100 opacity-100 text-indigo-500' : '-rotate-90 scale-0 opacity-0'}`} />
      </div>
    </button>
  );
};
