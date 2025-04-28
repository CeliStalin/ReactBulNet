import React from 'react';
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
  // Obtener el estado de autenticación y los roles del usuario
  const auth = useAuth();
  const location = useLocation();
  
  // Desestructurar solo lo que necesitamos para evitar problemas con objetos complejos
  const { isSignedIn, isInitializing, loading } = auth;
  
  // Si está cargando o inicializando, mostrar un indicador de carga simple
  if (isInitializing || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column' as const
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
    // Extraer los nombres de los roles manualmente para evitar problemas de serialización
    const userRoleNames: string[] = (auth.roles || []).map(role => {
      // Evitar acceder a propiedades de objetos undefined
      return role && typeof role === 'object' && 'Rol' in role ? String(role.Rol) : '';
    }).filter(Boolean);
    
    // Verificar si tiene alguno de los roles permitidos
    const hasPermission = allowedRoles.some(role => userRoleNames.includes(role));
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Si pasó todas las verificaciones, mostrar el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;