import { theme } from '../../../styles/theme';

export const navMenuStyles = {
  container: (isCollapsed: boolean) => ({
    width: isCollapsed ? '50px' : '220px',
    position: 'fixed' as const,
    left: 0,
    top: '4rem', 
    height: 'calc(100vh - 4rem)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9', 
    zIndex: 100,
    padding: isCollapsed ? '0' : '1rem',
    boxShadow: isCollapsed ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.07)',
  }),
  
  menuLabel: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    margin: 0,
    color: '#555',
    fontWeight: 500,
    backgroundColor: 'transparent', 
    borderRadius: '4px',
  },
  
  menuIcon: (isCollapsed: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    width: '24px',
    height: '24px',
    transition: 'transform 0.3s ease',
    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
    color: theme.colors.primary,
  }),
  
  menuContent: (isCollapsed: boolean) => ({
    opacity: isCollapsed ? 0 : 1,
    visibility: isCollapsed ? 'hidden' as const : 'visible' as const,
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    padding: isCollapsed ? '0' : '0 0.5rem',
  }),
  
  // Estilo para elementos activos del menú
  activeLink: {
    backgroundColor: theme.colors.primary + '10', // Color primario con 10% de opacidad
    color: theme.colors.primary,
    fontWeight: 500,
    borderLeft: `3px solid ${theme.colors.primary}`,
    transition: 'all 0.2s ease-in-out',
    borderRadius: '4px',
  },
  
  // Estilo normal para elementos de menú 
  normalLink: {
    color: '#444',
    transition: 'all 0.2s ease-in-out',
    borderLeft: '3px solid transparent',
    backgroundColor: 'transparent', // Transparente para que se vea el fondo del menú
    borderRadius: '4px',
  },
  
  sectionTitle: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75em 0.5em',
    userSelect: 'none' as const,
    color: '#666',
    fontSize: '13px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    backgroundColor: 'transparent', // Transparente para que se vea el fondo del menú
  },
  
  sectionArrow: (isExpanded: boolean) => ({
    fontSize: '10px',
    transition: 'transform 0.3s ease',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    color: theme.colors.primary,
  }),
  
  sectionContent: (isExpanded: boolean) => ({
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
    maxHeight: isExpanded ? '500px' : '0',
    opacity: isExpanded ? 1 : 0,
  }),

  // Estilos adicionales para los enlaces del menú
  menuItem: {
    display: 'block',
    padding: '10px 12px',
    borderRadius: '4px',
    margin: '2px 0',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 400,
    transition: 'all 0.2s ease',
  },
  
  // Estilos para el estado hover
  menuItemHover: {
    backgroundColor: '#f0f0f0', // Gris claro para hover
    color: theme.colors.primary,
  }
};