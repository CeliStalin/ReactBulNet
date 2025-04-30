interface RawRolResponse {
    ID_USUARIO: number;
    COD_APLICACION: string;
    ROL: string;
    TIPO_ROL: string | null;
    INICIO_VIGENCIA: string;
    FIN_VIGENCIA: string | null;
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
    RawRolResponse
}