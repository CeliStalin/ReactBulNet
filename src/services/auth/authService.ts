import { AuthProvider } from './authProviderMsal'; 
import { IUser } from '../../interfaces/IUserAz';
import { UsuarioAd } from '../../interfaces/IUsuarioAD';
import { RolResponse } from '../../interfaces/IRol';
import { mapRawToUsuarioAd } from '../../Utils/MapperRawToUsuarioAd';
import { mapRawArrayToRolResponseArray } from '../../Utils/MapperRawToRol';

export class AuthService {
  public static async getMe(): Promise<IUser> {
    try {
      const token = await AuthProvider.getAccessToken(['user.read']);
      
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos del usuario: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en getMe:', error);
      throw error;
    }
  }

  public static async getUsuarioAD(email: string): Promise<UsuarioAd> {
    try {
      const apiUrl = `${import.meta.env.VITE_APP_API_ARQUITECTURA_URL}/Usuario/mail/${email}`;
      const headers = {
        [import.meta.env.VITE_APP_NAME_API_KEY]: import.meta.env.VITE_APP_KEY_PASS_API_ARQ,
        "Content-Type": "application/json; charset=utf-8",
      };
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers
      });
      
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      
      const rawData = await response.json();
      return mapRawToUsuarioAd(rawData);
      
    } catch (error) {
      const errorMessage = error instanceof Error 
          ? error.message 
          : String(error);
          
      throw new Error(`Error al obtener usuario para ${email}: ${errorMessage}`);
    }
  }

  public static async getRoles(email: string): Promise<RolResponse[]> {
    try {
      const sistema = import.meta.env.VITE_APP_SISTEMA;
      const apiUrl = `${import.meta.env.VITE_APP_API_ARQUITECTURA_URL}/Rol/mail/${email}/app/${sistema}`;
      
      const headers = {
        [import.meta.env.VITE_APP_NAME_API_KEY]: import.meta.env.VITE_APP_KEY_PASS_API_ARQ,
        "Content-Type": "application/json; charset=utf-8",
      };
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers
      });
      
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      
      const rawData = await response.json();
      return mapRawArrayToRolResponseArray(rawData);
      
    } catch (error) {
      const errorMessage = error instanceof Error 
          ? error.message 
          : String(error);
          
      throw new Error(`Error al obtener roles para ${email}: ${errorMessage}`);
    }
  }
}

// Exportar funciones para compatibilidad
export const getMe = () => AuthService.getMe();
export const getUsuarioAD = (email: string) => AuthService.getUsuarioAD(email);
export const getRoles = (email: string) => AuthService.getRoles(email);