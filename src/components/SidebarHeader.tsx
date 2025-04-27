import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import { Search as SearchIcon, Sidebar as SidebarIcon, X } from 'lucide-react';

export const SidebarHeader: React.FC = () => {
  const { state, dispatch } = useSidebar();
  const { theme, isSearchOpen } = state;

  const handleToggleSearch = () => {
    dispatch({ type: 'TOGGLE_SEARCH' });
  };

  const handleClose = () => {
    dispatch({ type: 'SET_VISIBLE', payload: false });
  };

  return (
    <div className={`p-3 flex items-center justify-between border-b ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="flex items-center">
        <SidebarIcon 
          size={20} 
          className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
        />
        <h2 className="ml-2 font-semibold">Quick Dock</h2>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handleToggleSearch}
          className={`p-1.5 rounded-full ${
            isSearchOpen
              ? theme === 'dark' 
                ? 'bg-blue-900 bg-opacity-50 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          } transition-colors mr-1`}
          title="Search"
        >
          <SearchIcon size={16} />
        </button>
        
        <button
          onClick={handleClose}
          className={`p-1.5 rounded-full ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          } transition-colors`}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};