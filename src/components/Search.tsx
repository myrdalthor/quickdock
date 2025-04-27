import React, { useEffect, useRef } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { Search as SearchIcon, X } from 'lucide-react';

export const Search: React.FC = () => {
  const { state, dispatch } = useSidebar();
  const { theme, searchQuery } = state;
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search is opened
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SEARCH', payload: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className={`p-2 ${theme === 'dark' ? 'bg-gray-850' : 'bg-gray-50'}`}>
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <SearchIcon size={16} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className={`p-2 pl-10 pr-10 w-full rounded-md text-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
              : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500'
          } border outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <button
            onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
            className={`absolute inset-y-0 right-8 flex items-center pr-1 ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleClose}
          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};