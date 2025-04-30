import { RawUsuarioAD } from '../interfaces/IRawUsuarioAD'
import { UserExterno } from '../interfaces/IUserExterno'
import { UsuarioAd } from '../interfaces/IUsuarioAD'

const mapRawToUsuarioAd = (rawData: RawUsuarioAD): UsuarioAd => {
    const userExterno: UserExterno = {
      UsuarioAdId: rawData.UsuarioExterno.USUARIOS_AD_ID,
      PassEncriptado: rawData.UsuarioExterno.PASSWORD_ENCRYPT,
      Iv: rawData.UsuarioExterno.IV,
      Nombres: rawData.UsuarioExterno.NOMBRES,
      ApellidoPaterno: rawData.UsuarioExterno.APELLIDO_PATERNO,
      ApellidoMaterno: rawData.UsuarioExterno.APELLIDO_MATERNO,
      Email: rawData.UsuarioExterno.EMAIL,
      Telefono: rawData.UsuarioExterno.TELEFONO,
      Bloqueado: rawData.UsuarioExterno.BLOQUEADO,
      DebeCambiar: rawData.UsuarioExterno.DEBE_CAMBIAR,
      IntentosFallidos: rawData.UsuarioExterno.INTENTOS_FALLIDOS,
      CodigoPromotor: rawData.UsuarioExterno.CODIGO_PROMOTOR || '',
      EstadoReg: rawData.UsuarioExterno.ESTADO_REG,
      FechaEstadoRegistro: new Date(rawData.UsuarioExterno.FEC_ESTADO_REG),
      UsuarioCreacion: rawData.UsuarioExterno.USUARIO_CREACION,
      FechaCreacion: new Date(rawData.UsuarioExterno.FECHA_CREACION),
      UsuarioModificacion: rawData.UsuarioExterno.USUARIO_MODIF,
      FechaModificacion: new Date(rawData.UsuarioExterno.FECHA_MODIF),
      FuncionModificacion: rawData.UsuarioExterno.FUNCION_MODIF
    };
  
    return {
      IdUsuario: rawData.ID_USUARIO,
      UserName: rawData.USERNAME,
      TipoUsuario: rawData.TIPO_USUARIO,
      Cargo: rawData.CARGO,
      UnorCorrelativo: rawData.UNOR_CORRELATIVO,
      TipoEmpleado: rawData.TIPO_EMPL || '',
      TicvCodigo: rawData.TICV_CODIGO || '',
      TiavCodigo: rawData.TIAV_CODIGO || '',
      Rut: rawData.RUT,
      Dv: rawData.DV,
      UsuarioExterno: userExterno,
      EstadoReg: rawData.ESTADO_REG,
      FechaEstadoRegistro: new Date(rawData.FEC_ESTADO_REG),
      UsuarioCreacion: rawData.USUARIO_CREACION,
      FechaCreacion: new Date(rawData.FECHA_CREACION),
      FuncionCreacion: rawData.FUNCION_CREACION,
      UsuarioModificacion: rawData.USUARIO_MODIF,
      FechaModificacion: new Date(rawData.FECHA_MODIF),
      FuncionModificacion: rawData.FUNCION_MODIF
    };
  };

  export {
    mapRawToUsuarioAd
  }