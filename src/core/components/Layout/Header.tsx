import React from 'react';
import { theme } from '@/styles/theme';

interface HeaderProps {
  logoUrl: string;
  altText: string;
  pageTitle?: string;
  rightContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  altText,
  pageTitle,
  rightContent,
}) => {
  const styles = {
    header: {
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
      height: '64px',
      boxShadow: theme.shadows.md,
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    logo: {
      height: '40px',
      width: 'auto',
      marginLeft: '1rem',
    },
    separator: {
      color: theme.colors.white,
      margin: '0 1rem',
      fontSize: '1.5rem',
      fontWeight: '300' as const,
      opacity: 0.8,
    },
    pageTitle: {
      color: theme.colors.white,
      fontSize: '1.2rem',
      fontWeight: '500' as const,
      letterSpacing: '0.5px',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img
          src={logoUrl}
          alt={altText}
          style={styles.logo}
        />
        {pageTitle && (
          <>
            <span style={styles.separator}>|</span>
            <span style={styles.pageTitle}>
              {pageTitle}
            </span>
          </>
        )}
      </div>
      {rightContent && rightContent}
    </header>
  );
};