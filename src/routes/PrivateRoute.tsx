import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

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
  // Eliminamos 'roles' de la desestructuración ya que no se usa directamente
  const { isSignedIn, isInitializing, loading, hasAnyRole } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    // Solo verificamos una vez que la autenticación esté completa
    if (!isInitializing && !loading) {
      setIsVerifying(false);
    }
  }, [isInitializing, loading]);
  
  // Si está cargando o inicializando, mostrar un indicador de carga simple
  if (isInitializing || loading || isVerifying) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Verificando acceso...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isSignedIn) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si se requieren roles específicos, verificar si el usuario tiene al menos uno
  if (allowedRoles.length > 0) {
    // Verificación mejorada de roles utilizando hasAnyRole del hook
    const userHasPermission = hasAnyRole(allowedRoles);
    
    if (!userHasPermission) {
      // Redirigir a página de no autorizado si no tiene los roles
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Si pasó todas las verificaciones, mostrar el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;