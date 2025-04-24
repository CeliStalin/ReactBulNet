// src/components/NavMenu/styles/navMenu.styles.ts
import { theme } from '../../styles/theme';

export const navMenuStyles = {
  container: (isCollapsed: boolean) => ({
    minWidth: isCollapsed ? '60px' : '200px',
    position: 'absolute' as const,
    left: 0,
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
  }),
  
  menuLabel: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  menuIcon: (isCollapsed: boolean) => ({
    marginLeft: isCollapsed ? '0' : '10px',
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
    padding: '0.5em 0',
    userSelect: 'none' as const,
    color: '#333',
    fontWeight: 'bold',
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
    marginLeft: '0.75rem',
  })
};