import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const { roles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const userRoles = useMemo(() => roles.map(role => role.Rol), [roles]);
  const isAdmin = userRoles.includes("ADMIN");

  // Detectar cambios de ruta y colapsar automáticamente
  useEffect(() => {
    const shouldAutoCollapse = () => {
      // Solo colapsar automáticamente si el menú está expandido
      if (!isCollapsed) {
        const newState = true;
        setIsCollapsed(newState);
        onToggle?.(newState);
      }
    };

    // Colapsar cuando cambia la ubicación
    shouldAutoCollapse();
  }, [location.pathname]); // Dependencia al pathname para detectar cambios de ruta

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (userRoles.length === 0) {
          setMenuItems([]);
          setLoading(false);
          return;
        }

        const results = await Promise.all(userRoles.map(role => ApiGetMenus(role)));
        const allMenus = results.flat().filter((item): item is ElementMenu => item !== null);
        const uniqueMenus = Array.from(
          new Map(allMenus.map(item => [item.Id, item])).values()
        );

        console.log('Menús cargados:', uniqueMenus);
        setMenuItems(uniqueMenus);
      } catch (error) {
        console.error("Error al cargar menús:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [userRoles]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle?.(newState);
  };

  const handleMenuClick = (path: string, title?: string) => {
    console.log('NavMenuApp - handleMenuClick:', { path, title });
    navigate(path);
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
              <MenuSection>
                <MenuItem 
                  to="/" 
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
                  onClick={() => handleMenuClick('/', "Inicio")} 
                  isActive={isPathActive('/')}
                />
                <MenuItem 
                  to="/profile" 
                  label="Mi Perfil" 
                  onClick={() => handleMenuClick('/profile', "Mi Perfil")} 
                  isActive={isPathActive('/profile')}
                />
              </MenuSection>

              {isAdmin && (
                <MenuSection title="Administración">
                  <MenuItem 
                    to="/admin" 
                    label="Panel de Admin" 
                    onClick={() => handleMenuClick('/admin', "Panel de Administración")} 
                    isActive={isPathActive('/admin')}
                  />
                  <MenuItem 
                    to="/dashboard" 
                    label="Dashboard" 
                    onClick={() => handleMenuClick('/dashboard', "Dashboard")} 
                    isActive={isPathActive('/dashboard')}
                  />
                </MenuSection>
              )}

              {menuItems.length > 0 && (
                <MenuSection title="Aplicaciones">
                  {menuItems.map((item) => {
                    let navigatePath = '';
                    
                    // Determinar la ruta correcta basada en el título
                    if (item.Descripcion?.toLowerCase().includes("herederos") && 
                        item.Descripcion?.toLowerCase().includes("ingreso")) {
                      navigatePath = "/MnHerederos/ingresoHer";
                    } else if (item.Descripcion?.toLowerCase().includes("documentos") && 
                               item.Descripcion?.toLowerCase().includes("ingreso")) {
                      navigatePath = "/MnHerederos/ingresoDoc";
                    } else {
                      navigatePath = `/${item.Controlador}/${item.Id}`;
                    }
                    
                    return (
                      <MenuItem 
                        key={item.Id} 
                        to={navigatePath} 
                        label={item.Descripcion}
                        onClick={() => handleMenuClick(navigatePath, item.Descripcion)}
                        isActive={isPathActive(navigatePath)}
                      />
                    );
                  })}
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