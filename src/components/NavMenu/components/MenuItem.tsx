import React from 'react';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuItemProps {
  to: string;
  label: string | React.ReactNode;
  onClick?: (path: string) => void;
  isActive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ to, label, onClick, isActive }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(to);
  };
  
  return (
    <li>
      <a
        href={to}
        className={isActive ? "is-active" : ""}
        style={isActive ? navMenuStyles.activeLink : navMenuStyles.normalLink}
        onClick={handleClick}
      >
        {label}
      </a>
    </li>
  );
};