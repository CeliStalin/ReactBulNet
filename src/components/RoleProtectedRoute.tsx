
// 1. Mejorar el componente RoleProtectedRoute
// src/components/RoleProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LoadingDots } from './Login/components/LoadingDots';

interface RoleProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { 
    isSignedIn, 
    roles, 
    isInitializing, 
    loading, 
    isLoggingOut,
    checkAuthentication,
    authAttempts,
    maxAuthAttempts
  } = useAuth();
  
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Si está cerrando sesión, mostrar pantalla de logout
    if (isLoggingOut) {
      return;
    }

    // Verificación inicial de autenticación
    const verifyAuth = async () => {
      // Si ya está autenticado, salir
      if (isSignedIn && !isInitializing && !loading) {
        setIsChecking(false);
        setHasCheckedAuth(true);
        return;
      }

      // Si está inicializando o cargando, esperar
      if (isInitializing || loading) {
        return;
      }

      // Si no está autenticado y no hemos superado los intentos máximos
      if (!isSignedIn && authAttempts < maxAuthAttempts) {
        checkAuthentication();
        return;
      }

      // Si llegamos aquí, ya hemos terminado de verificar
      setIsChecking(false);
      setHasCheckedAuth(true);
    };

    verifyAuth();
  }, [isSignedIn, isInitializing, loading, isLoggingOut, authAttempts, maxAuthAttempts, checkAuthentication]);

  // Pantalla de cierre de sesión
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
        <LoadingDots size="medium" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
          Cerrando sesión...
        </div>
      </div>
    );
  }

  // Pantalla de carga mientras verificamos autenticación
  if (isChecking || isInitializing || loading || !hasCheckedAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <LoadingDots size="medium" color="rgb(4, 165, 155)" />
        <div style={{ color: '#333', fontSize: '16px' }}>
          Verificando acceso...
        </div>
      </div>
    );
  }

  // Redirección inmediata si no está autenticado
  if (!isSignedIn) {
    return <Navigate to="/404" replace />;
  }

  // Verificación de roles
  const userRoles = roles.map(role => role.Rol);
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));

  // Redirección si no tiene permisos
  if (!hasPermission) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Solo renderizar el elemento si está autenticado y tiene permisos
  return <>{element}</>;
};

export default RoleProtectedRoute;