import React, { useState } from 'react';
import { Group as GroupType } from '../types';
import { useSidebar } from '../context/SidebarContext';
import { Edit2, Save, Trash2, ChevronRight, ChevronDown, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { Item } from './Item';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { MenuButton, MenuItem, MenuList, useMenuState } from './Menu';

interface GroupProps {
  group: GroupType;
  isActive: boolean;
  index: number;
}

export const Group: React.FC<GroupProps> = ({ group, isActive, index }) => {
  const { state, dispatch } = useSidebar();
  const { theme } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const menu = useMenuState();

  const handleSave = () => {
    if (editedName.trim()) {
      dispatch({
        type: 'RENAME_GROUP',
        payload: { id: group.id, name: editedName.trim() }
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${group.name}" group?`)) {
      dispatch({ type: 'REMOVE_GROUP', payload: group.id });
    }
    menu.close();
  };

  const handleToggleExpand = () => {
    dispatch({ type: 'TOGGLE_GROUP_EXPAND', payload: group.id });
  };

  const toggleDisplayMode = () => {
    dispatch({
      type: 'UPDATE_GROUP_DISPLAY',
      payload: {
        groupId: group.id,
        displayMode: group.displayMode === 'icon-only' ? 'icon-and-name' : 'icon-only'
      }
    });
    menu.close();
  };

  const toggleLayout = () => {
    dispatch({
      type: 'UPDATE_GROUP_LAYOUT',
      payload: {
        groupId: group.id,
        layout: group.layout === 'vertical' ? 'horizontal' : 'vertical'
      }
    });
    menu.close();
  };

  const headerClasses = `
    flex items-center justify-between p-2 rounded-md cursor-pointer
    ${isActive 
      ? theme === 'dark' 
        ? 'bg-blue-900 bg-opacity-50' 
        : 'bg-blue-100'
      : theme === 'dark'
        ? 'hover:bg-gray-800'
        : 'hover:bg-gray-100'
    }
    transition-colors duration-200
  `;

  const itemsContainerClasses = `
    ml-4 pl-2 mt-1 border-l-2 
    ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
    ${group.layout === 'horizontal' ? 'flex flex-wrap gap-2' : ''}
  `;

  return (
    <Draggable draggableId={group.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-2"
        >
          <div 
            className={headerClasses}
            {...provided.dragHandleProps}
          >
            <div 
              className="flex items-center flex-grow"
              onClick={handleToggleExpand}
            >
              {group.expanded ? (
                <ChevronDown size={18} className="mr-1" />
              ) : (
                <ChevronRight size={18} className="mr-1" />
              )}
              
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className={`flex-grow px-1 py-0.5 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                  }`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="font-medium">
                  {group.name}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="p-1 text-green-500 hover:text-green-400 transition-colors"
                >
                  <Save size={16} />
                </button>
              ) : (
                <MenuButton
                  state={menu}
                  className={`p-1 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors rounded-full hover:bg-opacity-20 hover:bg-gray-500`}
                >
                  <MoreVertical size={16} />
                </MenuButton>
              )}
              
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
                  onClick={() => {
                    setIsEditing(true);
                    menu.close();
                  }}
                >
                  <Edit2 size={14} className="mr-2" />
                  Rename
                </MenuItem>
                <MenuItem
                  className={`px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  } flex items-center`}
                  onClick={toggleDisplayMode}
                >
                  {group.displayMode === 'icon-only' ? (
                    <>
                      <List size={14} className="mr-2" />
                      Show Names
                    </>
                  ) : (
                    <>
                      <LayoutGrid size={14} className="mr-2" />
                      Icons Only
                    </>
                  )}
                </MenuItem>
                <MenuItem
                  className={`px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  } flex items-center`}
                  onClick={toggleLayout}
                >
                  {group.layout === 'vertical' ? (
                    <>
                      <LayoutGrid size={14} className="mr-2" />
                      Horizontal Layout
                    </>
                  ) : (
                    <>
                      <List size={14} className="mr-2" />
                      Vertical Layout
                    </>
                  )}
                </MenuItem>
                <MenuItem
                  className={`px-4 py-2 text-sm text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center ${
                    theme === 'dark' ? 'hover:bg-red-900 hover:bg-opacity-50' : ''
                  }`}
                  onClick={handleDelete}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </MenuItem>
              </MenuList>
            </div>
          </div>
          
          {group.expanded && (
            <Droppable droppableId={group.id} type="item">
              {(dropProvided: DroppableProvided) => (
                <div
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className={itemsContainerClasses}
                >
                  {group.items.map((item, itemIndex) => (
                    <Item
                      key={item.id}
                      item={item}
                      groupId={group.id}
                      index={itemIndex}
                      displayMode={group.displayMode}
                    />
                  ))}
                  {dropProvided.placeholder}
                  
                  {group.items.length === 0 && (
                    <div className={`p-2 text-sm italic ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Drag items here or add new ones
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};