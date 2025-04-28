import React from 'react';
import { theme } from '@/styles/theme';

interface SidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  isCollapsed,
  onToggle,
}) => {
  const styles = {
    sidebar: {
      width: isCollapsed ? '60px' : theme.layout.sidebarWidth,
      position: 'fixed' as const,
      left: 0,
      top: '64px', // Header height
      height: 'calc(100vh - 64px)',
      backgroundColor: theme.colors.white,
      borderRight: `1px solid ${theme.colors.gray.light}`,
      transition: theme.transitions.default,
      overflow: 'hidden',
      zIndex: 900,
      boxShadow: theme.shadows.sm,
    },
    toggleButton: {
      width: '100%',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      cursor: 'pointer',
      borderBottom: `1px solid ${theme.colors.gray.light}`,
      backgroundColor: 'transparent',
      border: 'none',
      transition: theme.transitions.default,
    },
    icon: {
      fontSize: '20px',
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: theme.transitions.default,
    },
    label: {
      marginLeft: '10px',
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? 'hidden' as const : 'visible' as const,
      transition: theme.transitions.default,
    },
    content: {
      padding: isCollapsed ? '0' : '16px',
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? 'hidden' as const : 'visible' as const,
      transition: theme.transitions.default,
    },
  };

  return (
    <aside style={styles.sidebar}>
      <button style={styles.toggleButton} onClick={onToggle}>
        <span style={styles.icon}>☰</span>
        {!isCollapsed && <span style={styles.label}>Menú</span>}
      </button>
      <div style={styles.content}>
        {children}
      </div>
    </aside>
  );
};