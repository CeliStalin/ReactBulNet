import React, { useEffect, useState, useMemo } from "react";
import { ApiGetMenus } from "../../services/GetApiArq";
import { ElementMenu } from "../../interfaces/IMenusElementos";
import useAuth from "../../hooks/useAuth";
import { navMenuStyles } from '../NavMenu/styles/navMenu.styles';
import { MenuItem } from '../NavMenu/components/MenuItem';
import { MenuSection } from '../NavMenu/components/MenuSection';

interface NavMenuAppProps {
  onToggle?: (collapsed: boolean) => void;
  onMenuItemClick?: (path: string, title?: string) => void;
}

const NavMenuApp: React.FC<NavMenuAppProps> = ({ onToggle, onMenuItemClick }) => {
  const { roles } = useAuth();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('/');

  // Usamos useMemo para evitar que userRoles se recree en cada render
  const userRoles = useMemo(() => roles.map(role => role.Rol), [roles]);
  const isAdmin = userRoles.includes("ADMIN");

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

        console.log('Menús cargados:', uniqueMenus); // Debug
        setMenuItems(uniqueMenus);
      } catch (error) {
        console.error("Error al cargar menús:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [userRoles.join(',')]); // Cambiamos la dependencia para que solo se ejecute cuando cambie el contenido de userRoles

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle?.(newState);
  };

  const handleMenuClick = (itemId: number | string, path: string, title?: string) => {
    console.log('NavMenuApp - handleMenuClick:', { itemId, path, title }); // Debug
    
    // Establecer el path actual
    setCurrentPath(`${path}_${itemId}`);
    
    // Navegar según el título del menú
    if (title === "Ingreso Herederos") {
      console.log('Navegando a Ingreso Herederos');
      onMenuItemClick?.("/MnHerederos/ingresoHer", title);
    } else if (title === "Ingreso Documentos") {
      console.log('Navegando a Ingreso Documentos');
      onMenuItemClick?.("/MnHerederos/ingresoDoc", title);
    } else {
      onMenuItemClick?.(path, title);
    }
  };

  if (loading) return <p>Cargando menú...</p>;

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
            <span style={navMenuStyles.menuIcon()}>
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
                  onClick={() => handleMenuClick('inicio', '/', "Inicio")} 
                  currentPath={currentPath} 
                />
                <MenuItem 
                  to="/profile" 
                  label="Mi Perfil" 
                  onClick={() => handleMenuClick('profile', '/profile', "Mi Perfil")} 
                  currentPath={currentPath} 
                />
              </MenuSection>

              {isAdmin && (
                <MenuSection title="Administración">
                  <MenuItem 
                    to="/admin" 
                    label="Panel de Admin" 
                    onClick={() => handleMenuClick('admin', '/admin', "Panel de Administración")} 
                    currentPath={currentPath} 
                  />
                  <MenuItem 
                    to="/dashboard" 
                    label="Dashboard" 
                    onClick={() => handleMenuClick('dashboard', '/dashboard', "Dashboard")} 
                    currentPath={currentPath} 
                  />
                </MenuSection>
              )}

              {menuItems.length > 0 && (
                <MenuSection title="Aplicaciones">
                  {menuItems.map((item) => {
                    const uniqueKey = `${item.Id}_${item.Nombre}`;
                    
                    return (
                      <MenuItem 
                        key={uniqueKey} 
                        to={`${item.Controlador}_${item.Id}`} 
                        label={item.Descripcion}
                        onClick={() => handleMenuClick(item.Id, item.Controlador, item.Descripcion)}
                        currentPath={currentPath}
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