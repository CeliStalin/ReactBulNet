import { renderHook, act } from '@testing-library/react';
import { Providers } from '@microsoft/mgt-element';
import { login as azureLogin, logout as azureLogout, isAuthenticated } from '../../src/auth/authProvider';
import { getMe, getUsuarioAD, getRoles } from '../../src/auth/authService';
import useAuth from '../../src/hooks/useAuth';
import { IUser } from '../../src/interfaces/IUserAz';
import { RolResponse } from '../../src/interfaces/IRol';
import { UsuarioAd } from '../../src/interfaces/IUsuarioAD';


jest.mock('@microsoft/mgt-element', () => ({
  Providers: {
    onProviderUpdated: jest.fn(),
    removeProviderUpdatedListener: jest.fn(),
  },
}));

jest.mock('../../src/auth/authProvider', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
}));

jest.mock('../../src/auth/authService', () => ({
  getMe: jest.fn(),
  getUsuarioAD: jest.fn(),
  getRoles: jest.fn(),
}));


jest.mock('../../src/hooks/useLocalStorage', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((key, initialValue) => {
      // Por defecto, devolver un array con initialValue y una función noop
      return [initialValue, jest.fn()];
    })
  };
});


import useLocalStorage from '../../src/hooks/useLocalStorage';


interface LocalStorageInitialValues {
  isLogin?: boolean;
  usuario?: IUser | null;
  usuarioAD?: UsuarioAd | null;
  roles?: RolResponse[];
}

