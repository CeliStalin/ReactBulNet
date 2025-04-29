import React, { useState } from 'react';
import { navMenuStyles } from '../styles/navMenu.styles';

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  if (!title) {
    return <>{children}</>;
  }

  return (
    <>
      <p 
        className="menu-label mt-4" 
        style={navMenuStyles.sectionTitle}
        onClick={toggleSection}
      >
        <span>{title}</span>
        <span style={navMenuStyles.sectionArrow(isExpanded)}>
          ▶
        </span>
      </p>
      <div style={navMenuStyles.sectionContent(isExpanded)}>
        {children}
      </div>
    </>
  );
};