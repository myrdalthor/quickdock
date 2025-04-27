import React, { useRef } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { X } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface OptionsModalProps {
  onClose: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({ onClose }) => {
  const { state } = useSidebar();
  const { theme } = state;
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose);

  const options = [
    { label: 'Run at startup', type: 'toggle' },
    { label: 'Auto-hide when inactive', type: 'toggle' },
    { label: 'Auto-hide delay', type: 'range', min: 0, max: 2000, step: 100 },
    { label: 'Transparency', type: 'range', min: 0, max: 100, step: 5 },
    { label: 'Animation speed', type: 'select', options: ['None', 'Fast', 'Normal', 'Slow'] },
    { label: 'Sort items by', type: 'select', options: ['Manual', 'Name', 'Type', 'Last used'] },
    { label: 'Confirm item deletion', type: 'toggle' },
    { label: 'Check for updates', type: 'toggle' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div 
        ref={modalRef}
        className={`${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
        } rounded-lg shadow-xl w-full max-w-md p-4 relative overflow-y-auto max-h-[90vh]`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Options</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.label} className="flex items-center justify-between">
                <label className="text-sm">{option.label}</label>
                {option.type === 'select' && (
                  <select
                    className={`ml-2 p-1.5 rounded text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    } border`}
                  >
                    {option.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {option.type === 'toggle' && (
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-blue-600 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200`}
                    />
                  </div>
                )}
                {option.type === 'range' && (
                  <div className="flex items-center">
                    <input
                      type="range"
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      className="ml-2 w-32"
                    />
                    <span className="ml-2 text-sm w-12 text-right">0</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md mr-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};