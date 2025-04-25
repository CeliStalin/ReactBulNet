import React, { useState } from 'react';
import { Header } from './components/Header';
import NavMenuApp from '../NavMenu/NavMenuApp';
import logoIcon from '../../assets/Logo.png';

interface LayoutProps {
  children: React.ReactNode;
  onMenuClick?: (path: string, title?: string) => void;
  pageTitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onMenuClick, pageTitle }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  
  const handleMenuToggle = (collapsed: boolean) => {
    setIsMenuCollapsed(collapsed);
  };
  
  const handleMenuItemClick = (path: string, title?: string) => {
    console.log('Layout - Menu item clicked:', path, title); // Debug
    if (onMenuClick) {
      onMenuClick(path, title);
    }
  };
  
  return (
    <div className="layout">
      <Header 
        logoUrl={logoIcon}
        altText="Consalud Logo"
        pageTitle={pageTitle}
      />
      
      <div className="layout-body" style={{ paddingTop: "4rem", display: "flex" }}>
        <NavMenuApp 
          onToggle={handleMenuToggle}
          onMenuItemClick={handleMenuItemClick}
        />
        
        <main style={{ 
          marginLeft: isMenuCollapsed ? "50px" : "220px", 
          padding: "20px", 
          width: "100%",
          transition: "margin-left 0.3s ease-in-out"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};