describe('useAuth', () => {
  // Mock data
  const mockUser = { 
    id: '123', 
    mail: 'test@example.com', 
    displayName: 'Test User',
    userPrincipalName: 'test.user@example.com' 
  } as IUser;
  
  const mockUsuarioAD = { 
    IdUsuario: 456, 
    UserName: 'test@example.com', 
    TipoUsuario: 'Interno',
    EstadoReg: 'A' 
  } as UsuarioAd;
  
  const mockRoles = [{ 
    IdUsuario: 456, 
    CodApp: 'TEST', 
    Rol: 'Admin',
    TipoRol: 'Administrador',
    InicioVigencia: new Date(),
    EstadoReg: 'A',
    FecEstadoReg: new Date(),
    UsuarioCreacion: 'SYSTEM',
    FechaCreacion: new Date(),
    FuncionCreacion: 'TEST',
    UsuarioModificacion: 'SYSTEM',
    FechaModificacion: new Date(),
    FuncionModificacion: 'TEST'
  }] as RolResponse[];


  const setupLocalStorageMock = (initialValues: LocalStorageInitialValues = {}) => {
    const storageState = {
      isLogin: initialValues.isLogin || false,
      usuario: initialValues.usuario || null,
      usuarioAD: initialValues.usuarioAD || null,
      roles: initialValues.roles || [],
    };
    
    const mockSetters = {
      setIsSignedIn: jest.fn((value) => {
        storageState.isLogin = typeof value === 'function' ? value(storageState.isLogin) : value;
      }),
      setUsuario: jest.fn((value) => {
        storageState.usuario = typeof value === 'function' ? value(storageState.usuario) : value;
      }),
      setUsuarioAD: jest.fn((value) => {
        storageState.usuarioAD = typeof value === 'function' ? value(storageState.usuarioAD) : value;
      }),
      setRoles: jest.fn((value) => {
        storageState.roles = typeof value === 'function' ? value(storageState.roles) : value;
      }),
    };
    type LocalStorageValueType = boolean | IUser | UsuarioAd | RolResponse[] | null;

    (useLocalStorage as jest.Mock).mockImplementation((key: string, initialValue: LocalStorageValueType) => {
      switch (key) {
        case 'isLogin':
          return [storageState.isLogin, mockSetters.setIsSignedIn];
        case 'usuario':
          return [storageState.usuario, mockSetters.setUsuario];
        case 'usuarioAD':
          return [storageState.usuarioAD, mockSetters.setUsuarioAD];
        case 'roles':
          return [storageState.roles, mockSetters.setRoles];
        default:
          return [initialValue, jest.fn()];
      }
    });

    return { storageState, mockSetters };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupLocalStorageMock();
    (isAuthenticated as jest.Mock).mockReturnValue(false);
  });

  test('inicializa con valores por defecto', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.usuario).toBeNull();
    expect(result.current.usuarioAD).toBeNull();
    expect(result.current.roles).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.errorAD).toBe('');
    expect(result.current.errorRoles).toBe('');
    expect(result.current.authAttempts).toBe(0);
    expect(result.current.maxAuthAttempts).toBe(1);
  });

  test('registra listeners al montar y los elimina al desmontar', () => {
    const { unmount } = renderHook(() => useAuth());

    expect(Providers.onProviderUpdated).toHaveBeenCalled();
    
    unmount();
    
    expect(Providers.removeProviderUpdatedListener).toHaveBeenCalled();
  });

  test('checkAuthentication verifica el estado de autenticación y actualiza los intentos', () => {

    (isAuthenticated as jest.Mock).mockReturnValue(false);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.authAttempts).toBe(0);
    

    let authenticated = false; 
    act(() => {
      authenticated = result.current.checkAuthentication();
    });
    
    expect(authenticated).toBe(false);
    expect(result.current.authAttempts).toBe(1);
    

    (isAuthenticated as jest.Mock).mockReturnValue(true);
    
    act(() => {
      authenticated = result.current.checkAuthentication();
    });
    
    expect(authenticated).toBe(true);
    expect(result.current.authAttempts).toBe(2);
  });

  test('login llama a azureLogin y actualiza el estado', async () => {
    const { result } = renderHook(() => useAuth());
    

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    

    (azureLogin as jest.Mock).mockResolvedValue(undefined);
    

    await act(async () => {
      await result.current.login();
    });
    

    expect(azureLogin).toHaveBeenCalled();
    

    expect(result.current.loading).toBe(false); 
    expect(result.current.authAttempts).toBe(0); 
  });

  test('login maneja errores correctamente', async () => {
    const { result } = renderHook(() => useAuth());
    
    const errorMsg = 'Error de autenticación';
    (azureLogin as jest.Mock).mockRejectedValue(new Error(errorMsg));
    

    await act(async () => {
      await result.current.login();
    });
    

    expect(azureLogin).toHaveBeenCalled();
    

    expect(result.current.error).toBe(errorMsg);
    expect(result.current.loading).toBe(false);
  });

  test('logout llama a azureLogout y limpia el estado', async () => {

    const { mockSetters } = setupLocalStorageMock({
      isLogin: true,
      usuario: mockUser,
      usuarioAD: mockUsuarioAD,
      roles: mockRoles
    });
    
    (azureLogout as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.logout();
    });
    

    expect(azureLogout).toHaveBeenCalled();
    

    expect(mockSetters.setUsuario).toHaveBeenCalledWith(null);
    expect(mockSetters.setUsuarioAD).toHaveBeenCalledWith(null);
    expect(mockSetters.setRoles).toHaveBeenCalledWith([]);
  });

  test('loadUserData carga datos cuando el usuario está autenticado', async () => {

    setupLocalStorageMock({ isLogin: true });
    (getMe as jest.Mock).mockResolvedValue(mockUser);
    (getUsuarioAD as jest.Mock).mockImplementation((email, callback) => {
      callback({ data: mockUsuarioAD, error: '' });
    });
    (getRoles as jest.Mock).mockImplementation((email, callback) => {
      callback({ data: mockRoles, error: '' });
    });
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(getMe).toHaveBeenCalled();
    expect(getUsuarioAD).toHaveBeenCalled();
    expect(getRoles).toHaveBeenCalled();
  });

  test('loadUserData no carga datos cuando el usuario no está autenticado', async () => {

    setupLocalStorageMock({ isLogin: false });
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(getMe).not.toHaveBeenCalled();
    expect(getUsuarioAD).not.toHaveBeenCalled();
    expect(getRoles).not.toHaveBeenCalled();
  });

  test('loadUserData no vuelve a cargar datos si ya existen', async () => {

    setupLocalStorageMock({
      isLogin: true,
      usuario: mockUser
    });
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(getMe).not.toHaveBeenCalled();
  });

  test('loadUserData maneja errores de getMe', async () => {

    setupLocalStorageMock({ isLogin: true });
    const errorMsg = 'Error al obtener usuario';
    (getMe as jest.Mock).mockRejectedValue(new Error(errorMsg));
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(result.current.error).toBe(errorMsg);
  });

  test('loadUserData maneja errores en formato JSON de getMe', async () => {

    setupLocalStorageMock({ isLogin: true });
    const errorJson = JSON.stringify({ Error: 'Error en formato JSON' });
    (getMe as jest.Mock).mockResolvedValue(errorJson);
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(result.current.error).toBe('Error en formato JSON');
  });

  test('loadUserData maneja errores de getUsuarioAD', async () => {

    setupLocalStorageMock({ isLogin: true });
    (getMe as jest.Mock).mockResolvedValue(mockUser);
    const errorMsg = 'Error al obtener usuario AD';
    (getUsuarioAD as jest.Mock).mockImplementation((email, callback) => {
      callback({ data: null, error: errorMsg });
    });
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(result.current.errorAD).toBe(errorMsg);
  });

  test('loadUserData maneja errores de getRoles', async () => {

    setupLocalStorageMock({ isLogin: true });
    (getMe as jest.Mock).mockResolvedValue(mockUser);
    (getUsuarioAD as jest.Mock).mockImplementation((email, callback) => {
      callback({ data: mockUsuarioAD, error: '' });
    });
    const errorMsg = 'Error al obtener roles';
    (getRoles as jest.Mock).mockImplementation((email, callback) => {
      callback({ data: [], error: errorMsg });
    });
    
    const { result } = renderHook(() => useAuth());
    

    await act(async () => {
      await result.current.loadUserData();
    });
    

    expect(result.current.errorRoles).toBe(errorMsg);
  });

  test('actualiza el estado cuando cambia la autenticación', () => {

    (isAuthenticated as jest.Mock).mockReturnValue(false);
    

    type ProviderCallback = () => void;


    let providerCallback: ProviderCallback | null = null;
    (Providers.onProviderUpdated as jest.Mock).mockImplementation((callback: ProviderCallback) => {
      providerCallback = callback;
    });
    

    const { result } = renderHook(() => useAuth());
    

    expect(result.current.isSignedIn).toBe(false);
    

    (isAuthenticated as jest.Mock).mockReturnValue(true);
    

    if (providerCallback) {
      act(() => {
        providerCallback!();
      });
    }
    

    expect(isAuthenticated).toHaveBeenCalled();
  });
});