// src/App.tsx
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
            
            {/* Ahora solo necesitamos esta ruta principal para manejar todo el contenido */}
            <Route 
              path="/" 
              element={
                <RoleProtectedRoute 
                  element={<Mainpage />} 
                  allowedRoles={["USER", "ADMIN"]} 
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