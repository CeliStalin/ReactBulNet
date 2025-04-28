import React from 'react';
import { LoadingDots } from '../../Login/components/LoadingDots';
import { ButtonProps } from './Button.types';
import { useButtonStyles } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const styles = useButtonStyles({ variant, size, fullWidth, disabled });

  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={styles.buttonStyle}
      {...props}
    >
      {loading ? (
        <LoadingDots size="small" color={variant === 'primary' ? '#fff' : '#000'} />
      ) : (
        <>
          {icon && <span style={styles.iconStyle}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};