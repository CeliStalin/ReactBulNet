import React from 'react';
import { theme } from '../../../styles/theme';

interface LoadingDotsProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'medium',
  color = theme.colors.primary
}) => {
  const dotSizes = {
    small: '6px',
    medium: '8px',
    large: '10px'
  };

  const spacingSizes = {
    small: '3px',
    medium: '4px',
    large: '5px'
  };

  const animationDelay = [0, 0.2, 0.4];

  const dotStyle: React.CSSProperties = {
    width: dotSizes[size],
    height: dotSizes[size],
    borderRadius: '50%',
    backgroundColor: color,
    margin: `0 ${spacingSizes[size]}`,
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both'
  };

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0);
            } 
            40% { 
              transform: scale(1.0);
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              ...dotStyle,
              animationDelay: `${animationDelay[index]}s`
            }}
          />
        ))}
      </div>
    </>
  );
};