import { useMemo } from 'react';
import { theme } from '@/styles/theme';

interface StyleProps {
  variant: string;
  size: string;
  fullWidth: boolean;
  disabled: boolean;
}

export const useButtonStyles = ({ variant, size, fullWidth, disabled }: StyleProps) => {
  return useMemo(() => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.full,
      fontWeight: 'bold',
      transition: 'all 0.2s ease-in-out',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      border: 'none',
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        boxShadow: theme.shadows.button,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
      },
      danger: {
        backgroundColor: theme.colors.danger,
        color: theme.colors.white,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.gray.dark,
      },
    };

    const sizeStyles = {
      small: {
        padding: '8px 16px',
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        padding: '12px 24px',
        fontSize: theme.typography.fontSize.md,
      },
      large: {
        padding: '16px 32px',
        fontSize: theme.typography.fontSize.lg,
      },
    };

    return {
      button: `button-${variant} button-${size}`,
      buttonStyle: {
        ...baseStyles,
        ...variantStyles[variant as keyof typeof variantStyles],
        ...sizeStyles[size as keyof typeof sizeStyles],
      },
      iconStyle: {
        marginRight: '8px',
        display: 'inline-flex',
      },
    };
  }, [variant, size, fullWidth, disabled]);
};