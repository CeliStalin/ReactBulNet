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
  allowedRoles = ['Developers'] 
}) => {
  const { 
    isSignedIn, 
    hasAnyRole,
    isInitializing, 
    loading,
    isLoggingOut
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si no está autenticado y no está inicializando, redirigir a login
    if (!isSignedIn && !isInitializing && !loading && !isLoggingOut) {
      navigate('/login', { 
        replace: true, 
        state: { from: location } 
      });
      return;
    }

    // Si está autenticado, verificar roles
    if (isSignedIn && !isInitializing && !loading) {
      const hasPermission = hasAnyRole(allowedRoles);
      
      if (!hasPermission) {
        console.log(`Usuario sin acceso a ruta protegida: ${location.pathname}. Roles requeridos: ${allowedRoles.join(', ')}`);
        navigate('/unauthorized', { 
          replace: true,
          state: { from: location } 
        });
      }
    }
  }, [isSignedIn, hasAnyRole, isInitializing, loading, isLoggingOut, allowedRoles, navigate, location]);

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

  // Si no está autenticado, no renderizar nada (la redirección se maneja en useEffect)
  if (!isSignedIn) {
    return null;
  }

  // Verificar roles antes de renderizar
  const hasPermission = hasAnyRole(allowedRoles);
  
  if (!hasPermission) {
    return null; // La redirección se maneja en useEffect
  }

  return (
    <Layout pageTitle={pageTitle}>
      {children}
    </Layout>
  );
};

export default SecureLayout;