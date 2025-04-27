import React, { useRef, useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { FileText, FolderOpen, Globe, Monitor } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface AddItemContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const AddItemContextMenu: React.FC<AddItemContextMenuProps> = ({ x, y, onClose }) => {
  const { state, dispatch } = useSidebar();
  const { theme, groups } = state;
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, onClose);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddItem = (type: 'application' | 'document' | 'folder' | 'website') => {
    // Here we would typically open a file picker dialog
    // For now, we'll simulate it with a prompt
    const path = prompt(`Enter path for ${type}:`);
    if (!path) return;

    const name = path.split('\\').pop()?.split('/').pop() || path;
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        groupId: state.defaultGroup,
        item: {
          name,
          type,
          path,
        },
      },
    });
    
    onClose();
  };

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 1000,
  };

  const menuItems = [
    { type: 'application' as const, icon: Monitor, label: 'Add Application' },
    { type: 'document' as const, icon: FileText, label: 'Add Document' },
    { type: 'folder' as const, icon: FolderOpen, label: 'Add Folder' },
    { type: 'website' as const, icon: Globe, label: 'Add Website' },
  ];

  return (
    <div 
      ref={menuRef}
      className={`rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}
      style={menuStyle}
    >
      <div className="py-1">
        {menuItems.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleAddItem(type)}
            className={`w-full px-4 py-2 text-left flex items-center ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Icon size={16} className="mr-2" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};