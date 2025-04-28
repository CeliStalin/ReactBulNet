// Implementación mejorada usando MSAL directamente
import { PublicClientApplication, Configuration, AuthenticationResult, AccountInfo, PopupRequest, RedirectRequest } from '@azure/msal-browser';

// Configuración de MSAL
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID || '',
    authority: import.meta.env.VITE_APP_AUTHORITY || '',
    // Usar la URI configurada en Azure
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

// Inicializar MSAL como una promesa
function initializeMsal(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        msalInstance = new PublicClientApplication(msalConfig);
        // Importante: esperar a que MSAL se inicialice completamente
        await msalInstance.initialize();
        console.log('MSAL inicializado correctamente');
        
        // Para facilitar la depuración
        console.log('Config MSAL:', {
          clientId: msalConfig.auth.clientId,
          redirectUri: msalConfig.auth.redirectUri,
          authority: msalConfig.auth.authority
        });
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
        await instance.logoutRedirect({
          account: account,
          postLogoutRedirectUri: window.location.origin
        });
      }
    } catch (error) {
      console.error('Error al limpiar cuentas:', error);
    }
  }

  // Iniciar sesión
  public static async login(): Promise<void> {
    try {
      await this.clearAccounts(); // Limpiar sesiones anteriores
      
      const instance = await getMsalInstance();
      console.log('Iniciando loginPopup con redirectUri:', msalConfig.auth.redirectUri);
      
      const loginResponse = await instance.loginPopup({
        ...loginRequest,
        redirectUri: msalConfig.auth.redirectUri,
        prompt: 'select_account' // Forzar selección de cuenta
      });
      
      console.log('Login exitoso:', loginResponse);
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  }

  // Método alternativo usando redirección en lugar de popup
  public static async loginRedirect(): Promise<void> {
    try {
      await this.clearAccounts(); // Limpiar sesiones anteriores
      
      const instance = await getMsalInstance();
      console.log('Iniciando loginRedirect con redirectUri:', msalConfig.auth.redirectUri);
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
        
        await instance.logoutPopup(logoutRequest);
      }
    } catch (error) {
      console.error('Error durante logout:', error);
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
        // Si falla la adquisición silenciosa, intentar con popup
        console.warn('Silent token acquisition failed, falling back to popup', silentError);
        const response = await instance.acquireTokenPopup(tokenRequest);
        return response.accessToken;
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