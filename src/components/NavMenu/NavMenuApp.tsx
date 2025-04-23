import React, { useEffect, useState } from "react";
import { ApiGetMenus } from "../../services/GetApiArq";
import { ElementMenu } from "../../interfaces/IMenusElementos";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface NavMenuAppProps {
  onToggle?: (collapsed: boolean) => void;
}

const NavMenuApp: React.FC<NavMenuAppProps> = ({ onToggle }) => {
  const location = useLocation();
  const { roles } = useAuth();
  const [menuItems, setMenuItems] = useState<ElementMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const roleNames = roles.map(role => role.Rol);
    setUserRoles(roleNames);
  }, [roles]);

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

  const isAdmin = userRoles.includes("ADMIN");

  if (loading) return <p>Cargando menú...</p>;

  return (
    <div className="columns is-gapless">
      <div 
        className="column is-one-fifth has-background-light" 
        style={{ 
          minWidth: isCollapsed ? '60px' : '200px', 
          position: 'absolute', 
          left: 0,
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden'
        }}
      >
        <aside className="menu p-4">
          <p 
            className="menu-label" 
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              if (onToggle) {
                onToggle(!isCollapsed);
              }
            }}
          >
            {!isCollapsed && <span>Menú</span>}
            <span style={{ marginLeft: isCollapsed ? '0' : '10px' }}>
              {isCollapsed ? '☰' : '◀'}
            </span>
          </p>
          
          {!isCollapsed && (
            <ul className="menu-list">
              {/* Menú comun para todos los usuarios */}
              <li>
                <Link
                  to="/"
                  className={location.pathname === "/" ? "is-active" : ""}
                  style={{
                    backgroundColor: location.pathname === "/" ? '#00cbbf' : '',
                    color: location.pathname === "/" ? 'white' : '',
                  }}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={location.pathname === "/profile" ? "is-active" : ""}
                  style={{
                    backgroundColor: location.pathname === "/profile" ? '#00cbbf' : '',
                    color: location.pathname === "/profile" ? 'white' : '',
                  }}
                >
                  Mi Perfil
                </Link>
              </li>

              {/* Menu solo para adm*/}
              {isAdmin && (
                <>
                  <p className="menu-label mt-4">Administración</p>
                  <li>
                    <Link
                      to="/admin"
                      className={location.pathname === "/admin" ? "is-active" : ""}
                      style={{
                        backgroundColor: location.pathname === "/admin" ? '#00cbbf' : '',
                        color: location.pathname === "/admin" ? 'white' : '',
                      }}
                    >
                      Panel de Admin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className={location.pathname === "/dashboard" ? "is-active" : ""}
                      style={{
                        backgroundColor: location.pathname === "/dashboard" ? '#00cbbf' : '',
                        color: location.pathname === "/dashboard" ? 'white' : '',
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}

              {/* Elementos de menu dinámicos desde la API */}
              {menuItems.length > 0 && (
                <>
                  <p className="menu-label mt-4">Aplicaciones</p>
                  {menuItems.map((item) => (
                    <li key={item.Id}>
                      <Link
                        to={item.Controlador}
                        className={location.pathname === item.Controlador ? "is-active" : ""}
                        style={{
                          backgroundColor: location.pathname === item.Controlador ? '#00cbbf' : '',
                          color: location.pathname === item.Controlador ? 'white' : '',
                        }}
                      >
                        {item.Descripcion}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default NavMenuApp;