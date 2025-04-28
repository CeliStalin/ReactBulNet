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
  const { roles, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [menuError, setMenuError] = useState<string | null>(null);

  const userRoles = useMemo(() => {
    console.log('[NavMenu] Roles originales:', roles);
    return roles.map(role => {
      console.log('[NavMenu] Mapeando rol:', role);
      return role.Rol;
    });
  }, [roles]);
  
  // Verificación de roles específicos - case insensitive
  const isDeveloper = useMemo(() => {
    const normalizedRoles = userRoles.map(role => role.toLowerCase());
    const isDev = normalizedRoles.includes("developers") || 
                  normalizedRoles.includes("developer");
    console.log('[NavMenu] ¿Es desarrollador?', isDev);
    console.log('[NavMenu] Roles disponibles:', userRoles);
    return isDev;
  }, [userRoles]);

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
        console.log('[NavMenu] Cargando menús para roles:', userRoles);
        
        if (userRoles.length === 0) {
          console.log('[NavMenu] No hay roles, no se cargan menús');
          setMenuItems([]);
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          userRoles.map(async (role) => {
            console.log(`[NavMenu] Obteniendo menús para rol: "${role}"`);
            try {
              const items = await ApiGetMenus(role);
              console.log(`[NavMenu] Menús obtenidos para rol "${role}":`, items);
              return items;
            } catch (err) {
              console.error(`[NavMenu] Error al obtener menús para rol "${role}":`, err);
              return null;
            }
          })
        );
        
        const allMenus = results
          .flat()
          .filter((item): item is ElementMenu => item !== null);
        
        console.log('[NavMenu] Todos los menús sin filtrar:', allMenus);
        
        const uniqueMenus = Array.from(
          new Map(allMenus.map(item => [item.Id, item])).values()
        );

        console.log('[NavMenu] Menús únicos cargados:', uniqueMenus);
        setMenuItems(uniqueMenus);
        setMenuError(null);
      } catch (error) {
        console.error("[NavMenu] Error al cargar menús:", error);
        setMenuItems([]);
        setMenuError(error instanceof Error ? error.message : String(error));
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
    console.log('[NavMenu] Click en menú:', { path, title });
    navigate(path);
  };

  const isPathActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Modo de depuración - mostrar información sobre los roles
  const renderDebugInfo = () => {
    if (!import.meta.env.DEV) return null;
    
    return (
      <div style={{ 
        padding: '8px', 
        background: '#f0f0f0', 
        fontSize: '12px',
        marginTop: '8px',
        borderRadius: '4px'
      }}>
        <details>
          <summary style={{ cursor: 'pointer' }}>Info de Depuración</summary>
          <div>
            <p><strong>isSignedIn:</strong> {isSignedIn ? 'Sí' : 'No'}</p>
            <p><strong>Roles:</strong> {userRoles.join(', ') || 'Ninguno'}</p>
            <p><strong>isDeveloper:</strong> {isDeveloper ? 'Sí' : 'No'}</p>
            <p><strong>Menús cargados:</strong> {menuItems.length}</p>
            {menuError && <p style={{ color: 'red' }}><strong>Error:</strong> {menuError}</p>}
          </div>
        </details>
      </div>
    );
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
            {/* Información de depuración */}
            {!isCollapsed && import.meta.env.DEV && renderDebugInfo()}
          
            <ul className="menu-list" style={{ padding: 0 }}>
              {/* Menú Básico - Siempre visible para todos los usuarios */}
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

              {/* Menú de Administración - Visible para todos los usuarios */}
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

              {/* Menú de Aplicaciones - Solo visible si es Developer o tiene menús de API */}
              {(isDeveloper || menuItems.length > 0) && (
                <MenuSection title="Aplicaciones">
                  {/* Menús de ingreso hardcodeados - Solo visibles para desarrolladores */}
                  {isDeveloper && (
                    <>
                      <MenuItem 
                        to="/MnHerederos/ingresoHer"
                        label="Ingreso Herederos"
                        onClick={() => handleMenuClick('/MnHerederos/ingresoHer', "Ingreso Herederos")}
                        isActive={isPathActive('/MnHerederos/ingresoHer')}
                      />
                      <MenuItem 
                        to="/MnHerederos/ingresoDoc"
                        label="Ingreso Documentos"
                        onClick={() => handleMenuClick('/MnHerederos/ingresoDoc', "Ingreso Documentos")}
                        isActive={isPathActive('/MnHerederos/ingresoDoc')}
                      />
                    </>
                  )}
                  
                  {/* Menús cargados dinámicamente de la API */}
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
              
              {/* Sección de herramientas de desarrollo - Visible para todos */}
              <MenuSection title="Herramientas">
                <MenuItem 
                  to="/tools" 
                  label="Herramientas Generales" 
                  onClick={() => handleMenuClick('/tools')} 
                  isActive={isPathActive('/tools')}
                />
                <MenuItem 
                  to="/settings" 
                  label="Configuración" 
                  onClick={() => handleMenuClick('/settings')} 
                  isActive={isPathActive('/settings')}
                />
              </MenuSection>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NavMenuApp;