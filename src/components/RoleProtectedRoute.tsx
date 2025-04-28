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
    maxAuthAttempts,
    hasAnyRole
  } = useAuth();
  
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Verificación de roles mejorada
  useEffect(() => {
    const checkRoles = () => {
      if (!isSignedIn || !roles || roles.length === 0) {
        console.log('[RoleProtectedRoute] Usuario no autenticado o sin roles');
        setHasPermission(false);
        return;
      }

      console.log('[RoleProtectedRoute] Verificando roles:', allowedRoles);
      console.log('[RoleProtectedRoute] Roles del usuario:', roles.map(r => r.Rol));
      
      // Verificar si el usuario tiene alguno de los roles permitidos
      const userRoles = roles.map(role => role.Rol);
      
      // Comprobar roles de forma case-insensitive
      const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
      const normalizedUserRoles = userRoles.map(r => r.toLowerCase());
      
      // También comprobar con hasAnyRole para tener doble verificación
      const hasRole = normalizedAllowedRoles.some(role => 
        normalizedUserRoles.includes(role)
      );
      
      const hasRoleFromHook = hasAnyRole(allowedRoles);
      
      console.log('[RoleProtectedRoute] ¿Tiene algún rol permitido?', hasRole);
      console.log('[RoleProtectedRoute] ¿Tiene rol según hook?', hasRoleFromHook);
      
      // Si alguna de las dos verificaciones es positiva, permitir acceso
      setHasPermission(hasRole || hasRoleFromHook);
    };
    
    checkRoles();
  }, [isSignedIn, roles, allowedRoles, hasAnyRole]);

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

  // Redirección inmediata a login si no está autenticado
  if (!isSignedIn) {
    console.log('[RoleProtectedRoute] Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirección si no tiene permisos
  if (!hasPermission) {
    console.log('[RoleProtectedRoute] Usuario sin permisos, redirigiendo a unauthorized');
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Solo renderizar el elemento si está autenticado y tiene permisos
  console.log('[RoleProtectedRoute] Usuario autenticado y con permisos, mostrando contenido');
  return <>{element}</>;
};

export default RoleProtectedRoute;