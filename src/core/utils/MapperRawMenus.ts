import { ElementMenu } from '../interfaces/IMenusElementos'
import { RawMenusElemento } from '../interfaces/IRawMenusElmento'
const mapRawToElementMenu = (rawData: RawMenusElemento): ElementMenu => {
  return {
    Id: rawData.ID,
    Nombre: rawData.NOMBRE,
    Descripcion: rawData.DESCRIPCION,
    IdPadre:rawData.ID_PADRE, 
    Controlador: rawData.CONTROLADOR,
    Accion: rawData.ACCION,
    EsMenu: rawData.ES_MENU,
    Orden: rawData.ORDEN,
    ConAplicion: rawData.COD_APLICACION, 
    Nivel: rawData.NIVEL,
    EstadoReg: rawData.ESTADO_REG,
    FechaEstadoReg: rawData.FEC_ESTADO_REG instanceof Date ? rawData.FEC_ESTADO_REG : new Date(rawData.FEC_ESTADO_REG),
    UsuarioCreacion: rawData.USUARIO_CREACION,
    FechaCreacion: rawData.FECHA_CREACION instanceof Date ? rawData.FECHA_CREACION : new Date(rawData.FECHA_CREACION),
    FuncionCreacion: rawData.FUNCION_CREACION,
    UsuarioModificacion: rawData.USUARIO_MODIF,
    FechaModificacion: rawData.FECHA_MODIF instanceof Date ? rawData.FECHA_MODIF : new Date(rawData.FECHA_MODIF),
    FuncionModificacion: rawData.FUNCION_MODIF
  };
};


const mapRawArrayToElementMenuArray = (rawDataArray: RawMenusElemento[]): ElementMenu[] => {
  return rawDataArray.map(rawData => mapRawToElementMenu(rawData));
};

export { mapRawToElementMenu, mapRawArrayToElementMenuArray };