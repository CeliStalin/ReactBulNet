import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LoadingDots } from '../Login/components/LoadingDots';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = '/login' 
}) => {
  const { 
    isSignedIn, 
    roles, 
    isInitializing, 
    loading,
    isLoggingOut 
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitializing || loading || isLoggingOut) {
      return;
    }

    if (!isSignedIn) {
      // Guardar la ubicación actual para redirigir después del login
      navigate(redirectPath, { 
        replace: true, 
        state: { from: location } 
      });
      return;
    }

    if (allowedRoles.length > 0) {
      const userRoles = roles.map(role => role.Rol);
      const hasPermission = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasPermission) {
        navigate('/unauthorized', { 
          replace: true, 
          state: { from: location } 
        });
      }
    }
  }, [
    isSignedIn, 
    roles, 
    isInitializing, 
    loading, 
    isLoggingOut, 
    navigate, 
    location, 
    allowedRoles, 
    redirectPath
  ]);

  if (isInitializing || loading) {
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

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;