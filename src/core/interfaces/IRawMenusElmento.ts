interface RawMenusElemento{
     ID:number,
     NOMBRE:string,
     DESCRIPCION:string,
     ID_PADRE:number,
     CONTROLADOR:string,
     ACCION:string,
     ES_MENU:string,
     ORDEN:number,
     COD_APLICACION:string,
     NIVEL:number,
     ESTADO_REG:string,
     FEC_ESTADO_REG:Date,
     USUARIO_CREACION:string,
     FECHA_CREACION:Date,
     FUNCION_CREACION:string,
     USUARIO_MODIF:string,
     FECHA_MODIF:Date,
     FUNCION_MODIF:string
}
export type{
    RawMenusElemento
}