// Implementación mejorada usando MSAL directamente
import { PublicClientApplication, Configuration, AuthenticationResult, AccountInfo } from '@azure/msal-browser';

// Configuración de MSAL
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID || '',
    authority: import.meta.env.VITE_APP_AUTHORITY || '',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

// Scopes de la aplicación
const loginRequest = {
  scopes: ['user.read', 'openid', 'profile', 'email', 'offline_access'],
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

  // Iniciar sesión
  public static async login(): Promise<void> {
    try {
      const instance = await getMsalInstance();
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
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
        };
        
        await instance.logout(logoutRequest);
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