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
  },
};