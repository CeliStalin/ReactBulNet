import { theme } from '../../styles/theme';

export const navMenuStyles = {
  container: (isCollapsed: boolean) => ({
    width: isCollapsed ? '50px' : '220px',
    position: 'fixed' as const,
    left: 0,
    top: '4rem', // Ajustado para que comience después del header
    height: 'calc(100vh - 4rem)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Transición más suave
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    zIndex: 100,
    padding: isCollapsed ? '0' : '1rem',
    boxShadow: isCollapsed ? 'none' : '2px 0 5px rgba(0, 0, 0, 0.1)', // Añadir sombra cuando está expandido
  }),
  
  menuLabel: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centramos el contenido
    padding: '0.75rem',
    margin: 0,
  },
  
  menuIcon: (isCollapsed: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    width: '24px',
    height: '24px',
    transition: 'transform 0.3s ease',
    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', // Añadir rotación al ícono
  }),
  
  menuContent: (isCollapsed: boolean) => ({
    opacity: isCollapsed ? 0 : 1,
    visibility: isCollapsed ? 'hidden' as const : 'visible' as const,
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    padding: isCollapsed ? '0' : '0 0.5rem',
  }),
  
  activeLink: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    transition: 'background-color 0.2s ease-in-out',
  },
  
  normalLink: {
    transition: 'background-color 0.2s ease-in-out',
  },
  
  sectionTitle: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75em 0.5em',
    userSelect: 'none' as const,
    color: '#333',
    fontWeight: 'bold',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  
  sectionArrow: (isExpanded: boolean) => ({
    fontSize: '12px',
    transition: 'transform 0.3s ease',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    color: theme.colors.primary,
  }),
  
  sectionContent: (isExpanded: boolean) => ({
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
    maxHeight: isExpanded ? '500px' : '0',
    opacity: isExpanded ? 1 : 0,
  })
};