import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuItemProps {
  to: string;
  label: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li>
      <Link
        to={to}
        className={isActive ? "is-active" : ""}
        style={isActive ? navMenuStyles.activeLink : {}}
      >
        {label}
      </Link>
    </li>
  );
};