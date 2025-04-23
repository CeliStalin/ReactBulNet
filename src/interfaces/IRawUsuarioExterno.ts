interface UsuarioExternoRaw {
    USUARIOS_AD_ID: number;
    PASSWORD_ENCRYPT: string;
    IV: string;
    NOMBRES: string;
    APELLIDO_PATERNO: string;
    APELLIDO_MATERNO: string;
    EMAIL: string;
    TELEFONO: string;
    BLOQUEADO: string;
    DEBE_CAMBIAR: string;
    INTENTOS_FALLIDOS: number;
    CODIGO_PROMOTOR: string | null;
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
    UsuarioExternoRaw 
  }