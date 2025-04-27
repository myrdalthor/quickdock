import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { SidebarState, SidebarAction, Group, Item } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: SidebarState = {
  groups: [
    {
      id: 'default',
      name: 'Applications',
      items: [
        {
          id: 'chrome',
          name: 'Chrome',
          type: 'application',
          path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          icon: 'chrome',
        },
        {
          id: 'vscode',
          name: 'VS Code',
          type: 'application',
          path: 'C:\\Program Files\\Microsoft VS Code\\Code.exe',
          icon: 'code',
        },
      ],
      expanded: true,
      displayMode: 'icon-and-name',
      layout: 'vertical',
    },
    {
      id: 'documents',
      name: 'Documents',
      items: [
        {
          id: 'doc1',
          name: 'Project Proposal',
          type: 'document',
          path: 'C:\\Users\\User\\Documents\\Project Proposal.docx',
          icon: 'file-text',
        },
      ],
      expanded: true,
      displayMode: 'icon-and-name',
      layout: 'vertical',
    },
  ],
  activeGroupId: 'default',
  isVisible: true,
  isFixed: true,
  position: 'left',
  theme: 'dark',
  isSearchOpen: false,
  searchQuery: '',
  autoHideDelay: 500,
  transparency: 90,
  autoHideWhenInactive: false,
  sortBy: 'manual',
  confirmDeletion: true,
  runAtStartup: false,
  checkUpdates: true,
  font: {
    family: 'system-ui',
    size: 14,
    weight: 400
  },
  defaultGroup: 'default'
};

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'SET_VISIBLE':
      return { ...state, isVisible: action.payload };
    case 'SET_FIXED':
      return { ...state, isFixed: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ACTIVE_GROUP':
      return { ...state, activeGroupId: action.payload };
    case 'ADD_GROUP': {
      const newGroup: Group = {
        id: uuidv4(),
        name: action.payload.name,
        items: [],
        expanded: true,
        displayMode: 'icon-and-name',
        layout: 'vertical',
      };
      return {
        ...state,
        groups: [...state.groups, newGroup],
        activeGroupId: newGroup.id,
      };
    }
    case 'RENAME_GROUP': {
      const { id, name } = action.payload;
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === id ? { ...group, name } : group
        ),
      };
    }
    case 'REMOVE_GROUP': {
      const filteredGroups = state.groups.filter(group => group.id !== action.payload);
      return {
        ...state,
        groups: filteredGroups,
        activeGroupId: filteredGroups.length > 0 ? filteredGroups[0].id : null,
      };
    }
    case 'ADD_ITEM': {
      const { groupId, item } = action.payload;
      const newItem: Item = {
        ...item,
        id: uuidv4(),
      };
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === groupId ? { ...group, items: [...group.items, newItem] } : group
        ),
      };
    }
    case 'REMOVE_ITEM': {
      const { groupId, itemId } = action.payload;
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === groupId
            ? { ...group, items: group.items.filter(item => item.id !== itemId) }
            : group
        ),
      };
    }
    case 'MOVE_ITEM': {
      const { fromGroupId, toGroupId, itemId } = action.payload;
      if (fromGroupId === toGroupId) return state;

      const fromGroup = state.groups.find(group => group.id === fromGroupId);
      if (!fromGroup) return state;

      const item = fromGroup.items.find(item => item.id === itemId);
      if (!item) return state;

      return {
        ...state,
        groups: state.groups.map(group => {
          if (group.id === fromGroupId) {
            return {
              ...group,
              items: group.items.filter(i => i.id !== itemId),
            };
          }
          if (group.id === toGroupId) {
            return {
              ...group,
              items: [...group.items, item],
            };
          }
          return group;
        }),
      };
    }
    case 'REORDER_GROUPS': {
      const { payload: groupIds } = action;
      const reorderedGroups = groupIds.map(id => 
        state.groups.find(group => group.id === id)
      ).filter(Boolean) as Group[];
      
      return {
        ...state,
        groups: reorderedGroups,
      };
    }
    case 'REORDER_ITEMS': {
      const { groupId, itemIds } = action.payload;
      const targetGroup = state.groups.find(group => group.id === groupId);
      
      if (!targetGroup) return state;
      
      const reorderedItems = itemIds
        .map(id => targetGroup.items.find(item => item.id === id))
        .filter(Boolean) as Item[];
      
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === groupId ? { ...group, items: reorderedItems } : group
        ),
      };
    }
    case 'TOGGLE_SEARCH':
      return { 
        ...state, 
        isSearchOpen: action.payload !== undefined ? action.payload : !state.isSearchOpen,
        searchQuery: action.payload === false ? '' : state.searchQuery
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_GROUP_EXPAND': {
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload
            ? { ...group, expanded: !group.expanded }
            : group
        ),
      };
    }
    case 'UPDATE_OPTIONS':
      return { ...state, ...action.payload };
    case 'UPDATE_GROUP_DISPLAY':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, displayMode: action.payload.displayMode }
            : group
        ),
      };
    case 'UPDATE_GROUP_LAYOUT':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, layout: action.payload.layout }
            : group
        ),
      };
    default:
      return state;
  }
}

type SidebarContextType = {
  state: SidebarState;
  dispatch: React.Dispatch<SidebarAction>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'UPDATE_OPTIONS', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved sidebar state', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(state));
  }, [state]);

  // Register Windows Shell integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // In a real desktop app, this would register shell integration
      // For web demo, we'll just handle basic right-click
      const handleContextMenu = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check if the target is a file/folder
        if (target.matches('[data-file-path]')) {
          e.preventDefault();
          
          const filePath = target.getAttribute('data-file-path');
          const fileName = target.getAttribute('data-file-name');
          const fileType = target.getAttribute('data-file-type');
          
          if (filePath && fileName && fileType) {
            dispatch({
              type: 'ADD_ITEM',
              payload: {
                groupId: state.defaultGroup,
                item: {
                  name: fileName,
                  type: fileType as Item['type'],
                  path: filePath,
                },
              },
            });
          }
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [state.defaultGroup]);

  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};