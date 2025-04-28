import { apiClient } from './apiClient';
import { RolResponse } from '@/types/interfaces/IRol';
import { UsuarioAd } from '@/types/interfaces/IUsuarioAD';
import { ElementMenu } from '@/types/interfaces/IMenusElementos';
import { 
  mapRawArrayToRolResponseArray, 
  mapRawToUsuarioAd, 
  mapRawArrayToElementMenuArray 
} from '@/Utils/mappers';

export class ArquitecturaApi {
  private static readonly BASE_PATH = '';

  public static async getRoles(email: string): Promise<RolResponse[]> {
    try {
      const sistema = import.meta.env.VITE_APP_SISTEMA;
      const rawData = await apiClient.get(`/Rol/mail/${email}/app/${sistema}`);
      return mapRawArrayToRolResponseArray(rawData);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw new Error(`Error al obtener roles para ${email}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public static async getUsuarioAD(email: string): Promise<UsuarioAd> {
    try {
      const rawData = await apiClient.get(`/Usuario/mail/${email}`);
      return mapRawToUsuarioAd(rawData);
    } catch (error) {
      console.error('Error al obtener usuario AD:', error);
      throw new Error(`Error al obtener usuario AD para ${email}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public static async getMenus(rol: string): Promise<ElementMenu[]> {
    if (!rol) {
      return [];
    }

    try {
      const sistema = import.meta.env.VITE_APP_SISTEMA;
      const rawData = await apiClient.get(`/Elemento/${rol}/${sistema}`);
      return mapRawArrayToElementMenuArray(rawData);
    } catch (error) {
      console.error('Error al obtener menús:', error);
      throw new Error(`Error al obtener menús para rol ${rol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const arquitecturaApi = ArquitecturaApi;