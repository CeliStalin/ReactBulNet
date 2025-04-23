import { Providers } from '@microsoft/mgt-element';
import { IUser } from '../interfaces/IUserAz';
import { IAuthResponse } from '../interfaces/IAuth';
import { ApiGetUsuarioAd, ApiRoles } from '../services/GetApiArq';
import { UsuarioAd } from '../interfaces/IUsuarioAD';
import { RolResponse } from '../interfaces/IRol';

export async function getMe(): Promise<IUser | string> {
  const provider = Providers.globalProvider;
  const graphClient = provider.graph.client;
 // console.log("Ejecutando getMe()");
  
  try {
    const data = await graphClient.api("/me").get();
    return data;
  } catch (error: Error | unknown) {
   // console.log("Error getMe(): " + error);
    return JSON.stringify({ Error: error instanceof Error ? error.message : String(error)});
  }
}


export async function getUsuarioAD(email: string, callback: (response: IAuthResponse<UsuarioAd | null>) => void): Promise<void> {
    try {
  
      const usuarioAd = await ApiGetUsuarioAd(email);
      
      callback({ data: usuarioAd, error: '' });
    } catch (error: Error | unknown) {
      callback({ data: null, error: error instanceof Error ? error.message : String(error) });
    }
  }

export async function getRoles(email: string, callback: (response: IAuthResponse<RolResponse[]>) => void): Promise<void> {
    try {
      const roles = await ApiRoles(email);
      
      callback({ data: roles, error: '' });
    } catch (error:  Error | unknown) {
      callback({ data: [], error: error instanceof Error ? error.message : String(error)  });
    }
  }