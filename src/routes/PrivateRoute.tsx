// src/routes/PrivateRoute.tsx
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
  const { isSignedIn, roles, isInitializing, loading } = useAuth();
  const location = useLocation();
  
  // Si está cargando o inicializando, mostrar un indicador de carga simple
  if (isInitializing || loading) {
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
    // Extraer los nombres de los roles de forma segura
    const userRoleNames: string[] = [];
    
    // Procesamiento seguro de roles
    if (roles && Array.isArray(roles)) {
      for (const role of roles) {
        if (role && typeof role === 'object' && 'Rol' in role) {
          userRoleNames.push(String(role.Rol));
        }
      }
    }
    
    // Verificar si tiene alguno de los roles permitidos
    const hasPermission = allowedRoles.some(role => {
      // Comprobar de forma insensible a mayúsculas/minúsculas
      return userRoleNames.some(userRole => 
        userRole.toLowerCase() === role.toLowerCase()
      );
    });
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Si pasó todas las verificaciones, mostrar el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;