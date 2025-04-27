import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { SidebarProvider } from './context/SidebarContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function App() {
  const [showToggle, setShowToggle] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('left');

  // Toggle button appears after a short delay or when sidebar is hidden
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToggle(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const togglePosition = () => {
    setPosition(prev => prev === 'left' ? 'right' : 'left');
  };

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 text-white">
        <Sidebar />
        
        {showToggle && (
          <button
            onClick={togglePosition}
            className={`fixed top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 ${
              position === 'left' ? 'left-2' : 'right-2'
            }`}
          >
            {position === 'left' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>
        )}
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-6 rounded-lg bg-gray-900 bg-opacity-50 backdrop-blur-md">
            <h1 className="text-3xl font-bold mb-4">Quick Dock</h1>
            <p className="mb-4">
              A sleek sidebar for organizing your applications, documents, and more.
            </p>
            <div className="text-left p-4 bg-black bg-opacity-30 rounded-md">
              <p className="text-gray-300 text-sm mb-2">
                <strong>Hint:</strong> Try the following:
              </p>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                <li>Create new groups with the "Add Group" button</li>
                <li>Pin applications or documents to groups</li>
                <li>Drag and drop items to reorder or move between groups</li>
                <li>Toggle dark/light mode using the moon/sun icon</li>
                <li>Pin or unpin the sidebar with the pin icon</li>
                <li>Switch sidebar position with the position toggle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;