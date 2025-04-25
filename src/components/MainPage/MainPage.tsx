import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Layout } from "../Layout/Layout";
import { DashboardContent } from "./components/DashboardContent";
import { MainContent } from "./components/MainContent";
import './styles/animations.css';

// Interfaz para los títulos de las páginas
interface PageTitles {
  [key: string]: string;
}

const pageTitles: PageTitles = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/profile': 'Mi Perfil',
  '/admin': 'Panel de Administración',
  '/MnHerederos/ingresoHer': 'Ingreso Herederos',
  '/MnHerederos/ingresoDoc': 'Ingreso Documentos'
};

const Mainpage: React.FC = () => {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const userRoles = roles.map(role => role.Rol);
  const [activeContent, setActiveContent] = useState<'main' | 'dashboard'>('main');
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleMenuClick = (path: string, title?: string) => {
    console.log('MainPage - handleMenuClick:', { path, title }); // Debug
    
    // Actualizar el título de la página
    setCurrentPageTitle(title || pageTitles[path] || '');

    // Navegar según la ruta
    if (path === '/MnHerederos/ingresoHer' || path === '/MnHerederos/ingresoDoc') {
      console.log('Navegando a:', path); // Debug
      navigate(path);
      return;
    }

    // Para la página de inicio
    if (path === '/') {
      if (activeContent !== 'main') {
        if (contentRef.current) {
          contentRef.current.style.animation = 'fadeOutDown 0.3s ease-in forwards';
        }
        
        setTimeout(() => {
          setActiveContent('main');
          
          if (contentRef.current) {
            contentRef.current.style.animation = 'fadeInUp 0.3s ease-out forwards';
          }
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.animation = '';
            }
          }, 300);
        }, 300);
      }
      return;
    }

    // Para el dashboard
    if (path === '/dashboard') {
      if (activeContent !== 'dashboard') {
        if (contentRef.current) {
          contentRef.current.style.animation = 'fadeOutDown 0.3s ease-in forwards';
        }
        
        setTimeout(() => {
          setActiveContent('dashboard');
          
          if (contentRef.current) {
            contentRef.current.style.animation = 'fadeInUp 0.3s ease-out forwards';
          }
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.animation = '';
            }
          }, 300);
        }, 300);
      }
      return;
    }
  };
  
  return (
    <Layout onMenuClick={handleMenuClick} pageTitle={currentPageTitle}>
      <div 
        ref={contentRef}
        className="content-container"
        style={{ minHeight: '400px' }}
      >
        {activeContent === 'main' ? (
          <MainContent />
        ) : (
          <DashboardContent userRoles={userRoles} />
        )}
      </div>
    </Layout>
  );
};

export { Mainpage };