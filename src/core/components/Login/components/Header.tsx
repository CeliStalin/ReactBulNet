
import React from 'react';
import { headerStyles } from '../styles/header.styles';

interface HeaderProps {
  logoUrl: string;
  altText: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, altText }) => {
  return (
    <header style={headerStyles}>
      <img 
        src={logoUrl}
        alt={altText}
        className="image"
        style={{ height: '40px', width: 'auto' }}
      />
    </header>
  );
};