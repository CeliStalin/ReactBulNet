import React from 'react';
import { CardProps } from './Card.types';
import { useCardStyles } from './Card.styles';

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  padding = 'medium',
  className = '',
}) => {
  const styles = useCardStyles({ variant, padding });

  return (
    <div className={`${styles.card} ${className}`} style={styles.cardStyle}>
      {(title || subtitle) && (
        <div style={styles.headerStyle}>
          {title && <h3 style={styles.titleStyle}>{title}</h3>}
          {subtitle && <p style={styles.subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      
      <div style={styles.contentStyle}>
        {children}
      </div>
      
      {footer && (
        <div style={styles.footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
};