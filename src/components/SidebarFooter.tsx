import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import { PinIcon, Moon, Sun, SidebarClose, PanelLeft, PanelRight, Upload, Settings } from 'lucide-react';

interface SidebarFooterProps {
  onShowOptions: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ onShowOptions }) => {
  const { state, dispatch } = useSidebar();
  const { theme, isFixed, position } = state;

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleFixed = () => {
    dispatch({ type: 'SET_FIXED', payload: !isFixed });
  };

  const togglePosition = () => {
    dispatch({ type: 'SET_POSITION', payload: position === 'left' ? 'right' : 'left' });
  };

  const handleAddClick = () => {
    // In a real desktop app, this would open the native Windows file picker
    // For web demo, we'll show an alert
    alert('In the desktop app, this would open the Windows file picker');
  };

  return (
    <div className={`p-2 border-t ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="flex justify-between">
        <button
          onClick={handleAddClick}
          className={`p-2 rounded-md flex-grow ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors mr-2`}
        >
          <span className="flex items-center justify-center">
            <Upload size={16} className="mr-2" />
            Add Item
          </span>
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:text-white' 
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            } transition-colors`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={onShowOptions}
            className={`p-2 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:text-white' 
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            } transition-colors`}
            title="Options"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      <div className={`flex mt-2 rounded-md overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      } divide-x ${
        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
      }`}>
        <button
          onClick={toggleFixed}
          className={`p-2 flex-1 flex justify-center ${
            isFixed
              ? theme === 'dark' 
                ? 'bg-blue-900 bg-opacity-30 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-500 hover:text-gray-800'
          } transition-colors`}
          title={isFixed ? 'Unpin Sidebar' : 'Pin Sidebar'}
        >
          {isFixed ? <PinIcon size={16} /> : <SidebarClose size={16} />}
        </button>
        
        <button
          onClick={togglePosition}
          className={`p-2 flex-1 flex justify-center ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-500 hover:text-gray-800'
          } transition-colors`}
          title={position === 'left' ? 'Move to Right' : 'Move to Left'}
        >
          {position === 'left' ? <PanelRight size={16} /> : <PanelLeft size={16} />}
        </button>
      </div>
    </div>
  );
};