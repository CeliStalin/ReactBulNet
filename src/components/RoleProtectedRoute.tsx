import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LoadingDots } from '../components/Login/components/LoadingDots';

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
    hasAnyRole
  } = useAuth();
  
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // Verificación de roles mejorada
  useEffect(() => {
    if (!isInitializing && !loading) {
      // Solo verificar si está autenticado
      if (isSignedIn) {
        // Verificación con hasAnyRole para mayor seguridad
        const userHasPermission = hasAnyRole(allowedRoles);
        setHasPermission(userHasPermission);
      }
      setIsChecking(false);
    }
  }, [isSignedIn, roles, allowedRoles, hasAnyRole, isInitializing, loading]);

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
  if (isChecking || isInitializing || loading) {
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

  // Redirección inmediata a login si no está autenticado
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirección si no tiene permisos
  if (!hasPermission) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Solo renderizar el elemento si está autenticado y tiene permisos
  return <>{element}</>;
};

export default RoleProtectedRoute;