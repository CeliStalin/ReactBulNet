import { Providers, ProviderState, IProvider } from '@microsoft/mgt-element';
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

// Función para obtener el proveedor, con mejor manejo de tipos
function getProvider(): IProvider | null {
  try {
    if (!Providers.globalProvider) {
      Providers.globalProvider = new Msal2Provider(authConfig);
    }
    return Providers.globalProvider;
  } catch (error) {
    console.error('Error al inicializar o acceder al proveedor:', error);
    return null;
  }
}

// Clase AuthProvider con métodos estáticos
export class AuthProvider {
  public static getInstance(): IProvider | null {
    return getProvider();
  }

  // Verificar si el usuario está autenticado
  public static isAuthenticated(): boolean {
    const provider = getProvider();
    return provider !== null && provider.state === ProviderState.SignedIn;
  }

  // Iniciar sesión
  public static async login(): Promise<void> {
    const provider = getProvider();
    
    if (!provider) {
      throw new Error('No se pudo inicializar el proveedor de autenticación');
    }
    
    try {
      // Ahora TypeScript sabe que provider no es null
      await provider.login();
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  }

  // Cerrar sesión
  public static async logout(): Promise<void> {
    const provider = getProvider();
    
    if (!provider) {
      console.warn('No hay proveedor de autenticación para cerrar sesión');
      return;
    }
    
    try {
      await provider.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
      throw error;
    }
  }

  // Obtener token de acceso
  public static async getAccessToken(scopes?: string[]): Promise<string> {
    const provider = getProvider();
    
    if (!provider) {
      throw new Error('No se pudo inicializar el proveedor de autenticación');
    }
    
    try {
      // Usamos type assertion para convertir el array de strings a lo que espera la función
      // esto evita errores de tipo en TypeScript
      return await provider.getAccessToken(scopes as any || []);
    } catch (error) {
      console.error('Error al obtener access token:', error);
      throw error;
    }
  }
}

// Para mantener compatibilidad con código existente que use las funciones directamente
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

console.log('Provider state:', Providers.globalProvider?.state);
console.log('Auth config:', authConfig);