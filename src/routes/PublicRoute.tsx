import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/core/hooks/useAuth';
import { LoadingOverlay } from '@/core/components/Loading/LoadingOverlay';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectPath = '/home' // Cambiado de '/' a '/home'
}) => {
  const { isSignedIn, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingOverlay show message="Cargando..." />;
  }

  if (isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};