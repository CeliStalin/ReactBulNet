import React from 'react';

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => {
  return (
    <>
      {title && <p className="menu-label mt-4">{title}</p>}
      {children}
    </>
  );
};