import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/common/Loading/LoadingOverlay';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles = [],
  redirectPath = '/login'
}) => {
  const { isSignedIn, roles, isInitializing, loading } = useAuth();
  const location = useLocation();

  if (isInitializing || loading) {
    return <LoadingOverlay show message="Verificando acceso..." />;
  }

  if (!isSignedIn) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoles = roles.map(role => role.Rol);
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};