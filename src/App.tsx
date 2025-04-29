// src/App.tsx
import React, { Suspense, useEffect } from 'react';
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
  // Inicializar MSAL al cargar la aplicación
  useEffect(() => {
    const initMsal = async () => {
      try {
        await MsalAuthProvider.initialize();
        console.log("MSAL inicializado correctamente en App");
      } catch (error) {
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
        const response = await MsalAuthProvider.handleRedirectPromise();
        if (response) {
          console.log('Se ha procesado una redirección de autenticación');
        }
      } catch (error) {
        // Evitamos imprimir el objeto de error directamente
        console.error('Error al manejar redirección de autenticación:', 
          error instanceof Error ? error.message : 'Error desconocido');
      }
    };
    
    handleRedirectPromise();
  }, []);

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