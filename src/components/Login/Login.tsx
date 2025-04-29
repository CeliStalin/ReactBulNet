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
    logout,
    isInitializing
  } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirectMethodUsed, setRedirectMethodUsed] = useState<boolean>(() => {
    // Verificar si ya está guardado en sessionStorage
    const savedMethod = sessionStorage.getItem('authMethod');
    return savedMethod === 'redirect';
  });

  // Al montar el componente, verificar si hay un parámetro en la URL que indique redirección
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fromRedirect = queryParams.get('fromRedirect') === 'true';
    
    if (fromRedirect && !redirectMethodUsed) {
      setRedirectMethodUsed(true);
      AuthProvider.setUseRedirectFlow(true);
    }
  }, [location.search, redirectMethodUsed]);

  // Limpiar cache al cargar
  useEffect(() => {
    // Función para limpiar sesiones anteriores
    const clearSessions = async () => {
      if (!isSignedIn && !isInitializing) {
        try {
          // Intentar limpiar sesiones previas (opcional)
          if (!redirectMethodUsed) {
            // Solo limpiar localStorage/sessionStorage si no estamos en medio de un flujo de redirección
            // ya que podríamos estar volviendo de una redirección de autenticación
            sessionStorage.removeItem('isLogin');
            localStorage.removeItem('usuario');
            localStorage.removeItem('usuarioAD');
            localStorage.removeItem('roles');
          }
          
          // Limpiar cuentas en MSAL
          await AuthProvider.clearAccounts();
        } catch (error) {
          console.error('Error al limpiar sesiones:', error);
        }
      }
    };
    
    clearSessions();
  }, [isSignedIn, isInitializing, redirectMethodUsed]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isSignedIn && !isInitializing && !loading) {
      const state = location.state as LocationState;
      // Cambiado: redirigir a /home por defecto en lugar de /
      const from = state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isSignedIn, isInitializing, loading, navigate, location]);

  // Función que usa redirección para login
  const handleLoginRedirect = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    
    try {

      // Configurar para usar el método de redirección
      AuthProvider.setUseRedirectFlow(true);
      setRedirectMethodUsed(true);
      
      // Limpiar sessionStorage para forzar una autenticación limpia
      sessionStorage.clear();
      
      // Establecer en sessionStorage que estamos usando el método de redirección
      sessionStorage.setItem('authMethod', 'redirect');
      
      // Usar loginRedirect
      await AuthProvider.loginRedirect();
      
      // La navegación se maneja automáticamente por redireccionamiento
    } catch (error) {
      console.error('Error durante login redirect en componente Login:', error);
      setLocalError(error instanceof Error ? error.message : String(error));
      setIsLoggingIn(false);
    }
  };

  // Función específica para manejar el logout teniendo en cuenta el método utilizado
  const handleLogout = async () => {
    try {
      
      // Usar método adecuado según cómo se autenticó
      if (redirectMethodUsed) {
        await AuthProvider.logoutRedirect();
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Error durante logout en componente Login:', error);
      setLocalError(error instanceof Error ? error.message : String(error));
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
                          className="button is-fullwidth is-primary"
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
                          className="button is-fullwidth is-primary"
                          style={styles.primaryButton}
                          onClick={handleLoginRedirect}
                          disabled={isLoggingIn}
                        >
                          Iniciar sesión con Azure AD
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UserInfo usuario={usuario} usuarioAD={usuarioAD} roles={roles} />
                      
                      <div className="field" style={{ width: '100%', marginTop: '24px' }}>
                        <div className="control">
                          <button 
                            className="button is-fullwidth is-primary"
                            style={styles.primaryButton}
                            onClick={handleLogout}
                            disabled={loading}
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <ErrorMessages 
                    error={localError || error || undefined}
                    errorAD={errorAD || undefined}
                    errorRoles={errorRoles || undefined}
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