import React from 'react';
import UserLoginApp from '../../UserLogin/UserLoginApp';
import { headerStyles } from '../styles/header.styles';

interface HeaderProps {
  logoUrl: string;
  altText: string;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, altText, pageTitle }) => {
  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.logoContainer}>
        <img
          src={logoUrl}
          alt={altText}
          className="image"
          style={headerStyles.logo}
        />
        {pageTitle && (
          <>
            <span style={headerStyles.separator}>|</span>
            <span style={headerStyles.pageTitle}>
              {pageTitle}
            </span>
          </>
        )}
      </div>
      <UserLoginApp />
    </header>
  );
};