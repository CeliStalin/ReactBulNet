import { RawRolResponse } from '../interfaces/IRawRolResponse'
import { RolResponse } from '../interfaces/IRol'


const mapRawToRolResponse = (rawData: RawRolResponse): RolResponse => {
    const rolResponse = {
      IdUsuario: rawData.ID_USUARIO,
      CodApp: rawData.COD_APLICACION,
      Rol: rawData.ROL,
      TipoRol: rawData.TIPO_ROL || '',
      InicioVigencia: new Date(rawData.INICIO_VIGENCIA),
      FinVigencia: rawData.FIN_VIGENCIA ? new Date(rawData.FIN_VIGENCIA) : undefined,
      EstadoReg: rawData.ESTADO_REG,
      FecEstadoReg: new Date(rawData.FEC_ESTADO_REG),
      UsuarioCreacion: rawData.USUARIO_CREACION,
      FechaCreacion: new Date(rawData.FECHA_CREACION),
      FuncionCreacion: rawData.FUNCION_CREACION,
      UsuarioModificacion: rawData.USUARIO_MODIF,
      FechaModificacion: new Date(rawData.FECHA_MODIF),
      FuncionModificacion: rawData.FUNCION_MODIF
    };
    return rolResponse;
  };
  
  
  const mapRawArrayToRolResponseArray = (rawDataArray: RawRolResponse[]): RolResponse[] => {
    if (!rawDataArray || !Array.isArray(rawDataArray)) {
      console.warn('[MapperRawToRol] Los datos de roles no son un array válido:', rawDataArray);
      return [];
    }
    
    try {
      const mappedRoles = rawDataArray.map(rawData => mapRawToRolResponse(rawData));
      return mappedRoles;
    } catch (error) {
      console.error('[MapperRawToRol] Error al mapear roles:', error);
      return [];
    }
  };
  
  export { mapRawToRolResponse, mapRawArrayToRolResponseArray };