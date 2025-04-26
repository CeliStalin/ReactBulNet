import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import { NotFound } from './components/NotFound'; 
import { initializeAuthProvider } from './auth/authProvider';
import useAuth from './hooks/useAuth';
import { Mainpage } from './components/MainPage/MainPage';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { LoadingDots } from './components/Login/components/LoadingDots';
import { useAuthContext } from './context/AuthContext';
import IngresoHerederos from './components/IngresoHerederos/IngresoHerederos';
import IngresoDocumentos from './components/IngresoDocumentos/IngresoDocumentos';
import DashboardPage from './components/Dashboard/DashboardPage';

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
            {/* Ruta de login - accesible sin autenticación */}
            <Route 
              path="/login" 
              element={isSignedIn ? <Navigate to="/" replace /> : <Login />} 
            />
            
            {/* Rutas públicas */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/" 
              element={
                <RoleProtectedRoute 
                  element={<Mainpage />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <RoleProtectedRoute 
                  element={<DashboardPage />} 
                  allowedRoles={["ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/MnHerederos/ingresoHer" 
              element={
                <RoleProtectedRoute 
                  element={<IngresoHerederos />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route 
              path="/MnHerederos/ingresoDoc" 
              element={
                <RoleProtectedRoute 
                  element={<IngresoDocumentos />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;