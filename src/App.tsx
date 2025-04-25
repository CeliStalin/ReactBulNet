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
            <Route 
              path="/login" 
              element={isSignedIn ? <Navigate to="/" replace /> : <Login />} 
            />
            
            <Route path="/404" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
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
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
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
            
            {/* Ruta dinámica para otras aplicaciones */}
            <Route 
              path="/:controlador/:id" 
              element={
                <RoleProtectedRoute 
                  element={<GenericApplicationPage />} 
                  allowedRoles={["USER", "ADMIN", "Developers"]} 
                />
              } 
            />
            
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Componente genérico para mostrar aplicaciones
const GenericApplicationPage: React.FC = () => {
  const { pathname } = window.location;
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Aplicación</h1>
      <p>Ruta actual: {pathname}</p>
      <p>Esta página se renderizará según el controlador y ID de la aplicación.</p>
    </div>
  );
};

export default App;