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

const AdminPage: React.FC = () => {
  return (
    <div className="container p-4 mt-5">
      <h1 className="title">Panel de Administración</h1>
      <p className="subtitle">Esta página solo es accesible para administradores.</p>
      <div className="content">
        <ul>
          <li>Gestión de usuarios</li>
          <li>Configuración del sistema</li>
          <li>Reportes y estadísticas</li>
        </ul>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { usuario } = useAuth();
  
  return (
    <div className="container p-4 mt-5">
      <h1 className="title">Mi Perfil</h1>
      {usuario && (
        <div className="box">
          <p><strong>Nombre:</strong> {usuario.displayName}</p>
          <p><strong>Email:</strong> {usuario.mail || usuario.userPrincipalName}</p>
          <p><strong>Cargo:</strong> {usuario.jobTitle || 'No especificado'}</p>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const { isInitializing, isSignedIn } = useAuth();
  const { isLoggingOut } = useAuthContext(); // Obtener directamente del contexto

  useEffect(() => {
    initializeAuthProvider();
    
    const timer = setTimeout(() => {
      setIsAppInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Log detallado de estados
  useEffect(() => {
    console.log('[App] Estados actuales:', {
      isAppInitialized,
      isInitializing,
      isLoggingOut,
      isSignedIn
    });
  }, [isAppInitialized, isInitializing, isLoggingOut, isSignedIn]);

  // Esta es la clave: verificamos isLoggingOut ANTES de cualquier otra condición
  if (isLoggingOut) {
    console.log('[App] MOSTRANDO PANTALLA DE LOGOUT');
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

  // Después verificamos la inicialización
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
            {/* Login route - solo accesible si NO está autenticado */}
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
                  allowedRoles={["USER", "ADMIN"]} 
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <RoleProtectedRoute 
                  element={<ProfilePage />} 
                  allowedRoles={["USER", "ADMIN"]} 
                />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <RoleProtectedRoute 
                  element={<AdminPage />} 
                  allowedRoles={["ADMIN"]} 
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <RoleProtectedRoute 
                  element={<div>Dashboard Administrativo</div>} 
                  allowedRoles={["ADMIN"]} 
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

export default App;