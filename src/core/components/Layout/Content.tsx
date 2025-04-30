import React from 'react';
import { theme } from '@/styles/theme';

interface ContentProps {
  children: React.ReactNode;
  collapsed: boolean;
}

export const Content: React.FC<ContentProps> = ({
  children,
  collapsed,
}) => {
  const styles = {
    content: {
      marginLeft: collapsed ? '60px' : theme.layout.sidebarWidth,
      padding: '20px',
      width: `calc(100% - ${collapsed ? '60px' : theme.layout.sidebarWidth})`,
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f8f9fa',
      transition: theme.transitions.default,
    },
    container: {
      maxWidth: theme.layout.containerMaxWidth,
      margin: '0 auto',
    },
  };

  return (
    <main style={styles.content}>
      <div style={styles.container}>
        {children}
      </div>
    </main>
  );
};