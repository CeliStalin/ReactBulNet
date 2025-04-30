import { useMemo } from 'react';
import { theme } from '@/core/styles/theme';

interface StyleProps {
  variant: string;
  padding: string;
}

export const useCardStyles = ({ variant, padding }: StyleProps) => {
  return useMemo(() => {
    const baseStyles = {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.small,
      overflow: 'hidden',
    };

    const variantStyles = {
      default: {
        boxShadow: theme.shadows.card,
      },
      bordered: {
        border: `1px solid ${theme.colors.gray.light}`,
      },
      elevated: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    };

    const paddingStyles = {
      none: {
        padding: '0',
      },
      small: {
        padding: theme.spacing.sm,
      },
      medium: {
        padding: theme.spacing.md,
      },
      large: {
        padding: theme.spacing.lg,
      },
    };

    return {
      card: `card-${variant}`,
      cardStyle: {
        ...baseStyles,
        ...variantStyles[variant as keyof typeof variantStyles],
      },
      headerStyle: {
        padding: padding === 'none' ? `${theme.spacing.sm} ${theme.spacing.md}` : undefined,
        borderBottom: `1px solid ${theme.colors.gray.light}`,
      },
      titleStyle: {
        margin: 0,
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.black,
      },
      subtitleStyle: {
        margin: '4px 0 0',
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray.dark,
      },
      contentStyle: {
        ...paddingStyles[padding as keyof typeof paddingStyles],
      },
      footerStyle: {
        padding: padding === 'none' ? `${theme.spacing.sm} ${theme.spacing.md}` : undefined,
        borderTop: `1px solid ${theme.colors.gray.light}`,
        backgroundColor: '#f9f9f9',
      },
    };
  }, [variant, padding]);
};