import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Layout } from '../Layout/Layout';
import { LoadingDots } from '../Login/components/LoadingDots';

interface SecureLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  allowedRoles?: string[];
}

const SecureLayout: React.FC<SecureLayoutProps> = ({ 
  children, 
  pageTitle, 
  allowedRoles = ['USER', 'ADMIN', 'Developers'] 
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
    // Si no está autenticado y no está inicializando
    if (!isSignedIn && !isInitializing && !loading && !isLoggingOut) {
      navigate('/404', { replace: true });
      return;
    }

    // Si está autenticado, verificar roles
    if (isSignedIn && !isInitializing && !loading) {
      const userRoles = roles.map(role => role.Rol);
      const hasPermission = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasPermission) {
        navigate('/unauthorized', { state: { from: location }, replace: true });
      }
    }
  }, [isSignedIn, roles, isInitializing, loading, isLoggingOut, allowedRoles, navigate, location]);

  // Mostrar pantalla de carga mientras se inicializa
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
          Cargando...
        </div>
      </div>
    );
  }

  // Si está cerrando sesión, mostrar pantalla específica
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

  // Solo renderizar el layout si está autenticado
  if (!isSignedIn) {
    return null; // La redirección ya se maneja en useEffect
  }

  return (
    <Layout pageTitle={pageTitle}>
      {children}
    </Layout>
  );
};

export default SecureLayout;