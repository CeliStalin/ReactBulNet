// src/components/NavMenu/components/MenuItem.tsx
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
  
  const linkStyle = {
    ...(isActive ? navMenuStyles.activeLink : navMenuStyles.normalLink),
    display: 'block',
    padding: '0.5em 0.75em',
    borderRadius: '4px',
    textDecoration: 'none',
    color: isActive ? 'white' : 'inherit',
  };
  
  return (
    <li>
      <a
        href={to}
        className={isActive ? "is-active" : ""}
        style={linkStyle}
        onClick={handleClick}
      >
        {label}
      </a>
    </li>
  );
};