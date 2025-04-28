import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { AuthProvider } from '../../services/auth/authProviderMsal';
import { Header } from './components/Header';
import { UserInfo } from './components/UserInfo';
import { ErrorMessages } from './components/ErrorMessages';
import { LoadingDots } from './components/LoadingDots';
import * as styles from './Login.styles';
import { theme } from '../styles/theme';
import logoIcon from '../../assets/Logo.png';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    logout,
    isInitializing
  } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Limpiar cache al cargar
  useEffect(() => {
    // Función para limpiar sesiones anteriores
    const clearSessions = async () => {
      if (!isSignedIn && !isInitializing) {
        try {
          // Intentar limpiar sesiones previas (opcional)
          sessionStorage.clear();
          localStorage.removeItem('isLogin');
          localStorage.removeItem('usuario');
          localStorage.removeItem('usuarioAD');
          localStorage.removeItem('roles');
          
          // Limpiar cuentas en MSAL
          await AuthProvider.clearAccounts();
        } catch (error) {
          console.error('Error al limpiar sesiones:', error);
        }
      }
    };
    
    clearSessions();
  }, [isSignedIn, isInitializing]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isSignedIn && !isInitializing && !loading) {
      console.log('Usuario autenticado, redirigiendo...');
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isSignedIn, isInitializing, loading, navigate, location]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    
    try {
      console.log('Iniciando login desde componente Login...');
      
      // Limpiar sessionStorage para forzar una autenticación limpia
      sessionStorage.clear();
      
      // Usar loginPopup con prompt="select_account"
      await AuthProvider.login();
      
      // Si llegamos aquí, el login fue exitoso
      console.log('Login completado en componente Login');
    } catch (error) {
      console.error('Error durante login en componente Login:', error);
      setLocalError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Función alternativa que usa redirección en lugar de popup
  const handleLoginRedirect = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    
    try {
      console.log('Iniciando login redirect desde componente Login...');
      
      // Limpiar sessionStorage para forzar una autenticación limpia
      sessionStorage.clear();
      
      // Usar loginRedirect en lugar de loginPopup
      await AuthProvider.loginRedirect();
      
      // La navegación se maneja automáticamente por redireccionamiento
    } catch (error) {
      console.error('Error durante login redirect en componente Login:', error);
      setLocalError(error instanceof Error ? error.message : String(error));
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Header 
        logoUrl={logoIcon}
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
                  
                  {loading || isLoggingIn || isInitializing ? (
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
                  ) : !isSignedIn ? (
                    <div className="field" style={{ width: '100%' }}>
                      <div className="control">
                        <button 
                          className="button is-fullwidth"
                          style={styles.primaryButton}
                          onClick={handleLogin}
                          disabled={isLoggingIn}
                        >
                          Iniciar sesión con Azure AD (Popup)
                        </button>
                      </div>
                      
                      <div className="control mt-3">
                        <button 
                          className="button is-fullwidth"
                          style={{
                            ...styles.primaryButton,
                            backgroundColor: 'transparent',
                            color: theme.colors.primary,
                            border: `1px solid ${theme.colors.primary}`
                          }}
                          onClick={handleLoginRedirect}
                          disabled={isLoggingIn}
                        >
                          Iniciar sesión con Azure AD (Redirección)
                        </button>
                      </div>
                    </div>
                  ) : (
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
                  )}
                  
                  <ErrorMessages 
                    error={localError || error}
                    errorAD={errorAD}
                    errorRoles={errorRoles}
                  />
                  
                  {/* Información de depuración */}
                  {import.meta.env.DEV && (
                    <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '12px', color: '#666' }}>
                      <details>
                        <summary>Información de depuración</summary>
                        <pre>
                          {`isSignedIn: ${isSignedIn}
isInitializing: ${isInitializing}
loading: ${loading}
isLoggingIn: ${isLoggingIn}
redirectUri: ${window.location.origin}
pathname: ${location.pathname}
`}
                        </pre>
                      </details>
                    </div>
                  )}
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