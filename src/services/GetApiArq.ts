import { GetApiArquitectura, GetSistema,FetchWithTimeout,GetNameApiKey,GetKeyApiKey} from '../Utils/GetEnvVariables'
import { RolResponse } from '../interfaces/IRol'
import { UsuarioAd } from '../interfaces/IUsuarioAD'
import { RawUsuarioAD } from '../interfaces/IRawUsuarioAD'
import { mapRawToUsuarioAd } from '../Utils/MapperRawToUsuarioAd'
import { mapRawArrayToRolResponseArray } from '../Utils/MapperRawToRol'
import { RawMenusElemento } from '../interfaces/IRawMenusElmento'
import { mapRawArrayToElementMenuArray } from '../Utils/MapperRawMenus'
import { ElementMenu } from '../interfaces/IMenusElementos'

const ApiRoles = async(mail: string): Promise<RolResponse[]> => {
  const ApiUrl = `${GetApiArquitectura()}/Rol/mail/${mail}/app/${GetSistema().codigo}`;
  console.log(`[ApiRoles] Consultando roles para ${mail} en URL: ${ApiUrl}`);
  
  try {
      const Response = await FetchWithTimeout(ApiUrl, {
          method: "GET",
          headers: {
              [GetNameApiKey()]: GetKeyApiKey(),
              "Content-Type": "application/json; charset=utf-8",
          }
      });
      
      if (!Response.ok) {
          throw new Error(`${Response.status} - ${Response.statusText}`);
      }
      
      const Rawdata = await Response.json();
      console.log(`[ApiRoles] Datos crudos recibidos:`, Rawdata);
      
      const formattedData: RolResponse[] = mapRawArrayToRolResponseArray(Rawdata);
      console.log(`[ApiRoles] Roles formateados:`, formattedData);
      
      return formattedData;
  } catch (ex) {
      const errorMessage = ex instanceof Error 
          ? ex.message 
          : String(ex);
      
      console.error(`[ApiRoles] Error al obtener roles para ${mail}:`, errorMessage);
      throw new Error(`Error al obtener roles para ${mail}: ${errorMessage}`);
  }
}

const ApiGetUsuarioAd = async (mail: string): Promise<UsuarioAd > => {
    const Url = `${GetApiArquitectura()}/Usuario/mail/${mail}`;
    console.log(`[ApiGetUsuarioAd] Consultando usuario para ${mail} en URL: ${Url}`);
    
    try {
      const Response = await FetchWithTimeout(Url, {
        method: "GET",
        headers: {
          [GetNameApiKey()]: GetKeyApiKey(),
          "Content-Type": "application/json; charset=utf-8",
        }
      });
      
      if (!Response.ok) {
        throw new Error(`${Response.status} - ${Response.statusText}`);
      }
      
      const rawData: RawUsuarioAD = await Response.json();
      console.log(`[ApiGetUsuarioAd] Datos de usuario recibidos para ${mail}:`, rawData);
      
      return mapRawToUsuarioAd(rawData);
      
    } catch (ex) {
      const errorMessage = ex instanceof Error 
          ? ex.message 
          : String(ex);
      
      console.error(`[ApiGetUsuarioAd] Error al obtener usuario para ${mail}:`, errorMessage);
      throw new Error(`Error al obtener roles para ${mail}: ${errorMessage}`);
    }
};

const ApiGetMenus = async (rol :string) : Promise<ElementMenu[] | null>   =>  {
   if(!rol){
    console.log('[ApiGetMenus] Rol vacío, no se pueden obtener menús');
    return null;
   }
   
   const Url = `${GetApiArquitectura()}/Elemento/${rol}/${GetSistema().codigo}`;
   console.log(`[ApiGetMenus] Consultando menús para rol ${rol} en URL: ${Url}`);
   console.log(`[ApiGetMenus] Sistema: ${GetSistema().codigo}`);
   
   try{
        const Response = await FetchWithTimeout(Url, {
          method: "GET",
          headers: {
            [GetNameApiKey()]: GetKeyApiKey(),
            "Content-Type": "application/json; charset=utf-8",
          }
        });
        
        if (!Response.ok) {
          throw new Error(`${Response.status} - ${Response.statusText}`);
        }
        
        const rawData: RawMenusElemento[] = await Response.json();
        console.log(`[ApiGetMenus] Menús crudos recibidos para rol ${rol}:`, rawData);
        
        const menuItems = mapRawArrayToElementMenuArray(rawData);
        console.log(`[ApiGetMenus] Menús procesados para rol ${rol}:`, menuItems);
        
        return menuItems;

   } catch (ex) {
    const errorMessage = ex instanceof Error 
    ? ex.message 
    : String(ex);
    
    console.error(`[ApiGetMenus] Error al obtener menús para rol ${rol}:`, errorMessage);
    throw new Error(`Error al obtener roles para ${rol}: ${errorMessage}`);
  }
}




export {
    ApiRoles,
    ApiGetUsuarioAd,
    ApiGetMenus
}