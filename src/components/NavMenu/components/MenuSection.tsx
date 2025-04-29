import React, { useState } from 'react';
import { navMenuStyles } from '../styles/navMenu.styles';
import { theme } from '../../styles/theme';

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  if (!title) {
    return <>{children}</>;
  }

  return (
    <>
      <p 
        className="menu-label mt-3" 
        style={{
          ...navMenuStyles.sectionTitle,
          backgroundColor: isHovered ? '#f0f0f0' : 'transparent', // Solo cambia a gris en hover
          padding: '8px 12px', // Mismo padding que los ítems del menú para consistencia
          borderRadius: '4px',
        }}
        onClick={toggleSection}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{title}</span>
        <span style={{
          fontSize: '10px',
          transition: 'transform 0.3s ease',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          color: theme.colors.primary,
        }}>
          ▶
        </span>
      </p>
      <div style={navMenuStyles.sectionContent(isExpanded)}>
        {children}
      </div>
    </>
  );
};