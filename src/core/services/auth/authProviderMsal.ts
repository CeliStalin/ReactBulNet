import { PublicClientApplication, Configuration, AuthenticationResult, AccountInfo, PopupRequest, RedirectRequest } from '@azure/msal-browser';

// Configuración de MSAL
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID || '',
    authority: import.meta.env.VITE_APP_AUTHORITY || '',
    // Usar la ruta /login explícitamente como se hacía antes
    redirectUri: `${window.location.origin}/login`,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

// Scopes de la aplicación
const loginRequest: PopupRequest | RedirectRequest = {
  scopes: ['user.read', 'openid', 'profile', 'email', 'offline_access'],
  prompt: 'select_account', // Esto fuerza la selección de cuenta
};

// Crear e inicializar la instancia de MSAL
let msalInstance: PublicClientApplication | null = null;
let initializationPromise: Promise<void> | null = null;
let useRedirectFlow = false; // Nuevo flag para controlar el flujo

// Inicializar MSAL como una promesa
function initializeMsal(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        msalInstance = new PublicClientApplication(msalConfig);
        // Importante: esperar a que MSAL se inicialice completamente
        await msalInstance.initialize();
        

        // Esto ayudará a mantener consistencia entre loginRedirect y logoutRedirect
        const cachedAuthMethod = sessionStorage.getItem('authMethod');
        if (cachedAuthMethod === 'redirect') {
          useRedirectFlow = true;
        }

      } catch (error) {
        console.error('Error al inicializar MSAL:', error);
        msalInstance = null;
        throw new Error('No se pudo inicializar la autenticación');
      }
    })();
  }
  return initializationPromise;
}

// Obtener la instancia de MSAL ya inicializada
async function getMsalInstance(): Promise<PublicClientApplication> {
  if (!msalInstance) {
    await initializeMsal();
  }
  if (!msalInstance) {
    throw new Error('No se pudo inicializar MSAL');
  }
  return msalInstance;
}

// Clase para gestionar la autenticación
export class AuthProvider {
  // Inicializar el proveedor de autenticación
  public static async initialize(): Promise<void> {
    await initializeMsal();
  }

  // Obtener la instancia de autenticación
  public static async getInstance(): Promise<PublicClientApplication> {
    return await getMsalInstance();
  }

