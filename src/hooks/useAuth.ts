import { useState, useEffect, useCallback } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { login as azureLogin, logout as azureLogout, isAuthenticated } from '../../src/auth/authProvider';
import { getMe, getUsuarioAD, getRoles } from '../../src/auth/authService';
import useLocalStorage from '../../src/hooks/useLocalStorage';
import { IUser } from '../interfaces/IUserAz';
import { RolResponse } from '../interfaces/IRol';
import { UsuarioAd } from '../interfaces/IUsuarioAD';

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
}

export const useAuth = () => {
  // Estado local con localStorage
  const [isSignedIn, setIsSignedIn] = useLocalStorage<boolean>('isLogin', false);
  const [usuario, setUsuario] = useLocalStorage<IUser | null>('usuario', null);
  const [usuarioAD, setUsuarioAD] = useLocalStorage<UsuarioAd | null>('usuarioAD', null);
  //const [roles, setRoles] = useLocalStorage<RolResponse[]>('roles', []);
  const [roles, setRoles] = useLocalStorage<RolResponse[]>('roles', [
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
  ]);
  // Estado local sin persistencia
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errorAD, setErrorAD] = useState<string>('');
  const [errorRoles, setErrorRoles] = useState<string>('');
  const [authAttempts, setAuthAttempts] = useState<number>(0);
  const maxAuthAttempts = 1;

  // Verificar estado de autenticación solo cuando cambia el provider
  useEffect(() => {
    // Esta función será llamada solo cuando el provider cambie realmente
    const updateState = () => {
      const signedIn = isAuthenticated();
      // Solo logueamos cuando cambia el estado para reducir el ruido en la consola
      if (signedIn !== isSignedIn) {
        setIsSignedIn(signedIn);
        // Resetear intentos cuando cambia el estado de autenticación
        setAuthAttempts(0);
      }
    };

    // Nos suscribimos a los cambios del provider
    Providers.onProviderUpdated(updateState);
    
    // Verificación inicial sin loguear constantemente
    const initialSignedIn = isAuthenticated();
    if (initialSignedIn !== isSignedIn) {
      setIsSignedIn(initialSignedIn);
    }

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              setRoles(res.data);
              setErrorRoles(res.error);
            });
          }
        }
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : String(err));
      // No limpiar los datos si ya existen
      if (!usuario) setUsuario(null);
      if (!usuarioAD) setUsuarioAD(null);
      if (roles.length === 0) setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, setRoles, setUsuario, setUsuarioAD, usuario, usuarioAD, roles]);

  // Efecto para cargar datos solo cuando cambia el estado de autenticación
  useEffect(() => {
    if (isSignedIn) {
      loadUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  // Función para intentar verificar autenticación
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
    } catch (err: Error | unknown) {
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await azureLogout();
      setUsuario(null);
      setUsuarioAD(null);
      setRoles([]);
      setAuthAttempts(0);
    } catch (err: Error | unknown) {
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [setRoles, setUsuario, setUsuarioAD]);

  const hasRole = useCallback((roleName: string): boolean => {
    return roles.some(role => role.Rol === roleName);
  }, [roles]);

  const hasAnyRole = useCallback((allowedRoles: string[]): boolean => {
    if (!roles || roles.length === 0) {
      return false;
    }
    return allowedRoles.some(role => hasRole(role));
  }, [roles, hasRole]);

  return {
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
    hasAnyRole
  };
};

export type {
    AuthState
}

export default useAuth;