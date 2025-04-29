import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import NavMenuApp from '../NavMenu/NavMenuApp';
import logoIcon from '../../assets/Logo.png';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

// Mapa de rutas a títulos de página
const pageTitles: { [key: string]: string } = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/profile': 'Mi Perfil',
  '/admin': 'Panel de Administración',
  '/MnHerederos/ingresoHer': 'Ingreso Herederos',
  '/MnHerederos/ingresoDoc': 'Ingreso Documentos'
};

export const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const location = useLocation();
  
  const handleMenuToggle = (collapsed: boolean) => {
    setIsMenuCollapsed(collapsed);
  };
  
  // Determinar el título basado en la ubicación actual si no se proporciona uno
  const currentPageTitle = pageTitle || pageTitles[location.pathname] || '';
  
  return (
    <div className="layout">
      <Header 
        logoUrl={logoIcon}
        altText="Consalud Logo"
        pageTitle={currentPageTitle}
      />
      
      <div className="layout-body" style={{ paddingTop: "4rem", display: "flex" }}>
        <NavMenuApp 
          onToggle={handleMenuToggle}
        />
        
        <main style={{ 
          marginLeft: isMenuCollapsed ? "50px" : "220px", 
          padding: "20px", 
          width: "100%",
          transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Igual animación que el menú
          minHeight: 'calc(100vh - 4rem)' 
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};