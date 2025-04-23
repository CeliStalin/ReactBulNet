import { Providers, ProviderState } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import { IAuthConfig } from '../interfaces/IAuth';


const authConfig: IAuthConfig = {
    clientId: import.meta.env.VITE_APP_CLIENT_ID , 
    authority: import.meta.env.VITE_APP_AUTHORITY,
    scopes: [
      "user.read",
      "openid",
      "profile",
      "user.readbasic.all",
    ]
  };
  

  export function initializeAuthProvider(): void {
    if (!Providers.globalProvider) {
      Providers.globalProvider = new Msal2Provider(authConfig);
    }
  }
  
   export function isAuthenticated(): boolean {
     return Providers.globalProvider && Providers.globalProvider.state === ProviderState.SignedIn;
   }

  export async function login(): Promise<void> {
    if (!Providers.globalProvider) {
      initializeAuthProvider();
    }
    
    try {
      await Providers.globalProvider!.login();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  
  export async function logout(): Promise<void> {
    if (Providers.globalProvider) {
      try {
        await Providers.globalProvider.logout();
      } catch (error) {
        console.error('Error during logout:', error);
        throw error;
      }
    }
  }
  

  initializeAuthProvider();