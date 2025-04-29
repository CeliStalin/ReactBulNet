import { theme } from '../../styles/theme';

export const headerStyles = {
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
  height: '4rem', // Altura fija para mejor control
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Añadimos sombra para mejor separación visual
};