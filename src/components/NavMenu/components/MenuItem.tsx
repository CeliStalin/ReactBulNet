import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuItemProps {
  to: string;
  label: string | React.ReactNode;
  isActive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ to, label, isActive }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Verificar que la ruta no esté vacía
    if (to && to.trim() !== '') {
      // Mostrar mensaje detallado en consola para depuración
      console.log(`MenuItem: Navegando a ruta: "${to}"`);
      
      // Navegar explícitamente a la ruta exacta
      navigate(to, { replace: false });
    } else {
      console.warn("MenuItem: Intento de navegación a una ruta vacía");
    }
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