import React, { useRef, useState } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { Group } from './Group';
import { Search } from './Search';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { OptionsView } from './OptionsView';
import { PlusCircle } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

const Sidebar: React.FC = () => {
  const { state, dispatch } = useSidebar();
  const { isVisible, isFixed, position, theme, groups, activeGroupId, isSearchOpen, font, transparency } = state;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useOutsideClick(sidebarRef, () => {
    if (!isFixed && isVisible) {
      dispatch({ type: 'SET_VISIBLE', payload: false });
    }
  });

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      dispatch({
        type: 'ADD_GROUP',
        payload: { name: newGroupName.trim() }
      });
      setNewGroupName('');
      setIsAddingGroup(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    
    if (!destination) return;
    
    if (type === 'group') {
      const newGroupOrder = Array.from(groups.map(g => g.id));
      const [removed] = newGroupOrder.splice(source.index, 1);
      newGroupOrder.splice(destination.index, 0, removed);
      
      dispatch({ type: 'REORDER_GROUPS', payload: newGroupOrder });
    } else if (type === 'item') {
      const sourceGroupId = source.droppableId;
      const destGroupId = destination.droppableId;
      
      if (sourceGroupId === destGroupId) {
        const group = groups.find(g => g.id === sourceGroupId);
        if (!group) return;
        
        const itemIds = group.items.map(item => item.id);
        const [removed] = itemIds.splice(source.index, 1);
        itemIds.splice(destination.index, 0, removed);
        
        dispatch({ 
          type: 'REORDER_ITEMS', 
          payload: { groupId: sourceGroupId, itemIds } 
        });
      } else {
        const sourceGroup = groups.find(g => g.id === sourceGroupId);
        if (!sourceGroup) return;
        
        const itemId = sourceGroup.items[source.index].id;
        
        dispatch({
          type: 'MOVE_ITEM',
          payload: {
            fromGroupId: sourceGroupId,
            toGroupId: destGroupId,
            itemId
          }
        });
      }
    }
  };

  const sidebarClasses = `fixed top-0 bottom-0 z-50 flex flex-col w-64 h-screen transition-all duration-300 shadow-lg ${
    position === 'left' ? 'left-0' : 'right-0'
  } ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`;

  const fontStyle = {
    fontFamily: font.family,
    fontSize: `${font.size}px`,
    fontWeight: font.weight,
    backgroundColor: theme === 'dark' 
      ? `rgba(17, 24, 39, ${(100 - transparency) / 100})`
      : `rgba(255, 255, 255, ${(100 - transparency) / 100})`,
    backdropFilter: 'blur(10px)',
    boxShadow: theme === 'dark' 
      ? '0 0 15px rgba(0, 0, 0, 0.5)' 
      : '0 0 15px rgba(0, 0, 0, 0.1)'
  };

  if (!isVisible) return null;

  if (showOptions) {
    return (
      <div ref={sidebarRef} className={sidebarClasses} style={fontStyle}>
        <OptionsView onBack={() => setShowOptions(false)} />
      </div>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className={sidebarClasses}
      style={fontStyle}
    >
      <SidebarHeader />
      
      {isSearchOpen && <Search />}
      
      <div className="flex-grow overflow-y-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sidebar-groups" type="group">
            {(provided: DroppableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-2"
              >
                {groups.map((group, index) => (
                  <Group 
                    key={group.id} 
                    group={group} 
                    isActive={group.id === activeGroupId}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {isAddingGroup ? (
          <div className="mx-2 p-2 my-2 rounded-md bg-opacity-20 bg-blue-500">
            <div className="flex items-center">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="flex-grow px-2 py-1 bg-transparent border-b-2 border-blue-400 outline-none focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddGroup();
                  if (e.key === 'Escape') setIsAddingGroup(false);
                }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleAddGroup}
                className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingGroup(true)}
            className={`flex items-center justify-center w-full p-2 mt-2 ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            } rounded-md transition-colors`}
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Add Group</span>
          </button>
        )}
      </div>
      
      <SidebarFooter onShowOptions={() => setShowOptions(true)} />
    </div>
  );
};

export default Sidebar;