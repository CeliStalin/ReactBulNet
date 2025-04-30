import { theme } from '../../../styles/theme'

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
};