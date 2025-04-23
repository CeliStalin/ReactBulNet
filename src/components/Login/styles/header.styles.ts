import { theme } from '../../styles/theme';

export const headerStyles = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: theme.layout.headerHeight,
  background: theme.colors.primary,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  zIndex: 1000,
  padding: `0 20px`,
};