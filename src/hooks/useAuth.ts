import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AuthProvider } from '@/services/auth/authProvider';
import { getMe, getUsuarioAD, getRoles } from '@/services/auth/authService';
import { useLocalStorage } from './useLocalStorage';
import { IUser } from '@/types/interfaces/IUserAz';
import { RolResponse } from '@/types/interfaces/IRol';
import { UsuarioAd } from '@/types/interfaces/IUsuarioAD';
import { useAuthContext } from '@/context/AuthContext';

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
  checkAuthentication: () => boolean;
  loadUserData: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (allowedRoles: string[]) => boolean;
  isInitializing: boolean;
  isLoggingOut: boolean;
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
  const cache = useRef(new Map());

  // Inicialización y verificación de estado de autenticación
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Dar tiempo al provider para inicializarse
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!mounted) return;

        const signedIn = AuthProvider.isAuthenticated();
        
        if (signedIn !== isSignedIn) {
          setIsSignedIn(signedIn);
        }
      } catch (error) {
        console.error('Error en inicialización:', error);
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
      const userData = await getMe();
      
      if (typeof userData === 'string') {
        try {
          const parsedError = JSON.parse(userData);
          if (parsedError.Error) {
            setError(parsedError.Error);
            setUsuario(null);
          }
        } catch (e) {
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
            setErrorRoles(error instanceof Error ? error.message : String(error));
          }
        }
      }
    } catch (err) {
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

  const checkAuthentication = useCallback(() => {
    const authenticated = AuthProvider.isAuthenticated();
    if (authenticated !== isSignedIn) {
      setIsSignedIn(authenticated);
    }
    return authenticated;
  }, [isSignedIn, setIsSignedIn]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthProvider.login();
      setIsSignedIn(true);
    } catch (err) {
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
      await AuthProvider.logout();
      
      // Limpiar estados
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setIsSignedIn(false);
      cache.current.clear();
      
    } catch (err) {
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
    return roles.some(role => role.Rol === roleName);
  }, [roles]);

  const hasAnyRole = useCallback((allowedRoles: string[]): boolean => {
    return allowedRoles.some(role => hasRole(role));
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
    isLoggingOut
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
    isLoggingOut
  ]);
};

export default useAuth;