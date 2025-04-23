import React, { useEffect, useState } from "react";
import { ApiGetMenus } from "../../services/GetApiArq";
import { ElementMenu } from "../../interfaces/IMenusElementos";
import useAuth from "../../hooks/useAuth";
import { navMenuStyles } from './styles/navMenu.styles';
import { MenuItem } from './components/MenuItem';
import { MenuSection } from './components/MenuSection';

interface NavMenuAppProps {
  onToggle?: (collapsed: boolean) => void;
}

const NavMenuApp: React.FC<NavMenuAppProps> = ({ onToggle }) => {
  const { roles } = useAuth();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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

  if (loading) return <p>Cargando menú...</p>;

  return (
    <div className="columns is-gapless">
      <div 
        className="column is-one-fifth has-background-light" 
        style={navMenuStyles.container(isCollapsed)}
      >
        <aside className="menu p-4">
          <p 
            className="menu-label" 
            style={navMenuStyles.menuLabel}
            onClick={handleToggle}
          >
            {!isCollapsed && <span>Menú</span>}
            <span style={navMenuStyles.menuIcon(isCollapsed)}>
              {isCollapsed ? '☰' : '◀'}
            </span>
          </p>
          
          {!isCollapsed && (
            <ul className="menu-list">
              <MenuSection>
                <MenuItem to="/" label="Inicio" />
                <MenuItem to="/profile" label="Mi Perfil" />
              </MenuSection>

              {isAdmin && (
                <MenuSection title="Administración">
                  <MenuItem to="/admin" label="Panel de Admin" />
                  <MenuItem to="/dashboard" label="Dashboard" />
                </MenuSection>
              )}

              {menuItems.length > 0 && (
                <MenuSection title="Aplicaciones">
                  {menuItems.map((item) => (
                    <MenuItem 
                      key={item.Id} 
                      to={item.Controlador} 
                      label={item.Descripcion} 
                    />
                  ))}
                </MenuSection>
              )}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default NavMenuApp;