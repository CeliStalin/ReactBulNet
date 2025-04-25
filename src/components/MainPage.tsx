import React, { useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Layout } from "./Layout/Layout";
import { DashboardContent } from "./MainPage/components/DashboardContent";
import { MainContent } from "./MainPage/components/MainContent";
import './MainPage/styles/animations.css';

// Interfaz para los títulos de las páginas
interface PageTitles {
  [key: string]: string;
}

const pageTitles: PageTitles = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/profile': 'Mi Perfil',
  '/admin': 'Panel de Administración',
  // Añade más títulos según tus rutas
};

const Mainpage: React.FC = () => {
  const { roles } = useAuth();
  const userRoles = roles.map(role => role.Rol);
  const [activeContent, setActiveContent] = useState<'main' | 'dashboard'>('main');
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleMenuClick = (path: string, title?: string) => {
    // Actualizar el título de la página: usar el título proporcionado o buscar en el mapa
    setCurrentPageTitle(title || pageTitles[path] || '');

    if ((path === '/dashboard' && activeContent === 'dashboard') || 
        (path === '/' && activeContent === 'main')) {
      return; // No animar si ya estamos en la misma página
    }
    
    // Primero aplicamos la animación de salida
    if (contentRef.current) {
      contentRef.current.style.animation = 'fadeOutDown 0.3s ease-in forwards';
    }

    // Esperamos a que termine la animación de salida antes de cambiar el contenido
    setTimeout(() => {
      if (path === '/dashboard') {
        setActiveContent('dashboard');
      } else if (path === '/') {
        setActiveContent('main');
      }
      
      // Aplicamos la animación de entrada
      if (contentRef.current) {
        contentRef.current.style.animation = 'fadeInUp 0.3s ease-out forwards';
      }
      
      // Limpiamos el estado de animación
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.animation = '';
        }
      }, 300);
    }, 300);
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