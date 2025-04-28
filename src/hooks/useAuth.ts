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
        console.log('[useAuth] Estado de autenticación inicial:', signedIn);
        
        if (signedIn !== isSignedIn) {
          console.log('[useAuth] Actualizando estado de autenticación:', signedIn);
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
      console.log('[useAuth] No está autenticado, limpiando datos de usuario');
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setError(null);
      setErrorAD(null);
      setErrorRoles(null);
      return;
    }

    if (usuario && usuario.id && cache.current.has(usuario.id)) {
      console.log('[useAuth] Usando datos en caché para usuario:', usuario.id);
      return;
    }

    setLoading(true);
    try {
      console.log('[useAuth] Cargando datos del usuario...');
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
        console.log('[useAuth] Datos de usuario obtenidos correctamente:', userData);
        setUsuario(userData);
        cache.current.set(userData.id, userData);
        
        if (userData.mail) {
          // Obtener datos de AD
          try {
            console.log('[useAuth] Obteniendo datos de AD para:', userData.mail);
            const adData = await getUsuarioAD(userData.mail);
            console.log('[useAuth] Datos de AD obtenidos correctamente');
            setUsuarioAD(adData);
            setErrorAD(null);
          } catch (error) {
            console.error('[useAuth] Error al obtener datos de AD:', error);
            setErrorAD(error instanceof Error ? error.message : String(error));
          }

          // Obtener roles
          try {
            console.log('[useAuth] Obteniendo roles para:', userData.mail);
            const rolesData = await getRoles(userData.mail);
            console.log('[useAuth] Roles obtenidos correctamente:', rolesData);
            console.log('[useAuth] Roles detallados:', JSON.stringify(rolesData, null, 2));
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
      console.log('[useAuth] Usuario autenticado, cargando datos...');
      loadUserData();
    }
  }, [isSignedIn, loadUserData]);

  const checkAuthentication = useCallback(async () => {
    try {
      const authenticated = await AuthProvider.isAuthenticated();
      console.log('[useAuth] Verificando autenticación:', authenticated);
      
      if (authenticated !== isSignedIn) {
        console.log('[useAuth] Actualizando estado de autenticación a:', authenticated);
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
      console.log('[useAuth] Iniciando proceso de login...');
      setLoading(true);
      setError(null);
      
      // Asegurarse de que MSAL esté inicializado
      await AuthProvider.initialize();
      
      // Iniciar sesión
      console.log('[useAuth] Llamando a AuthProvider.login()');
      await AuthProvider.login();
      
      console.log('[useAuth] Login completado correctamente');
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
      console.log('[useAuth] Iniciando proceso de logout...');
      setLoading(true);
      await AuthProvider.logout();
      
      // Limpiar estados
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setIsSignedIn(false);
      cache.current.clear();
      console.log('[useAuth] Logout completado correctamente');
      
    } catch (err) {
      console.error('[useAuth] Error en proceso de logout:', err);
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 2000);
    }
  }, [setIsLoggingOut]);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!roles || roles.length === 0) {
      console.log('[useAuth] No hay roles disponibles');
      return false;
    }
    
    console.log(`[useAuth] Verificando si tiene rol: "${roleName}"`);
    console.log('[useAuth] Roles disponibles:', roles.map(r => r.Rol));
    
    // Verificar caso exacto
    const exactMatch = roles.some(role => 
      role && typeof role === 'object' && 'Rol' in role && role.Rol === roleName
    );
    
    // Verificar ignorando mayúsculas/minúsculas
    const caseInsensitiveMatch = roles.some(role => 
      role && typeof role === 'object' && 'Rol' in role && 
      role.Rol.toLowerCase() === roleName.toLowerCase()
    );
    
    console.log(`[useAuth] ¿Tiene rol "${roleName}" (exacto)?: ${exactMatch}`);
    console.log(`[useAuth] ¿Tiene rol "${roleName}" (ignorando mayúsculas)?: ${caseInsensitiveMatch}`);
    
    // Devolver coincidencia exacta o insensible a mayúsculas según necesidades
    return exactMatch || caseInsensitiveMatch;
  }, [roles]);

  const hasAnyRole = useCallback((allowedRoles: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) {
      console.log('[useAuth] No se requieren roles específicos');
      return true;
    }
    
    if (!roles || roles.length === 0) {
      console.log('[useAuth] Usuario no tiene roles asignados');
      return false;
    }
    
    console.log('[useAuth] Verificando si tiene alguno de estos roles:', allowedRoles);
    const hasPermission = allowedRoles.some(role => hasRole(role));
    console.log('[useAuth] ¿Tiene permiso?', hasPermission);
    
    return hasPermission;
  }, [roles, hasRole]);

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