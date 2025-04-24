import React, { useEffect, useState } from "react";
import { ApiGetMenus } from "../../services/GetApiArq";
import { ElementMenu } from "../../interfaces/IMenusElementos";
import useAuth from "../../hooks/useAuth";
import { navMenuStyles } from './styles/navMenu.styles';
import { MenuItem } from './components/MenuItem';
import { MenuSection } from './components/MenuSection';

interface NavMenuAppProps {
  onToggle?: (collapsed: boolean) => void;
  onMenuItemClick?: (path: string) => void;
}

const NavMenuApp: React.FC<NavMenuAppProps> = ({ onToggle, onMenuItemClick }) => {
  const { roles } = useAuth();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('/');

  const userRoles = roles.map(role => role.Rol);
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

  const handleMenuClick = (path: string) => {
    setCurrentPath(path);
    onMenuItemClick?.(path);
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
                <MenuItem to="/" label="Inicio" onClick={handleMenuClick} currentPath={currentPath} />
                <MenuItem to="/profile" label="Mi Perfil" onClick={handleMenuClick} currentPath={currentPath} />
              </MenuSection>

              {isAdmin && (
                <MenuSection title="Administración">
                  <MenuItem to="/admin" label="Panel de Admin" onClick={handleMenuClick} currentPath={currentPath} />
                  <MenuItem to="/dashboard" label="Dashboard" onClick={handleMenuClick} currentPath={currentPath} />
                </MenuSection>
              )}

              {menuItems.length > 0 && (
                <MenuSection title="Aplicaciones">
                  {menuItems.map((item) => (
                    <MenuItem 
                      key={item.Id} 
                      to={item.Controlador} 
                      label={item.Descripcion}
                      onClick={handleMenuClick}
                      currentPath={currentPath}
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