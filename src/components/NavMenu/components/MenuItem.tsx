import React from 'react';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuItemProps {
  to: string;
  label: string;
  onClick?: (path: string) => void;
  currentPath?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ to, label, onClick, currentPath }) => {
  const isActive = currentPath === to;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(to);
  };
  
  return (
    <li>
      <a
        href={to}
        className={isActive ? "is-active" : ""}
        style={isActive ? navMenuStyles.activeLink : {}}
        onClick={handleClick}
      >
        {label}
      </a>
    </li>
  );
};