import { Providers, ProviderState } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

// Configuración de autenticación
const authConfig = {
  clientId: import.meta.env.VITE_APP_CLIENT_ID,
  authority: import.meta.env.VITE_APP_AUTHORITY,
  scopes: [
    "user.read",
    "openid",
    "profile",
    "user.readbasic.all",
  ]
};

// Inicializar el proveedor si aún no existe
function ensureProviderInitialized() {
  if (!Providers.globalProvider) {
    Providers.globalProvider = new Msal2Provider(authConfig);
  }
}

// Inicializar al cargar el módulo
ensureProviderInitialized();

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  ensureProviderInitialized();
  return Providers.globalProvider && Providers.globalProvider.state === ProviderState.SignedIn;
}

// Iniciar sesión
export async function login(): Promise<void> {
  ensureProviderInitialized();
  
  if (Providers.globalProvider) {
    try {
      await Providers.globalProvider.login();
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  } else {
    throw new Error('No se pudo inicializar el proveedor de autenticación');
  }
}

// Cerrar sesión
export async function logout(): Promise<void> {
  if (Providers.globalProvider) {
    try {
      await Providers.globalProvider.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
      throw error;
    }
  }
}

// Obtener token de acceso
export async function getAccessToken(scopes?: string[]): Promise<string> {
  ensureProviderInitialized();
  
  if (Providers.globalProvider) {
    try {
      return await Providers.globalProvider.getAccessToken(scopes || []);
    } catch (error) {
      console.error('Error al obtener access token:', error);
      throw error;
    }
  } else {
    throw new Error('No se pudo inicializar el proveedor de autenticación');
  }
}

// También exportamos la clase para compatibilidad con código existente
export class AuthProvider {
  public static getInstance(): void {
    ensureProviderInitialized();
  }
}