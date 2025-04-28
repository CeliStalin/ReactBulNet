import { AuthProvider } from './authProvider';
import { IUser } from '@/types/interfaces/IUserAz';
import { arquitecturaApi } from '@/services/api/arquitecturaApi';
import { UsuarioAd } from '@/types/interfaces/IUsuarioAD';
import { RolResponse } from '@/types/interfaces/IRol';

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
      return await arquitecturaApi.getUsuarioAD(email);
    } catch (error) {
      console.error('Error obteniendo usuario AD:', error);
      throw error;
    }
  }

  public static async getRoles(email: string): Promise<RolResponse[]> {
    try {
      return await arquitecturaApi.getRoles(email);
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      throw error;
    }
  }
}

// Exportar funciones para compatibilidad
export const getMe = () => AuthService.getMe();
export const getUsuarioAD = (email: string) => AuthService.getUsuarioAD(email);
export const getRoles = (email: string) => AuthService.getRoles(email);