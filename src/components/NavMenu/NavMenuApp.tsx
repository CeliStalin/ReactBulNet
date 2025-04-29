import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ApiGetMenus } from "../../services/GetApiArq";
import { ElementMenu } from "../../interfaces/IMenusElementos";
import useAuth from "../../hooks/useAuth";
import { navMenuStyles } from './styles/navMenu.styles';
import { MenuItem } from './components/MenuItem';
import { MenuSection } from './components/MenuSection';
import { LoadingDots } from '../Login/components/LoadingDots';
import { theme } from '../styles/theme';

interface NavMenuAppProps {
  onToggle?: (collapsed: boolean) => void;
}

const NavMenuApp: React.FC<NavMenuAppProps> = ({ onToggle }) => {
  const { roles, isSignedIn } = useAuth();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  
  const prevPathRef = useRef(location.pathname);

  // Verificar si el usuario tiene el rol Developers
  const hasDevelopersRole = useMemo(() => {
    return roles.some(role => role.Rol === "Developers");
  }, [roles]);

  useEffect(() => {
    if (onToggle) {
      onToggle(true);
    }
  }, [onToggle]);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname && prevPathRef.current !== '') {
      prevPathRef.current = location.pathname;
    } else {
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (roles.length === 0) {
          setMenuItems([]);
          setLoading(false);
          return;
        }
  
        // Solo cargar menús si el usuario tiene el rol Developers
        if (hasDevelopersRole) {
          const items = await ApiGetMenus("Developers");
          // Filtrar los elementos problemáticos "IngresoDoc" e "IngresoHer"
          const filteredItems = (items || []).filter(item => 
            !item.Nombre?.includes("IngresoDoc") && 
            !item.Nombre?.includes("IngresoHer") &&
            !item.Controlador?.includes("IngresoDoc") && 
            !item.Controlador?.includes("IngresoHer")
          );
          setMenuItems(filteredItems);
        } else {
          // Si no tiene rol Developers, dejar el menú vacío
          setMenuItems([]);
        }
      } catch (error) {
        setMenuItems([]);
        console.error("Error al cargar menús:", error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };
  
    fetchMenu();
  }, [hasDevelopersRole, roles]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const isPathActive = (path: string): boolean => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div 
        className="columns is-gapless"
        style={{
          width: '220px',
          position: 'fixed',
          left: 0,
          top: '4rem',
          height: 'calc(100vh - 4rem)',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <LoadingDots size="small" color={theme.colors.primary} />
          <span style={{ 
            color: theme.colors.gray.dark, 
            fontSize: theme.typography.fontSize.sm 
          }}>
            Cargando menú...
          </span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar el menú
  if (!isSignedIn) {
    return null;
  }

  // Opciones fijas para el menú de Herederos (estas son las que funcionan correctamente)
  const menuHerederos = [
    {
      path: "/MnHerederos/ingresoHer",
      label: "Ingreso Herederos"
    },
    {
      path: "/MnHerederos/ingresoDoc",
      label: "Ingreso Documentos"
    }
  ];

  return (
    <div className="columns is-gapless">
      <div 
        className="column has-background-light" 
        style={navMenuStyles.container(isCollapsed)}
      >
        <aside className="menu">
          <p 
            className="menu-label" 
            style={navMenuStyles.menuLabel}
            onClick={handleToggle}
          >
            <span style={navMenuStyles.menuIcon(isCollapsed)}>
              ☰
            </span>
            {!isCollapsed && <span style={{ marginLeft: '10px' }}>Menú</span>}
          </p>
          
          <div style={navMenuStyles.menuContent(isCollapsed)}>
            <ul className="menu-list" style={{ padding: 0 }}>
              {/* Menú Básico - Inicio (visible para todos los roles) */}
              <MenuSection>
                <MenuItem 
                  to="/home" 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      Inicio
                    </span>
                  }
                  isActive={isPathActive('/home')}
                />
              </MenuSection>

              {/* Menú de Aplicaciones - Solo visible para rol Developers */}
              {hasDevelopersRole && (
                <MenuSection title="Aplicaciones">
                  {/* SIEMPRE mostrar las opciones que funcionan */}
                  {menuHerederos.map((item, index) => (
                    <MenuItem 
                      key={`herederos-${index}`}
                      to={item.path}
                      label={item.label}
                      isActive={isPathActive(item.path)}
                    />
                  ))}
                  
                  {/* Mostrar el resto de los elementos de la API (si hay) */}
                  {menuItems && menuItems.length > 0 && menuItems.map((item) => (
                    <MenuItem 
                      key={item.Id}
                      to={item.Controlador}
                      label={item.Nombre}
                      isActive={isPathActive(item.Controlador)}
                    />
                  ))}
                </MenuSection>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NavMenuApp;