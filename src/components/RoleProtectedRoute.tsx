import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface RoleProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { isSignedIn, roles, checkAuthentication, authAttempts, maxAuthAttempts } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    if (isSignedIn) {
      setIsChecking(false);
      return;
    }
    
    if (authAttempts >= maxAuthAttempts) {
      setIsChecking(false);
      return;
    }
    
    const timer = setTimeout(() => {
      const authenticated = checkAuthentication();
      
      if (authenticated || authAttempts >= maxAuthAttempts - 1) {
        setIsChecking(false);
      }
    }, 1000 * (authAttempts + 1)); 
    
    return () => clearTimeout(timer);
  }, [isSignedIn, authAttempts, maxAuthAttempts, checkAuthentication]);

  if (isChecking) {
    return <div>Verificando autenticación... Intento {authAttempts + 1}/{maxAuthAttempts}</div>;
  }


  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }


  const userRoles = roles.map(role => role.Rol);
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }


  return <>{element}</>;
};

export default RoleProtectedRoute;