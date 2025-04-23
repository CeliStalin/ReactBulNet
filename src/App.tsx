/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import { NotFound } from './components/NotFound'; 
import { initializeAuthProvider } from './auth/authProvider';
import useAuth from './hooks/useAuth';
import { Mainpage } from './components/MainPage/MainPage';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Unauthorized from './components/Unauthorized';


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
  useEffect(() => {
    initializeAuthProvider();
  }, []);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
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