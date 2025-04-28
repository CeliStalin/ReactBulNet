import React from 'react';
import { Header } from './Header';
import logoIcon from '@/assets/Logo.png';
import { theme } from '@/styles/theme';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: theme.colors.white,
    },
    main: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      paddingTop: '80px', // Para compensar el header
    },
  };

  return (
    <div style={styles.container}>
      <Header 
        logoUrl={logoIcon}
        altText="Consalud Logo"
      />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};