  // Verificar si el usuario está autenticado
  public static async isAuthenticated(): Promise<boolean> {
    try {
      const instance = await getMsalInstance();
      const accounts = instance.getAllAccounts();
      return accounts.length > 0;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  // Obtener cuenta activa
  public static async getActiveAccount(): Promise<AccountInfo | null> {
    try {
      const instance = await getMsalInstance();
      const accounts = instance.getAllAccounts();
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Error al obtener cuenta activa:', error);
      return null;
    }
  }

  // Limpiar la caché de cuentas
  public static async clearAccounts(): Promise<void> {
    try {
      const instance = await getMsalInstance();
      const accounts = instance.getAllAccounts();
      
      for (const account of accounts) {
        // Solo intentamos limpiar aquí, no hacemos logout todavía
        console.log(`Limpiando cuenta: ${account.username}`);
        instance.setActiveAccount(null);
      }
    } catch (error) {
      console.error('Error al limpiar cuentas:', error);
    }
  }

  // Método para establecer el tipo de flujo (popup o redirect)
  public static setUseRedirectFlow(value: boolean): void {
    useRedirectFlow = value;
    // Guardar en sessionStorage para mantener consistencia entre navegaciones
    sessionStorage.setItem('authMethod', value ? 'redirect' : 'popup');
  }

  // Método para obtener el tipo de flujo actual
  public static isUsingRedirectFlow(): boolean {
    return useRedirectFlow;
  }

  // Iniciar sesión
  public static async login(): Promise<void> {
    try {
      await this.clearAccounts(); // Limpiar sesiones anteriores
      
      const instance = await getMsalInstance();
      
      if (useRedirectFlow) {
        await instance.loginRedirect({
          ...loginRequest,
          redirectUri: msalConfig.auth.redirectUri,
          prompt: 'select_account' // Forzar selección de cuenta
        });
      } else {
        const loginResponse = await instance.loginPopup({
          ...loginRequest,
          redirectUri: msalConfig.auth.redirectUri,
          prompt: 'select_account' // Forzar selección de cuenta
        });
        
        console.log('Login exitoso con respuesta:', loginResponse);

      }
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  }

  // Método específico para login con redirección
  public static async loginRedirect(): Promise<void> {
    try {
      // Establecer el flujo como redirección para todas las operaciones futuras
      this.setUseRedirectFlow(true);
      
      await this.clearAccounts(); // Limpiar sesiones anteriores
      
      const instance = await getMsalInstance();
      await instance.loginRedirect({
        ...loginRequest,
        redirectUri: msalConfig.auth.redirectUri,
        prompt: 'select_account' // Forzar selección de cuenta
      });
    } catch (error) {
      console.error('Error durante loginRedirect:', error);
      throw error;
    }
  }
  
  // Manejar el resultado de la redirección
  public static async handleRedirectPromise(): Promise<AuthenticationResult | null> {
    try {
      const instance = await getMsalInstance();
      return await instance.handleRedirectPromise();
    } catch (error) {
      console.error('Error al manejar redirección:', error);
      return null;
    }
  }

  // Cerrar sesión
  public static async logout(): Promise<void> {
    try {
      const instance = await getMsalInstance();
      const account = await this.getActiveAccount();
      
      if (account) {
        const logoutRequest = {
          account: account,
          postLogoutRedirectUri: window.location.origin
        };
        
        // Usar el mismo tipo de flujo que se utilizó para el inicio de sesión
        if (useRedirectFlow) {
          await instance.logoutRedirect(logoutRequest);
        } else {
          await instance.logoutPopup(logoutRequest);
        }
      } else {
        console.warn('No hay cuenta activa para cerrar sesión');
        // Limpieza manual de caché
        sessionStorage.clear();
        localStorage.removeItem('isLogin');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioAD');
        localStorage.removeItem('roles');
      }
    } catch (error) {
      console.error('Error durante logout:', error);
      throw error;
    }
  }

  // Método específico para logout con redirección
  public static async logoutRedirect(): Promise<void> {
    try {
      const instance = await getMsalInstance();
      const account = await this.getActiveAccount();
      
      if (account) {
        const logoutRequest = {
          account: account,
          postLogoutRedirectUri: window.location.origin
        };
        
        await instance.logoutRedirect(logoutRequest);
      } else {
        console.warn('No hay cuenta activa para cerrar sesión');
        // Limpieza manual de caché
        sessionStorage.clear();
        localStorage.removeItem('isLogin');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioAD');
        localStorage.removeItem('roles');
        // Redirigir manualmente
        window.location.href = window.location.origin;
      }
    } catch (error) {
      console.error('Error durante logoutRedirect:', error);
      // Intentar limpieza manual y redirección si falla el logout normal
      sessionStorage.clear();
      localStorage.removeItem('isLogin');
      localStorage.removeItem('usuario');
      localStorage.removeItem('usuarioAD');
      localStorage.removeItem('roles');
      window.location.href = window.location.origin;
      throw error;
    }
  }

  // Obtener token de acceso
  public static async getAccessToken(scopes: string[] = []): Promise<string> {
    try {
      const instance = await getMsalInstance();
      const account = await this.getActiveAccount();
      
      if (!account) {
        throw new Error('No hay una sesión activa');
      }
      
      const tokenRequest = {
        scopes: scopes.length > 0 ? scopes : loginRequest.scopes,
        account: account,
      };
      
      try {
        const response: AuthenticationResult = await instance.acquireTokenSilent(tokenRequest);
        return response.accessToken;
      } catch (silentError) {
        // Si falla la adquisición silenciosa, intentar con popup o redirect según el flujo actual
        console.warn('Silent token acquisition failed, falling back to interactive method', silentError);
        
        if (useRedirectFlow) {
          // Si estamos en flujo de redirección, no podemos esperar una respuesta inmediata
          await instance.acquireTokenRedirect(tokenRequest);
          throw new Error('Redirect in progress for token acquisition');
        } else {
          const response = await instance.acquireTokenPopup(tokenRequest);
          return response.accessToken;
        }
      }
    } catch (error) {
      console.error('Error al obtener access token:', error);
      throw error;
    }
  }
}

// Inicializar MSAL automáticamente al cargar este módulo
initializeMsal().catch(error => {
  console.error('Failed to initialize MSAL:', error);
});

// Funciones de compatibilidad para el código existente
export async function isAuthenticated(): Promise<boolean> {
  return await AuthProvider.isAuthenticated();
}

export async function login(): Promise<void> {
  return await AuthProvider.login();
}

export async function logout(): Promise<void> {
  return await AuthProvider.logout();
}

export async function getAccessToken(scopes?: string[]): Promise<string> {
  return await AuthProvider.getAccessToken(scopes);
}