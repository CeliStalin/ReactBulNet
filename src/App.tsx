import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import { NotFound } from './components/NotFound'; 
import { initializeAuthProvider } from './auth/authProvider';
import useAuth from './hooks/useAuth';
import { Mainpage } from './components/MainPage/MainPage';
import Unauthorized from './components/Unauthorized';
import { LoadingDots } from './components/Login/components/LoadingDots';
import { useAuthContext } from './context/AuthContext';
import IngresoHerederos from './components/IngresoHerederos/IngresoHerederos';
import IngresoDocumentos from './components/IngresoDocumentos/IngresoDocumentos';
import DashboardPage from './components/Dashboard/DashboardPage';

// Componente de ruta pública
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isSignedIn, isInitializing } = useAuth();
  
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <LoadingDots size="large" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px' }}>
          Cargando...
        </div>
      </div>
    );
  }
  
  // Si ya está autenticado, redirigir a la página principal
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

// Componente de ruta privada con verificación de autenticación
const PrivateRoute: React.FC<{ element: React.ReactNode; allowedRoles?: string[] }> = ({ 
  element, 
  allowedRoles = ["USER", "ADMIN", "Developers"] 
}) => {
  const { isSignedIn, isInitializing, roles } = useAuth();
  
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <LoadingDots size="large" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px' }}>
          Verificando acceso...
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar roles si se especifican
  if (allowedRoles.length > 0) {
    const userRoles = roles.map(role => role.Rol);
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <>{element}</>;
};

const App: React.FC = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const { isInitializing, isSignedIn } = useAuth();
  const { isLoggingOut } = useAuthContext();

  useEffect(() => {
    initializeAuthProvider();
    
    const timer = setTimeout(() => {
      setIsAppInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoggingOut) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#ffffff'
      }}>
        <LoadingDots size="large" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
          Cerrando sesión...
        </div>
      </div>
    );
  }

  if (!isAppInitialized || isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <LoadingDots size="large" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px' }}>
          Inicializando aplicación...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Ruta de login - accesible solo si NO está autenticado */}
            <Route 
              path="/login" 
              element={<PublicRoute element={<Login />} />} 
            />
            
            {/* Rutas públicas - accesibles sin autenticación */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rutas protegidas - requieren autenticación */}
            <Route 
              path="/" 
              element={
                <PrivateRoute 
                  element={<Mainpage />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute 
                  element={<DashboardPage />} 
                  allowedRoles={["ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/MnHerederos/ingresoHer" 
              element={
                <PrivateRoute 
                  element={<IngresoHerederos />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/MnHerederos/ingresoDoc" 
              element={
                <PrivateRoute 
                  element={<IngresoDocumentos />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            {/* Para cualquier otra ruta, si está autenticado ir a 404, si no a login */}
            <Route 
              path="*" 
              element={
                isSignedIn ? 
                  <Navigate to="/404" replace /> : 
                  <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;