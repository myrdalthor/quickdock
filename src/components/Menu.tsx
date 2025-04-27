import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

type MenuState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const MenuContext = createContext<MenuState | undefined>(undefined);

export function useMenuState(): MenuState {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
}

interface MenuButtonProps {
  state: MenuState;
  children: React.ReactNode;
  className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ state, children, className }) => {
  return (
    <button 
      onClick={(e) => { 
        e.stopPropagation();
        state.toggle();
      }}
      className={className}
    >
      {children}
    </button>
  );
};

interface MenuListProps {
  state: MenuState;
  children: React.ReactNode;
  className?: string;
}

export const MenuList: React.FC<MenuListProps> = ({ state, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useOutsideClick(ref, () => {
    if (state.isOpen) {
      state.close();
    }
  });
  
  if (!state.isOpen) return null;
  
  return (
    <MenuContext.Provider value={state}>
      <div 
        ref={ref}
        className={`absolute right-0 mt-1 ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
};

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ children, onClick, className }) => {
  const menuContext = useContext(MenuContext);
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};