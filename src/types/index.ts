export interface Item {
  id: string;
  name: string;
  type: 'application' | 'document' | 'folder' | 'website';
  path: string;
  icon?: string;
  favIcon?: string;
  category?: string;
}

export interface Group {
  id: string;
  name: string;
  items: Item[];
  expanded?: boolean;
  displayMode: 'icon-only' | 'icon-and-name';
  layout: 'vertical' | 'horizontal';
}

export interface FontSettings {
  family: string;
  size: number;
  weight: number;
}

export interface SidebarState {
  groups: Group[];
  activeGroupId: string | null;
  isVisible: boolean;
  isFixed: boolean;
  position: 'left' | 'right';
  theme: 'light' | 'dark';
  isSearchOpen: boolean;
  searchQuery: string;
  autoHideDelay: number;
  transparency: number;
  autoHideWhenInactive: boolean;
  sortBy: 'manual' | 'name' | 'type' | 'category' | 'last_used';
  confirmDeletion: boolean;
  runAtStartup: boolean;
  checkUpdates: boolean;
  font: FontSettings;
  defaultGroup: string;
}

export type SidebarAction = 
  | { type: 'SET_VISIBLE'; payload: boolean }
  | { type: 'SET_FIXED'; payload: boolean }
  | { type: 'SET_POSITION'; payload: 'left' | 'right' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_ACTIVE_GROUP'; payload: string }
  | { type: 'ADD_GROUP'; payload: Omit<Group, 'id' | 'items'> }
  | { type: 'RENAME_GROUP'; payload: { id: string; name: string } }
  | { type: 'REMOVE_GROUP'; payload: string }
  | { type: 'ADD_ITEM'; payload: { groupId: string; item: Omit<Item, 'id'> } }
  | { type: 'REMOVE_ITEM'; payload: { groupId: string; itemId: string } }
  | { type: 'MOVE_ITEM'; payload: { fromGroupId: string; toGroupId: string; itemId: string } }
  | { type: 'REORDER_GROUPS'; payload: string[] }
  | { type: 'REORDER_ITEMS'; payload: { groupId: string; itemIds: string[] } }
  | { type: 'TOGGLE_SEARCH'; payload?: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_GROUP_EXPAND'; payload: string }
  | { type: 'UPDATE_OPTIONS'; payload: Partial<SidebarState> }
  | { type: 'UPDATE_GROUP_DISPLAY'; payload: { groupId: string; displayMode: Group['displayMode'] } }
  | { type: 'UPDATE_GROUP_LAYOUT'; payload: { groupId: string; layout: Group['layout'] } };