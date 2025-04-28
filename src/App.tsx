import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingOverlay } from './components/common/Loading/LoadingOverlay';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { routes } from './routes/routes.config';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingOverlay show message="Cargando aplicación..." />}>
            <Routes>
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