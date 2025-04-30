import { UsuarioExternoRaw } from './IRawUsuarioExterno'


interface RawUsuarioAD {
    ID_USUARIO: number;
    USERNAME: string;
    TIPO_USUARIO: string;
    CARGO: number;
    UNOR_CORRELATIVO: number;
    TIPO_EMPL: string | null;
    TICV_CODIGO: string | null;
    TIAV_CODIGO: string | null;
    RUT: number;
    DV: string;
    UsuarioExterno: UsuarioExternoRaw;
    ESTADO_REG: string;
    FEC_ESTADO_REG: string;
    USUARIO_CREACION: string;
    FECHA_CREACION: string;
    FUNCION_CREACION: string;
    USUARIO_MODIF: string;
    FECHA_MODIF: string;
    FUNCION_MODIF: string;
  }
export type{
    RawUsuarioAD
}