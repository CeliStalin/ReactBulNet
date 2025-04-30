import { theme } from '../../styles/theme';

export const heroWrapper = {
  paddingTop: theme.layout.headerHeight,
};

export const loginBox = {
  display: 'flex',
  padding: theme.spacing.lg,
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  gap: theme.spacing.md,
  borderRadius: theme.borderRadius.small,
  background: theme.colors.white,
  width: theme.layout.boxWidth,
  boxShadow: theme.shadows.card,
};

export const titleStyles = {
    width: '270.5px',
    textAlign: 'center' as const,
    fontSize: '14px', 
    lineHeight: theme.typography.lineHeight.normal,
  };

export const primaryButton = {
  display: 'flex',
  padding: '13px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'stretch',
  borderRadius: theme.borderRadius.full,
  backgroundColor: theme.colors.primary,
  color: theme.colors.white,
  boxShadow: theme.shadows.button,
  border: 'none',
  fontWeight: 'bold' as const,
};