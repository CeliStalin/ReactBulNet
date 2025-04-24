// src/components/Login/Login.tsx
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Header } from './components/Header';
import { UserInfo } from './components/UserInfo';
import { ErrorMessages } from './components/ErrorMessages';
import { LoadingDots } from './components/LoadingDots';
import * as styles from './Login.styles';
import { theme } from '../styles/theme';
import logoIcon from '../../assets/Logo.png';

const Login: React.FC = () => {
  const { 
    isSignedIn, 
    usuario, 
    usuarioAD, 
    roles, 
    loading, 
    error, 
    errorAD, 
    errorRoles, 
    login, 
    logout
  } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
      // La navegación será manejada por el componente App
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoggingIn(false);
    }
  };

  const renderAuthButton = () => {
    if (loading || isLoggingIn) {
      return (
        <div className="field" style={{ width: '100%' }}>
          <div className="control">
            <button 
              className="button is-fullwidth"
              style={{
                ...styles.primaryButton,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '48px'
              }}
              disabled={true}
            >
              <LoadingDots size="small" />
            </button>
          </div>
        </div>
      );
    }

    if (!isSignedIn) {
      return (
        <div className="field" style={{ width: '100%' }}>
          <div className="control">
            <button 
              className="button is-fullwidth"
              style={styles.primaryButton}
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              Iniciar sesión con Azure AD
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <UserInfo usuario={usuario} usuarioAD={usuarioAD} roles={roles} />
        
        <div className="field" style={{ width: '100%', marginTop: '24px' }}>
          <div className="control">
            <button 
              className="button is-fullwidth"
              style={styles.primaryButton}
              onClick={logout}
              disabled={loading}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header 
       logoUrl= {logoIcon}
        altText="Consalud Logo"
      />

      <div className="hero is-fullheight" style={styles.heroWrapper}>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-narrow">
                <div className="box has-text-centered" style={styles.loginBox}>
                <h1 className="title has-text-centered" style={styles.titleStyles}>
              <span style={{ color: theme.colors.black }}>Ingresa al </span>
              <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                administrador de devolución a herederos
              </span>
            </h1>
                  
                  {renderAuthButton()}
                  
                  <ErrorMessages 
                    error={error}
                    errorAD={errorAD}
                    errorRoles={errorRoles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;