// Implementación alternativa usando MSAL directamente
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

// Crear la instancia de MSAL
let msalInstance: PublicClientApplication | null = null;

// Inicializar MSAL
function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    try {
      msalInstance = new PublicClientApplication(msalConfig);
    } catch (error) {
      console.error('Error al inicializar MSAL:', error);
      throw new Error('No se pudo inicializar la autenticación');
    }
  }
  return msalInstance;
}

// Clase para gestionar la autenticación
export class AuthProvider {
  // Obtener la instancia de autenticación
  public static getInstance(): PublicClientApplication {
    return getMsalInstance();
  }

  // Verificar si el usuario está autenticado
  public static isAuthenticated(): boolean {
    try {
      const instance = getMsalInstance();
      const accounts = instance.getAllAccounts();
      return accounts.length > 0;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  // Obtener cuenta activa
  public static getActiveAccount(): AccountInfo | null {
    try {
      const instance = getMsalInstance();
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
      const instance = getMsalInstance();
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  }

  // Cerrar sesión
  public static async logout(): Promise<void> {
    try {
      const instance = getMsalInstance();
      const account = this.getActiveAccount();
      
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
      const instance = getMsalInstance();
      const account = this.getActiveAccount();
      
      if (!account) {
        throw new Error('No hay una sesión activa');
      }
      
      const tokenRequest = {
        scopes: scopes.length > 0 ? scopes : loginRequest.scopes,
        account: account,
      };
      
      const response: AuthenticationResult = await instance.acquireTokenSilent(tokenRequest);
      return response.accessToken;
      
    } catch (error: any) {
      // Si falla la adquisición silenciosa, intentar con popup
      if (error.name === 'InteractionRequiredAuthError') {
        try {
          const instance = getMsalInstance();
          const response = await instance.acquireTokenPopup(loginRequest);
          return response.accessToken;
        } catch (popupError) {
          console.error('Error al adquirir token con popup:', popupError);
          throw popupError;
        }
      }
      
      console.error('Error al obtener access token:', error);
      throw error;
    }
  }
}

// Para mantener compatibilidad con código existente
export function isAuthenticated(): boolean {
  return AuthProvider.isAuthenticated();
}

export function login(): Promise<void> {
  return AuthProvider.login();
}

export function logout(): Promise<void> {
  return AuthProvider.logout();
}

export function getAccessToken(scopes?: string[]): Promise<string> {
  return AuthProvider.getAccessToken(scopes);
}