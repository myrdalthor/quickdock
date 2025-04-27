import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { X, FolderOpen, Upload } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface AddItemModalProps {
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose }) => {
  const { state, dispatch } = useSidebar();
  const { theme, groups } = state;
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [item, setItem] = useState({
    name: '',
    type: 'application' as const,
    path: '',
  });
  
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useOutsideClick(modalRef, onClose);

  // Focus first input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!item.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!item.path.trim()) {
      newErrors.path = 'Path is required';
    }
    
    if (!groupId) {
      newErrors.group = 'Group is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          groupId,
          item: {
            name: item.name.trim(),
            type: item.type,
            path: item.path.trim(),
          },
        },
      });
      
      onClose();
    }
  };

  const modalOverlayClasses = `fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center`;
  
  const modalClasses = `
    ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}
    rounded-lg shadow-xl w-full max-w-md p-4 relative overflow-y-auto max-h-[90vh]
  `;

  return (
    <div className={modalOverlayClasses}>
      <div ref={modalRef} className={modalClasses}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Item</h3>
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              className={`w-full p-2 rounded-md border ${
                errors.name 
                  ? 'border-red-500' 
                  : theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., Chrome, Project Document"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Type
            </label>
            <select
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'border-gray-700 bg-gray-800' 
                  : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={item.type}
              onChange={(e) => setItem({ 
                ...item, 
                type: e.target.value as 'application' | 'document' | 'folder' | 'website'
              })}
            >
              <option value="application">Application</option>
              <option value="document">Document</option>
              <option value="folder">Folder</option>
              <option value="website">Website</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Path
            </label>
            <div className="flex">
              <input
                type="text"
                className={`flex-grow p-2 rounded-l-md border ${
                  errors.path 
                    ? 'border-red-500' 
                    : theme === 'dark' 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-300 bg-white'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., C:\Program Files\app.exe"
                value={item.path}
                onChange={(e) => setItem({ ...item, path: e.target.value })}
              />
              <button
                type="button"
                className={`p-2 rounded-r-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Browse"
              >
                <FolderOpen size={20} />
              </button>
            </div>
            {errors.path && (
              <p className="text-red-500 text-xs mt-1">{errors.path}</p>
            )}
            <p className="text-xs mt-1 opacity-70">
              For applications: file path (.exe)<br />
              For documents: file path<br />
              For websites: URL (https://...)
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Group
            </label>
            <select
              className={`w-full p-2 rounded-md border ${
                errors.group 
                  ? 'border-red-500' 
                  : theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="" disabled>Select a group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.group && (
              <p className="text-red-500 text-xs mt-1">{errors.group}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
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
              type="submit"
              className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center`}
            >
              <Upload size={16} className="mr-2" />
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};