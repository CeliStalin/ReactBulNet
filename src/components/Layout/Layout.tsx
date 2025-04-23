import React, { useState } from 'react';
import { Header } from './components/Header';
import NavMenuApp from '../NavMenu/NavMenuApp';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  
  const handleMenuToggle = (collapsed: boolean) => {
    setIsMenuCollapsed(collapsed);
  };
  
  return (
    <div className="layout">
      <Header 
        logoUrl="https://www.consalud.cl/assets/img/iconos/logo-consalud-bgwhite.png"
        altText="Consalud Logo"
      />
      
      <div className="layout-body" style={{ paddingTop: "4rem", display: "flex" }}>
        <NavMenuApp onToggle={handleMenuToggle} />
        
        <main style={{ 
          marginLeft: isMenuCollapsed ? "60px" : "220px", 
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