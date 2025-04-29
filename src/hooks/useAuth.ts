import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AuthProvider } from '../services/auth/authProviderMsal';
import { getMe, getUsuarioAD, getRoles } from '../services/auth/authService';
import useLocalStorage from './useLocalStorage';
import { IUser } from '../interfaces/IUserAz';
import { RolResponse } from '../interfaces/IRol';
import { UsuarioAd } from '../interfaces/IUsuarioAD';
import { useAuthContext } from '../context/AuthContext';

interface AuthState {
  isSignedIn: boolean;
  usuario: IUser | null;
  usuarioAD: UsuarioAd | null;
  roles: RolResponse[];
  loading: boolean;
  error: string | null;
  errorAD: string | null;
  errorRoles: string | null;
}

interface UseAuthReturn extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthentication: () => Promise<boolean>;
  loadUserData: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (allowedRoles: string[]) => boolean;
  isInitializing: boolean;
  isLoggingOut: boolean;
  authAttempts: number;
  maxAuthAttempts: number;
}

export const useAuth = (): UseAuthReturn => {
  const { isLoggingOut, setIsLoggingOut } = useAuthContext();
  
  // Estado local con localStorage
  const [isSignedIn, setIsSignedIn] = useLocalStorage<boolean>('isLogin', false);
  const [usuario, setUsuario] = useLocalStorage<IUser | null>('usuario', null);
  const [usuarioAD, setUsuarioAD] = useLocalStorage<UsuarioAd | null>('usuarioAD', null);
  const [roles, setRoles] = useLocalStorage<RolResponse[]>('roles', []);
  
  // Estado local sin persistencia
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAD, setErrorAD] = useState<string | null>(null);
  const [errorRoles, setErrorRoles] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [authAttempts, setAuthAttempts] = useState<number>(0);
  const maxAuthAttempts = 3; // Máximo número de intentos
  const cache = useRef(new Map());

  // Inicialización y verificación de estado de autenticación
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Asegurarse de que MSAL esté inicializado
        await AuthProvider.initialize();
        
        if (!mounted) return;

        // Verificar si está autenticado usando la nueva implementación
        const signedIn = await AuthProvider.isAuthenticated();
        
        if (signedIn !== isSignedIn) {
          setIsSignedIn(signedIn);
        }
      } catch (error) {
        console.error('[useAuth] Error en inicialización:', error);
      } finally {
        if (mounted && !isLoggingOut) {
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const loadUserData = useCallback(async () => {
    if (!isSignedIn) {
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setError(null);
      setErrorAD(null);
      setErrorRoles(null);
      return;
    }

    if (usuario && usuario.id && cache.current.has(usuario.id)) {
      return;
    }

    setLoading(true);

    try {
      // Obtener datos del usuario
      const userData = await getMe();
      
      if (typeof userData === 'string') {
        try {
          const parsedError = JSON.parse(userData);
          if (parsedError.Error) {
            console.error('[useAuth] Error al obtener datos de usuario:', parsedError.Error);
            setError(parsedError.Error);
            setUsuario(null);
          }
        } catch (e) {
          console.error('[useAuth] Error al procesar la respuesta:', e);
          setError('Error al procesar la respuesta');
          setUsuario(null);
        }
      } else {
        setUsuario(userData);
        cache.current.set(userData.id, userData);
        
        if (userData.mail) {

          // Obtener datos de AD
          try {
            const adData = await getUsuarioAD(userData.mail);
            setUsuarioAD(adData);
            setErrorAD(null);
          } catch (error) {
            setErrorAD(error instanceof Error ? error.message : String(error));
          }

          // Obtener roles
          try {
            const rolesData = await getRoles(userData.mail);
            setRoles(rolesData);
            setErrorRoles(null);
          } catch (error) {
            console.error('[useAuth] Error al obtener roles:', error);
            setErrorRoles(error instanceof Error ? error.message : String(error));
          }
        }
      }
    } catch (err) {
      console.error('[useAuth] Error general al cargar datos de usuario:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      loadUserData();
    }
  }, [isSignedIn, loadUserData]);

  const checkAuthentication = useCallback(async () => {
    try {
      const authenticated = await AuthProvider.isAuthenticated();
      
      if (authenticated !== isSignedIn) {
        setIsSignedIn(authenticated);
      }
      
      // Incrementar contador de intentos si no está autenticado
      if (!authenticated) {
        setAuthAttempts(prevAttempts => prevAttempts + 1);
      }
      
      return authenticated;
    } catch (error) {
      console.error('[useAuth] Error al verificar autenticación:', error);
      return false;
    }
  }, [isSignedIn, setIsSignedIn]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Asegurarse de que MSAL esté inicializado
      await AuthProvider.initialize();
      // Iniciar sesión
      await AuthProvider.login();
      setIsSignedIn(true);
    } catch (err) {
      console.error('[useAuth] Error en proceso de login:', err);
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setIsSignedIn]);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    
    try {
      setLoading(true);
      // Determinar si estamos usando el flujo de redirección
      const isRedirectFlow = AuthProvider.isUsingRedirectFlow();
      
      if (isRedirectFlow) {
        // Logout con redirección
        await AuthProvider.logoutRedirect();
        // No continuamos la ejecución aquí, ya que la redirección nos llevará a otra página
        return;
      } else {
        // Logout normal
        await AuthProvider.logout();
      }
      
      // Limpiar estados (solo se ejecuta para logout normal, no redirect)
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setIsSignedIn(false);
      cache.current.clear();
      
    } catch (err) {
      console.error('[useAuth] Error en proceso de logout:', err);
      setError(err instanceof Error ? err.message : String(err));
      
      // Limpieza manual en caso de error
      try {
        sessionStorage.clear();
        localStorage.removeItem('isLogin');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioAD');
        localStorage.removeItem('roles');
        setIsSignedIn(false);
      } catch (e) {
        console.error('[useAuth] Error en limpieza manual:', e);
      }
      
      throw err;
    } finally {
      setLoading(false);
      // Dar tiempo para que la redirección se complete o para mostrar mensaje de carga
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 2000);
    }
  }, [setIsLoggingOut]);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!roles || roles.length === 0) {
      return false;
    }
    
    // Verificar caso exacto
    const exactMatch = roles.some(role => 
      role && typeof role === 'object' && 'Rol' in role && role.Rol === roleName
    );
    
    // Verificar ignorando mayúsculas/minúsculas
    const caseInsensitiveMatch = roles.some(role => 
      role && typeof role === 'object' && 'Rol' in role && 
      role.Rol.toLowerCase() === roleName.toLowerCase()
    );
    
    // Devolver coincidencia exacta o insensible a mayúsculas según necesidades
    return exactMatch || caseInsensitiveMatch;
  }, [roles]);

  const hasAnyRole = useCallback((allowedRoles: string[]): boolean => {
    // Si no se requieren roles, permitir acceso
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    
    // Si no hay roles asignados, denegar acceso
    if (!roles || roles.length === 0) {
      console.log('Usuario sin roles intentando acceder a ruta protegida');
      return false;
    }
    
    // Crear arrays normalizados para comparación case-insensitive
    const normalizedAllowedRoles = allowedRoles.map(role => 
      typeof role === 'string' ? role.toLowerCase() : ''
    );
    
    const normalizedUserRoles = roles.map(role => 
      role && typeof role === 'object' && 'Rol' in role && typeof role.Rol === 'string' 
        ? role.Rol.toLowerCase() 
        : ''
    );
    
    // Verificar si tiene alguno de los roles permitidos
    const hasPermission = normalizedAllowedRoles.some(role => 
      normalizedUserRoles.includes(role)
    );
    
    if (!hasPermission) {
      console.log(
        `Usuario sin permisos. Roles requeridos: [${allowedRoles.join(', ')}], ` +
        `Roles de usuario: [${roles.map(r => r.Rol).join(', ')}]`
      );
    }
    
    return hasPermission;
  }, [roles]);

  return useMemo(() => ({
    isSignedIn,
    usuario,
    usuarioAD,
    roles,
    loading,
    error,
    errorAD,
    errorRoles,
    login,
    logout,
    checkAuthentication,
    loadUserData,
    hasRole,
    hasAnyRole,
    isInitializing,
    isLoggingOut,
    authAttempts,
    maxAuthAttempts
  }), [
    isSignedIn,
    usuario,
    usuarioAD,
    roles,
    loading,
    error,
    errorAD,
    errorRoles,
    login,
    logout,
    checkAuthentication,
    loadUserData,
    hasRole,
    hasAnyRole,
    isInitializing,
    isLoggingOut,
    authAttempts
  ]);
};

export default useAuth;