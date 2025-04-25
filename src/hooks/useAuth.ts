// src/hooks/useAuth.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { login as azureLogin, logout as azureLogout, isAuthenticated } from '../auth/authProvider';
import { getMe, getUsuarioAD, getRoles } from '../auth/authService';
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
  error: string;
  errorAD: string;
  errorRoles: string;
  authAttempts: number;
  maxAuthAttempts: number;
  isInitializing: boolean;
  isLoggingOut: boolean;
}

// Mock roles para desarrollo
const MOCK_ROLES: RolResponse[] = [
  {
    IdUsuario: 1,
    CodApp: "CONSALUD",
    Rol: "ADMIN",
    TipoRol: "NORMAL",
    InicioVigencia: new Date(),
    EstadoReg: "A",
    FecEstadoReg: new Date(),
    UsuarioCreacion: "SISTEMA",
    FechaCreacion: new Date(),
    FuncionCreacion: "TEST",
    UsuarioModificacion: "SISTEMA",
    FechaModificacion: new Date(),
    FuncionModificacion: "TEST"
  }
];

export const useAuth = () => {
  const { isLoggingOut, setIsLoggingOut } = useAuthContext();
  
  // Estado local con localStorage
  const [isSignedIn, setIsSignedIn] = useLocalStorage<boolean>('isLogin', false);
  const [usuario, setUsuario] = useLocalStorage<IUser | null>('usuario', null);
  const [usuarioAD, setUsuarioAD] = useLocalStorage<UsuarioAd | null>('usuarioAD', null);
  const [roles, setRoles] = useLocalStorage<RolResponse[]>('roles', []); //MOCK_ROLES
  
  // Estado local sin persistencia
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errorAD, setErrorAD] = useState<string>('');
  const [errorRoles, setErrorRoles] = useState<string>('');
  const [authAttempts, setAuthAttempts] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const maxAuthAttempts = 1;

  // Inicialización y verificación de estado de autenticación
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Dar tiempo al provider para inicializarse
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!mounted) return;

      const signedIn = isAuthenticated();
      
      // Solo actualizar si hay diferencia
      if (signedIn !== isSignedIn) {
        setIsSignedIn(signedIn);
      }

      // Obtener roles del usuario 
      //usuario?.mail!
      getRoles("stalin.celi@consalud.cl", (response) => {
        if (response.error) {
          console.error('Error obteniendo roles:', response.error);
          return;
        }
        setRoles(response.data);
      });

      // Si está autenticado y no hay roles, establecer roles mock
      if (signedIn && (!roles || roles.length === 0)) {
        setRoles(MOCK_ROLES);
      }

      if (!isLoggingOut) {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const updateState = () => {
      if (!mounted) return;
      
      const signedIn = isAuthenticated();
      if (signedIn !== isSignedIn) {
        setIsSignedIn(signedIn);
        if (signedIn && (!roles || roles.length === 0)) {
          setRoles(MOCK_ROLES);
        }
        setAuthAttempts(0);
      }
    };

    Providers.onProviderUpdated(updateState);

    return () => {
      mounted = false;
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);

  const loadUserData = useCallback(async () => {
    if (!isSignedIn) {
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setError('');
      setErrorAD('');
      setErrorRoles('');
      return;
    }

    if (usuario && usuario.id) {
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
          setError('Error al procesar la respuesta: ' + e);
          setUsuario(null);
        }
      } else {
        setUsuario(userData);
        
        if (userData.mail) {
          if (!usuarioAD) {
            getUsuarioAD(userData.mail, (res) => {
              setUsuarioAD(res.data);
              setErrorAD(res.error);
            });
          }

          if (roles.length === 0) {
            getRoles(userData.mail, (res) => {
              if (res.data && res.data.length > 0) {
                setRoles(res.data);
              } else {
                setRoles(MOCK_ROLES);
              }
              setErrorRoles(res.error);
            });
          }
        } else {
          setRoles(MOCK_ROLES);
        }
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : String(err));
      if (!roles || roles.length === 0) {
        setRoles(MOCK_ROLES);
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, setRoles, setUsuario, setUsuarioAD, usuario, usuarioAD, roles]);

  useEffect(() => {
    if (isSignedIn) {
      loadUserData();
    }
  }, [isSignedIn, loadUserData]);

  const checkAuthentication = useCallback(() => {
    const authenticated = isAuthenticated();
    if (authenticated !== isSignedIn) {
      setIsSignedIn(authenticated);
    }

    setAuthAttempts(prev => prev + 1);
    return authenticated;
  }, [isSignedIn, setIsSignedIn]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      await azureLogin();
      setAuthAttempts(0);
      setIsSignedIn(true);
      setRoles(MOCK_ROLES);
    } catch (err: Error | unknown) {
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [setIsSignedIn, setRoles]);

  const logout = useCallback(async () => {
    console.log('[useAuth] Iniciando logout...');
    // Usar el contexto para actualizar el estado inmediatamente
    setIsLoggingOut(true);
    
    try {
      setLoading(true);
      await azureLogout();
      
      // Limpiar estados
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setAuthAttempts(0);
      setIsSignedIn(false);
      
    } catch (err: Error | unknown) {
      console.error('[useAuth] Error en logout:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      // Mantener isLoggingOut por más tiempo
      setTimeout(() => {
        console.log('[useAuth] Desactivando isLoggingOut');
        setIsLoggingOut(false);
      }, 2000);
    }
  }, [setRoles, setUsuario, setUsuarioAD, setIsSignedIn, setIsLoggingOut]);

  const hasRole = useCallback((roleName: string): boolean => {
    return roles.some(role => role.Rol === roleName);
  }, [roles]);

  const hasAnyRole = useCallback((allowedRoles: string[]): boolean => {
    if (!roles || roles.length === 0) {
      return false;
    }
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
    authAttempts,
    maxAuthAttempts,
    loadUserData,
    hasRole,
    hasAnyRole,
    isInitializing,
    isLoggingOut  // Este ahora viene del contexto
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
    authAttempts,
    maxAuthAttempts,
    loadUserData,
    hasRole,
    hasAnyRole,
    isInitializing,
    isLoggingOut
  ]);
};

export type {
    AuthState
}

export default useAuth;