import React from 'react';
import { theme } from '@/styles/theme';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  className = ''
}) => {
  const styles: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: theme.borderRadius.sm,
    marginTop: '16px',
    fontSize: theme.typography.fontSize.sm,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor:
      type === 'error'
        ? 'rgba(220, 53, 69, 0.1)'
        : type === 'warning'
        ? 'rgba(255, 193, 7, 0.1)'
        : 'rgba(23, 162, 184, 0.1)',
    color:
      type === 'error'
        ? theme.colors.danger
        : type === 'warning'
        ? theme.colors.warning
        : theme.colors.info,
    border: `1px solid ${
      type === 'error'
        ? theme.colors.danger
        : type === 'warning'
        ? theme.colors.warning
        : theme.colors.info
    }`,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0,
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div style={styles} className={className}>
      <span style={iconStyles}>{getIcon()}</span>
      <span>{message}</span>
    </div>
  );
};