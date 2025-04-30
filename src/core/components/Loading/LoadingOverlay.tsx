import React from 'react';
import { LoadingDots } from './LoadingDots';
import { theme } from '@/core/styles/theme';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  message = 'Cargando...',
  fullScreen = true
}) => {
  if (!show) return null;

  const overlayStyles: React.CSSProperties = {
    position: fullScreen ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.md,
  };

  const messageStyles: React.CSSProperties = {
    color: theme.colors.gray.dark,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  };

  return (
    <div style={overlayStyles}>
      <div style={contentStyles}>
        <LoadingDots size="medium" color={theme.colors.primary} />
        {message && <p style={messageStyles}>{message}</p>}
      </div>
    </div>
  );
};