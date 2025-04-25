import { theme } from '../../styles/theme';

export const headerStyles = {
  container: {
    backgroundColor: theme.colors.primary,
    padding: '0.8rem',
    width: '100%',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  logo: {
    height: '50px',
    width: 'auto',
    marginLeft: '1rem',
  },
  
  separator: {
    color: 'white',
    margin: '0 1rem',
    fontSize: '1.5rem',
    fontWeight: '300' as const,
    opacity: 0.8,
  },
  
  pageTitle: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '500' as const,
    letterSpacing: '0.5px',
  }
};