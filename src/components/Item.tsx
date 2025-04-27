import React from 'react';
import { Item as ItemType } from '../types';
import { useSidebar } from '../context/SidebarContext';
import { Edit2, Trash2, ExternalLink, MoreVertical } from 'lucide-react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { MenuButton, MenuItem, MenuList, useMenuState } from './Menu';
import { getItemIcon } from '../utils/iconUtils';

interface ItemProps {
  item: ItemType;
  groupId: string;
  index: number;
  displayMode: 'icon-only' | 'icon-and-name';
}

export const Item: React.FC<ItemProps> = ({ item, groupId, index, displayMode }) => {
  const { state, dispatch } = useSidebar();
  const { theme } = state;
  const menu = useMenuState();

  const handleDelete = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { groupId, itemId: item.id }
    });
    menu.close();
  };

  const handleLaunch = () => {
    // In a real application, this would launch the application or open the document
    alert(`Launching ${item.name} (${item.path})`);
  };

  const ItemIcon = getItemIcon(item);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group flex items-center justify-between p-2 my-1 rounded-md cursor-pointer ${
            theme === 'dark' 
              ? 'hover:bg-gray-800' 
              : 'hover:bg-gray-100'
          } transition-colors ${
            displayMode === 'icon-only' ? 'w-10 h-10 justify-center' : 'w-full'
          }`}
          onClick={handleLaunch}
          title={displayMode === 'icon-only' ? item.name : undefined}
        >
          <div className={`flex items-center ${
            displayMode === 'icon-only' ? '' : 'flex-grow min-w-0'
          }`}>
            <div className={`flex-shrink-0 ${
              displayMode === 'icon-only' ? '' : 'mr-2'
            } ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <ItemIcon size={18} />
            </div>
            {displayMode === 'icon-and-name' && (
              <span className="truncate">{item.name}</span>
            )}
          </div>
          
          {displayMode === 'icon-and-name' && (
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <MenuButton
                state={menu}
                className={`p-1 rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 hover:text-white' 
                    : 'hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <MoreVertical size={16} />
              </MenuButton>
              
              <MenuList state={menu} className={`z-50 min-w-32 py-1 rounded-md shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <MenuItem
                  className={`px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  } flex items-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch();
                    menu.close();
                  }}
                >
                  <ExternalLink size={14} className="mr-2" />
                  Open
                </MenuItem>
                <MenuItem
                  className={`px-4 py-2 text-sm text-red-500 hover:text-red-700 flex items-center ${
                    theme === 'dark' ? 'hover:bg-red-900 hover:bg-opacity-50' : 'hover:bg-red-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Trash2 size={14} className="mr-2" />
                  Remove
                </MenuItem>
              </MenuList>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};