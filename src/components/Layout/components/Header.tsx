import React from 'react';
import UserLoginApp from '../../UserLogin/UserLoginApp';
import { headerStyles } from '../../MainPage/styles/header.styles';

interface HeaderProps {
  logoUrl: string;
  altText: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, altText }) => {
  return (
    <header style={headerStyles}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logoUrl}
          alt={altText}
          className="image"
          style={{ height: '50px', width: 'auto', marginLeft: '1rem' }}
        />
      </div>
      <UserLoginApp />
    </header>
  );
};