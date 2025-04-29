import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider as MsalAuthProvider } from './services/auth/authProviderMsal';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingOverlay } from './components/common/Loading/LoadingOverlay';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { routes } from './routes/routes.config';
import './App.css';

// Componente de error genérico
const ErrorFallback = () => (
  <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
    <h2>¡Ups! Algo salió mal</h2>
    <p>Ha ocurrido un error inesperado. Intenta recargar la página.</p>
    <button onClick={() => window.location.reload()}>
      Recargar página
    </button>
  </div>
);

const App: React.FC = () => {
  const [isHandlingRedirect, setIsHandlingRedirect] = useState<boolean>(true);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  // Inicializar MSAL al cargar la aplicación
  useEffect(() => {
    const initMsal = async () => {
      try {
        await MsalAuthProvider.initialize();
        ("MSAL inicializado correctamente en App");
      } catch (error) {console.log
        // Evitamos imprimir el objeto de error directamente
        console.error("Error al inicializar MSAL en App:", 
          error instanceof Error ? error.message : 'Error desconocido');
      }
    };

    initMsal();
  }, []);

  // Manejar redirecciones de autenticación
  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        setIsHandlingRedirect(true);
        ("Verificando si hay redirecciones pendientes...");
        
        const response = await MsalAuthProvider.handleRedirectPromise();
        if (response) {
          
          // Determinar si es login o logout y guardar estado
          const isLoginRedirect = response.account !== null;
          if (isLoginRedirect) {
            localStorage.setItem('isLogin', 'true');
            sessionStorage.setItem('authMethod', 'redirect');
          } else {
          }
        } else {
        }
      } catch (error) {

     // Evitamos imprimir el objeto de error directamente
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al manejar redirección de autenticación:', errorMessage);
        setRedirectError(errorMessage);
      } finally {
        setIsHandlingRedirect(false);
      }
    };
    
    handleRedirectPromise();
  }, []);

  // Mostrar loading mientras se maneja la redirección
  if (isHandlingRedirect) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <LoadingOverlay show message="Verificando sesión..." />
        {redirectError && (
          <div style={{ 
            marginTop: '20px', 
            color: 'red',
            padding: '10px',
            border: '1px solid red',
            borderRadius: '5px',
            background: 'rgba(255,0,0,0.1)'
          }}>
            <p>Error al procesar la autenticación: {redirectError}</p>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#04A59B',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Volver a intentar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingOverlay show message="Cargando aplicación..." />}>
            <Routes>
              {/* Ruta raíz redirecciona a /home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Rutas públicas */}
              {routes
                .filter(route => route.public)
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PublicRoute>
                        <route.component />
                      </PublicRoute>
                    }
                  />
                ))}
              
              {/* Rutas privadas */}
              {routes
                .filter(route => !route.public)
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PrivateRoute allowedRoles={route.roles}>
                        <route.component />
                      </PrivateRoute>
                    }
                  />
                ))}
              
              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;