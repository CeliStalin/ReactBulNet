import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Header } from './components/Header';
import { UserInfo } from './components/UserInfo';
import { ErrorMessages } from './components/ErrorMessages';
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

  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  const renderAuthButton = () => {
    if (loading) {
      return <p className="has-text-centered" style={{ width: '100%' }}>Cargando...</p>;
    }

    if (!isSignedIn) {
      return (
        <div className="field" style={{ width: '100%' }}>
          <div className="control">
            <button 
              className="button is-fullwidth"
              style={styles.primaryButton}
              onClick={login}
              disabled={loading}
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