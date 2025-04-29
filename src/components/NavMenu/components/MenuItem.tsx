import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuItemProps {
  to: string;
  label: string | React.ReactNode;
  isActive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ to, label, isActive }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (to && to.trim() !== '') {
      navigate(to, { replace: false });
    } else {
      console.warn("MenuItem: Intento de navegación a una ruta vacía");
    }
  };
  
  const getStyle = () => {
    // Si es el elemento activo, usamos el estilo activo con borde verde
    if (isActive) {
      return {
        ...navMenuStyles.menuItem,
        ...navMenuStyles.activeLink,
        paddingLeft: '9px', // Compensa el borde izquierdo de 3px
      };
    }
    
    // Si está en hover, aplicamos un fondo gris claro
    if (isHovered) {
      return {
        ...navMenuStyles.menuItem,
        ...navMenuStyles.normalLink,
        backgroundColor: '#f0f0f0', // Cambia a gris claro solo en hover
        borderLeft: `3px solid ${navMenuStyles.menuItemHover.backgroundColor}`,
        paddingLeft: '9px', // Compensa el borde izquierdo de 3px
        color: navMenuStyles.menuItemHover.color,
      };
    }
    
    // Estado normal (no activo, no hover): fondo transparente igual al fondo del menú
    return {
      ...navMenuStyles.menuItem,
      ...navMenuStyles.normalLink,
      backgroundColor: '#f9f9f9', // Mismo color que el fondo del menú
      paddingLeft: '12px',
    };
  };
  
  return (
    <li>
      <a
        href={to}
        className={isActive ? "is-active" : ""}
        style={getStyle()}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {label}
      </a>
    </li>
  );
};